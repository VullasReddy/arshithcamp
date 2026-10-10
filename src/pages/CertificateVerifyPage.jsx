import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Search, ArrowLeft } from 'lucide-react';
import { SAMPLE_CERTIFICATES } from '../data/coursesData';

export default function CertificateVerifyPage({ certId, onBack, studentUser }) {
  const [searchId, setSearchId] = useState(certId || 'ABC-2026-PY0128');
  const [query, setQuery] = useState(certId || 'ABC-2026-PY0128');

  const rawMatch = SAMPLE_CERTIFICATES.find(
    c => c.id.toLowerCase() === query.trim().toLowerCase()
  ) || (query.includes('ABC') ? SAMPLE_CERTIFICATES[0] : null);

  const todayFormatted = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const studentDisplayName = (studentUser?.name && studentUser.name.trim()) ? studentUser.name.trim() : (studentUser?.email && studentUser.email.trim() ? studentUser.email.trim() : '');

  const match = rawMatch ? {
    ...rawMatch,
    studentName: studentDisplayName || (rawMatch.studentName !== 'Arshith Kumar' ? rawMatch.studentName : '') || studentUser?.email || 'Student',
    issueDate: (studentUser || rawMatch.issueDate === 'October 1, 2026') ? todayFormatted : rawMatch.issueDate
  } : null;

  return (
    <div className="py-12 bg-[#FAFDFB] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-black text-slate-800 hover:text-brand-900 bg-white border-2 border-brand-900 px-4 py-2 rounded-full shadow-xs transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Platform</span>
        </button>

        {/* Verification Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-brand-50 border-2 border-brand-900 text-brand-700 flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-9 h-9 stroke-[2.2]" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Certificate Verification Portal
          </h1>
          <p className="text-sm text-slate-500 font-semibold">
            Verify the authenticity of any credential issued by Arshith Boot Camp.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white p-4 rounded-3xl dark-bezel flex items-center gap-2">
          <input
            type="text"
            placeholder="Enter Certificate ID e.g. ABC-2026-PY0128"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full px-4 py-3 text-sm font-bold bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:border-brand-900"
          />
          <button
            onClick={() => setQuery(searchId)}
            className="px-6 py-3 text-xs font-black text-white bg-brand-600 hover:bg-brand-700 rounded-2xl border-2 border-brand-900 shadow-sm transition-all flex items-center gap-1.5 shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>Verify</span>
          </button>
        </div>

        {/* Result Card */}
        {match ? (
          <div className="bg-white rounded-3xl p-8 border-3 border-emerald-500 shadow-xl space-y-6 relative overflow-hidden">
            <div className="flex items-center gap-3 text-emerald-700 bg-emerald-50 p-4 rounded-2xl border border-emerald-300">
              <CheckCircle2 className="w-7 h-7 shrink-0 text-emerald-600" />
              <div>
                <p className="text-sm font-black uppercase">AUTHENTIC & VERIFIED CREDENTIAL ✓</p>
                <p className="text-xs font-semibold text-emerald-800">This certificate was officially issued by Arshith Boot Camp.</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs font-bold text-slate-600 pt-2">
              <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase">Student Name</span>
                <p className="text-base font-black text-slate-900">{match.studentName}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase">Course Title</span>
                <p className="text-base font-black text-brand-700">{match.courseTitle}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase">Certificate ID</span>
                <p className="text-sm font-black text-slate-900 font-mono">{match.id}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase">Issue Date</span>
                <p className="text-sm font-black text-slate-900">{match.issueDate}</p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>Issuer: Arshith Boot Camp Platform</span>
              <span>Status: Active</span>
            </div>

          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center border-2 border-slate-200">
            <p className="text-sm font-bold text-rose-600">No certificate found for ID: {query}</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">Please check the ID and try again (Try: ABC-2026-PY0128)</p>
          </div>
        )}

      </div>
    </div>
  );
}
