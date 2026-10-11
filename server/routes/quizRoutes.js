import express from 'express';
import { getDb, saveDb, logActivity } from '../db.js';
import { verifyAdminToken } from '../middleware/auth.js';

const router = express.Router();

// =========================================================================
// LEARNER PUBLIC / PROTECTED QUIZ ENDPOINTS
// =========================================================================

/**
 * GET /api/quizzes/module/:moduleId
 * Returns 5 active module quiz questions WITHOUT correct answers or explanations (Security)
 */
router.get('/quizzes/module/:moduleId', (req, res) => {
  const { moduleId } = req.params;
  const db = getDb();

  const questions = (db.questionBank || [])
    .filter(q => q.moduleId === moduleId && q.status === 'active')
    .map(q => {
      // Omit correct answer and explanation for security
      const { correctAnswer, explanation, ...safeQuestion } = q;
      return safeQuestion;
    });

  if (questions.length === 0) {
    for (const c of (db.courses || [])) {
      const mod = (c.modules || []).find(m => m.id === moduleId);
      if (mod && mod.quiz && mod.quiz.questions && mod.quiz.questions.length > 0) {
        const safeQuestions = mod.quiz.questions.map(q => {
          const { correctAnswer, explanation, ...safeQ } = q;
          return safeQ;
        });
        return res.json({
          success: true,
          moduleId,
          totalQuestions: safeQuestions.length,
          passingScore: 70,
          questions: safeQuestions
        });
      }
    }
    return res.status(404).json({
      success: false,
      message: `No active quiz questions found for module ${moduleId}`
    });
  }

  res.json({
    success: true,
    moduleId,
    totalQuestions: questions.length,
    passingScore: 70, // 70% threshold
    questions
  });
});

/**
 * POST /api/quizzes/module/:moduleId/submit
 * Validates module quiz answers on backend, calculates score/pass status, stores attempt
 */
