import React from 'react';
import { X, Lock, CheckCircle, Clock, Briefcase, Award, ArrowRight } from 'lucide-react';

export default function CertificateRequirementsModal({
  isOpen,
  onClose,
  course,
  eligibility,
  onOpenFinalTest,
  onOpenProjects
}) {
  if (!isOpen || !course) return null;

  const { modulesDone, testPassed, projectSubmitted } = eligibility || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                Certificate Generation Locked
              </span>
              <h3 className="text-base font-black text-white">
                {course.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          To generate and claim your official verified certificate for <strong className="text-white">{course.title}</strong>, you must complete all 3 core academic requirements below:
        </p>

        {/* 3 Requirements Checklist */}
        <div className="space-y-3">
          
          {/* Requirement 1: Course Modules */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            modulesDone ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${
                modulesDone ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {modulesDone ? '✓' : '1'}
              </div>
              <div>
                <p className="text-xs font-bold text-white">Course Reading Modules</p>
                <p className="text-[10px] text-slate-400">Complete 100% of module reading & quizzes</p>
              </div>
            </div>
            <span className={`text-xs font-black ${modulesDone ? 'text-emerald-400' : 'text-slate-500'}`}>
              {modulesDone ? 'Completed ✓' : 'Incomplete'}
            </span>
          </div>

          {/* Requirement 2: Final Assessment */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            testPassed ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300' : 'bg-amber-950/40 border-amber-500/60 text-amber-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${
                testPassed ? 'bg-emerald-500 text-slate-950' : 'bg-amber-400 text-slate-950'
              }`}>
                {testPassed ? '✓' : '2'}
              </div>
              <div>
                <p className="text-xs font-bold text-white">45-Minute Final Assessment</p>
                <p className="text-[10px] text-slate-400">Score at least 70% on final exam</p>
              </div>
            </div>
            {testPassed ? (
              <span className="text-xs font-black text-emerald-400">Passed ✓</span>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onOpenFinalTest();
                }}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow flex items-center gap-1 cursor-pointer"
              >
                <span>Take Test</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Requirement 3: Project Git Repo Submission */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            projectSubmitted ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300' : 'bg-cyan-950/40 border-cyan-500/60 text-cyan-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${
                projectSubmitted ? 'bg-emerald-500 text-slate-950' : 'bg-cyan-400 text-slate-950'
              }`}>
                {projectSubmitted ? '✓' : '3'}
              </div>
              <div>
                <p className="text-xs font-bold text-white">Course Project Submission</p>
                <p className="text-[10px] text-slate-400">Submit your project GitHub repository URL</p>
              </div>
            </div>
            {projectSubmitted ? (
              <span className="text-xs font-black text-emerald-400">Submitted ✓</span>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onOpenProjects();
                }}
                className="px-3 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs rounded-xl shadow flex items-center gap-1 cursor-pointer"
              >
                <span>Submit Git Link</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
