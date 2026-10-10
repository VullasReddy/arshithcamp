import React from 'react';
import { Briefcase, BookOpen, Clock, Award, CheckCircle2, Sparkles, Code2, ShieldCheck } from 'lucide-react';

export default function WhyLearnWithUs() {
  const features = [
    {
      id: 1,
      badge: '3 Projects Included',
      title: 'Hands-On Mini Projects',
      subtitle: 'Real-world 1–2 page scripts with starter code & GitHub link submission',
      description: 'Master practical engineering tasks like log file analyzers, OOP grade trackers, SQLite contact book, and e-commerce analytics.',
      bgColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: Briefcase
    },
    {
      id: 2,
      badge: 'Full Textbook Manuals',
      title: '15 Module Curriculum',
      subtitle: 'In-depth theory, code snippets, edge cases & downloadable PDFs',
      description: 'Comprehensive reading material covering core concepts, best practices, practice challenges, and 5 MCQs per module.',
      bgColor: 'bg-blue-500/10 text-blue-600 border-blue-200',
      badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: BookOpen
    },
    {
      id: 3,
      badge: '4 Student Paper Sets',
      title: 'Timed Final Assessments',
      subtitle: '45-minute certification exams assigned by candidate name (Sets A–D)',
      description: 'Evaluate your knowledge with 25 comprehensive multiple-choice questions, real-time timer countdown, and detailed answer explanations.',
      bgColor: 'bg-amber-500/10 text-amber-600 border-amber-200',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: Clock
    },
    {
      id: 4,
      badge: 'Online Verification',
      title: 'Verified Distinction Certificates',
      subtitle: 'Downloadable PDF certificates with 256-bit verification IDs',
      description: 'Earn industry-recognized certificates featuring percentage scores, distinction badges, and public online verification links.',
      bgColor: 'bg-purple-500/10 text-purple-600 border-purple-200',
      badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
      icon: ShieldCheck
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#FAFDFB] via-white to-[#FAFDFB] relative overflow-hidden border-b border-slate-200/80">
      
      {/* Decorative ambient lighting */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-brand-100/50 rounded-full blur-3xl -z-10 -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-emerald-100/50 rounded-full blur-3xl -z-10 -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-900 text-xs font-black uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>The Boot Camp Advantage</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Why Engineers & Developers <br className="hidden sm:inline" />
            <span className="text-brand-700">Choose Arshith Boot Camp</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Industry-standard curriculum, real hands-on projects, automated assessments, and verified credentials designed for real career growth.
          </p>
        </div>

        {/* Feature Cards Grid (4 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border-2 border-slate-200/80 shadow-sm hover:shadow-xl hover:border-brand-500 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top Badge & Icon */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className={`w-12 h-12 rounded-2xl ${item.bgColor} border flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs`}>
                      <IconComponent className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${item.badgeBg}`}>
                      {item.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-brand-700 transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs font-extrabold text-brand-800 mt-1 line-clamp-2">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 font-medium leading-relaxed pt-1">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Footer Check */}
                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Included in every course</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Key Metrics Bar */}
        <div className="mt-14 bg-brand-900 rounded-3xl p-6 sm:p-8 text-white border-2 border-brand-800 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-emerald-400">100%</p>
            <p className="text-xs font-bold text-slate-300">Practical & Project-Based</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-amber-400">15 Modules</p>
            <p className="text-xs font-bold text-slate-300">Per Full Course Manual</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-cyan-400">4 Exam Sets</p>
            <p className="text-xs font-bold text-slate-300">Alphabetically Assigned</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-purple-300">Instant PDF</p>
            <p className="text-xs font-bold text-slate-300">Verified Certificates</p>
          </div>
        </div>

      </div>
    </section>
  );
}
