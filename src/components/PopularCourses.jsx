import React from 'react';
import { Star, Clock, ArrowRight, Code, Database, BarChart2, Terminal, CheckCircle2, Sparkles, BookOpen, ShieldCheck, GitBranch, Award, Layers } from 'lucide-react';

export default function PopularCourses({ courses, onSelectCourse, onViewAllCourses, studentUser, onEnrollCourse }) {
  const popularCourses = courses.slice(0, 4);

  const renderTrackIcon = (type) => {
    switch (type) {
      case 'python':
        return (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200/80 flex items-center justify-center text-blue-600 shadow-2xs">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.912 2C6.736 2 7.054 2.22 7.054 4.398v1.89h4.945v.697H5.203C3.02 6.985 2 8.358 2 11.238c0 2.879 1.455 4.372 3.864 4.372h1.363v-1.922c0-2.18 1.838-4.013 4.02-4.013h4.913V7.776c0-2.179-1.848-3.776-4.248-3.776zM9.544 3.738a.952.952 0 1 1 0 1.905.952.952 0 0 1 0-1.905zm2.544 9.024v1.89H7.143v.697h6.796c2.183 0 3.203-1.373 3.203-4.253 0-2.879-1.455-4.372-3.864-4.372h-1.363v1.922c0 2.18-1.838 4.013-4.02 4.013H2.981v1.898c0 2.179 1.848 3.776 4.248 3.776h4.859c5.176 0 4.858-.22 4.858-2.398v-1.89h-4.945v-.697h6.796z" />
            </svg>
          </div>
        );
      case 'database':
        return (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-50 to-sky-100 border border-cyan-200/80 flex items-center justify-center text-cyan-700 shadow-2xs">
            <Database className="w-6 h-6 stroke-[2.2]" />
          </div>
        );
      case 'code':
        return (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shadow-2xs">
            <Code className="w-6 h-6 stroke-[2.2]" />
          </div>
        );
      case 'brain':
        return (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-100 border border-purple-200/80 flex items-center justify-center text-purple-700 shadow-2xs">
            <svg className="w-6 h-6 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs">
            <Terminal className="w-6 h-6" />
          </div>
        );
    }
  };

  return (
    <section className="py-20 bg-white border-b border-slate-200/80 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Infosys Springboard Style) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-5 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-black uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              <span>Curated Learning Pathways</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Featured Competency Programs
            </h2>
            <p className="text-sm sm:text-base text-slate-500 font-medium max-w-xl">
              Industry-standard technical curriculums designed to cultivate production-ready developers and database architects.
            </p>
          </div>

          <button
            onClick={onViewAllCourses}
            className="inline-flex items-center gap-2 text-sm font-extrabold text-emerald-700 hover:text-emerald-800 transition-all group self-start sm:self-auto cursor-pointer"
          >
            <span>Explore All Curriculums</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {popularCourses.map((course) => {
            const completedCount = course.modules?.filter(m => m.completed).length || 0;
            const totalModules = course.modules?.length || 1;
            const progressPercent = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;
            const isEnrolled = studentUser?.enrolledCourseIds?.includes(course.id);

            return (
              <div
                key={course.id}
                className="bg-white rounded-3xl border border-slate-200/90 hover:border-emerald-600/70 shadow-xs hover:shadow-xl transition-all duration-300 p-7 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header: Icon, Tags & Bestseller */}
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3.5">
                      {renderTrackIcon(course.iconType)}
                      <div>
                        <span className="text-[11px] font-black text-emerald-800 uppercase tracking-wider block">
                          {course.category} Track
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          {course.level} • {course.duration || '30 Hours'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                        100% Free
                      </span>
                      {course.bestseller && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-900 text-white uppercase tracking-wider">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Course Title */}
                  <h3
                    onClick={() => onSelectCourse(course.id)}
                    className="text-2xl font-black text-slate-900 group-hover:text-emerald-800 transition-colors cursor-pointer mb-2.5 leading-snug"
                  >
                    {course.title}
                  </h3>

                  {/* Course Description */}
                  <p className="text-sm text-slate-600 font-normal leading-relaxed mb-6 line-clamp-2">
                    {course.shortDescription || course.description}
                  </p>

                  {/* Springboard 4-Pill Highlights */}
                  <div className="grid grid-cols-2 gap-2.5 mb-6 text-xs text-slate-700 font-bold bg-[#F8FAF9] p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{totalModules} Modular Textbooks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>3 Capstone GitHub Projects</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>45-Min Timed Exam (Sets A–D)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                      <span>Verifiable Distinction Certificate</span>
                    </div>
                  </div>

                  {/* Rating & Students enrolled */}
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 mb-6">
                    <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
                      <span>{course.rating}</span>
                    </div>
                    <span className="text-slate-500 font-medium">({course.studentsCount} active candidates enrolled)</span>
                  </div>
                </div>

                {/* Footer Action & Real Progress Bar */}
                <div className="space-y-4 pt-5 border-t border-slate-100">
                  {isEnrolled ? (
                    <button
                      onClick={() => onSelectCourse(course.id)}
                      className="w-full py-3.5 px-5 text-sm font-black text-white bg-emerald-700 hover:bg-emerald-800 active:scale-98 rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Continue Learning Pathway</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={(e) => onEnrollCourse ? onEnrollCourse(course.id, e) : onSelectCourse(course.id)}
                      className="w-full py-3.5 px-5 text-sm font-black text-white bg-emerald-700 hover:bg-emerald-800 active:scale-98 rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group"
                    >
                      <span>Start Learning Pathway</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}

                  {/* Progress Indicator */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between items-center text-xs font-extrabold text-slate-600">
                      <span>{completedCount} / {totalModules} Modules Completed</span>
                      <span className="text-emerald-800 font-black">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
