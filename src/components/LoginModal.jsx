import React, { useState, useEffect } from 'react';
import { X, GraduationCap, Mail, Lock, User, ArrowRight, ArrowLeft, Hash, Phone, KeyRound, AlertCircle } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, initialMode = 'login', onSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setMode(initialMode);
    setError('');
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedRegNo = regNo.trim().toUpperCase();
    const trimmedPhone = phone.trim();
    const trimmedName = name.trim();

    if (mode === 'signup') {
      // 1. Mandatory validation for registration
      if (!trimmedName) {
        setError('Full Name is mandatory.');
        return;
      }
      if (!trimmedRegNo) {
        setError('Registration Number is mandatory.');
        return;
      }
      if (!trimmedPhone) {
        setError('Phone Number is mandatory.');
        return;
      }
      const digitsOnly = trimmedPhone.replace(/[^0-9]/g, '');
      if (digitsOnly.length < 10) {
        setError('Please enter a valid phone number with at least 10 digits.');
        return;
      }
      if (!trimmedEmail) {
        setError('Email Address is mandatory.');
        return;
      }
      if (!password) {
        setError('Password is mandatory.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (!confirmPassword) {
        setError('Confirm Password is mandatory.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please verify and re-enter.');
        return;
      }

      // Check if user already exists
      const existingUserRaw = localStorage.getItem(`studentUser_${trimmedEmail}`);
      if (existingUserRaw) {
        setError('An account with this email address already exists. Please log in.');
        return;
      }

      if (onSuccess) {
        onSuccess({
          name: trimmedName,
          regNo: trimmedRegNo,
          phone: trimmedPhone,
          email: trimmedEmail,
          password: password,
          mode: 'signup'
        });
      }
      onClose();
    } else {
      // LOGIN MODE - Everything is mandatory! Without Registration Number, do not log in!
      if (!trimmedRegNo) {
        setError('Registration Number is mandatory to log in.');
        return;
      }
      if (!trimmedEmail) {
        setError('Email Address is mandatory.');
        return;
      }
      if (!password) {
        setError('Password is mandatory.');
        return;
      }

      // Validate against registered user credentials in localStorage if available
      const userKey = `studentUser_${trimmedEmail}`;
      const savedUserRaw = localStorage.getItem(userKey);
      let resolvedName = '';
      let resolvedPhone = '';

      if (savedUserRaw) {
        try {
          const savedUser = JSON.parse(savedUserRaw);
          if (savedUser.regNo && savedUser.regNo.toUpperCase() !== trimmedRegNo) {
            setError(`Invalid Registration Number. It does not match our records for ${trimmedEmail}`);
            return;
          }
          if (savedUser.password && savedUser.password !== password) {
            setError('Incorrect password. Please try again.');
            return;
          }
          resolvedName = savedUser.name || '';
          resolvedPhone = savedUser.phone || '';
        } catch (err) {}
      }

      if (!resolvedName) {
        const emailPrefix = trimmedEmail.split('@')[0];
        resolvedName = emailPrefix.replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      }

      if (onSuccess) {
        onSuccess({
          name: resolvedName,
          regNo: trimmedRegNo,
          phone: resolvedPhone,
          email: trimmedEmail,
          password: password,
          mode: 'login'
        });
      }
      onClose();
    }
  };

  const handleSwitchMode = (newMode) => {
    setMode(newMode);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto flex flex-col items-center justify-start sm:justify-center p-4 sm:p-6 min-h-screen">
      
      {/* Top Navigation Bar */}
      <div className="w-full max-w-md flex items-center justify-between py-2 mb-2 shrink-0">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-brand-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-4 py-2 rounded-full transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-brand-700" />
          <span>Back to Home</span>
        </button>
        <button
          onClick={onClose}
          title="Close"
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full border border-slate-200 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-xl border border-slate-200 relative my-auto">

        {/* Modal Brand Header */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 mb-3">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            {mode === 'login' ? 'Welcome Back 👋' : 'Register for Arshith Ignite 🚀'}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {mode === 'login' ? 'Enter your credentials to access your courses' : 'All fields are mandatory to create your student account'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {/* Full Name - Only in signup mode */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Arshith Kumar"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(''); }}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          {/* Registration Number - Mandatory in both signup and login */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Registration Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. ABC2026-001 or 21A91A0501"
                value={regNo}
                onChange={(e) => { setRegNo(e.target.value.toUpperCase()); setError(''); }}
                className="w-full pl-10 pr-4 py-2.5 text-sm font-mono uppercase bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none font-semibold"
              />
              <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Phone Number - Only in signup mode */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 9876543210"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setError(''); }}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none font-medium"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          {/* Email Address - Mandatory in both */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Password - Mandatory in both */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Confirm Password - Only in signup mode */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 active:scale-98 rounded-xl shadow-md shadow-brand-600/20 transition-all flex items-center justify-center gap-2 mt-3 cursor-pointer"
          >
            <span>{mode === 'login' ? 'Sign In' : 'Create Account & Register'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer toggle */}
        <div className="mt-5 pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={() => handleSwitchMode(mode === 'login' ? 'signup' : 'login')}
              className="font-bold text-brand-600 hover:underline cursor-pointer"
            >
              {mode === 'login' ? 'Register Now' : 'Log In'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
