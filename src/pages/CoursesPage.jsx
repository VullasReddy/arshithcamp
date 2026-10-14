import React, { useState, useMemo } from 'react';
import { Search, Filter, Star, Clock, Users, ArrowRight, Code, Database, BarChart2, Terminal, CheckCircle } from 'lucide-react';
import { CATEGORIES } from '../data/coursesData';

export default function CoursesPage({ courses, onSelectCourse, studentUser, onEnrollCourse, initialSearch = '', initialCategory = 'All Categories' }) {
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'All Categories' || c.category === selectedCategory;
      const matchesLevel = selectedLevel === 'All' || c.level === selectedLevel;
      const matchesPrice = selectedPrice === 'All' || (selectedPrice === 'Free' ? c.isFree : !c.isFree);
      return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.studentsNumeric - a.studentsNumeric;
    });
  }, [courses, search, selectedCategory, selectedLevel, selectedPrice, sortBy]);

  const renderIcon = (type) => {
    switch (type) {
      case 'python':
        return (
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.912 2C6.736 2 7.054 2.22 7.054 4.398v1.89h4.945v.697H5.203C3.02 6.985 2 8.358 2 11.238c0 2.879 1.455 4.372 3.864 4.372h1.363v-1.922c0-2.18 1.838-4.013 4.02-4.013h4.913V7.776c0-2.179-1.848-3.776-4.248-3.776zM9.544 3.738a.952.952 0 1 1 0 1.905.952.952 0 0 1 0-1.905zm2.544 9.024v1.89H7.143v.697h6.796c2.183 0 3.203-1.373 3.203-4.253 0-2.879-1.455-4.372-3.864-4.372h-1.363v1.922c0 2.18-1.838 4.013-4.02 4.013H2.981v1.898c0 2.179 1.848 3.776 4.248 3.776h4.859c5.176 0 4.858-.22 4.858-2.398v-1.89h-4.945v-.697h6.796z" />
            </svg>
          </div>
        );
      case 'code':
        return (
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs">
            <Code className="w-6 h-6 stroke-[2.5]" />
          </div>
        );
      case 'database':
        return (
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shadow-xs">
            <Database className="w-6 h-6 stroke-[2.2]" />
          </div>
        );
      case 'brain':
        return (
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-xs">
            <svg className="w-6 h-6 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
            <Terminal className="w-6 h-6" />
          </div>
        );
    }
  };

  return (
    <div className="py-10 bg-[#FAFDFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-brand-50 text-brand-700 uppercase tracking-wider">
            Catalog & Training
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Explore All Online Courses
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium mt-2">
            Build in-demand tech skills with hands-on projects, expert instruction, and verified certificates.
          </p>
        </div>

        {/* Filter & Search Bar Controls */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search courses or skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Select Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
                <Filter className="w-4 h-4 text-slate-400" />
                <span>Filters:</span>
              </div>

              {/* Level Filter */}
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-700"
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>

              {/* Price Filter */}
              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-700"
              >
                <option value="All">All Prices</option>
                <option value="Free">Free Courses</option>
                <option value="Paid">Paid Courses</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200 rounded-xl focus:outline-none"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

          </div>

          {/* Category Chips Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 text-xs font-bold rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-semibold text-slate-600">
            Showing <span className="font-bold text-slate-900">{filteredCourses.length}</span> courses
          </p>
        </div>

        {/* Course Cards Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const isEnrolled = studentUser?.enrolledCourseIds?.includes(course.id);
              const completedModules = course.modules?.filter(m => m.completed).length || 0;
              const totalModules = course.modules?.length || 1;
              const progressPercent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
              return (
                <div
                  key={course.id}
                  className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm hover:shadow-xl hover:border-brand-300 card-hover-effect flex flex-col justify-between relative group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      {renderIcon(course.iconType)}
                      <div className="flex items-center gap-1.5">
                        {course.isFree && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700">
                            Free
                          </span>
                        )}
                        {course.bestseller && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-600 text-white uppercase">
                            Bestseller
                          </span>
                        )}
                      </div>
                    </div>

                    <h3
                      onClick={() => onSelectCourse(course.id)}
                      className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors cursor-pointer line-clamp-1 mb-2"
                    >
                      {course.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                      {course.description}
                    </p>

                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-3">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600">{course.level}</span>
                      <span className="text-slate-300">•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{course.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 mb-4">
                      <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                        <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
                        <span>{course.rating}</span>
                      </div>
                      <span className="text-slate-500">({course.studentsCount} students)</span>
                    </div>

                    <div className="mb-5">
                      {course.isFree ? (
                        <span className="text-xl font-extrabold text-brand-600">Free</span>
                      ) : (
                        <span className="text-xl font-extrabold text-slate-900">₹{course.price.toLocaleString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    {isEnrolled ? (
                      <button
                        onClick={() => onSelectCourse(course.id)}
                        className="w-full py-2.5 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-full shadow-sm transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>Enrolled</span>
                        <CheckCircle className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => onEnrollCourse ? onEnrollCourse(course.id, e) : onSelectCourse(course.id)}
                        className="w-full py-2.5 px-4 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 active:scale-98 rounded-full shadow-sm transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>Enroll</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-500">
                      <span>{completedModules} / {totalModules} Modules</span>
                      <span className="text-brand-700 font-extrabold">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No courses found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or search query.</p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All Categories');
                setSelectedLevel('All');
                setSelectedPrice('All');
              }}
              className="mt-4 px-4 py-2 text-xs font-bold text-brand-700 bg-brand-50 rounded-full"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
