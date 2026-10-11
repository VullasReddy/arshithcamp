import React from 'react';
import { ArrowRight, Award, PlayCircle, TrendingUp } from 'lucide-react';

export default function HeroSection({ onExploreClick }) {
  return (
    <section className="relative overflow-hidden pt-6 pb-16 md:pt-12 md:pb-24 hero-gradient border-b-2 border-brand-900/10">
      {/* Background Glow */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-peach-100/60 via-mint-100/50 to-transparent blur-3xl -z-10 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border-2 border-brand-800 text-brand-900 text-xs sm:text-sm font-extrabold tracking-wide uppercase shadow-xs">
              <span>LEARN</span>
              <span className="text-brand-500">•</span>
              <span>BUILD</span>
              <span className="text-brand-500">•</span>
              <span>GROW</span>
              <span className="text-base">🚀</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Learn Skills That{' '}
              <span className="relative inline-block text-brand-700 font-black">
                Move Your Career
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-peach-500/80" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.00024 7.00003C50.0002 2.50003 148 -1.99997 198 6.50003" stroke="#FF7D42" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </span>{' '}
              Forward
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed">
              Practical, project-based Ignite courses taught by industry lead engineers. Learn at your own pace and earn verified certificates.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="px-8 py-4 text-base font-extrabold text-white bg-brand-600 hover:bg-brand-700 active:scale-98 rounded-full border-2 border-brand-900 shadow-lg shadow-brand-600/25 transition-all flex items-center gap-3 group cursor-pointer"
              >
                <span>Explore Ignite Courses</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

          {/* Right Image Composition with Dark Green Border Bezel */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            
            <div className="relative w-full max-w-[500px]">
              {/* Soft Blobs */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] sm:w-[440px] sm:h-[440px] bg-gradient-to-tr from-peach-200/80 to-mint-200/80 rounded-full blur-2xl -z-10" />

              {/* Main Image with Dark Bezel */}
              <div className="relative rounded-3xl overflow-visible p-1.5 dark-bezel bg-white">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                  alt="Student at Arshith Ignite"
                  className="w-full h-[380px] sm:h-[460px] object-cover object-center rounded-2xl shadow-xl"
                />

                {/* Mug Overlay Accent */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border-2 border-brand-900 shadow-lg flex items-center gap-2">
                  <span className="text-xl">☕</span>
                  <div className="text-[10px] font-extrabold text-slate-900 leading-tight">
                    Better Skills<br /><span className="text-brand-600">Brighter Future 😊</span>
                  </div>
                </div>

                {/* Floating Card 1 */}
                <div className="absolute top-6 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border-2 border-brand-900 shadow-floating flex items-center gap-3 float-animation">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700">
                    <PlayCircle className="w-5 h-5 fill-brand-100 text-brand-700" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900">Learn</p>
                    <p className="text-[11px] font-bold text-slate-500">Anytime</p>
                  </div>
                </div>

                {/* Floating Card 2 */}
                <div className="absolute top-10 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border-2 border-brand-900 shadow-floating flex items-center gap-3 float-animation-delayed">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900">Get</p>
                    <p className="text-[11px] font-bold text-slate-500">Certified</p>
                  </div>
                </div>

                {/* Floating Card 3 */}
                <div className="absolute -bottom-4 left-6 sm:left-12 bg-white/95 backdrop-blur-md px-4.5 py-3 rounded-2xl border-2 border-brand-900 shadow-floating flex items-center gap-3 float-animation">
                  <div className="w-9.5 h-9.5 rounded-xl bg-peach-100 border border-peach-200 flex items-center justify-center text-peach-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900">Build</p>
                    <p className="text-[11px] font-black text-brand-600">Your Future</p>
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
