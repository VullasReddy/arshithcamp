import express from 'express';
import { getDb, saveDb, logActivity } from '../db.js';
import { verifyAdminToken } from '../middleware/auth.js';

const router = express.Router();

// ==========================================
// PUBLIC CERTIFICATE VERIFICATION ENDPOINT
// ==========================================
router.get('/certificates/verify/:id', (req, res) => {
  const db = getDb();
  const certIdInput = req.params.id.trim().toUpperCase();

  const cert = (db.certificates || []).find(
    c => c.certificateId.toUpperCase() === certIdInput || c.id.toUpperCase() === certIdInput
  );

  if (!cert) {
    return res.status(404).json({
      success: false,
      message: 'Certificate not found. Please verify the Certificate ID.'
    });
  }

  // Return public non-sensitive verification payload
  res.json({
    success: true,
    certificate: {
      certificateId: cert.certificateId,
      studentName: cert.studentName,
      courseTitle: cert.courseTitle,
      issueDate: cert.issueDate,
      instructorName: cert.instructorName,
      grade: cert.grade,
      status: cert.status, // active | revoked
      skills: cert.skills || []
    }
  });
});

// ==========================================
// PROTECTED ADMIN CERTIFICATE ENDPOINTS
// ==========================================

// Get all certificates
router.get('/admin/certificates', verifyAdminToken, (req, res) => {
  const db = getDb();
  res.json({ success: true, certificates: db.certificates || [] });
});

// Check eligibility server-side
router.post('/admin/certificates/check-eligibility', verifyAdminToken, (req, res) => {
  const { studentId, courseId } = req.body;
  const db = getDb();

  const student = (db.students || []).find(s => s.id === studentId);
  const course = (db.courses || []).find(c => c.id === courseId);

  if (!student || !course) {
    return res.status(404).json({ success: false, message: 'Student or Course not found.' });
  }

  const progressObj = (student.progressMap && student.progressMap[courseId]) || {};
  const totalModules = course.modules?.length || 1;
  const completedModulesCount = progressObj.completedModules?.length || 0;
  const quizzesPassedCount = progressObj.quizzesPassed?.length || 0;
  const finalTestPassed = Boolean(progressObj.finalTestPassed);
  const projectStatus = progressObj.projectStatus || 'Not Submitted';

  const allModulesCompleted = completedModulesCount >= totalModules;
  const allQuizzesPassed = quizzesPassedCount >= totalModules;
  const projectApproved = projectStatus === 'Approved';

  const isEligible = allModulesCompleted && allQuizzesPassed && finalTestPassed && projectApproved;

  res.json({
    success: true,
    isEligible,
    details: {
      allModulesCompleted: `${completedModulesCount}/${totalModules}`,
      allQuizzesPassed: `${quizzesPassedCount}/${totalModules}`,
      finalTestPassed,
      projectStatus
    }
  });
});

// Generate Certificate
router.post('/admin/certificates/generate', verifyAdminToken, (req, res) => {
  const { studentId, courseId, grade, forceOverride } = req.body;
  const db = getDb();

  const student = (db.students || []).find(s => s.id === studentId);
  const course = (db.courses || []).find(c => c.id === courseId);

  if (!student || !course) {
    return res.status(404).json({ success: false, message: 'Student or Course not found.' });
  }

  // Check if certificate already exists for this student & course
  const existingCert = (db.certificates || []).find(
    c => c.studentId === studentId && c.courseId === courseId && c.status === 'active'
  );

  if (existingCert) {
    return res.status(400).json({
      success: false,
      message: `Student already has an active certificate (${existingCert.certificateId}) for this course.`,
      certificate: existingCert
    });
  }

  // Verify eligibility if not forceOverride
  if (!forceOverride) {
    const progressObj = (student.progressMap && student.progressMap[courseId]) || {};
    const totalModules = course.modules?.length || 1;
    const completedModulesCount = progressObj.completedModules?.length || 0;
    const finalTestPassed = Boolean(progressObj.finalTestPassed);
    const projectStatus = progressObj.projectStatus || 'Not Submitted';

    if (completedModulesCount < totalModules || !finalTestPassed || projectStatus !== 'Approved') {
      return res.status(400).json({
        success: false,
        message: 'Student does not meet automatic certificate eligibility criteria (Requires 100% modules, passed quizzes, passed final test, and approved project). Use explicit override if needed.'
      });
    }
  }

  // Generate unique certificate ID (e.g. ARB-FSWD-2026-000127)
  const courseCode = course.title.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 4);
  const randomSeq = Math.floor(100000 + Math.random() * 900000);
  const certificateId = `ARB-${courseCode}-2026-${randomSeq}`;

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const issueDateStr = new Date().toLocaleDateString('en-US', options);

  const newCert = {
    id: certificateId,
    certificateId,
    studentId: student.id,
    studentName: (student.name && student.name.trim()) ? student.name.trim() : (student.email && student.email.trim() ? student.email.trim() : 'Student'),
    studentEmail: student.email,
    courseId: course.id,
    courseTitle: course.title,
    issueDate: issueDateStr,
    createdAt: new Date().toISOString(),
    instructorName: course.instructor?.name || 'Arshith Bootcamp Lead',
    grade: grade || '96% Distinction',
    status: 'active',
    skills: course.skills || ['Core Bootcamp Mastery']
  };

  if (!db.certificates) db.certificates = [];
  db.certificates.unshift(newCert);
  saveDb(db);

  logActivity({
    adminId: req.admin.adminId,
    action: 'CERTIFICATE_GENERATED',
    target: `Certificate: ${certificateId}`,
    details: `Generated for ${student.name} (${course.title})`
  });

  res.status(201).json({ success: true, message: 'Certificate generated successfully', certificate: newCert });
});

// Revoke Certificate
router.post('/admin/certificates/:id/revoke', verifyAdminToken, (req, res) => {
  const db = getDb();
  const cert = (db.certificates || []).find(c => c.id === req.params.id || c.certificateId === req.params.id);

  if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found.' });

  cert.status = 'revoked';
  cert.revokedAt = new Date().toISOString();
  saveDb(db);

  logActivity({
    adminId: req.admin.adminId,
    action: 'CERTIFICATE_REVOKED',
    target: `Certificate: ${cert.certificateId}`,
    details: `Revoked certificate issued to ${cert.studentName}`
  });

  res.json({ success: true, message: 'Certificate revoked successfully.', certificate: cert });
});

// Restore Revoked Certificate
router.post('/admin/certificates/:id/restore', verifyAdminToken, (req, res) => {
  const db = getDb();
  const cert = (db.certificates || []).find(c => c.id === req.params.id || c.certificateId === req.params.id);

  if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found.' });

  cert.status = 'active';
  delete cert.revokedAt;
  saveDb(db);

  logActivity({
    adminId: req.admin.adminId,
    action: 'CERTIFICATE_RESTORED',
    target: `Certificate: ${cert.certificateId}`,
    details: `Restored revoked certificate for ${cert.studentName}`
  });

  res.json({ success: true, message: 'Certificate restored to active status.', certificate: cert });
});

export default router;
