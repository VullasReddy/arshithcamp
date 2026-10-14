import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, GraduationCap, Award, Users, Heart } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="py-12 bg-[#FAFDFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3.5 py-1 bg-brand-50 text-brand-900 text-xs font-black rounded-full uppercase tracking-wider border border-brand-200">
            Our Mission
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            About Arshith <span className="text-brand-600">Bootcamp</span>
          </h1>
          <p className="text-base text-slate-600 font-semibold leading-relaxed">
            Learn Today, Build Tomorrow. We are dedicated to bridging the global tech skills gap by delivering practical, project-focused Bootcamp education to learners worldwide.
          </p>
        </div>

        {/* Mission Banner */}
        <div className="bg-white rounded-3xl dark-bezel p-8 sm:p-12 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Why We Founded Arshith Bootcamp
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Traditional computer science degrees often lack real-world engineering projects. At Arshith Bootcamp, we structure every course into complete module reading manuals, code examples, hands-on challenges, and downloadable course manuals.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                <CheckCircle className="w-4.5 h-4.5 text-emerald-600" />
                <span>Structured Multi-Module Curriculum Taught by Senior Engineers</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                <CheckCircle className="w-4.5 h-4.5 text-emerald-600" />
                <span>Full Complete Course PDF Manual Generation</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                <CheckCircle className="w-4.5 h-4.5 text-emerald-600" />
                <span>Verified Online Course Completion Certificates</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
              alt="Team collaboration at Arshith Bootcamp"
              className="rounded-3xl dark-bezel shadow-xl"
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="py-12 bg-[#FAFDFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="px-3.5 py-1 bg-brand-50 text-brand-900 text-xs font-black rounded-full uppercase tracking-wider border border-brand-200">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Contact Arshith Bootcamp Support
          </h1>
          <p className="text-sm text-slate-500 font-semibold">
            Have questions about a Bootcamp course or certificate verification? We are here to help!
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Info cards */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-6 dark-bezel flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Email Us</p>
                <p className="text-sm font-black text-slate-900">careers@arshithgroup.com</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 dark-bezel flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Call Support</p>
                <p className="text-sm font-black text-slate-900">+91 86184 71444</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 dark-bezel flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Headquarters</p>
                <p className="text-sm font-black text-slate-900">Bengaluru, Karnataka, India</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 dark-bezel">
            {submitted ? (
              <div className="p-8 text-center space-y-3 bg-brand-50 rounded-2xl border border-brand-200">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-black text-slate-900">Message Sent Successfully!</h3>
                <p className="text-xs text-slate-600 font-semibold">Thank you for reaching out to Arshith Bootcamp. Our support team will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Arshith Student"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs font-semibold bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:border-brand-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="arshith@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs font-semibold bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:border-brand-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Course query / Bootcamp guidance"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs font-semibold bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:border-brand-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we assist your learning journey?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs font-semibold bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:border-brand-900"
                  />
                </div>

                <button
                  type="submit"
                  className="px-8 py-3 text-xs font-black text-white bg-brand-600 hover:bg-brand-700 rounded-full border-2 border-brand-900 shadow-md transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
