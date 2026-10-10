import React, { useState, useEffect } from 'react';
import { 
  X, Briefcase, Code, CheckCircle, ExternalLink, Copy, Check, 
  Terminal, Sparkles, AlertCircle, Clock, FileText, ChevronRight 
} from 'lucide-react';

export default function CourseProjectsModal({ isOpen, onClose, course }) {
  const projects = course?.projects || [];
  const [activeProjectId, setActiveProjectId] = useState(projects[0]?.id || '');
  const [copiedCode, setCopiedCode] = useState(false);
  const [submissions, setSubmissions] = useState({});
  const [githubUrlInput, setGithubUrlInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (projects.length > 0 && !activeProjectId) {
      setActiveProjectId(projects[0].id);
    }
  }, [projects]);

  useEffect(() => {
    if (isOpen) {
      // Load saved project submissions from localStorage
      const loaded = {};
      projects.forEach(p => {
        const saved = localStorage.getItem(`arb_proj_sub_${course?.id}_${p.id}`);
        if (saved) {
          try { loaded[p.id] = JSON.parse(saved); } catch (e) {}
        }
      });
      setSubmissions(loaded);
      setSaveSuccess(false);
    }
  }, [isOpen, course]);

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

  useEffect(() => {
    if (activeProject) {
      setGithubUrlInput(submissions[activeProject.id]?.githubUrl || '');
      setSaveSuccess(false);
    }
  }, [activeProject, submissions]);

  if (!isOpen || !course) return null;

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSaveSubmission = (e) => {
    e.preventDefault();
    if (!githubUrlInput.trim() || !activeProject) return;

    const record = {
      githubUrl: githubUrlInput.trim(),
      submittedAt: new Date().toISOString(),
      status: 'Submitted'
    };

    const savedUser = (() => {
      try {
        const raw = localStorage.getItem('studentUser') || localStorage.getItem('student_user');
        return raw && raw !== 'undefined' && raw !== 'null' ? JSON.parse(raw) : {};
      } catch (e) { return {}; }
    })();
    const userId = savedUser?.id || savedUser?.email || 'student-001';

    localStorage.setItem(`arb_proj_sub_${course.id}_${activeProject.id}`, JSON.stringify(record));
    localStorage.setItem(`arb_proj_submitted_${course.id}_${userId}`, 'true');
    localStorage.setItem(`project_submitted_${course.id}`, 'true');
    setSubmissions(prev => ({ ...prev, [activeProject.id]: record }));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const completedCount = Object.keys(submissions).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border-2 border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                  Course Hands-on Projects
                </span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                  {completedCount} / {projects.length} Completed
                </span>
              </div>
              <h3 className="text-base font-black text-white truncate max-w-md">
                {course.title} — 3 Practical Mini-Projects (1–2 Pages Each)
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 grid md:grid-cols-12 overflow-hidden">
          
          {/* Projects Left Sidebar (4 Cols) */}
          <div className="md:col-span-4 bg-slate-950/60 p-4 border-r border-slate-800 overflow-y-auto space-y-2.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 pb-1">
              Select Project (3 Available)
            </div>

            {projects.map((proj, idx) => {
              const isSelected = activeProject?.id === proj.id;
              const isSubmitted = !!submissions[proj.id];

              return (
                <button
                  key={proj.id}
                  onClick={() => setActiveProjectId(proj.id)}
                  className={`w-full text-left p-3.5 rounded-2xl transition-all border ${
                    isSelected
                      ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-lg'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono uppercase font-black text-emerald-400">
                      Project #{idx + 1}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {proj.difficulty}
                      </span>
                      {isSubmitted && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          ✓ Done
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="text-xs font-bold line-clamp-2 leading-snug">
                    {proj.title}
                  </h4>

                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                    {proj.subtitle}
                  </p>
                </button>
              );
            })}

            <div className="p-3 bg-slate-900/40 rounded-2xl border border-slate-800/60 text-[11px] text-slate-400 space-y-1 mt-4">
              <span className="font-bold text-slate-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Lightweight Design</span>
              </span>
              <p>Each project is sized to 1–2 pages of code (50–90 lines) and directly applies modules you studied.</p>
            </div>
          </div>

          {/* Project Details Right Area (8 Cols) */}
          <div className="md:col-span-8 p-6 overflow-y-auto space-y-6 text-slate-200">
            {activeProject ? (
              <>
                {/* Project Header Banner */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-3 py-1 bg-emerald-950 text-emerald-300 text-[10px] font-black uppercase rounded-full border border-emerald-800">
                      {activeProject.subtitle}
                    </span>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{activeProject.estimatedTime}</span>
                      <span>•</span>
                      <span>{activeProject.pageLength}</span>
                    </div>
                  </div>

                  <h2 className="text-xl font-black text-white">
                    {activeProject.title}
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {activeProject.description}
                  </p>
                </div>

                {/* Core Learning Objectives */}
                {activeProject.objectives && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" />
                      <span>What You Will Practice</span>
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-2 text-xs">
                      {activeProject.objectives.map((obj, i) => (
                        <div key={i} className="flex items-start gap-2 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span className="text-slate-300">{obj}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Requirements Checklist */}
                {activeProject.requirements && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <FileText className="w-4 h-4" />
                      <span>Project Requirements & Deliverables</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-300 pl-2">
                      {activeProject.requirements.map((req, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] font-bold text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                            {rIdx + 1}
                          </span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Complete Starter Code / Template */}
                {activeProject.starterCode && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <Code className="w-4 h-4" />
                        <span>Starter Code & Reference Implementation</span>
                      </h4>
                      <button
                        onClick={() => handleCopyCode(activeProject.starterCode)}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-lg flex items-center gap-1 transition-all"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                      </button>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto max-h-72">
                      <pre>{activeProject.starterCode}</pre>
                    </div>
                  </div>
                )}

                {/* Expected Terminal Output */}
                {activeProject.expectedOutput && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      <span>Expected Terminal Output</span>
                    </h4>
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
                      <pre>{activeProject.expectedOutput}</pre>
                    </div>
                  </div>
                )}

                {/* GitHub Submission Card */}
                <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-5 rounded-2xl border-2 border-emerald-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span>Submit Project GitHub Link</span>
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Upload your script to GitHub and record your repository link below.
                      </p>
                    </div>
                    {submissions[activeProject.id] && (
                      <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase rounded-full">
                        Saved ✓
                      </span>
                    )}
                  </div>

                  <form onSubmit={handleSaveSubmission} className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="url"
                      placeholder={`https://github.com/username/${course?.id || 'course'}-mini-project`}
                      value={githubUrlInput}
                      onChange={(e) => setGithubUrlInput(e.target.value)}
                      required
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs rounded-xl transition-all shrink-0 shadow-lg cursor-pointer"
                    >
                      Save Submission
                    </button>
                  </form>

                  {saveSuccess && (
                    <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      ✓ Project link saved successfully!
                    </p>
                  )}
                </div>
              </>
            ) : null}
          </div>

        </div>

      </div>
    </div>
  );
}
