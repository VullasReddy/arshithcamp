import React, { useState } from 'react';
import { GraduationCap, ArrowRight, Instagram, Linkedin, Heart, Sparkles } from 'lucide-react';

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
          
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div 
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3.5 cursor-pointer group inline-flex select-none"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-950 to-brand-800 border-2 border-emerald-400/50 flex items-center justify-center text-emerald-400 shadow-lg shadow-black/30 group-hover:scale-105 transition-all">
                <GraduationCap className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white tracking-tight flex items-center gap-1.5 leading-none">
                  Arshith <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Bootcamp</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-black text-emerald-300/80 tracking-wider uppercase mt-1 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-emerald-400 inline shrink-0" />
                  LEARN TODAY, BUILD TOMORROW.
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 font-normal leading-relaxed max-w-sm">
              Empowering learners worldwide with structured, project-based Bootcamp courses, complete module reading manuals, and verified credentials.
            </p>

            {/* Social Icons (Only Instagram and LinkedIn) */}
            <div className="flex items-center gap-3 pt-2">
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/arshithgroup/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-brand-800/90 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 text-slate-300 hover:text-white flex items-center justify-center transition-all border border-brand-700 shadow-sm cursor-pointer"
                title="PALLAVI NELLI (@arshithgroup) on Instagram"
                aria-label="Instagram - PALLAVI NELLI (@arshithgroup)"
              >
                <Instagram className="w-4 h-4" />
              </a>

              {/* LinkedIn: Company Profile */}
              <a 
                href="https://www.linkedin.com/company/arshith-group/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-brand-800/90 hover:bg-[#0A66C2] text-slate-300 hover:text-white flex items-center justify-center transition-all border border-brand-700 shadow-sm cursor-pointer"
                title="Arshith Group on LinkedIn"
                aria-label="LinkedIn - Arshith Group Company"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              {/* LinkedIn: Personal Profile (Farook N) */}
              <a 
                href="https://www.linkedin.com/in/farook-n-2bb2b5344/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-brand-800/90 hover:bg-[#0077B5] text-slate-300 hover:text-white flex items-center justify-center transition-all border border-brand-700 shadow-sm cursor-pointer"
                title="Farook N on LinkedIn"
                aria-label="LinkedIn - Farook N Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
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
              Get updates on new Bootcamp courses, tutorials, and certification offers directly in your inbox.
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

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© 2026 Arshith Bootcamp. All rights reserved.</p>
          <div className="flex items-center gap-1.5 font-bold text-slate-300">
            <span>Learn Today</span>
            <span className="text-emerald-400">•</span>
            <span>Build Tomorrow</span>
            <Heart className="w-3.5 h-3.5 fill-peach-500 text-peach-500 ml-0.5 inline" />
          </div>
        </div>

      </div>
    </footer>
  );
}
