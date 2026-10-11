import React from 'react';
import { BookOpen, Clock, ShieldCheck, GitBranch, CheckCircle2, Sparkles, Award, Cpu, GraduationCap, FileCheck } from 'lucide-react';

export default function WhyLearnWithUs() {
  const pillars = [
    {
      id: 1,
      badge: 'Academic Standard',
      title: '15-Module Full Textbook Curricula',
      subtitle: 'Complete manual reading, theory, and challenge problems in every course',
      description: 'Zero shallow video playlists. Each course delivers 15 comprehensive textbook modules with architectural diagrams, production code snippets, and 5 knowledge-check MCQs per module.',
      icon: BookOpen,
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    },
    {
      id: 2,
      badge: 'Hands-On Labs',
      title: '3 Real-World GitHub Capstone Projects',
      subtitle: 'Production engineering deliverables with starter code and repo submissions',
      description: 'Build real portfolio assets — from log file analyzers and OOP grade trackers to persistent SQLite inventory engines. Submit your live GitHub repository links for project verification.',
      icon: GitBranch,
      iconBg: 'bg-blue-50 text-blue-700 border-blue-200/80',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200'
    },
    {
      id: 3,
      badge: 'Rigorous Testing',
      title: 'Timed 45-Min Automated Assessments',
      subtitle: '4 randomized paper sets (A–D) assigned transparently by candidate name',
      description: 'Evaluate your true mastery with 25 comprehensive examination questions. Real-time countdown timer, zero retake manipulation, and instant post-exam question reviews.',
      icon: Clock,
      iconBg: 'bg-amber-50 text-amber-700 border-amber-200/80',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    {
      id: 4,
      badge: 'Accredited',
      title: 'Cryptographically Verified Certificates',
      subtitle: '256-bit unique validation hash with instant online verification portal',
      description: 'Earn distinguished credentials recognized by hiring teams. Every certificate includes an authentic verification ID, distinction grade banner, and printable PDF signed by leadership.',
      icon: ShieldCheck,
      iconBg: 'bg-purple-50 text-purple-700 border-purple-200/80',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200'
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-[#F8FAF9] relative overflow-hidden border-b border-slate-200/80 font-sans">
      
      {/* Ambient background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-black uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Springboard Learning Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            A 360° Holistic Digital Competency Framework
          </h2>

          <p className="text-sm sm:text-base text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
            Engineered to empower developers with deep academic comprehension, practical software execution, and verifiable distinction credentials.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-emerald-600/70 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Top Icon & Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className={`w-12 h-12 rounded-2xl ${item.iconBg} border flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs`}>
                      <IconComponent className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs font-extrabold text-emerald-800 mt-1 line-clamp-2">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 font-normal leading-relaxed pt-1">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Footer Note */}
                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Integrated in every pathway</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Institutional Metrics Bar */}
        <div className="mt-14 bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-slate-900">15</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Modular Textbooks</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-emerald-700">3</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">GitHub Mini Projects</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-slate-900">4</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Timed Exam Paper Sets</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-emerald-700">100%</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Free Digital Credentials</p>
          </div>
        </div>

      </div>
    </section>
  );
}