router.post('/quizzes/module/:moduleId/submit', (req, res) => {
  const { moduleId } = req.params;
  const { userId = 'student-001', studentName = 'Learner', answers = {} } = req.body;

  const db = getDb();
  let moduleQuestions = (db.questionBank || []).filter(
    q => q.moduleId === moduleId && q.status === 'active'
  );

  if (moduleQuestions.length === 0) {
    for (const c of (db.courses || [])) {
      const mod = (c.modules || []).find(m => m.id === moduleId);
      if (mod && mod.quiz && mod.quiz.questions && mod.quiz.questions.length > 0) {
        moduleQuestions = mod.quiz.questions;
        break;
      }
    }
  }

  if (moduleQuestions.length === 0) {
    return res.status(404).json({ success: false, message: 'Quiz questions not found.' });
  }

  let correctCount = 0;
  const questionsReview = [];

  moduleQuestions.forEach(q => {
    const selectedAnswer = answers[q.id] !== undefined ? Number(answers[q.id]) : null;
    const isCorrect = selectedAnswer === q.correctAnswer;

    if (isCorrect) correctCount += 1;

    questionsReview.push({
      id: q.id,
      questionText: q.questionText,
      options: q.options,
      selectedAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation,
      difficulty: q.difficulty
    });
  });

  const totalQuestions = moduleQuestions.length;
  const score = correctCount;
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const passed = percentage >= 70; // 70% passing criteria

  // Find existing attempt count
  if (!db.quizAttempts) db.quizAttempts = [];
  const previousAttempts = db.quizAttempts.filter(
    a => a.userId === userId && a.moduleId === moduleId
  );
  const attemptNumber = previousAttempts.length + 1;

  const targetCourseId = req.body.courseId || 
    (db.courses || []).find(c => (c.modules || []).some(m => m.id === moduleId))?.id || 
    'python-programming';

  const newAttempt = {
    id: `attempt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId,
    studentName,
    courseId: targetCourseId,
    moduleId,
    score,
    totalQuestions,
    percentage,
    passed,
    attemptNumber,
    answers,
    completedAt: new Date().toISOString()
  };

  db.quizAttempts.unshift(newAttempt);

  // If passed, mark module as completed in the corresponding course
  const targetCourse = (db.courses || []).find(c => c.id === targetCourseId || (c.modules || []).some(m => m.id === moduleId));
  if (targetCourse && passed) {
    const targetModule = targetCourse.modules?.find(m => m.id === moduleId);
    if (targetModule) {
      targetModule.completed = true;

      // Recalculate course progress
      const totalMods = targetCourse.modules.length;
      const doneMods = targetCourse.modules.filter(m => m.completed).length;
      targetCourse.progress = Math.round((doneMods / totalMods) * 100);
    }
  }

  saveDb(db);

  res.json({
    success: true,
    message: passed ? 'Module Quiz Passed!' : 'Module Quiz Not Passed',
    result: {
      attemptId: newAttempt.id,
      moduleId,
      score,
      totalQuestions,
      correctCount,
      incorrectCount: totalQuestions - correctCount,
      percentage,
      passed,
      attemptNumber,
      questionsReview
    }
  });
});

/**
 * GET /api/quizzes/module/:moduleId/attempts
 * Get attempt history for a module
 */
router.get('/quizzes/module/:moduleId/attempts', (req, res) => {
  const { moduleId } = req.params;
  const { userId = 'student-001' } = req.query;

  const db = getDb();
  const attempts = (db.quizAttempts || [])
    .filter(a => a.moduleId === moduleId && (a.userId === userId || !userId))
    .map(a => ({
      id: a.id,
      attemptNumber: a.attemptNumber,
      score: a.score,
      totalQuestions: a.totalQuestions,
      percentage: a.percentage,
      passed: a.passed,
      completedAt: a.completedAt
    }));

  res.json({ success: true, attempts });
});

// =========================================================================
// FINAL ASSESSMENT ENDPOINTS (45-Minute Server-Persisted Timer)
// =========================================================================

/**
 * Helper to pick question paper set based on student's first name in alphabetical order:
 * A-F: Set A (SQL-QP-SETA)
 * G-L: Set B (SQL-QP-SETB)
 * M-R: Set C (SQL-QP-SETC)
 * S-Z: Set D (SQL-QP-SETD)
 */
function getPaperSetForStudent(studentName, papers = []) {
  if (!papers || papers.length === 0) return null;
  if (!studentName || typeof studentName !== 'string') return papers[0];

  const firstLetter = studentName.trim().toUpperCase().charAt(0);
  if (firstLetter >= 'A' && firstLetter <= 'F') return papers[0] || papers[0];
  if (firstLetter >= 'G' && firstLetter <= 'L') return papers[1] || papers[0];
  if (firstLetter >= 'M' && firstLetter <= 'R') return papers[2] || papers[0];
  if (firstLetter >= 'S' && firstLetter <= 'Z') return papers[3] || papers[0];
  return papers[0];
}

/**
 * POST /api/final-test/start
 * Starts or resumes a 45-minute (2700 seconds) server-validated test session
 */
router.post('/final-test/start', (req, res) => {
  const { userId = 'student-001', studentName = 'Learner', courseId = 'python-programming', paperCode } = req.body;
  const db = getDb();

  if (!db.finalTestActiveSessions) db.finalTestActiveSessions = {};

  const DURATION_SECONDS = 45 * 60; // 45 minutes = 2700s
  const now = Date.now();

  let sessionKey = `${userId}-${courseId}-final`;
  let session = db.finalTestActiveSessions[sessionKey];

  if (!session || session.submitted) {
    session = {
      sessionId: `session-${now}`,
      userId,
      studentName,
      courseId,
      startedAt: now,
      durationSeconds: DURATION_SECONDS,
      submitted: false
    };
    db.finalTestActiveSessions[sessionKey] = session;
    saveDb(db);
  }

  const elapsedSeconds = Math.floor((now - session.startedAt) / 1000);
  const remainingSeconds = Math.max(0, DURATION_SECONDS - elapsedSeconds);

  // Fetch course question papers
  const course = (db.courses || []).find(c => c.id === courseId) || (db.courses || []).find(c => c.id === 'python-programming') || (db.courses || []).find(c => c.id === 'sql-mastery' || c.id === 'sql-data-analysis');
  const questionPapers = course?.finalTest?.questionPapers || [];

  let assignedPaper = null;
  if (paperCode) {
    assignedPaper = questionPapers.find(p => p.paperCode === paperCode);
  }
  if (!assignedPaper) {
    assignedPaper = getPaperSetForStudent(studentName, questionPapers);
  }

  let rawQuestions = assignedPaper?.questions;
  if (!rawQuestions || rawQuestions.length === 0) {
    rawQuestions = (db.questionBank || []).filter(q => (q.category === 'final-test' || q.courseId === courseId) && q.status === 'active');
  }

  // Omit correct answers and explanations for candidate security
  const questions = rawQuestions.map(q => {
    const { correctAnswer, explanation, ...safeQ } = q;
    return safeQ;
  });

  res.json({
    success: true,
    sessionId: session.sessionId,
    startedAt: session.startedAt,
    serverTime: now,
    durationSeconds: DURATION_SECONDS,
    remainingSeconds,
    totalQuestions: questions.length,
    passingScore: 70, // 70% threshold
    assignedPaper: assignedPaper ? {
      id: assignedPaper.id,
      paperCode: assignedPaper.paperCode,
      groupName: assignedPaper.groupName,
      letterRange: assignedPaper.letterRange,
      title: assignedPaper.title,
      subtitle: assignedPaper.subtitle
    } : null,
    availablePapers: questionPapers.map(p => ({
      id: p.id,
      paperCode: p.paperCode,
      groupName: p.groupName,
      letterRange: p.letterRange,
      title: p.title
    })),
    questions
  });
});

/**
 * POST /api/final-test/submit
 * Submits the final assessment, validates server time, scores answers, logs result
 */
router.post('/final-test/submit', (req, res) => {
  const { userId = 'student-001', studentName = 'Learner', courseId = 'python-programming', paperCode, answers = {} } = req.body;
  const db = getDb();

  const now = Date.now();
  const sessionKey = `${userId}-${courseId}-final`;
  const session = db.finalTestActiveSessions?.[sessionKey];

  let startedAt = session ? session.startedAt : now - (10 * 60 * 1000);
  const elapsedSeconds = Math.floor((now - startedAt) / 1000);
  const isAutoSubmitted = elapsedSeconds >= (45 * 60 + 10);

  const course = (db.courses || []).find(c => c.id === courseId) || (db.courses || []).find(c => c.id === 'python-programming') || (db.courses || []).find(c => c.id === 'sql-mastery' || c.id === 'sql-data-analysis');
  const questionPapers = course?.finalTest?.questionPapers || [];

  let assignedPaper = null;
  if (paperCode) {
    assignedPaper = questionPapers.find(p => p.paperCode === paperCode);
  }
  if (!assignedPaper) {
    assignedPaper = getPaperSetForStudent(studentName, questionPapers);
  }

  let finalQuestions = assignedPaper?.questions;
  if (!finalQuestions || finalQuestions.length === 0) {
    finalQuestions = (db.questionBank || []).filter(q => q.category === 'final-test' && q.status === 'active');
  }

  let correctCount = 0;
  const questionsReview = [];

  finalQuestions.forEach(q => {
    const selectedAnswer = answers[q.id] !== undefined ? Number(answers[q.id]) : null;
    const isCorrect = selectedAnswer === q.correctAnswer;

    if (isCorrect) correctCount += 1;

    questionsReview.push({
      id: q.id,
      questionText: q.questionText,
      options: q.options,
      selectedAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation,
      difficulty: q.difficulty
    });
  });

  const totalQuestions = finalQuestions.length;
  const score = correctCount;
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const passed = percentage >= 60; // 60% passing criteria (15/25)

  // Format time taken
  const minutesTaken = Math.floor(elapsedSeconds / 60);
  const secondsTaken = elapsedSeconds % 60;
  const timeTakenFormatted = `${minutesTaken} minute${minutesTaken !== 1 ? 's' : ''} ${secondsTaken} second${secondsTaken !== 1 ? 's' : ''}`;

  if (!db.finalTestAttempts) db.finalTestAttempts = [];
  const previousAttempts = db.finalTestAttempts.filter(a => a.userId === userId);

  const targetCourseId = req.body.courseId || courseId || 'python-programming';

  const attempt = {
    id: `ftest-attempt-${Date.now()}`,
    userId,
    studentName,
    courseId: targetCourseId,
    score,
    totalQuestions,
    percentage,
    passed,
    attemptNumber: previousAttempts.length + 1,
    timeTakenSeconds: elapsedSeconds,
    timeTakenFormatted,
    isAutoSubmitted,
    startedAt: new Date(startedAt).toISOString(),
    submittedAt: new Date(now).toISOString(),
    answers
  };

  db.finalTestAttempts.unshift(attempt);

  // Update session status
  if (session) {
    session.submitted = true;
  }

  // Update course completion status if passed
  const targetCourse = (db.courses || []).find(c => c.id === targetCourseId || c.id === courseId);
  if (targetCourse && passed) {
    targetCourse.progress = 100;
    targetCourse.isCompleted = true;
    targetCourse.completedAt = new Date().toISOString();
  }

  saveDb(db);

  res.json({
    success: true,
    message: passed ? 'Final Assessment Passed!' : 'Final Assessment Not Passed',
    result: {
      attemptId: attempt.id,
      score,
      totalQuestions,
      correctCount,
      incorrectCount: totalQuestions - correctCount,
      percentage,
      passed,
      timeTakenFormatted,
      isAutoSubmitted,
      attemptNumber: attempt.attemptNumber,
      questionsReview
    }
  });
});

/**
 * GET /api/final-test/attempts
 * Get user attempt history for final assessment
 */
router.get('/final-test/attempts', (req, res) => {
  const { userId = 'student-001' } = req.query;
  const db = getDb();

  const attempts = (db.finalTestAttempts || [])
    .filter(a => a.userId === userId || !userId)
    .map(a => ({
      id: a.id,
      attemptNumber: a.attemptNumber,
      score: a.score,
      totalQuestions: a.totalQuestions,
      percentage: a.percentage,
      passed: a.passed,
      timeTakenFormatted: a.timeTakenFormatted,
      submittedAt: a.submittedAt
    }));

  res.json({ success: true, attempts });
});

// =========================================================================
// ADMIN QUIZ MANAGEMENT & ANALYTICS (PROTECTED BY VERIFY ADMIN)
// =========================================================================

/**
 * GET /api/admin/questions
 * Returns all questions WITH correct answers and explanations for Admin
 */
router.get('/admin/questions', verifyAdminToken, (req, res) => {
  const db = getDb();
  res.json({
    success: true,
    total: (db.questionBank || []).length,
    questions: db.questionBank || []
  });
});

/**
 * POST /api/admin/questions
 * Creates a new question in the question bank
 */
router.post('/admin/questions', verifyAdminToken, (req, res) => {
  const {
    questionText, options, correctAnswer, explanation,
    moduleId, category = 'module', difficulty = 'medium', status = 'active'
  } = req.body;

  if (!questionText || !options || options.length < 2 || correctAnswer === undefined) {
    return res.status(400).json({ success: false, message: 'Missing required question fields.' });
  }

  const db = getDb();
  if (!db.questionBank) db.questionBank = [];

  const newQ = {
    id: `sql-q-custom-${Date.now()}`,
    courseId: 'sql-data-analysis',
    moduleId: category === 'final-test' ? 'final-test' : (moduleId || 'sql-mod-1'),
    category: category || 'module',
    order: db.questionBank.length + 1,
    difficulty: difficulty || 'medium',
    questionText,
    options,
    correctAnswer: Number(correctAnswer),
    explanation: explanation || '',
    status: status || 'active'
  };

  db.questionBank.push(newQ);
  saveDb(db);

  logActivity({
    adminId: req.admin.adminId,
    action: 'QUESTION_CREATED',
    target: `Question: ${newQ.id}`,
    details: `Created question in ${newQ.moduleId}`
  });

  res.status(201).json({ success: true, message: 'Question created successfully', question: newQ });
});

/**
 * PUT /api/admin/questions/:id
 * Updates an existing question
 */
router.put('/admin/questions/:id', verifyAdminToken, (req, res) => {
  const { id } = req.params;
  const db = getDb();

  const index = (db.questionBank || []).findIndex(q => q.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Question not found' });
  }

  const existing = db.questionBank[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id // preserve ID
  };

  db.questionBank[index] = updated;
  saveDb(db);

  logActivity({
    adminId: req.admin.adminId,
    action: 'QUESTION_UPDATED',
    target: `Question: ${id}`,
    details: `Updated question attributes`
  });

  res.json({ success: true, message: 'Question updated successfully', question: updated });
});

/**
 * DELETE /api/admin/questions/:id
 * Deletes a question from the question bank
 */
router.delete('/admin/questions/:id', verifyAdminToken, (req, res) => {
  const { id } = req.params;
  const db = getDb();

  const index = (db.questionBank || []).findIndex(q => q.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Question not found' });
  }

  db.questionBank.splice(index, 1);
  saveDb(db);

  logActivity({
    adminId: req.admin.adminId,
    action: 'QUESTION_DELETED',
    target: `Question: ${id}`,
    details: `Permanently deleted question ${id}`
  });

  res.json({ success: true, message: 'Question deleted successfully' });
});

/**
 * GET /api/admin/quiz-analytics
 * Calculates comprehensive analytics across module quizzes & final test
 */
router.get('/admin/quiz-analytics', verifyAdminToken, (req, res) => {
  const db = getDb();

  const quizAttempts = db.quizAttempts || [];
  const finalTestAttempts = db.finalTestAttempts || [];

  const totalQuizAttempts = quizAttempts.length;
  const passedQuizAttempts = quizAttempts.filter(a => a.passed).length;
  const quizPassRate = totalQuizAttempts > 0 ? Math.round((passedQuizAttempts / totalQuizAttempts) * 100) : 0;
  const avgQuizScore = totalQuizAttempts > 0 
    ? Math.round(quizAttempts.reduce((acc, a) => acc + a.percentage, 0) / totalQuizAttempts) 
    : 0;

  const totalFinalAttempts = finalTestAttempts.length;
  const passedFinalAttempts = finalTestAttempts.filter(a => a.passed).length;
  const finalPassRate = totalFinalAttempts > 0 ? Math.round((passedFinalAttempts / totalFinalAttempts) * 100) : 0;
  const avgFinalScore = totalFinalAttempts > 0 
    ? Math.round(finalTestAttempts.reduce((acc, a) => acc + a.percentage, 0) / totalFinalAttempts) 
    : 0;

  // Module-wise average scores
  const modulePerformance = {};
  for (let i = 1; i <= 15; i++) {
    const modId = `sql-mod-${i}`;
    const modAttempts = quizAttempts.filter(a => a.moduleId === modId);
    const count = modAttempts.length;
    const avgPct = count > 0 ? Math.round(modAttempts.reduce((acc, a) => acc + a.percentage, 0) / count) : 0;
    modulePerformance[modId] = {
      moduleNumber: i,
      attempts: count,
      avgPercentage: avgPct,
      passedCount: modAttempts.filter(a => a.passed).length
    };
  }

  res.json({
    success: true,
    analytics: {
      totalQuizAttempts,
      passedQuizAttempts,
      quizPassRate,
      avgQuizScore,
      totalFinalAttempts,
      passedFinalAttempts,
      finalPassRate,
      avgFinalScore,
      modulePerformance,
      recentQuizAttempts: quizAttempts.slice(0, 10),
      recentFinalAttempts: finalTestAttempts.slice(0, 10)
    }
  });
});

export default router;
