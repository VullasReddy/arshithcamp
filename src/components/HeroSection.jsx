import React from 'react';
import { ArrowRight, BookOpen, Award, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function HeroSection({ onExploreClick }) {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 bg-gradient-to-b from-[#F2F8F5] via-[#F8FCFA] to-white border-b border-slate-200/80 font-sans">
      
      {/* Subtle corporate ambient grid & light washes */}
      <div className="absolute inset-0 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.035] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-gradient-to-tr from-emerald-100/50 via-teal-50/40 to-transparent blur-3xl -z-10 rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-emerald-100/30 blur-3xl rounded-full -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Corporate Institutional Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-slate-200/60 text-xs font-bold text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="font-extrabold uppercase tracking-wider text-slate-700">Digital Competency & Learning Ecosystem</span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-700 font-semibold hidden sm:inline">Industry-Aligned Pathways & Verified Credentials</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500 font-semibold">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 100% Free Access</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verifiable Certificates</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Springboard Institutional Headline & Search */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            
            {/* Pathway Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-emerald-300/80 text-emerald-900 text-xs font-extrabold tracking-wide shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>FUTURE-READY DIGITAL ACADEMY</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-black text-slate-900 tracking-tight leading-[1.14]">
              Accelerate Your Career with{' '}
              <span className="text-emerald-700 underline decoration-emerald-300 decoration-4 underline-offset-4">
                Industry-Aligned Learning Pathways
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl">
              Springboard your technical journey with structured enterprise curricula. Master software engineering and relational databases through comprehensive 15–module textbooks, 3 production-grade portfolio projects, timed evaluations, and accredited distinction credentials.
            </p>

            {/* Enterprise Tracks Row */}
            <div className="w-full pt-1">
              <p className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2.5">
                POPULAR COMPETENCY PATHWAYS:
              </p>
              <div className="flex flex-wrap gap-2">
                {['Python Professional', 'SQL & Database Engineering', 'Full-Stack Architecture', 'Data & Analytics'].map((track) => (
                  <button
                    key={track}
                    onClick={onExploreClick}
                    className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 bg-white hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200/90 shadow-2xs transition-all cursor-pointer"
                  >
                    {track}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button
                onClick={onExploreClick}
                className="px-8 py-4 text-sm sm:text-base font-extrabold text-white bg-emerald-700 hover:bg-emerald-800 active:scale-98 rounded-full shadow-lg shadow-emerald-900/15 transition-all flex items-center gap-2.5 group cursor-pointer"
              >
                <span>Explore Learning Pathways</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreClick}
                className="px-6 py-4 text-sm sm:text-base font-bold text-slate-700 hover:text-emerald-800 bg-white hover:bg-slate-50 border border-slate-300/80 rounded-full shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span>View Full Curriculum Manuals</span>
              </button>
            </div>

          </div>

          {/* Right Column: Springboard Competency Roadmap Dashboard Preview */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Dashboard Card */}
            <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-7 relative overflow-hidden">
              
              {/* Institutional Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider block">
                    CURRICULUM ARCHITECTURE
                  </span>
                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    Engineering Competency Model
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Accredited
                </span>
              </div>

              {/* 4 Structured Milestones Pathway */}
              <div className="space-y-3.5 relative">
                
                {/* Connecting Line */}
                <div className="absolute left-[17px] top-3 bottom-3 w-0.5 bg-slate-100 -z-0" />

                {/* Milestone 1 */}
                <div className="flex items-start gap-3.5 relative z-10">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    01
                  </div>
                  <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 flex-1">
                    <p className="text-xs font-black text-slate-900 leading-snug">Foundational Theory Manuals</p>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">Modules 01–05: Core architecture & syntax foundations</p>
                  </div>
                </div>

                {/* Milestone 2 */}
                <div className="flex items-start gap-3.5 relative z-10">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    02
                  </div>
                  <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 flex-1">
                    <p className="text-xs font-black text-slate-900 leading-snug">Advanced System Engineering</p>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">Modules 06–15: Data structures, databases & APIs</p>
                  </div>
                </div>

                {/* Milestone 3 */}
                <div className="flex items-start gap-3.5 relative z-10">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    03
                  </div>
                  <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 flex-1">
                    <p className="text-xs font-black text-slate-900 leading-snug">3 Capstone Project Deliverables</p>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">Hands-on GitHub repository submissions</p>
                  </div>
                </div>

                {/* Milestone 4 */}
                <div className="flex items-start gap-3.5 relative z-10">
                  <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    04
                  </div>
                  <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200/80 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-emerald-950 leading-snug">Timed Final Examination</p>
                      <span className="text-[10px] font-black text-emerald-700">Sets A–D</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 font-medium mt-0.5">45–min timed test & distinction certificate</p>
                  </div>
                </div>

              </div>

              {/* Verified Credential Banner */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-800">256–Bit Public Verification</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700">Instant PDF ✓</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
