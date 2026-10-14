import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, ShieldCheck, GraduationCap, ArrowLeft, Award, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CertificatePage({ certificate, onBack, onVerifyClick, studentUser }) {
  const certificateRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  if (!certificate) return null;

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    setDownloading(true);

    try {
      // Reset scroll position to top
      window.scrollTo(0, 0);

      const canvas = await html2canvas(certificateRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FAF8EE',
        scrollX: 0,
        scrollY: 0,
        width: 896,
        height: 632,
        windowWidth: 896,
        windowHeight: 632,
        logging: false,
        onclone: (clonedDoc) => {
          const certNode = clonedDoc.querySelector('[data-cert-canvas]');
          if (certNode) {
            certNode.style.width = '896px';
            certNode.style.height = '632px';
            certNode.style.margin = '0';
            certNode.style.transform = 'none';
          }
        }
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Standard A4 Landscape PDF: 297mm x 210mm
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      pdf.addImage(imgData, 'PNG', 0, 0, 297, 210, undefined, 'FAST');
      pdf.save(`ArshithBootcamp_Certificate_${certificate.id}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setDownloading(false);
    }
  };

  const instructorDisplayName = certificate.instructorName || 'Farook Sir';

  return (
    <div className="py-8 bg-slate-950 min-h-screen text-slate-100 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-black text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2.5 rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onVerifyClick(certificate.id)}
              className="px-4 py-2.5 text-xs font-black text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 rounded-xl transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verify Online</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="px-6 py-2.5 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-98 rounded-xl shadow-lg transition-all flex items-center gap-2 border-2 border-amber-300 cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>{downloading ? 'Generating A4 PDF...' : 'Download A4 Certificate PDF'}</span>
            </button>
          </div>
        </div>

        {/* Outer Dark Bezel Canvas Wrap */}
        <div className="bg-slate-900/90 p-4 sm:p-6 rounded-3xl border border-slate-800 overflow-x-auto shadow-2xl flex justify-center">
          
          {/* Certificate Main Canvas - Single A4 Landscape Page (896px x 632px) */}
          <div
            ref={certificateRef}
            data-cert-canvas="true"
            className="bg-[#FAF8EE] text-slate-900 w-[896px] h-[632px] p-7 rounded-xl border-4 border-[#013323] relative overflow-hidden font-serif flex flex-col justify-between text-center shadow-2xl shrink-0"
            style={{ 
              boxSizing: 'border-box',
              backgroundImage: `
                radial-gradient(circle at center, rgba(212, 175, 55, 0.05) 0%, transparent 70%),
                radial-gradient(#013323 0.3px, transparent 0.3px)
              `, 
              backgroundSize: '100% 100%, 20px 20px' 
            }}
          >
            {/* Top-Left Corner Decorative Swoosh Curves */}
            <svg className="absolute top-0 left-0 w-44 h-44 pointer-events-none z-0" viewBox="0 0 160 160" fill="none">
              <path d="M0 0 L160 0 C100 35 35 100 0 160 Z" fill="#013323" />
              <path d="M0 0 L130 0 C80 28 28 80 0 130 Z" fill="#004D34" />
              <path d="M0 145 C40 90 90 40 145 0 L160 0 C100 40 40 100 0 160 Z" fill="#D4AF37" />
            </svg>

            {/* Bottom-Right Corner Decorative Swoosh Curves */}
            <svg className="absolute bottom-0 right-0 w-48 h-48 pointer-events-none z-0" viewBox="0 0 180 180" fill="none">
              <path d="M180 180 L20 180 C80 140 140 80 180 20 Z" fill="#013323" />
              <path d="M180 180 L45 180 C95 145 145 95 180 45 Z" fill="#004D34" />
              <path d="M180 0 C140 60 60 140 0 180 L20 180 C75 140 140 75 180 20 Z" fill="#D4AF37" />
            </svg>

            {/* Outer Double Gold Border */}
            <div className="absolute inset-3 border-2 border-[#D4AF37] pointer-events-none rounded-lg" />
            <div className="absolute inset-4 border border-[#D4AF37]/50 pointer-events-none rounded-md" />
            
            {/* Inner Gold Bracket Accents */}
            <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37] pointer-events-none" />
            <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37] pointer-events-none" />

            {/* Header: Logo, Branding & Credential ID (Single Row) */}
            <div className="flex items-center justify-between pb-2 relative z-10 pl-12 pr-4">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-[#013323] text-[#D4AF37] border border-[#D4AF37] flex items-center justify-center shadow-md shrink-0">
                  <GraduationCap className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h2 className="text-base font-black text-[#013323] tracking-wider uppercase font-sans leading-tight" style={{ color: '#013323', margin: 0, padding: 0 }}>
                    ARSHITH <span className="text-[#B8860B]" style={{ color: '#B8860B' }}>BOOTCAMP</span>
                  </h2>
                  <p className="text-[9px] font-extrabold uppercase tracking-widest font-sans" style={{ color: '#013323', margin: '2px 0 0 0' }}>
                    OFFICIAL ACADEMIC CERTIFICATION
                  </p>
                </div>
              </div>

              {/* Verified Credential ID Pill - Centered & Explicitly Styled */}
              <div className="flex flex-col items-center text-center font-sans">
                <p 
                  style={{ 
                    color: '#B8860B', 
                    fontSize: '9px', 
                    fontWeight: '800', 
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    lineHeight: '1.2', 
                    margin: '0 0 4px 0',
                    textAlign: 'center'
                  }}
                >
                  VERIFIED CREDENTIAL ID
                </p>
                <div 
                  style={{ 
                    backgroundColor: '#013323', 
                    color: '#FFFFFF', 
                    border: '1px solid #D4AF37', 
                    borderRadius: '9999px',
                    padding: '4px 14px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    lineHeight: '1.3',
                    display: 'inline-block',
                    textAlign: 'center'
                  }}
                >
                  ID: {certificate.id}
                </div>
              </div>
            </div>

            {/* Center Content Section */}
            <div className="relative z-10 my-auto py-1">
              
              {/* Arshith Brand Logo */}
              <img 
                src="/arshith-logo.png" 
                alt="Arshith Logo" 
                className="h-11 mx-auto object-contain drop-shadow-xs" 
                style={{ marginBottom: '8px' }}
              />

              {/* Main Certificate Title */}
              <div style={{ marginBottom: '8px' }}>
                <h1 className="text-3xl font-black uppercase font-serif drop-shadow-xs" style={{ color: '#013323', letterSpacing: '0.1em', margin: 0 }}>
                  Certificate of Completion
                </h1>

                {/* Golden Ornament Line Below Title */}
                <div className="flex items-center justify-center gap-2 text-[#D4AF37]" style={{ margin: '6px 0' }}>
                  <span className="w-16 h-px bg-[#D4AF37]"></span>
                  <span className="text-xs" style={{ color: '#D4AF37' }}>‹ ◈ ›</span>
                  <span className="w-16 h-px bg-[#D4AF37]"></span>
                </div>

                <p className="text-[10px] font-black uppercase tracking-widest font-sans" style={{ color: '#B8860B', marginTop: '4px' }}>
                  THIS IS TO CERTIFY THAT
                </p>
              </div>

              {/* Recipient Student Name with Golden Diamond Underline */}
              <div className="relative max-w-md mx-auto" style={{ margin: '8px auto' }}>
                <h3 className="text-4xl font-black italic font-serif leading-tight" style={{ color: '#013323', margin: 0, paddingBottom: '4px' }}>
                  {certificate.studentName || certificate.studentEmail || 'Student'}
                </h3>
                
                {(certificate.regNo || studentUser?.regNo) && (
                  <p className="text-[11px] font-bold uppercase tracking-wider font-sans" style={{ color: '#013323', margin: '2px 0 2px 0' }}>
                    Registration No: <span className="font-mono text-[#B8860B] font-black">{certificate.regNo || studentUser?.regNo}</span>
                  </p>
                )}

                <div className="flex items-center justify-center gap-2 text-[#D4AF37] max-w-xs mx-auto" style={{ marginTop: '4px' }}>
                  <span className="flex-1 h-px bg-[#D4AF37]"></span>
                  <span className="text-[10px]" style={{ color: '#D4AF37' }}>◈</span>
                  <span className="flex-1 h-px bg-[#D4AF37]"></span>
                </div>
              </div>

              <p className="text-xs max-w-md mx-auto font-medium leading-relaxed font-sans" style={{ color: '#334155', margin: '10px auto 14px auto' }}>
                has successfully completed all required module reading materials, practical hands-on projects, and official final assessments for:
              </p>

              {/* Course Title & Mint Grade Display Badge - Clean Separated Margins */}
              <div style={{ marginTop: '4px' }}>
                <h4 className="text-2xl font-black tracking-tight font-sans" style={{ color: '#013323', margin: '0 0 14px 0', lineHeight: '1.2' }}>
                  {certificate.courseTitle}
                </h4>
                
                <div 
                  style={{ 
                    backgroundColor: '#E8F5E9', 
                    border: '1px solid #A5D6A7', 
                    color: '#013323',
                    borderRadius: '9999px',
                    padding: '6px 20px',
                    fontSize: '12px',
                    fontWeight: '900',
                    fontFamily: 'sans-serif',
                    lineHeight: '1.4',
                    display: 'inline-block'
                  }}
                >
                  <span style={{ color: '#B8860B', marginRight: '6px', fontSize: '13px' }}>★</span>
                  <span style={{ color: '#013323', fontWeight: '900' }}>
                    Grade Achieved: {certificate.grade || '98% Distinction'}
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom Footer: Date (Left) & Signature with LEAD INSTRUCTOR & CEO (Right) */}
            <div className="pt-2 flex items-end justify-between text-left relative z-10 font-sans pl-4 pr-12">
              
              {/* Date of Issue - Left Aligned with Fixed Spacing */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
                <p style={{ color: '#B8860B', fontSize: '9px', fontWeight: '900', letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: '1.2', margin: '0 0 4px 0' }}>
                  DATE OF ISSUE
                </p>
                <p style={{ color: '#013323', fontSize: '14px', fontWeight: '900', fontFamily: 'serif', lineHeight: '1.3', margin: '0 0 6px 0' }}>
                  {certificate.issueDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#004D34] shrink-0" />
                  <span style={{ color: '#004D34', fontSize: '10px', fontWeight: '700' }}>Verified Authenticity</span>
                </div>
              </div>

              {/* Signature Block - Right Aligned with LEAD INSTRUCTOR & CEO Underneath */}
              <div className="flex flex-col items-center text-center min-w-[220px]">
                <div className="h-[72px] flex items-end justify-center w-full pb-1">
                  <img
                    src="/ceo-signature.png"
                    alt="CEO Signature"
                    className="h-full w-auto object-contain max-h-[72px]"
                  />
                </div>
                <div className="w-full border-b border-[#013323]" />
                <p className="text-[10px] font-black uppercase tracking-widest text-center" style={{ color: '#B8860B', marginTop: '4px' }}>
                  LEAD INSTRUCTOR & CEO
                </p>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
