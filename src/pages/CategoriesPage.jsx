import React from 'react';
import { Database, Terminal, ArrowRight, BookOpen, GitBranch, Clock, ShieldCheck, CheckCircle2, Sparkles, Code2, Brain } from 'lucide-react';

export default function CategoriesPage({ onCategorySelect }) {
  const tracks = [
    {
      categoryName: 'Programming',
      roleBadge: 'Software Engineering',
      title: 'Python Programming Track',
      level: 'Beginner to Intermediate',
      duration: '30 Hours',
      modulesCount: '15 Modules',
      projectsCount: '3 Projects',
      textbooksCount: '15 Textbooks',
      labsCount: '3 GitHub Labs',
      icon: Terminal,
      iconGradient: 'from-blue-600 to-indigo-600 text-white',
      badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
      description: 'Master core programming architecture, memory management, data structures, object-oriented design, and network programming from absolute scratch to production grade.',
      syllabusPoints: [
        'Python 3.12 syntax, PEMDAS, input pipelines, and control flow',
        'Data structures: Lists, Dictionaries, Tuples & Comprehensions',
        'OOP Architecture: Classes, Constructors, Inheritance & Scope',
        '3 GitHub Mini Projects: Log Analyzer, Grade Book & Invoice Engine'
      ]
    },
    {
      categoryName: 'Web Development',
      roleBadge: 'Full Stack Web Engineering',
      title: 'Web Development Track',
      level: 'Beginner to Advanced',
      duration: '60 Hours',
      modulesCount: '15 Modules',
      projectsCount: '4 Projects',
      textbooksCount: '15 Textbooks',
      labsCount: '3 Mini + 1 Capstone',
      icon: Code2,
      iconGradient: 'from-emerald-600 to-teal-600 text-white',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      description: 'Master modern full-stack web engineering from HTML5 semantic architecture, responsive CSS3/Flexbox/Grid, and modern JavaScript ES6+ to React, Node.js, Express REST APIs, and cloud deployments.',
      syllabusPoints: [
        'HTML5 Semantic Web Architecture & Responsive CSS3 Grid/Flexbox',
        'Modern JavaScript ES6+, Async/Await, DOM & Fetch API Architecture',
        'Full-Stack Node.js & Express REST APIs with Security Middleware',
        '3 Mini Projects + 1 Enterprise Capstone: DevLog, TaskTracker & Cloud API'
      ]
    },
    {
      categoryName: 'SQL',
      roleBadge: 'Database Engineering',
      title: 'SQL & Relational Databases Track',
      level: 'All Levels',
      duration: '30 Hours',
      modulesCount: '15 Modules',
      projectsCount: '3 Projects',
      textbooksCount: '15 Textbooks',
      labsCount: '3 GitHub Labs',
      icon: Database,
      iconGradient: 'from-cyan-600 to-teal-600 text-white',
      badgeBg: 'bg-cyan-50 text-cyan-800 border-cyan-200',
      description: 'Master relational schema modeling, foreign key integrity, multi-table JOINs, aggregations, Window Functions, and persistent ACID transaction engines with SQLite.',
      syllabusPoints: [
        'Relational schema architecture, PRIMARY/FOREIGN keys & Normalization',
        'Complex Multi-Table INNER/LEFT JOINs, Subqueries & CTEs',
        'Advanced Window Functions (RANK, DENSE_RANK, PARTITION BY)',
        '3 GitHub Mini Projects: Hospital Analytics, Salary Model & Library ACID Engine'
      ]
    },
    {
      categoryName: 'Artificial Intelligence & Data Science',
      roleBadge: 'AI & Machine Learning Engineering',
      title: 'AI & Data Science Track',
      level: 'Intermediate to Advanced',
      duration: '60 Hours',
      modulesCount: '15 Modules',
      projectsCount: '5 Capstones',
      textbooksCount: '15 Textbooks',
      labsCount: '5 Production Capstones',
      icon: Brain,
      iconGradient: 'from-purple-600 to-pink-600 text-white',
      badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
      description: 'Master Python for data science, NumPy numerical vectorization, Pandas, exploratory data analysis, Scikit-Learn ML pipelines, deep learning, Transformers, and GenAI RAG.',
      syllabusPoints: [
        'NumPy vectorization, Pandas manipulation & statistical EDA workflows',
        'Supervised & Unsupervised Machine Learning with Scikit-Learn Pipelines',
        'Deep Learning Foundations, Transformer Attention & Generative AI RAG',
        '5 End-to-End Capstones: Churn Model, Fraud Engine & Vector Search'
      ]
    }
  ];

  return (
    <div className="py-14 bg-[#FAFDFB] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-black rounded-full uppercase tracking-wider border border-emerald-200 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Specialized Technical Tracks</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Browse Core Engineering Domains
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
            Focused, zero-fluff curricula built to cultivate authentic engineering competence through comprehensive 15-module reading manuals, hands-on portfolio labs, and verified credentials.
          </p>
        </div>

        {/* 2-Column High-Impact Track Showcase Cards (4 Domains in 2x2 Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {tracks.map((track) => {
            const Icon = track.icon;
            return (
              <div
                key={track.categoryName}
                onClick={() => onCategorySelect(track.categoryName)}
                className="bg-white rounded-3xl border border-slate-200/90 hover:border-emerald-600/80 shadow-xs hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-8 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${track.iconGradient} flex items-center justify-center shadow-md shadow-slate-200 group-hover:scale-105 transition-transform`}>
                        <Icon className="w-7 h-7 stroke-[2.2]" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-emerald-700 uppercase tracking-wider block">
                          {track.roleBadge}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          {track.level} • {track.duration}
                        </span>
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${track.badgeBg}`}>
                      {track.modulesCount}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h2 className="text-2xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors mb-3 leading-snug">
                    {track.title}
                  </h2>
                  <p className="text-sm text-slate-600 font-normal leading-relaxed mb-6">
                    {track.description}
                  </p>

                  {/* Core Syllabus Points */}
                  <div className="space-y-2.5 mb-7 bg-[#F8FAF9] p-4.5 rounded-2xl border border-slate-100">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-700">
                      Curriculum Highlights:
                    </p>
                    {track.syllabusPoints.map((pt, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                    <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-emerald-700" /> {track.textbooksCount}</span>
                    <span className="flex items-center gap-1.5"><GitBranch className="w-4 h-4 text-blue-600" /> {track.labsCount}</span>
                  </div>

                  <button className="inline-flex items-center gap-2 text-sm font-extrabold text-emerald-700 group-hover:text-emerald-800 transition-all group-hover:translate-x-1">
                    <span>Explore Track</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Global Standard Features Strip */}
        <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center space-y-1.5 p-2">
            <BookOpen className="w-6 h-6 text-emerald-700" />
            <p className="text-sm font-black text-slate-900">15 Full Textbook Manuals</p>
            <p className="text-xs text-slate-500 font-medium">Exhaustive reading material & code snippets per module</p>
          </div>

          <div className="flex flex-col items-center space-y-1.5 p-2">
            <GitBranch className="w-6 h-6 text-blue-600" />
            <p className="text-sm font-black text-slate-900">Portfolio Capstone Projects</p>
            <p className="text-xs text-slate-500 font-medium">Runnable code with GitHub repository link submission</p>
          </div>

          <div className="flex flex-col items-center space-y-1.5 p-2">
            <Clock className="w-6 h-6 text-amber-600" />
            <p className="text-sm font-black text-slate-900">Timed 45-Min Examination</p>
            <p className="text-xs text-slate-500 font-medium">4 randomized paper sets (A–D) assigned transparently</p>
          </div>

          <div className="flex flex-col items-center space-y-1.5 p-2">
            <ShieldCheck className="w-6 h-6 text-purple-600" />
            <p className="text-sm font-black text-slate-900">Verifiable PDF Credentials</p>
            <p className="text-xs text-slate-500 font-medium">256-bit cryptographic validation & distinction awards</p>
          </div>
        </div>

      </div>
    </div>
  );
}
