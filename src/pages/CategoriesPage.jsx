import React from 'react';
import { Database, BarChart2, Terminal, ArrowRight, ShieldCheck, Cloud } from 'lucide-react';

export default function CategoriesPage({ onCategorySelect }) {
  const categoryCards = [
    {
      name: 'Programming',
      icon: Terminal,
      bg: 'bg-blue-50 text-blue-600 border-2 border-blue-200',
      description: 'Master core programming languages like Python from absolute scratch to advanced object-oriented programming.',
      courseCount: '15 Modules'
    },
    {
      name: 'SQL',
      icon: Database,
      bg: 'bg-cyan-50 text-cyan-600 border-2 border-cyan-200',
      description: 'Learn relational database queries, JOINs, aggregate metrics, CTEs, Window Functions, and business intelligence.',
      courseCount: '15 Modules'
    },
    {
      name: 'Data Science',
      icon: BarChart2,
      bg: 'bg-emerald-50 text-emerald-600 border-2 border-emerald-200',
      description: 'Explore data analysis, NumPy arrays, Pandas DataFrames, statistical modeling, and data visualization.',
      courseCount: '15 Modules'
    },
    {
      name: 'Cloud & DevOps',
      icon: Cloud,
      bg: 'bg-amber-50 text-amber-600 border-2 border-amber-200',
      description: 'Master cloud infrastructure, containerization, CI/CD deployment pipelines, and microservices architecture.',
      courseCount: '12 Modules'
    }
  ];

  return (
    <div className="py-12 bg-[#FAFDFB] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="px-3.5 py-1 bg-brand-50 text-brand-900 text-xs font-black rounded-full uppercase tracking-wider border border-brand-200">
            Domain Expertise
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Browse Ignite Categories
          </h1>
          <p className="text-sm text-slate-500 font-semibold">
            Explore industry-tailored learning paths designed for modern software engineering careers.
          </p>
        </div>

        {/* Category Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryCards.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                onClick={() => onCategorySelect(cat.name)}
                className="bg-white rounded-3xl dark-bezel p-6 hover:shadow-2xl hover:scale-[1.02] transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl ${cat.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-xs`}>
                    <Icon className="w-7 h-7 stroke-[2.2]" />
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-brand-700 transition-colors">
                      {cat.name}
                    </h3>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                      {cat.courseCount}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed mb-6">
                    {cat.description}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs font-black text-brand-700 group-hover:gap-2 transition-all pt-2 border-t border-slate-100">
                  <span>Explore Courses</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
