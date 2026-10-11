import React from 'react';
import { ArrowRight, GraduationCap, Sparkles, BookOpen } from 'lucide-react';

export default function CtaSection({ onExploreClick }) {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl sm:rounded-4xl cta-gradient p-8 sm:p-12 lg:p-14 overflow-hidden border-2 border-brand-900 shadow-2xl">
          
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-peach-300/20 blur-3xl pointer-events-none rounded-full" />

          <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-5 text-white">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-black uppercase tracking-wider border border-white/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Arshith Ignite Platform</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Learn. Complete. Earn.
              </h2>

              <p className="text-base sm:text-lg text-emerald-50/90 font-normal max-w-xl leading-relaxed">
                Join thousands of learners and take the next step in your software career with our hands-on Ignite courses.
              </p>

              <div className="pt-2">
                <button
                  onClick={onExploreClick}
                  className="px-8 py-3.5 text-sm sm:text-base font-black text-brand-900 bg-white hover:bg-emerald-50 active:scale-98 rounded-full border-2 border-white shadow-lg transition-all inline-flex items-center gap-2.5 group"
                >
                  <span>Explore Courses</span>
                  <ArrowRight className="w-5 h-5 text-brand-900 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Column Illustration */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[340px] sm:max-w-[400px]">
                
                <div className="relative bg-white/10 backdrop-blur-sm p-3 rounded-3xl border-2 border-white/30 shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80"
                    alt="Graduate student illustration"
                    className="w-full h-56 sm:h-64 object-cover object-center rounded-2xl"
                  />

                  {/* Floating Cap Badge */}
                  <div className="absolute -top-4 -left-4 bg-white text-slate-900 p-3 rounded-2xl shadow-xl flex items-center gap-2 border-2 border-brand-900">
                    <div className="w-8 h-8 rounded-xl bg-peach-100 text-peach-600 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Earn Verified</p>
                      <p className="text-xs font-black text-slate-900">Certificate</p>
                    </div>
                  </div>

                  {/* Floating Book Badge */}
                  <div className="absolute -bottom-3 -right-3 bg-white text-slate-900 p-2.5 rounded-2xl shadow-xl flex items-center gap-2 border-2 border-brand-900">
                    <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-800 flex items-center justify-center">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black text-slate-900 pr-1">Full Course PDF</span>
                  </div>

                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
