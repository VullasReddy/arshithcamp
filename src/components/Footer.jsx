import React, { useState } from 'react';
import { GraduationCap, ArrowRight, Instagram, Linkedin, Heart, Sparkles, ExternalLink } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const handleNavClick = (id) => {
    if (setActiveTab) setActiveTab(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-brand-900 text-slate-300 pt-16 pb-12 border-t-4 border-brand-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-brand-800/80">
          
          {/* Brand Info & Social Redirection */}
          <div className="lg:col-span-4 space-y-4">
            <div 
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 cursor-pointer group inline-flex"
            >
              <div className="w-11 h-11 rounded-2xl bg-brand-800 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-md">
                <GraduationCap className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white tracking-tight">
                  Arshith <span className="text-emerald-400">Boot Camp</span>
                </span>
                <span className="text-[10px] font-extrabold text-emerald-300/80 tracking-wider uppercase -mt-1 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-emerald-400 inline" />
                  Learn Today, Build Tomorrow
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 font-normal leading-relaxed max-w-sm">
              Empowering learners worldwide with structured, project-based boot camp courses, complete module reading manuals, and verified credentials.
            </p>

            {/* Direct Social Redirection Handles */}
            <div className="space-y-2 pt-2">
              <p className="text-[11px] font-black uppercase text-emerald-400 tracking-wider">
                Official Social Profiles
              </p>
              
              <div className="flex flex-col gap-2">
                {/* 1. Instagram: PALLAVI NELLI (@arshithgroup) */}
                <a 
                  href="https://www.instagram.com/arshithgroup/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-brand-800/80 hover:bg-gradient-to-r hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 text-slate-200 hover:text-white transition-all border border-brand-700/80 group shadow-xs cursor-pointer w-fit"
                  title="Follow PALLAVI NELLI (@arshithgroup) on Instagram"
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shrink-0">
                    <Instagram className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold block leading-tight">Instagram</span>
                    <span className="text-[10px] text-slate-400 group-hover:text-white/90 font-medium block">PALLAVI NELLI (@arshithgroup)</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white ml-2 shrink-0" />
                </a>

                {/* 2. LinkedIn: Company Account (Arshith Group) */}
                <a 
                  href="https://www.linkedin.com/company/arshith-group/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-brand-800/80 hover:bg-[#0A66C2] text-slate-200 hover:text-white transition-all border border-brand-700/80 group shadow-xs cursor-pointer w-fit"
                  title="Follow Arshith Group on LinkedIn"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#0A66C2] text-white flex items-center justify-center shrink-0">
                    <Linkedin className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold block leading-tight">LinkedIn Company</span>
                    <span className="text-[10px] text-slate-400 group-hover:text-white/90 font-medium block">Arshith Group</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white ml-2 shrink-0" />
                </a>

                {/* 3. LinkedIn: Personal Profile (Farook N) */}
                <a 
                  href="https://www.linkedin.com/in/farook-n-2bb2b5344/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-brand-800/80 hover:bg-[#0077B5] text-slate-200 hover:text-white transition-all border border-brand-700/80 group shadow-xs cursor-pointer w-fit"
                  title="Connect with Farook N on LinkedIn"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#0077B5] text-white flex items-center justify-center shrink-0">
                    <Linkedin className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold block leading-tight">LinkedIn Profile</span>
                    <span className="text-[10px] text-slate-400 group-hover:text-white/90 font-medium block">Farook N</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white ml-2 shrink-0" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-black text-white uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5 text-sm font-semibold">
              <li>
                <button onClick={() => handleNavClick('home')} className="hover:text-emerald-400 transition-colors cursor-pointer">Home</button>
              </li>
              <li>
                <button onClick={() => handleNavClick('courses')} className="hover:text-emerald-400 transition-colors cursor-pointer">Courses</button>
              </li>
              <li>
                <button onClick={() => handleNavClick('categories')} className="hover:text-emerald-400 transition-colors cursor-pointer">Categories</button>
              </li>
              <li>
                <button onClick={() => handleNavClick('about')} className="hover:text-emerald-400 transition-colors cursor-pointer">About Us</button>
              </li>
              <li>
                <button onClick={() => handleNavClick('contact')} className="hover:text-emerald-400 transition-colors cursor-pointer">Contact</button>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-black text-white uppercase tracking-wider">Support</h3>
            <ul className="space-y-2.5 text-sm font-semibold">
              <li>
                <button onClick={() => handleNavClick('contact')} className="hover:text-emerald-400 transition-colors cursor-pointer">Help Center</button>
              </li>
              <li>
                <a href="#terms" className="hover:text-emerald-400 transition-colors">Terms & Conditions</a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-black text-white uppercase tracking-wider">Newsletter</h3>
            <p className="text-xs text-slate-400 font-medium">
              Get updates on new boot camp courses, tutorials, and certification offers directly in your inbox.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-2xl bg-brand-800 text-emerald-300 text-xs font-bold border border-brand-700">
                ✓ Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative mt-2">
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 text-xs font-semibold text-white bg-brand-800/80 border border-brand-700 rounded-full focus:outline-none focus:border-emerald-400 transition-colors placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-emerald-500 hover:bg-emerald-400 text-brand-950 flex items-center justify-center transition-all font-bold cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar with Direct Social Text Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© 2026 Arshith Boot Camp. All rights reserved.</p>
          
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            <a 
              href="https://www.instagram.com/arshithgroup/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <Instagram className="w-3.5 h-3.5 text-rose-400" />
              <span>Instagram (@arshithgroup)</span>
            </a>
            
            <a 
              href="https://www.linkedin.com/company/arshith-group/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <Linkedin className="w-3.5 h-3.5 text-blue-400" />
              <span>LinkedIn (Arshith Group)</span>
            </a>

            <a 
              href="https://www.linkedin.com/in/farook-n-2bb2b5344/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <Linkedin className="w-3.5 h-3.5 text-cyan-400" />
              <span>LinkedIn (Farook N)</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
