import React, { useState } from 'react';
import { 
  Plus, Trash2, Edit3, BookOpen, Users, Award, 
  TrendingUp, Video, Save, X, CheckCircle 
} from 'lucide-react';

export default function AdminPanel({ courses, onAddCourse, onDeleteCourse }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Programming');
  const [level, setLevel] = useState('Beginner to Intermediate');
  const [duration, setDuration] = useState('30 hours');
  const [price, setPrice] = useState(999);
  const [description, setDescription] = useState('');
  const [instructorName, setInstructorName] = useState('Arshith Ignite Team');

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newCourse = {
      id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title,
      category,
      level,
      duration,
      rating: 5.0,
      studentsCount: '1.0k',
      studentsNumeric: 1000,
      price: Number(price),
      isFree: Number(price) === 0,
      bestseller: true,
      progress: 0,
      iconBg: 'bg-emerald-50 border-2 border-emerald-200 text-emerald-600',
      iconType: 'code',
      introVideoUrl: 'https://www.youtube.com/embed/kqtD5dpn9C8',
      description,
      instructor: {
        name: instructorName,
        role: 'Lead Ignite Engineer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      },
      modules: [
        {
          id: `mod-${Date.now()}-1`,
          title: 'Module 01 — Ignite Overview',
          description: 'Introduction to course concepts, learning objectives, and environment setup.',
          completed: false,
          readingMaterial: {
            introduction: 'Welcome to this module in Arshith Ignite!',
            objectives: ['Set up development workspace', 'Understand foundational syntax'],
            keyTakeaways: ['Practice daily to master concepts!']
          }
        }
      ]
    };

    onAddCourse(newCourse);
    setIsAddModalOpen(false);

    // Reset
    setTitle('');
    setDescription('');
    setPrice(999);
  };

  return (
    <div className="py-10 bg-[#FAFDFB] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl dark-bezel">
          <div>
            <span className="px-3 py-1 bg-rose-50 text-rose-700 text-xs font-extrabold rounded-full uppercase border border-rose-200">
              Admin Control Console
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Arshith Ignite Management Portal
            </h1>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 text-xs font-black text-white bg-brand-600 hover:bg-brand-700 rounded-full border-2 border-brand-900 shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Course</span>
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-3xl dark-bezel flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 border-2 border-brand-200 text-brand-700 flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">Total Courses</p>
              <p className="text-2xl font-black text-slate-900">{courses.length}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl dark-bezel flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border-2 border-blue-200 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">Enrolled Students</p>
              <p className="text-2xl font-black text-slate-900">55,600+</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl dark-bezel flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-600 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">Certificates Issued</p>
              <p className="text-2xl font-black text-slate-900">14,200</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl dark-bezel flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">Monthly Revenue</p>
              <p className="text-2xl font-black text-slate-900">₹6.2L</p>
            </div>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded-3xl dark-bezel p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-lg font-black text-slate-900">Published Ignite Courses</h2>
            <span className="text-xs font-bold text-slate-500">{courses.length} Active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Course Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Modules Count</th>
                  <th className="py-3 px-4">Students</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-bold">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-black text-slate-900">
                      {course.title}
                    </td>
                    <td className="py-4 px-4 text-brand-700">
                      {course.category}
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      {course.modules?.length || 0} Modules
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      {course.studentsCount}
                    </td>
                    <td className="py-4 px-4 font-black text-slate-900">
                      {course.isFree ? 'Free' : `₹${course.price}`}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => onDeleteCourse(course.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Creating Course */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 dark-bezel relative max-h-[90vh] overflow-y-auto">
              
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-black text-slate-900 mb-4">Publish New Ignite Course</h2>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Course Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full-Stack React & Node Masterclass"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:border-brand-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs font-bold bg-slate-50 border-2 border-slate-200 rounded-xl outline-none"
                    >
                      <option value="Programming">Programming</option>
                      <option value="SQL">SQL</option>
                      <option value="Web Development">Web Development</option>
                      <option value="AI">AI</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Level</label>
                    <input
                      type="text"
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs font-bold bg-slate-50 border-2 border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs font-bold bg-slate-50 border-2 border-slate-200 rounded-xl outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs font-bold bg-slate-50 border-2 border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Course Description</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide a comprehensive summary of course content..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs font-semibold bg-slate-50 border-2 border-slate-200 rounded-xl outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 text-xs font-black text-white bg-brand-600 hover:bg-brand-700 rounded-xl border-2 border-brand-900 shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save & Publish Course</span>
                </button>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
