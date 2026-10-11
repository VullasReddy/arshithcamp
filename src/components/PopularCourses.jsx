import React from 'react';
import { Star, Clock, Users, ArrowRight, Code, Database, BarChart2, Terminal, PlayCircle, CheckCircle } from 'lucide-react';

export default function PopularCourses({ courses, onSelectCourse, onViewAllCourses, studentUser, onEnrollCourse }) {
  const popularCourses = courses.slice(0, 4);

  const renderCourseIcon = (type) => {
    switch (type) {
      case 'python':
        return (
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-blue-600 shadow-xs">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.912 2C6.736 2 7.054 2.22 7.054 4.398v1.89h4.945v.697H5.203C3.02 6.985 2 8.358 2 11.238c0 2.879 1.455 4.372 3.864 4.372h1.363v-1.922c0-2.18 1.838-4.013 4.02-4.013h4.913V7.776c0-2.179-1.848-3.776-4.248-3.776zM9.544 3.738a.952.952 0 1 1 0 1.905.952.952 0 0 1 0-1.905zm2.544 9.024v1.89H7.143v.697h6.796c2.183 0 3.203-1.373 3.203-4.253 0-2.879-1.455-4.372-3.864-4.372h-1.363v1.922c0 2.18-1.838 4.013-4.02 4.013H2.981v1.898c0 2.179 1.848 3.776 4.248 3.776h4.859c5.176 0 4.858-.22 4.858-2.398v-1.89h-4.945v-.697h6.796z" />
            </svg>
          </div>
        );
      case 'code':
        return (
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
            <Code className="w-6 h-6 stroke-[2.5]" />
          </div>
        );
      case 'database':
        return (
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border-2 border-sky-200 flex items-center justify-center text-sky-600 shadow-xs">
            <Database className="w-6 h-6 stroke-[2.2]" />
          </div>
        );
      case 'barchart':
        return (
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border-2 border-purple-200 flex items-center justify-center text-purple-600 shadow-xs">
            <BarChart2 className="w-6 h-6 stroke-[2.5]" />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-2xl bg-brand-50 border-2 border-brand-200 flex items-center justify-center text-brand-600">
            <Terminal className="w-6 h-6" />
          </div>
        );
    }
  };

  return (
    <section className="py-16 bg-white border-t-2 border-b-2 border-brand-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Explore Ignite Courses
              </h2>
              <span className="text-2xl">🌱</span>
            </div>
            <p className="text-sm sm:text-base text-slate-500 font-semibold mt-1">
              Start learning from our structured, hands-on Ignite curricula
            </p>
          </div>

          <button
            onClick={onViewAllCourses}
            className="inline-flex items-center gap-1.5 text-sm font-extrabold text-brand-700 hover:text-brand-900 hover:gap-2 transition-all group self-start sm:self-auto"
          >
            <span>View All Courses</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 4 Course Cards Grid with Dark Bezel Styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularCourses.map((course) => {
            const completedCount = course.modules?.filter(m => m.completed).length || 0;
            const totalModules = course.modules?.length || 1;
            const isEnrolled = studentUser?.enrolledCourseIds?.includes(course.id);

            return (
              <div
                key={course.id}
                className="bg-white rounded-3xl dark-bezel p-5 hover:shadow-2xl hover:scale-[1.02] transition-all flex flex-col justify-between relative group"
              >
                <div>
                  {/* Icon & Bestseller */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    {renderCourseIcon(course.iconType)}
                    {course.bestseller && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-brand-900 text-white tracking-wide uppercase border border-brand-800">
                        Bestseller
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => onSelectCourse(course.id)}
                    className="text-lg font-black text-slate-900 group-hover:text-brand-700 transition-colors cursor-pointer line-clamp-1 mb-2"
                  >
                    {course.title}
                  </h3>

                  {/* Level & Modules count */}
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-3">
                    <span>{course.level}</span>
                    <span className="text-slate-300">•</span>
                    <div className="flex items-center gap-1 text-brand-700">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{totalModules} Modules</span>
                    </div>
                  </div>

                  {/* Rating & Students */}
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-4">
                    <div className="flex items-center gap-1 text-amber-500 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                      <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
                      <span>{course.rating}</span>
                    </div>
                    <span className="text-slate-500">({course.studentsCount} students)</span>
                  </div>

                  {/* Price */}
                  <div className="mb-5">
                    {course.isFree ? (
                      <span className="text-xl font-black text-brand-600">Free</span>
                    ) : (
                      <span className="text-xl font-black text-slate-900">₹{course.price.toLocaleString()}</span>
                    )}
                  </div>
                </div>

                {/* Footer Action & Real Module Progress */}
                <div className="space-y-3 pt-3 border-t-2 border-slate-100">
                  {isEnrolled ? (
                    <button
                      onClick={() => onSelectCourse(course.id)}
                      className="w-full py-2.5 px-4 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-full border-2 border-emerald-900 shadow-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Enrolled</span>
                      <CheckCircle className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={(e) => onEnrollCourse ? onEnrollCourse(course.id, e) : onSelectCourse(course.id)}
                      className="w-full py-2.5 px-4 text-xs font-black text-white bg-brand-600 hover:bg-brand-700 active:scale-98 rounded-full border-2 border-brand-900 shadow-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Enroll</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-extrabold text-slate-600">
                      <span>{completedCount} / {totalModules} Modules</span>
                      <span className="text-brand-700">{course.progress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className="h-full bg-gradient-to-r from-brand-600 to-emerald-400 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
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
