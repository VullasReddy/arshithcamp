import React, { useState } from 'react';
import { Search, Menu, X, GraduationCap, ChevronRight, LogIn, Sparkles, User, LogOut, LayoutDashboard } from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  onOpenAuth, 
  onSearchSubmit, 
  searchQuery, 
  setSearchQuery,
  studentUser,
  onLogoutStudent 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Courses', id: 'courses' },
    { name: 'Categories', id: 'categories' },
    { name: 'About', id: 'about' },
    { name: 'Contact', id: 'contact' },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (onSearchSubmit) onSearchSubmit(searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-brand-900 shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo - Arshith Ignite */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-brand-950 via-brand-900 to-emerald-950 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-brand-900/25 group-hover:scale-105 group-hover:border-emerald-400/60 transition-all duration-300">
              <GraduationCap className="w-6 h-6 stroke-[2.2] drop-shadow-sm text-emerald-400 group-hover:text-emerald-300 transition-colors" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-1.5 leading-none">
                <span className="text-brand-950">Arshith</span>
                <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent font-black tracking-tight">Ignite</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-black text-slate-500 tracking-wider uppercase mt-1 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-emerald-600 inline shrink-0" />
                LEARN TODAY, BUILD TOMORROW.
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative px-4 py-2 text-xs sm:text-sm font-bold rounded-full transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'text-white bg-brand-900 shadow-xs border border-brand-800' 
                      : 'text-slate-700 hover:text-brand-700 hover:bg-brand-50/70'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Search Input */}
            <div className="relative w-48 xl:w-56">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full pl-9 pr-4 py-2 text-xs font-semibold bg-slate-50 hover:bg-slate-100/80 focus:bg-white border-2 border-slate-200 focus:border-brand-900 rounded-full transition-all outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {studentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className={`px-4 py-2 text-xs font-black rounded-full flex items-center gap-2 border-2 transition-all cursor-pointer ${
                    activeTab === 'dashboard'
                      ? 'bg-brand-900 text-white border-brand-800'
                      : 'bg-emerald-50 text-brand-900 border-emerald-300 hover:bg-emerald-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                  <span className="max-w-[120px] truncate">{studentUser.name}</span>
                </button>

                <button
                  onClick={onLogoutStudent}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full border border-slate-200 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                {/* Login Button */}
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-2 text-xs font-bold text-brand-900 bg-white border-2 border-brand-900 hover:bg-brand-50 rounded-full transition-all shadow-xs cursor-pointer"
                >
                  Login
                </button>

                {/* Get Started Button */}
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-5 py-2 text-xs font-extrabold text-white bg-brand-600 hover:bg-brand-700 active:scale-[0.98] rounded-full border-2 border-brand-800 shadow-md shadow-brand-600/25 transition-all cursor-pointer"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2">
            {studentUser ? (
              <button
                onClick={() => handleNavClick('dashboard')}
                className="px-3 py-1.5 text-xs font-black text-brand-900 bg-emerald-100 rounded-full flex items-center gap-1 border border-emerald-300"
              >
                <User className="w-4 h-4" />
                <span className="max-w-[80px] truncate">{studentUser.name}</span>
              </button>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="p-2 text-brand-800 hover:bg-brand-50 rounded-full"
              >
                <LogIn className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b-2 border-brand-900 px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearchKeyDown(e);
                  setMobileMenuOpen(false);
                }
              }}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:border-brand-900"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="grid gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === link.id
                    ? 'bg-brand-900 text-white border border-brand-800'
                    : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 opacity-75" />
              </button>
            ))}

            {studentUser && (
              <button
                onClick={() => handleNavClick('dashboard')}
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-bold text-brand-900 bg-emerald-50 border border-emerald-200"
              >
                <span>Student Dashboard ({studentUser.name})</span>
                <ChevronRight className="w-4 h-4 text-emerald-600" />
              </button>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {studentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogoutStudent();
                }}
                className="w-full py-2.5 text-center text-sm font-bold text-rose-700 bg-rose-50 border-2 border-rose-200 rounded-xl"
              >
                Sign Out ({studentUser.name})
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="w-full py-2.5 text-center text-sm font-bold text-brand-900 border-2 border-brand-900 rounded-xl hover:bg-brand-50"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('signup');
                  }}
                  className="w-full py-2.5 text-center text-sm font-bold text-white bg-brand-600 rounded-xl border-2 border-brand-800 shadow-md"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
