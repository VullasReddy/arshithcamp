import React, { useState, useEffect } from 'react';
import { X, GraduationCap, Mail, Lock, User, ArrowRight, Hash } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, initialMode = 'login', onSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [regNo, setRegNo] = useState('');

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    let finalName = name.trim();
    if (!finalName && email) {
      const emailPrefix = email.split('@')[0];
      finalName = emailPrefix
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
    }
    if (!finalName) finalName = 'Student';

    const finalRegNo = regNo.trim().toUpperCase();

    if (onSuccess) {
      onSuccess({ name: finalName, regNo: finalRegNo, email: email.trim(), mode });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 mb-3">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            {mode === 'login' ? 'Welcome Back 👋' : 'Register for Arshith Boot Camp 🚀'}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {mode === 'login' ? 'Enter your details to access your courses' : 'Create your student account to get started'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name {mode === 'login' && <span className="text-slate-400 font-normal">(Optional)</span>}
            </label>
            <div className="relative">
              <input
                type="text"
                required={mode === 'signup'}
                placeholder="e.g. Arshith Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Registration Number Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Registration Number {mode === 'login' && <span className="text-slate-400 font-normal">(Optional)</span>}
            </label>
            <div className="relative">
              <input
                type="text"
                required={mode === 'signup'}
                placeholder="e.g. ABC2026-001 or 21A91A0501"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value.toUpperCase())}
                className="w-full pl-10 pr-4 py-2.5 text-sm font-mono uppercase bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
              />
              <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 active:scale-98 rounded-xl shadow-md shadow-brand-600/20 transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>{mode === 'login' ? 'Sign In' : 'Register Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer toggle */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="font-bold text-brand-600 hover:underline"
            >
              {mode === 'login' ? 'Sign Up free' : 'Log In'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
