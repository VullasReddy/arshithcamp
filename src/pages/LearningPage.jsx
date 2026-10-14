import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, CheckCircle, Circle, Award, Download, 
  ChevronRight, ChevronLeft, BookOpen, ExternalLink, 
  Code, Sparkles, AlertTriangle, CheckSquare, HelpCircle, Clock, Briefcase,
  Terminal, Layers, CheckCircle2
} from 'lucide-react';
import { generateCoursePDF } from '../utils/pdfGenerator';
import { cleanText } from '../utils/textUtils';
import ModuleQuizModal from '../components/ModuleQuizModal';
import FinalTestModal from '../components/FinalTestModal';
import CourseProjectsModal from '../components/CourseProjectsModal';
import CertificateRequirementsModal from '../components/CertificateRequirementsModal';
import { isCertificateUnlocked } from '../utils/certificateEligibility';

export default function LearningPage({ 
  course, 
  activeModuleId, 
  onBack, 
  onToggleModuleComplete, 
  onViewCertificate 
}) {
  const [currentModule, setCurrentModule] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [finalTestModalOpen, setFinalTestModalOpen] = useState(false);
  const [projectsModalOpen, setProjectsModalOpen] = useState(false);
  const [requirementsModalOpen, setRequirementsModalOpen] = useState(false);
  const [expandedLineByLine, setExpandedLineByLine] = useState({});
  const [revealedPracticeAnswers, setRevealedPracticeAnswers] = useState({});
  const [revealedInterviewAnswers, setRevealedInterviewAnswers] = useState({});

  const toggleLineByLine = (key) => {
    setExpandedLineByLine(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePracticeAnswer = (key) => {
    setRevealedPracticeAnswers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleInterviewAnswer = (key) => {
    setRevealedInterviewAnswers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const savedUser = (() => {
    try {
      const raw = localStorage.getItem('student_user') || localStorage.getItem('studentUser');
      return raw && raw !== 'undefined' && raw !== 'null' ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  })();
  const studentName = (savedUser?.name && savedUser.name.trim()) ? savedUser.name.trim() : (savedUser?.email && savedUser.email.trim() ? savedUser.email.trim() : 'Student');

  useEffect(() => {
    if (!course || !course.modules || course.modules.length === 0) return;

    setCurrentModule(prev => {
      // If student is already viewing a module, preserve it when course updates
      if (prev) {
        const matchingMod = course.modules.find(m => m.id === prev.id);
        if (matchingMod) return matchingMod;
      }
      if (activeModuleId) {
        const mod = course.modules.find(m => m.id === activeModuleId);
        if (mod) return mod;
      }
      return course.modules[0];
    });
  }, [course, activeModuleId]);

  if (!course) return null;

  const currentModuleIndex = course.modules?.findIndex(m => m.id === currentModule?.id) ?? 0;
  const completedCount = course.modules?.filter(m => m.completed).length || 0;
  const totalCount = course.modules?.length || 1;
  const isCourseFullyCompleted = course.progress === 100 || completedCount === totalCount;

  const userId = savedUser?.id || savedUser?.email || 'student-001';
  const certEligibility = isCertificateUnlocked(course.id, userId, course);

  const handleCertificateClick = () => {
    if (certEligibility.canGenerateCertificate) {
      onViewCertificate(course.id);
    } else {
      setRequirementsModalOpen(true);
    }
  };

  // Handle Mark Module Complete
  const handleMarkComplete = () => {
    if (!currentModule) return;
    onToggleModuleComplete(course.id, currentModule.id);

    // Check if this was the final uncompleted module
    const remainingUncompleted = course.modules.filter(m => !m.completed && m.id !== currentModule.id);
    if (remainingUncompleted.length === 0) {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });
    }
  };

  const handlePrev = () => {
    if (currentModuleIndex > 0) {
      setCurrentModule(course.modules[currentModuleIndex - 1]);
      setShowSolution(false);
      setExpandedLineByLine({});
      setRevealedPracticeAnswers({});
      setRevealedInterviewAnswers({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentModuleIndex < course.modules.length - 1) {
      setCurrentModule(course.modules[currentModuleIndex + 1]);
      setShowSolution(false);
      setExpandedLineByLine({});
      setRevealedPracticeAnswers({});
      setRevealedInterviewAnswers({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const rm = currentModule?.readingMaterial;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Bar */}
      <header className="bg-slate-900 border-b-2 border-brand-900 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all flex items-center gap-1.5 text-xs font-extrabold border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Exit Bootcamp Player</span>
          </button>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div>
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">{cleanText(course.title)}</span>
            <h2 className="text-sm font-black text-white truncate max-w-xs sm:max-w-md">
              {cleanText(currentModule?.title)}
            </h2>
          </div>
        </div>

        {/* Progress Tracker Widget */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Course Progress</p>
              <p className="text-xs font-black text-emerald-400">{completedCount} / {totalCount} Modules ({course.progress}%)</p>
            </div>
            <div className="w-28 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-brand-600 to-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>

          {/* 3 Mini Projects Button */}
          {course?.projects && course.projects.length > 0 && (
            <button
              onClick={() => setProjectsModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-black text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 rounded-xl shadow-lg flex items-center gap-1.5 transition-all"
              title="Open Course Projects (3 Mini Projects)"
            >
              <Briefcase className="w-4 h-4 text-cyan-400" />
              <span>3 Mini Projects</span>
            </button>
          )}

          {/* Final Test Button */}
          <button
            onClick={() => setFinalTestModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg flex items-center gap-1.5 transition-all"
            title={`Take 45-Minute ${course?.title || 'Course'} Final Assessment`}
          >
            <Clock className="w-4 h-4 text-slate-950" />
            <span>Final Assessment (45m)</span>
          </button>

          <button
            onClick={() => generateCoursePDF(course, studentName)}
            className="px-3 py-1.5 text-xs font-extrabold text-white bg-brand-900 hover:bg-brand-800 border border-brand-700 rounded-lg flex items-center gap-1.5"
            title="Download Complete Course Manual PDF"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Course PDF</span>
          </button>

          {isCourseFullyCompleted && (
            <button
              onClick={handleCertificateClick}
              className="px-4 py-1.5 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-full shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-4 h-4 text-slate-950" />
              <span>Get Certificate</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 grid lg:grid-cols-12 overflow-hidden">
        
        {/* Left Sidebar: Modules List (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900/90 border-r border-slate-800 overflow-y-auto max-h-[calc(100vh-60px)] p-4 space-y-4">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs font-black">
              <span className="text-slate-300 uppercase">Modules Progression</span>
              <span className="text-emerald-400">{completedCount} / {totalCount} Done</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-600 to-emerald-400 rounded-full"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>

          {/* Modules Tree */}
          <div className="space-y-2">
            {course.modules?.map((mod, idx) => {
              const isSelected = currentModule?.id === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => {
                    setCurrentModule(mod);
                    setShowSolution(false);
                    setExpandedLineByLine({});
                    setRevealedPracticeAnswers({});
                    setRevealedInterviewAnswers({});
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all border ${
                    isSelected
                      ? 'bg-brand-600 text-white border-brand-500 font-bold shadow-lg'
                      : mod.completed
                      ? 'bg-slate-900/80 text-emerald-300 border-slate-800/80 hover:bg-slate-800'
                      : 'bg-slate-900/40 text-slate-300 border-slate-800/60 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {mod.completed ? (
                      <CheckCircle className={`w-4.5 h-4.5 shrink-0 ${isSelected ? 'text-white' : 'text-emerald-400'}`} />
                    ) : (
                      <Circle className={`w-4.5 h-4.5 shrink-0 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                    )}
                    <span className="text-xs font-bold leading-snug break-words">
                      {cleanText(mod.title)}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono opacity-80 shrink-0 ml-1">
                    {mod.completed ? '✓' : `M${idx + 1}`}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Course Projects Card */}
          {course?.projects && course.projects.length > 0 && (
            <div className="bg-gradient-to-br from-cyan-950/80 via-slate-900 to-slate-950 p-4 rounded-2xl border-2 border-cyan-500/60 shadow-xl space-y-3 ring-1 ring-cyan-500/30 mt-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-cyan-400 text-slate-950 text-[10px] font-black uppercase rounded-full tracking-wider shadow-sm">
                  ★ Hands-On Practical
                </span>
                <span className="text-[10px] font-bold text-cyan-300 font-mono">3 Mini Projects</span>
              </div>

              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Course Projects (1-2 Pages)</span>
                </h4>
                <p className="text-[11px] text-slate-300 font-medium pt-1 leading-relaxed">
                  Fast, small, real-world {course?.title || 'course'} mini projects designed to apply your learning with starter code & GitHub submission.
                </p>
              </div>

              <button
                onClick={() => setProjectsModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-black text-slate-950 bg-cyan-400 hover:bg-cyan-300 active:scale-95 shadow-lg transition-all flex items-center justify-center gap-2 border border-cyan-300 cursor-pointer"
              >
                <Briefcase className="w-4 h-4 text-slate-950 shrink-0" />
                <span>View & Submit 3 Projects</span>
              </button>
            </div>
          )}

          {/* Highlighted Final Assessment Card Down of 15 Modules */}
          <div className="bg-gradient-to-br from-amber-950/90 via-slate-900 to-slate-950 p-4.5 rounded-2xl border-2 border-amber-400 shadow-2xl space-y-3 ring-2 ring-amber-400/40 mt-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black uppercase rounded-full tracking-wider shadow-sm">
                ★ Course Certification
              </span>
              <span className="text-[10px] font-bold text-amber-300 font-mono">25 Qs • 45 Mins</span>
            </div>

            <div>
              <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{course.title || 'Course'} Final Assessment</span>
              </h4>
              <p className="text-[11px] text-slate-300 font-medium pt-1 leading-relaxed">
                Test your mastery across all 15 modules to earn your verified course certificate.
              </p>
            </div>

            {/* Highlighting Yellow Pill Button requested by User */}
            <button
              onClick={() => setFinalTestModalOpen(true)}
              className="w-full py-3 px-4 rounded-full text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 shadow-xl transition-all flex items-center justify-center gap-2 border-2 border-amber-300 cursor-pointer"
            >
              <Clock className="w-4 h-4 text-slate-950 shrink-0" />
              <span>Final Assessment (45m)</span>
            </button>
          </div>

        </div>

        {/* Right Main Stage: Complete Reading Material (8 Cols) */}
        <div className="lg:col-span-8 p-4 sm:p-8 overflow-y-auto space-y-8 max-w-4xl mx-auto w-full">
          
          {/* Module Title Banner */}
          <div className="bg-slate-900 rounded-3xl p-6 border-2 border-brand-900 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-brand-900 text-emerald-300 text-[10px] font-black uppercase rounded-full border border-brand-800">
                Reading Material Manual
              </span>
              <span className="text-xs font-bold text-slate-400">Course Progress: {course.progress}%</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight break-words">{cleanText(currentModule?.title)}</h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed break-words">{cleanText(currentModule?.description)}</p>
          </div>

          {/* Completed Celebration Banner */}
          {isCourseFullyCompleted && (
            <div className="bg-gradient-to-r from-emerald-950 via-brand-900 to-slate-900 p-6 rounded-3xl border-2 border-emerald-400 space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-3xl">
                🎉
              </div>
              <h3 className="text-2xl font-black text-white">Congratulations! Course 100% Completed!</h3>
              <p className="text-xs text-emerald-200 font-medium max-w-lg mx-auto">
                You have completed all modules for {course.title}. Download your complete course manual PDF or claim your official completion certificate now!
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => generateCoursePDF(course, studentName)}
                  className="px-6 py-3 text-xs font-black text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-full shadow-lg flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>Download Complete Course PDF</span>
                </button>

                <button
                  onClick={handleCertificateClick}
                  className="px-6 py-3 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-full shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4 text-slate-950" />
                  <span>View Certificate</span>
                </button>
              </div>
            </div>
          )}

          {/* Reading Material Sections */}
          {rm && (
            <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-8 text-slate-200">
              
              {/* Introduction */}
              {rm.introduction && (
                <div className="space-y-3">
                  <h3 className="text-lg font-black text-emerald-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                    <BookOpen className="w-5 h-5" />
                    <span>1. Introduction</span>
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-300 font-normal">
                    {cleanText(rm.introduction)}
                  </p>
                </div>
              )}

              {/* Objectives */}
              {rm.objectives && rm.objectives.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-black text-emerald-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                    <CheckSquare className="w-5 h-5" />
                    <span>2. What You Will Learn</span>
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-2 text-xs font-semibold">
                    {rm.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{cleanText(obj)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 3. Technical Terminology & Definitions */}
              {rm.terminology && rm.terminology.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-emerald-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                    <BookOpen className="w-5 h-5 text-emerald-400" />
                    <span>3. Technical Terminology & Core Definitions</span>
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {rm.terminology.map((t, tIdx) => (
                      <div key={tIdx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-300 text-sm font-mono">{cleanText(t.term)}</span>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">Concept</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{cleanText(t.definition)}</p>
                        {t.importance && (
                          <p className="text-[11px] text-cyan-400/90 font-medium pt-1.5 border-t border-slate-900">
                            <span className="font-bold text-slate-400">Significance: </span>{cleanText(t.importance)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Architecture & Visual Workflow Diagram */}
              {rm.diagram && (
                <div className="space-y-3">
                  <h3 className="text-lg font-black text-emerald-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                    <Layers className="w-5 h-5 text-emerald-400" />
                    <span>4. Architecture & Visual Workflow</span>
                  </h3>
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono">
                      {cleanText(rm.diagram.title)}
                    </h4>
                    <div className="bg-slate-900/90 p-4 rounded-xl font-mono text-xs text-emerald-300 overflow-x-auto border border-slate-800">
                      <pre>{rm.diagram.ascii}</pre>
                    </div>
                    {rm.diagram.explanation && (
                      <p className="text-xs text-slate-300 leading-relaxed font-normal">
                        {cleanText(rm.diagram.explanation)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* 5. Detailed Core Topic Explanations */}
              {rm.sections && (
                <div className="space-y-6">
                  <h3 className="text-lg font-black text-emerald-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                    <BookOpen className="w-5 h-5 text-emerald-400" />
                    <span>5. Detailed Explanations & Core Theory</span>
                  </h3>
                  {rm.sections.map((sec, idx) => (
                    <div key={idx} className="space-y-3 bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80">
                      <h4 className="text-base font-bold text-white border-b border-slate-800/80 pb-1.5">
                        {cleanText(sec.heading)}
                      </h4>
                      <p className="text-sm leading-relaxed text-slate-300">{cleanText(sec.text)}</p>
                      
                      {sec.bulletPoints && (
                        <ul className="space-y-1.5 text-xs text-slate-300 pl-4 list-disc">
                          {sec.bulletPoints.map((bp, bIdx) => (
                            <li key={bIdx}>{cleanText(bp)}</li>
                          ))}
                        </ul>
                      )}

                      {sec.table && (
                        <div className="overflow-x-auto my-3">
                          <table className="w-full text-xs text-left border-collapse border border-slate-800">
                            <thead>
                              <tr className="bg-slate-950 text-emerald-400">
                                {sec.table.headers.map((h, hIdx) => (
                                  <th key={hIdx} className="p-2 border border-slate-800">{cleanText(h)}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {sec.table.rows.map((r, rIdx) => (
                                <tr key={rIdx} className="hover:bg-slate-800/40">
                                  {r.map((c, cIdx) => (
                                    <td key={cIdx} className="p-2 border border-slate-800 text-slate-300">{cleanText(c)}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* 6. Step-by-Step Practical Tutorials */}
              {rm.tutorials && rm.tutorials.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-emerald-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                    <Terminal className="w-5 h-5 text-emerald-400" />
                    <span>6. Step-by-Step Practical Tutorials</span>
                  </h3>
                  {rm.tutorials.map((tut, tIdx) => (
                    <div key={tIdx} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-black flex items-center justify-center">
                          {tIdx + 1}
                        </span>
                        <span>{cleanText(tut.title)}</span>
                      </h4>
                      <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-emerald-500/30">
                        {tut.steps && tut.steps.map((st, sIdx) => (
                          <div key={sIdx} className="space-y-2 pb-2">
                            <div className="flex items-start gap-2">
                              <span className="text-[11px] font-black uppercase text-emerald-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                Step {st.step || sIdx + 1}
                              </span>
                              <p className="text-xs font-bold text-slate-200">{cleanText(st.instruction)}</p>
                            </div>
                            {st.code && (
                              <div className="bg-slate-900 p-3 rounded-xl font-mono text-xs text-emerald-300 overflow-x-auto border border-slate-800">
                                <pre>{st.code}</pre>
                              </div>
                            )}
                            {st.explanation && (
                              <p className="text-xs text-slate-400 leading-relaxed pl-1">{cleanText(st.explanation)}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 7. Working Code Examples with Line-by-Line Breakdown */}
              {rm.codeExamples && (
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-emerald-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                    <Code className="w-5 h-5 text-emerald-400" />
                    <span>7. Syntax & Complete Working Code Examples</span>
                  </h3>
                  {rm.codeExamples.map((ex, exIdx) => (
                    <div key={exIdx} className="space-y-2.5 bg-slate-950 p-5 rounded-2xl border border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                          <Code className="w-4 h-4" />
                          <span>{cleanText(ex.title)}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {cleanText(ex.language) || 'Code'}
                        </span>
                      </div>

                      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 overflow-x-auto font-mono text-xs text-emerald-300">
                        <pre>{ex.code}</pre>
                      </div>

                      {ex.explanation && (
                        <p className="text-xs text-slate-400 italic">Note: {cleanText(ex.explanation)}</p>
                      )}

                      {/* Line-by-line Annotation Toggle */}
                      {ex.lineByLine && ex.lineByLine.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-800/80">
                          <button
                            onClick={() => toggleLineByLine(`${currentModule?.id}-${exIdx}`)}
                            className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <span>{expandedLineByLine[`${currentModule?.id}-${exIdx}`] ? '▲ Hide Line-by-Line Breakdown' : '▼ View Line-by-Line Code Annotation'}</span>
                          </button>

                          {expandedLineByLine[`${currentModule?.id}-${exIdx}`] && (
                            <div className="mt-2.5 space-y-1.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                              {ex.lineByLine.map((lbl, lIdx) => (
                                <div key={lIdx} className="text-xs grid grid-cols-12 gap-2 py-1.5 border-b border-slate-800/50 last:border-0 items-start">
                                  <span className="col-span-2 font-mono text-[10px] text-emerald-400 font-bold bg-slate-950 px-1.5 py-0.5 rounded text-center border border-slate-800">
                                    Line {lbl.line}
                                  </span>
                                  <div className="col-span-10 space-y-0.5">
                                    <div className="font-mono text-[11px] text-slate-200 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800/50 overflow-x-auto">
                                      <code>{lbl.code}</code>
                                    </div>
                                    <p className="text-[11px] text-slate-400 pl-1">{lbl.explanation}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* 8. Common Errors, Debugging & Solutions */}
              {course?.id !== 'web-development' && course?.id !== 'data-science-ai' && rm.commonErrors && rm.commonErrors.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-rose-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                    <span>8. Common Errors, Debugging Techniques & Solutions</span>
                  </h3>
                  <div className="space-y-4">
                    {rm.commonErrors.map((err, errIdx) => (
                      <div key={errIdx} className="bg-slate-950 p-5 rounded-2xl border border-rose-500/30 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-rose-500/20 text-rose-400 text-xs font-bold flex items-center justify-center">!</span>
                          <h4 className="text-sm font-bold text-rose-300">{cleanText(err.error)}</h4>
                        </div>
                        <p className="text-xs text-slate-300"><span className="font-bold text-slate-400">Root Cause: </span>{cleanText(err.reason)}</p>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {err.wrongCode && (
                            <div className="bg-rose-950/20 p-3 rounded-xl border border-rose-800/40 space-y-1">
                              <span className="text-[10px] font-black uppercase text-rose-400 tracking-wider">Incorrect / Buggy:</span>
                              <pre className="font-mono text-xs text-rose-300 overflow-x-auto">{err.wrongCode}</pre>
                            </div>
                          )}
                          {err.fixCode && (
                            <div className="bg-emerald-950/20 p-3 rounded-xl border border-emerald-800/40 space-y-1">
                              <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Correct Solution:</span>
                              <pre className="font-mono text-xs text-emerald-300 overflow-x-auto">{err.fixCode}</pre>
                            </div>
                          )}
                        </div>
                        {err.explanation && (
                          <p className="text-xs text-slate-400 leading-relaxed"><span className="font-bold text-slate-300">Debugging Tip: </span>{cleanText(err.explanation)}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 9. Best Practices & Industry Standards */}
              {rm.bestPractices && rm.bestPractices.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-cyan-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                    <CheckCircle className="w-5 h-5 text-cyan-400" />
                    <span>9. Best Practices & Industry Standards</span>
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {rm.bestPractices.map((bp, bpIdx) => (
                      <div key={bpIdx} className="bg-slate-950 p-4 rounded-2xl border border-cyan-500/30 space-y-2">
                        <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                          <span className="text-cyan-400 font-bold">#</span>
                          <span>{cleanText(bp.title)}</span>
                        </h4>
                        <p className="text-xs text-slate-200 font-medium">{cleanText(bp.rule)}</p>
                        {bp.why && (
                          <p className="text-[11px] text-slate-400"><span className="font-bold text-slate-300">Why: </span>{cleanText(bp.why)}</p>
                        )}
                        {bp.example && (
                          <div className="bg-slate-900 p-2 rounded-lg font-mono text-[11px] text-cyan-300 overflow-x-auto border border-slate-800">
                            <code>{bp.example}</code>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 10. Practice Exercise */}
              {rm.practiceExercise && (
                <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/40 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase">
                    <Sparkles className="w-4 h-4" />
                    <span>10. Practice Challenge: {cleanText(rm.practiceExercise.title)}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">{cleanText(rm.practiceExercise.problem)}</p>

                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="px-3 py-1.5 text-xs font-bold text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 rounded-lg border border-amber-800 cursor-pointer transition-all"
                  >
                    {showSolution ? 'Hide Solution' : 'View Solution Code'}
                  </button>

                  {showSolution && (
                    <div className="bg-slate-900 p-3 rounded-xl font-mono text-xs text-emerald-300 border border-slate-800">
                      <pre>{rm.practiceExercise.solutionCode}</pre>
                    </div>
                  )}
                </div>
              )}

              {/* 11. Practice Questions with Answers (15 Questions) */}
              {course?.id !== 'web-development' && course?.id !== 'data-science-ai' && rm.practiceQuestions && rm.practiceQuestions.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-lg font-black text-amber-400 flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-amber-400" />
                      <span>11. Practice Questions with Detailed Answers</span>
                    </h3>
                    <span className="text-xs font-bold text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
                      {rm.practiceQuestions.length} Practice Qs
                    </span>
                  </div>
                  <div className="space-y-3">
                    {rm.practiceQuestions.map((pq, pqIdx) => {
                      const isRevealed = revealedPracticeAnswers[`${currentModule?.id}-${pqIdx}`];
                      return (
                        <div key={pqIdx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2">
                              <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                                {pqIdx + 1}
                              </span>
                              <p className="text-xs font-bold text-slate-200 leading-relaxed">{cleanText(pq.question)}</p>
                            </div>
                            <button
                              onClick={() => togglePracticeAnswer(`${currentModule?.id}-${pqIdx}`)}
                              className="shrink-0 text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 px-2.5 py-1 rounded-lg border border-amber-800/80 transition-all cursor-pointer"
                            >
                              {isRevealed ? 'Hide Answer' : 'Show Answer'}
                            </button>
                          </div>
                          {isRevealed && (
                            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1.5">
                              <p className="text-xs text-emerald-300 font-semibold leading-relaxed">
                                <span className="font-bold text-white">Answer: </span>{cleanText(pq.answer)}
                              </p>
                              {pq.explanation && (
                                <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-slate-800">
                                  <span className="font-bold text-slate-300">Explanation: </span>{cleanText(pq.explanation)}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 12. Technical Interview Questions & Answers (10 Questions) */}
              {course?.id !== 'web-development' && course?.id !== 'data-science-ai' && rm.interviewQuestions && rm.interviewQuestions.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-lg font-black text-purple-400 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      <span>12. Technical Interview Questions & Model Answers</span>
                    </h3>
                    <span className="text-xs font-bold text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
                      {rm.interviewQuestions.length} Interview Qs
                    </span>
                  </div>
                  <div className="space-y-3">
                    {rm.interviewQuestions.map((iq, iqIdx) => {
                      const isRevealed = revealedInterviewAnswers[`${currentModule?.id}-${iqIdx}`];
                      return (
                        <div key={iqIdx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2">
                              <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                                {iqIdx + 1}
                              </span>
                              <p className="text-xs font-bold text-slate-200 leading-relaxed">{cleanText(iq.question)}</p>
                            </div>
                            <button
                              onClick={() => toggleInterviewAnswer(`${currentModule?.id}-${iqIdx}`)}
                              className="shrink-0 text-[11px] font-bold text-purple-400 hover:text-purple-300 bg-purple-950/40 hover:bg-purple-900/60 px-2.5 py-1 rounded-lg border border-purple-800/80 transition-all cursor-pointer"
                            >
                              {isRevealed ? 'Hide Answer' : 'Show Answer'}
                            </button>
                          </div>
                          {isRevealed && (
                            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-2">
                              <p className="text-xs text-slate-200 leading-relaxed">
                                <span className="font-bold text-purple-300">Model Answer: </span>{cleanText(iq.answer)}
                              </p>
                              {iq.keyPoints && iq.keyPoints.length > 0 && (
                                <div className="pt-1.5 border-t border-slate-800 space-y-1">
                                  <span className="text-[10px] font-black uppercase text-purple-400 tracking-wider">Key Talking Points:</span>
                                  <ul className="text-[11px] text-slate-300 space-y-1 pl-4 list-disc">
                                    {iq.keyPoints.map((kp, kpIdx) => (
                                      <li key={kpIdx}>{cleanText(kp)}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 13. Practical Mini-Task / Assignment */}
              {rm.miniTask && (
                <div className="bg-slate-950 p-6 rounded-3xl border-2 border-brand-800 space-y-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-black uppercase tracking-wider text-emerald-400">
                      13. Practical Mini-Task: {cleanText(rm.miniTask.title)}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed"><span className="font-bold text-slate-400">Objective: </span>{cleanText(rm.miniTask.objective)}</p>
                  {rm.miniTask.requirements && rm.miniTask.requirements.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Assignment Requirements:</span>
                      <ul className="grid sm:grid-cols-2 gap-2 text-xs">
                        {rm.miniTask.requirements.map((req, rIdx) => (
                          <li key={rIdx} className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-start gap-2 text-slate-300">
                            <span className="text-emerald-400 font-bold">[x]</span>
                            <span>{cleanText(req)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {rm.miniTask.deliverable && (
                    <div className="text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-slate-300">
                      <span className="font-bold text-emerald-400">Deliverable: </span>{cleanText(rm.miniTask.deliverable)}
                    </div>
                  )}
                </div>
              )}

              {/* 14. Module Summary & Key Takeaways */}
              {course?.id !== 'web-development' && rm.summary && (
                <div className="bg-gradient-to-br from-brand-950/60 to-slate-900 p-6 rounded-3xl border border-brand-800/80 space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>14. Module Summary & Key Takeaways</span>
                  </h3>
                  {rm.summary.takeaways && rm.summary.takeaways.length > 0 && (
                    <ul className="space-y-2 text-xs text-slate-200">
                      {rm.summary.takeaways.map((tk, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-2 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span className="leading-relaxed">{cleanText(tk)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {rm.summary.quickReference && rm.summary.quickReference.length > 0 && (
                    <div className="pt-2 border-t border-slate-800 space-y-2">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Quick Reference:</span>
                      <div className="grid sm:grid-cols-2 gap-2 text-xs">
                        {rm.summary.quickReference.map((qr, qIdx) => (
                          <div key={qIdx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-[11px] text-cyan-300">
                            {cleanText(qr)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 15. Module Self-Assessment MCQs */}
              {rm.selfAssessment && rm.selfAssessment.questions && (
                <div className="bg-slate-950 p-6 rounded-3xl border-2 border-emerald-500/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-emerald-400" />
                      <h4 className="text-sm font-black text-white uppercase tracking-wider">
                        {rm.selfAssessment.title || "15. Module Self-Assessment (5 MCQs)"}
                      </h4>
                    </div>
                    <button
                      onClick={() => setQuizModalOpen(true)}
                      className="px-3.5 py-1.5 text-[11px] font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-full shadow transition-all cursor-pointer"
                    >
                      Take Interactive Quiz
                    </button>
                  </div>

                  <div className="space-y-4 pt-1">
                    {rm.selfAssessment.questions.map((q, qIdx) => (
                      <div key={q.id || qIdx} className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2.5">
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                            {qIdx + 1}
                          </span>
                          <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                              {q.topic}
                            </span>
                            <p className="text-xs font-bold text-slate-200 leading-relaxed">
                              {q.questionText}
                            </p>
                          </div>
                        </div>

                        {q.codeSnippet && (
                          <div className="bg-slate-950 p-2.5 rounded-xl font-mono text-[11px] text-emerald-300 overflow-x-auto border border-slate-800">
                            <pre>{q.codeSnippet}</pre>
                          </div>
                        )}

                        <div className="grid sm:grid-cols-2 gap-1.5 pt-1">
                          {q.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className="px-3 py-2 rounded-xl text-xs bg-slate-950/80 border border-slate-800/80 text-slate-300 flex items-center gap-2"
                            >
                              <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] font-bold text-slate-400 flex items-center justify-center shrink-0">
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span className="leading-tight">{opt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Takeaways */}
              {(course?.id === 'data-science-ai' || course?.id === 'web-development' || !rm.summary) && rm.keyTakeaways && rm.keyTakeaways.length > 0 && (
                <div className="bg-brand-950/40 p-5 rounded-2xl border border-brand-800/80 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400">Key Takeaways</h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {rm.keyTakeaways.map((kt, kIdx) => (
                      <li key={kIdx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{kt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Official References */}
              {rm.references && rm.references.length > 0 && (
                <div className="pt-4 border-t border-slate-800 text-xs space-y-2">
                  <span className="font-bold text-slate-400 uppercase">Learning References:</span>
                  <div className="flex flex-wrap gap-3">
                    {rm.references.map((ref, rIdx) => (
                      <a
                        key={rIdx}
                        href={ref.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:underline inline-flex items-center gap-1 font-semibold"
                      >
                        <span>{ref.title}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Bottom Action Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={handlePrev}
              disabled={currentModuleIndex <= 0}
              className="w-full sm:w-auto px-4 py-3 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-2xl flex items-center justify-center gap-1.5 transition-all border border-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Take Module Quiz Button */}
            <button
              onClick={() => setQuizModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-xl transition-all flex items-center justify-center gap-2 border-2 border-amber-300"
            >
              <HelpCircle className="w-4.5 h-4.5 text-slate-950" />
              <span>Take {currentModule?.title?.split('—')[0] || 'Module'} Quiz (5 Qs)</span>
            </button>

            <button
              onClick={handleMarkComplete}
              className={`w-full sm:w-auto px-6 py-3 rounded-full text-xs font-black shadow-lg transition-all flex items-center justify-center gap-2 border-2 ${
                currentModule?.completed
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                  : 'bg-brand-600 hover:bg-brand-500 text-white border-brand-900'
              }`}
            >
              <CheckCircle className="w-4.5 h-4.5" />
              <span>{currentModule?.completed ? 'Completed ✓' : 'Mark Complete ✓'}</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentModuleIndex >= (course.modules?.length || 1) - 1}
              className="w-full sm:w-auto px-4 py-3 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 disabled:opacity-40 rounded-2xl flex items-center justify-center gap-1.5 transition-all border border-brand-900"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Module Quiz Modal */}
      {currentModule && (
        <ModuleQuizModal
          isOpen={quizModalOpen}
          onClose={() => setQuizModalOpen(false)}
          module={currentModule}
          courseId={course.id}
          hasNextModule={currentModuleIndex < (course.modules?.length || 1) - 1}
          nextModuleName={currentModuleIndex < (course.modules?.length || 1) - 1 ? course.modules[currentModuleIndex + 1]?.title : ''}
          onQuizPassed={(modId) => {
            onToggleModuleComplete(course.id, modId, true);
          }}
          onContinueNextModule={() => {
            setQuizModalOpen(false);
            if (currentModuleIndex < (course.modules?.length || 1) - 1) {
              const nextMod = course.modules[currentModuleIndex + 1];
              if (nextMod) {
                setCurrentModule(nextMod);
                setShowSolution(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            } else {
              setFinalTestModalOpen(true);
            }
          }}
        />
      )}

      {/* Final Assessment Modal */}
      <FinalTestModal
        isOpen={finalTestModalOpen}
        onClose={() => setFinalTestModalOpen(false)}
        course={course}
        onTestPassed={() => {
          confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.5 }
          });
        }}
        onViewCourseProgress={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Course Mini Projects Modal */}
      <CourseProjectsModal
        isOpen={projectsModalOpen}
        onClose={() => setProjectsModalOpen(false)}
        course={course}
      />

      {/* Certificate Requirements Modal */}
      <CertificateRequirementsModal
        isOpen={requirementsModalOpen}
        onClose={() => setRequirementsModalOpen(false)}
        course={course}
        eligibility={certEligibility}
        onOpenFinalTest={() => setFinalTestModalOpen(true)}
        onOpenProjects={() => setProjectsModalOpen(true)}
      />

    </div>
  );
}
