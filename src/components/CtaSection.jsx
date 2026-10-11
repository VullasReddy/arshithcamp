import React from 'react';
import { ArrowRight, GraduationCap, Sparkles, BookOpen, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function CtaSection({ onExploreClick }) {
  return (
    <section className="py-16 md:py-24 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl sm:rounded-4xl bg-gradient-to-br from-[#06241B] via-[#0B3A2C] to-[#0A4736] p-8 sm:p-14 lg:p-16 overflow-hidden border border-emerald-900/60 shadow-xl text-white">
          
          {/* Subtle Ambient Lighting */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-400/10 blur-3xl pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-400/10 blur-3xl pointer-events-none rounded-full" />

          <div className="grid lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/90 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-800/60 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Open Digital Learning Initiative</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Embark on Your Digital <br className="hidden sm:inline" />
                Competency Journey Today
              </h2>

              <p className="text-base sm:text-lg text-emerald-100/85 font-normal max-w-xl leading-relaxed">
                Gain immediate, unrestricted access to full 15-module reading manuals, runnable code examples, 3 portfolio capstone projects, and accredited distinction credentials.
              </p>

              {/* Guarantees Checklist */}
              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm font-bold text-slate-200 pt-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Free & Open Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>No Subscriptions or Paywalls</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Downloadable PDF Textbooks</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>256-Bit Verifiable Certificates</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-4">
                <button
                  onClick={onExploreClick}
                  className="px-8 py-4 text-sm sm:text-base font-extrabold text-slate-900 bg-white hover:bg-emerald-50 active:scale-98 rounded-full shadow-lg shadow-black/20 transition-all inline-flex items-center gap-2.5 group cursor-pointer"
                >
                  <span>Explore All Learning Pathways</span>
                  <ArrowRight className="w-4 h-4 text-slate-900 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>

            {/* Right Card: Springboard Credential & Accreditation Preview */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="w-full max-w-sm bg-white text-slate-900 rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-100">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">Arshith Ignite Credential</p>
                      <p className="text-[10px] text-emerald-700 font-mono font-bold">Industry Verified</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Distinction
                  </span>
                </div>

                {/* Pathway milestones */}
                <div className="space-y-2 text-xs text-slate-700 font-semibold">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>15 Modular Textbooks</span>
                    </div>
                    <span className="text-emerald-700 font-mono font-bold text-[11px]">100%</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>3 Capstone GitHub Labs</span>
                    </div>
                    <span className="text-emerald-700 font-mono font-bold text-[11px]">Verified</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>45-Min Final Examination</span>
                    </div>
                    <span className="text-emerald-700 font-mono font-bold text-[11px]">Passed</span>
                  </div>
                </div>

                {/* Footer validation */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>ID: ARB-2026-CREDENTIAL</span>
                  <span className="text-emerald-700 font-sans font-bold">Public Verification ✓</span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
