import React, { useState } from 'react';
import { 
  ArrowLeft, Star, Clock, Users, Award, PlayCircle, CheckCircle, 
  ChevronDown, ChevronUp, BookOpen, ShieldCheck, Sparkles, FileText 
} from 'lucide-react';

export default function CourseDetailsPage({ course, onBack, onStartLearning }) {
  const [openModules, setOpenModules] = useState({ 'py-mod-1': true, 'sql-mod-1': true, 'web-mod-1': true, 'ds-mod-1': true });

  if (!course) return null;

  const toggleModule = (id) => {
    setOpenModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedModulesCount = course.modules?.filter(m => m.completed).length || 0;
  const totalModulesCount = course.modules?.length || 0;

  return (
    <div className="py-8 bg-[#FAFDFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-brand-900 bg-white border-2 border-brand-900 px-4 py-2 rounded-full shadow-xs mb-6 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Courses</span>
        </button>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Course Info (Left 8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Single Course Overview Hero Cover Image Banner */}
            <div className="bg-white rounded-3xl dark-bezel p-6 sm:p-8 space-y-6">
              
              <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden bg-slate-950 border-2 border-brand-900 shadow-xl group">
                <img
                  src={
                    course.id?.includes('python')
                      ? 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80'
                      : course.id?.includes('sql')
                      ? 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80'
                      : course.id?.includes('data')
                      ? 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'
                      : course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt={course.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-3">
                  <div className="space-y-1 text-white">
                    <span className="px-3.5 py-1 bg-brand-600 text-white text-xs font-black rounded-full uppercase tracking-wider border border-brand-400">
                      {course.category}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black drop-shadow-md text-white">
                      {course.title}
                    </h2>
                  </div>
                  <div className="px-3.5 py-1.5 bg-white/95 backdrop-blur-md rounded-xl border border-white text-slate-900 text-xs font-black shadow-lg">
                    15 Total Modules • Certified Course
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3.5 py-1 bg-brand-900 text-white text-xs font-black rounded-full uppercase tracking-wider border border-brand-800">
                    {course.category}
                  </span>
                  <span className="px-3 py-1 bg-brand-50 text-brand-900 border border-brand-200 text-xs font-bold rounded-full">
                    {course.level}
                  </span>
                  {course.bestseller && (
                    <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-extrabold rounded-full uppercase tracking-wider">
                      Bestseller
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  {course.title}
                </h1>

                <p className="text-base text-slate-600 leading-relaxed font-medium">
                  {course.description}
                </p>

                {/* Stats Meta */}
                <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm font-bold text-slate-600 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Clock className="w-4 h-4 text-brand-700" />
                    <span>{course.duration}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-brand-700 font-extrabold">
                    <BookOpen className="w-4 h-4" />
                    <span>{totalModulesCount} Total Modules</span>
                  </div>
                </div>
              </div>

            </div>

            {/* What You Will Learn */}
            {course.whatYouWillLearn && (
              <div className="bg-white rounded-3xl dark-bezel p-6 sm:p-8 space-y-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-600" />
                  <span>What You Will Learn</span>
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {course.whatYouWillLearn.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-slate-800">
                      <CheckCircle className="w-4.5 h-4.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Complete Module Curriculum Breakdown */}
            <div className="bg-white rounded-3xl dark-bezel p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Course Curriculum</h3>
                  <p className="text-xs text-slate-500 font-bold mt-0.5">
                    {completedModulesCount} of {totalModulesCount} Modules Completed ({course.progress}%)
                  </p>
                </div>
              </div>

              {/* Modules List Accordion */}
              <div className="space-y-3">
                {course.modules?.map((mod, idx) => {
                  const isOpen = openModules[mod.id];
                  return (
                    <div key={mod.id} className="border-2 border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
                      <button
                        onClick={() => toggleModule(mod.id)}
                        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-100/80 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                            mod.completed ? 'bg-emerald-600 text-white' : 'bg-brand-900 text-white'
                          }`}>
                            {mod.completed ? '✓' : idx + 1}
                          </div>
                          <span className="text-sm sm:text-base font-bold text-slate-900">
                            {mod.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          {mod.completed ? (
                            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full uppercase">
                              Completed ✓
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-bold rounded-full">
                              Reading Material
                            </span>
                          )}
                          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-4 space-y-3 bg-white pt-3 border-t-2 border-slate-200">
                          <p className="text-xs text-slate-600 font-medium">{mod.description}</p>
                          
                          <div
                            onClick={() => onStartLearning(course.id, mod.id)}
                            className="flex items-center justify-between p-3 rounded-xl bg-brand-50 hover:bg-brand-100/70 border border-brand-200 transition-all cursor-pointer group"
                          >
                            <div className="flex items-center gap-2.5">
                              <FileText className="w-4 h-4 text-brand-700 group-hover:scale-110 transition-transform" />
                              <span className="text-xs font-bold text-brand-900">
                                Open Complete Reading Material & Code Examples
                              </span>
                            </div>
                            <span className="text-xs font-extrabold text-brand-700 group-hover:translate-x-1 transition-transform">
                              Study Module →
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Highlighted Final Assessment Card Down of 15 Modules */}
              <div className="mt-6 bg-slate-900 border-2 border-amber-400 rounded-3xl p-6 shadow-2xl space-y-4 text-white">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-amber-400 text-slate-950 text-[10px] font-black uppercase rounded-full tracking-wider shadow-sm">
                    ★ Course Final Evaluation
                  </span>
                  <span className="text-xs font-bold text-amber-300 font-mono">25 Qs • 45 Minutes</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-400" />
                    <span>SQL Final Assessment</span>
                  </h3>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    Test your comprehensive SQL skills across all 15 modules to earn your official verified completion certificate.
                  </p>
                </div>

                {/* Highlighting Yellow Pill Button requested by User */}
                <button
                  onClick={() => onStartLearning(course.id, course.modules?.[0]?.id)}
                  className="w-full py-3.5 px-6 rounded-full text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 shadow-xl transition-all flex items-center justify-center gap-2 border-2 border-amber-300 cursor-pointer"
                >
                  <Clock className="w-4.5 h-4.5 text-slate-950 shrink-0" />
                  <span>Final Assessment (45m)</span>
                </button>
              </div>

            </div>

          </div>

          {/* Right Column Sticky Card (Right 4 Cols) */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <div className="bg-white rounded-3xl dark-bezel-lg p-6 shadow-xl space-y-6">
              
              {/* Tuition & Progress */}
              <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-extrabold text-slate-400 uppercase">Tuition Fee</span>
                  {course.isFree ? (
                    <span className="text-3xl font-black text-brand-600">Free</span>
                  ) : (
                    <span className="text-3xl font-black text-slate-900">₹{course.price.toLocaleString()}</span>
                  )}
                </div>

                <button
                  onClick={() => onStartLearning(course.id, course.modules?.[0]?.id)}
                  className="w-full py-4 text-sm font-black text-white bg-brand-600 hover:bg-brand-700 active:scale-98 rounded-full border-2 border-brand-900 shadow-lg transition-all text-center flex items-center justify-center gap-2"
                >
                  <span>{course.progress > 0 ? 'Continue Boot Camp' : 'Start Boot Camp Now'}</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>

              {/* Progress Summary */}
              {course.progress > 0 && (
                <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 space-y-2">
                  <div className="flex justify-between items-center text-xs font-extrabold text-slate-800">
                    <span>Course Completion</span>
                    <span className="text-brand-700 font-black">{course.progress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-600 to-emerald-400 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Features List */}
              <div className="pt-4 border-t border-slate-100 space-y-3 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-brand-700" />
                  <span>Official Arshith Boot Camp Certificate</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-brand-700" />
                  <span>Full Course PDF Download Access</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-brand-700" />
                  <span>100% Self-Paced Flexible Modules</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
