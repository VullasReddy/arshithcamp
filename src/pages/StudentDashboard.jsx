import React from 'react';
import { 
  BookOpen, Award, CheckCircle, Clock, PlayCircle, 
  TrendingUp, Sparkles, ArrowRight, Download, User, Compass, GraduationCap 
} from 'lucide-react';
import { SAMPLE_CERTIFICATES } from '../data/coursesData';
import { generateCoursePDF } from '../utils/pdfGenerator';
import { isCertificateUnlocked } from '../utils/certificateEligibility';

export default function StudentDashboard({ 
  studentUser, 
  courses = [], 
  onSelectCourse, 
  onStartLearning, 
  onViewCertificate,
  onExploreCourses 
}) {
  const userName = (studentUser?.name && studentUser.name.trim()) ? studentUser.name.trim() : (studentUser?.email && studentUser.email.trim() ? studentUser.email.trim() : 'Student');
  const enrolledCourseIds = studentUser?.enrolledCourseIds || [];
  const userId = studentUser?.id || studentUser?.email || 'student-001';

  const enrolledCourses = courses.filter(c => enrolledCourseIds.includes(c.id));
  const completedCourses = enrolledCourses.filter(c => c.progress === 100);
  const inProgressCourse = enrolledCourses.sort((a, b) => (b.progress || 0) - (a.progress || 0))[0];

  const earnedCertificates = SAMPLE_CERTIFICATES.filter(sc => {
    const targetCourse = courses.find(c => c.id === sc.courseId);
    const elig = isCertificateUnlocked(sc.courseId, userId, targetCourse);
    return elig.canGenerateCertificate;
  });

  const totalLearningHours = enrolledCourses.reduce((acc, c) => acc + (parseInt(c.duration) || 10), 0);
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="py-10 bg-[#FAFDFB] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-emerald-950 rounded-3xl p-6 sm:p-10 text-white dark-bezel-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-400 border-2 border-emerald-300 flex items-center justify-center text-brand-950 font-black text-2xl shadow-md shrink-0">
                {userInitial}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Welcome back, {userName} 👋
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <p className="text-xs sm:text-sm text-emerald-200/90 font-medium">
                    Arshith Ignite Student Dashboard • Keep building your skills!
                  </p>
                  {studentUser?.regNo && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 font-mono tracking-wide">
                      Reg No: {studentUser.regNo}
                    </span>
                  )}
                  {studentUser?.phone && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 tracking-wide">
                      Phone: {studentUser.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {inProgressCourse ? (
              <button
                onClick={() => onStartLearning(inProgressCourse.id)}
                className="px-6 py-3 text-xs font-black text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-full shadow-lg transition-all flex items-center gap-2 shrink-0 border-2 border-emerald-300 cursor-pointer"
              >
                <PlayCircle className="w-4 h-4 text-slate-950" />
                <span>Resume Learning</span>
              </button>
            ) : (
              <button
                onClick={onExploreCourses}
                className="px-6 py-3 text-xs font-black text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-full shadow-lg transition-all flex items-center gap-2 shrink-0 border-2 border-emerald-300 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-slate-950" />
                <span>Explore Courses</span>
              </button>
            )}
          </div>

          {/* Key Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-brand-700/60">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-emerald-300 uppercase">Enrolled Ignite Courses</p>
              <p className="text-2xl font-black text-white">{enrolledCourses.length}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-emerald-300 uppercase">Completed Courses</p>
              <p className="text-2xl font-black text-white">{completedCourses.length}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-emerald-300 uppercase">Certificates</p>
              <p className="text-2xl font-black text-amber-300">{earnedCertificates.length}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-emerald-300 uppercase">Learning Hours</p>
              <p className="text-2xl font-black text-white">{enrolledCourses.length > 0 ? `${totalLearningHours} hrs` : '0 hrs'}</p>
            </div>
          </div>
        </div>

        {/* Currently Studying Banner or Empty Banner */}
        {inProgressCourse ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 dark-bezel space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-brand-900 bg-brand-50 px-3 py-1 rounded-full uppercase border border-brand-200">
                Currently Studying
              </span>
              <span className="text-xs font-bold text-slate-500">{inProgressCourse.progress || 0}% Overall Progress</span>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900">{inProgressCourse.title}</h3>
                <p className="text-xs text-slate-500 font-semibold">
                  Instructor: {inProgressCourse.instructor?.name || 'Dr. Ananya Sharma'} • Level: {inProgressCourse.level}
                </p>

                {/* Progress bar */}
                <div className="w-full max-w-md h-2.5 bg-slate-100 rounded-full overflow-hidden mt-3 border border-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-brand-600 to-emerald-400 rounded-full"
                    style={{ width: `${inProgressCourse.progress || 0}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => generateCoursePDF(inProgressCourse, userName)}
                  className="px-4 py-3 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-full border border-slate-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-brand-800" />
                  <span>Download Course PDF</span>
                </button>

                <button
                  onClick={() => onStartLearning(inProgressCourse.id)}
                  className="px-6 py-3 text-xs font-black text-white bg-brand-600 hover:bg-brand-700 rounded-full border-2 border-brand-900 shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue Learning</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 dark-bezel text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-brand-50 border-2 border-brand-200 flex items-center justify-center text-brand-700 mx-auto">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-xl font-black text-slate-900">No Courses Enrolled Yet</h3>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                You haven't enrolled in any Ignite courses yet. Explore our high-impact curriculum in Python, Web Development, SQL, AI, and start learning today!
              </p>
            </div>
            <button
              onClick={onExploreCourses}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-black text-white bg-brand-600 hover:bg-brand-700 rounded-full border-2 border-brand-900 shadow-md transition-all cursor-pointer"
            >
              <span>Browse All Courses</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Enrolled Courses Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">My Enrolled Ignite Courses</h2>
            {enrolledCourses.length > 0 && (
              <span className="text-xs font-extrabold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                {enrolledCourses.length} Active
              </span>
            )}
          </div>

          {enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrolledCourses.map((course) => {
                const completedModules = course.modules?.filter(m => m.completed).length || 0;
                const totalModules = course.modules?.length || 1;
                const progressPercent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

                return (
                  <div
                    key={course.id}
                    className="bg-white rounded-3xl p-6 dark-bezel flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-brand-800">{course.category}</span>
                        <span className="text-xs font-bold text-slate-500">{course.level}</span>
                      </div>

                      <h3 
                        onClick={() => onSelectCourse(course.id)}
                        className="text-lg font-black text-slate-900 hover:text-brand-700 cursor-pointer transition-colors"
                      >
                        {course.title}
                      </h3>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <div className="flex justify-between items-center text-xs font-black text-slate-700">
                        <span>{completedModules} / {totalModules} Modules Completed</span>
                        <span className="text-brand-700 font-extrabold">{progressPercent}%</span>
                      </div>

                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className="h-full bg-gradient-to-r from-brand-600 to-emerald-400 rounded-full"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => onStartLearning(course.id)}
                          className="text-xs font-black text-brand-700 hover:text-brand-900 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Open Modules</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => generateCoursePDF(course, userName)}
                          className="text-xs font-bold text-slate-600 hover:text-brand-900 flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-brand-700" />
                          <span>PDF</span>
                        </button>

                        {course.progress === 100 && (
                          <button
                            onClick={() => onViewCertificate(course.id)}
                            className="px-3 py-1 text-[11px] font-black text-amber-900 bg-amber-200 rounded-full flex items-center gap-1 border border-amber-300 cursor-pointer"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>Certificate</span>
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl text-center space-y-2">
              <p className="text-xs font-bold text-slate-500">Your course list is currently empty.</p>
              <button
                onClick={onExploreCourses}
                className="text-xs font-black text-brand-700 hover:underline cursor-pointer"
              >
                Click here to view all available Ignite courses →
              </button>
            </div>
          )}
        </div>

        {/* Earned Certificates Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-900">Earned Certificates</h2>

          {earnedCertificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {earnedCertificates.map((cert) => (
                <div key={cert.id} className="bg-white rounded-3xl p-6 border-2 border-amber-300 bg-gradient-to-tr from-amber-50/50 to-white shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-amber-800 uppercase tracking-wider">ID: {cert.id}</span>
                    <h3 className="text-base font-black text-slate-900">{cert.courseTitle}</h3>
                    <p className="text-xs text-slate-600 font-semibold">
                      Issued on: {cert.issueDate === 'October 1, 2026' ? new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : (cert.issueDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }))}
                    </p>
                  </div>

                  <button
                    onClick={() => onViewCertificate(cert.courseId)}
                    className="px-4 py-2 text-xs font-black text-amber-950 bg-amber-400 hover:bg-amber-300 rounded-full shadow-xs transition-all flex items-center gap-1 border border-amber-500 shrink-0 cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    <span>View</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl text-center space-y-1">
              <p className="text-xs font-bold text-slate-600">No certificates earned yet.</p>
              <p className="text-[11px] text-slate-400 font-medium">Complete 100% of a course and its final project to unlock your verified certificate!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
