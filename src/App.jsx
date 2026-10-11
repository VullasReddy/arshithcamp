import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import PopularCourses from './components/PopularCourses';
import WhyLearnWithUs from './components/WhyLearnWithUs';
import CtaSection from './components/CtaSection';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import LoginModal from './components/LoginModal';
import VideoModal from './components/VideoModal';

import CoursesPage from './pages/CoursesPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import LearningPage from './pages/LearningPage';
import CertificatePage from './pages/CertificatePage';
import CertificateVerifyPage from './pages/CertificateVerifyPage';
import StudentDashboard from './pages/StudentDashboard';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import CategoriesPage from './pages/CategoriesPage';
import { AboutPage, ContactPage } from './pages/AboutContactPages';

import { INITIAL_COURSES, SAMPLE_CERTIFICATES } from './data/coursesData';
import { api, getAdminToken } from './services/api';

export default function App() {
  // Single Source of Truth Course State (Loaded from Backend DB)
  const [courses, setCourses] = useState(INITIAL_COURSES);

  // Student Auth State
  const [studentUser, setStudentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('studentUser');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Admin Auth State
  const [adminUser, setAdminUser] = useState(null);

  // View state
  const [activeTab, setActiveTab] = useState(() => {
    const path = window.location.pathname;
    if (path === '/admin-login') return 'admin-login';
    if (path === '/admin-dashboard' || path.startsWith('/admin/')) return 'admin-dashboard';
    return 'home';
  });

  // Selected State
  const [selectedCourseId, setSelectedCourseId] = useState('python-programming');
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [selectedCertId, setSelectedCertId] = useState('ABC-2026-PY0128');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All Categories');

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Fetch single source of truth published courses from Backend API
  const fetchCoursesFromBackend = async () => {
    try {
      const res = await api.getPublicCourses();
      if (res.success && res.courses && res.courses.length > 0) {
        setCourses(res.courses);
      }
    } catch (err) {
      console.warn('Backend API connection fallback to initial courses:', err);
    }
  };

  // Verify Admin Session on mount if token exists
  const checkAdminAuth = async () => {
    const token = getAdminToken();
    if (!token) return;
    try {
      const res = await api.getAdminProfile();
      if (res.success && res.admin) {
        setAdminUser(res.admin);
      }
    } catch (err) {
      setAdminUser(null);
    }
  };

  useEffect(() => {
    fetchCoursesFromBackend();
    checkAdminAuth();

    // Listen to browser URL changes for /admin-login & /admin-dashboard
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/admin-login') setActiveTab('admin-login');
      else if (path === '/admin-dashboard' || path.startsWith('/admin/')) setActiveTab('admin-dashboard');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handlers
  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleStudentAuthSuccess = (userAuthData) => {
    const emailKey = `studentUser_${userAuthData.email.trim().toLowerCase()}`;
    let savedUserData = null;
    try {
      const saved = localStorage.getItem(emailKey);
      if (saved) savedUserData = JSON.parse(saved);
    } catch (e) {}

    const resolvedName = userAuthData.name?.trim() || savedUserData?.name?.trim() || '';
    const resolvedRegNo = userAuthData.regNo?.trim() || savedUserData?.regNo?.trim() || '';

    const existingEnrolled = userAuthData.mode === 'signup'
      ? []
      : (savedUserData?.enrolledCourseIds || []);

    const updatedUser = {
      name: resolvedName,
      regNo: resolvedRegNo,
      email: userAuthData.email.trim(),
      enrolledCourseIds: existingEnrolled,
      certificates: savedUserData?.certificates || []
    };
    setStudentUser(updatedUser);
    localStorage.setItem('studentUser', JSON.stringify(updatedUser));
    localStorage.setItem(emailKey, JSON.stringify(updatedUser));
    setActiveTab('dashboard');
  };

  const handleEnrollCourse = (courseId, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!studentUser) {
      handleOpenAuth('login');
      return;
    }
    const currentEnrolled = studentUser.enrolledCourseIds || [];
    if (!currentEnrolled.includes(courseId)) {
      const updatedEnrolled = [...currentEnrolled, courseId];
      const updatedUser = {
        ...studentUser,
        enrolledCourseIds: updatedEnrolled
      };
      setStudentUser(updatedUser);
      localStorage.setItem('studentUser', JSON.stringify(updatedUser));
      if (studentUser.email) {
        localStorage.setItem(`studentUser_${studentUser.email.trim().toLowerCase()}`, JSON.stringify(updatedUser));
      }
    }
  };

  const handleStudentLogout = () => {
    setStudentUser(null);
    localStorage.removeItem('studentUser');
    setActiveTab('home');
  };

  const handleSelectCourse = (courseId) => {
    setSelectedCourseId(courseId);
    setActiveTab('course-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartLearning = (courseId, moduleId = null) => {
    if (studentUser) {
      const currentEnrolled = studentUser.enrolledCourseIds || [];
      if (!currentEnrolled.includes(courseId)) {
        const updatedUser = {
          ...studentUser,
          enrolledCourseIds: [...currentEnrolled, courseId]
        };
        setStudentUser(updatedUser);
        localStorage.setItem('studentUser', JSON.stringify(updatedUser));
        if (studentUser.email) {
          localStorage.setItem(`studentUser_${studentUser.email.trim().toLowerCase()}`, JSON.stringify(updatedUser));
        }
      }
    }
    setSelectedCourseId(courseId);
    setSelectedModuleId(moduleId);
    setActiveTab('learning');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleModuleComplete = (courseId, moduleId, forceState = null) => {
    setCourses(prevCourses => {
      return prevCourses.map(c => {
        if (c.id !== courseId) return c;

        let totalCount = c.modules?.length || 1;
        let completedCount = 0;

        const updatedModules = c.modules.map(m => {
          const isCompleted = m.id === moduleId 
            ? (forceState !== null ? forceState : !m.completed)
            : m.completed;
          if (isCompleted) completedCount += 1;
          return { ...m, completed: isCompleted };
        });

        const newProgress = Math.round((completedCount / totalCount) * 100);

        return {
          ...c,
          modules: updatedModules,
          progress: newProgress
        };
      });
    });
  };

  const handleViewCertificate = (courseId) => {
    const existingCert = SAMPLE_CERTIFICATES.find(sc => sc.courseId === courseId);
    if (existingCert) {
      setSelectedCertId(existingCert.id);
    } else {
      const codeStr = courseId.slice(0, 2).toUpperCase();
      setSelectedCertId(`ABC-2026-${codeStr}0128`);
    }
    setActiveTab('certificate');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVerifyClick = (certId) => {
    setSelectedCertId(certId);
    setActiveTab('verify');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
    setActiveTab('courses');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin Actions & Navigation
  const handleAdminLoginSuccess = (adminData) => {
    setAdminUser(adminData);
    setActiveTab('admin-dashboard');
    window.history.pushState(null, '', '/admin-dashboard');
  };

  const handleAdminLogout = async () => {
    try {
      await api.adminLogout();
    } catch (e) {}
    setAdminUser(null);
    setActiveTab('home');
    window.history.pushState(null, '', '/');
  };

  const getTodayFormattedDate = () => {
    return new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStudentDisplayName = () => {
    if (studentUser?.name && studentUser.name.trim()) return studentUser.name.trim();
    if (studentUser?.email && studentUser.email.trim()) return studentUser.email.trim();
    return '';
  };

  const currentSelectedCourse = courses.find(c => c.id === selectedCourseId) || courses[0];
  const foundCert = SAMPLE_CERTIFICATES.find(c => c.id === selectedCertId);
  const studentDisplayName = getStudentDisplayName();

  const currentCert = {
    id: selectedCertId,
    courseId: foundCert?.courseId || currentSelectedCourse?.id || 'python-programming',
    courseTitle: foundCert?.courseTitle || currentSelectedCourse?.title || 'Python Programming',
    studentName: studentDisplayName || (foundCert?.studentName !== 'Arshith Kumar' ? foundCert?.studentName : '') || studentUser?.email || '',
    regNo: studentUser?.regNo || foundCert?.regNo || '',
    issueDate: (studentUser && studentUser.certificateIssueDates && studentUser.certificateIssueDates[selectedCertId])
      ? studentUser.certificateIssueDates[selectedCertId]
      : getTodayFormattedDate(),
    instructorName: foundCert?.instructorName || currentSelectedCourse?.instructor?.name || 'Dr. Ananya Sharma',
    grade: foundCert?.grade || '98% Distinction'
  };

  const isPublicPage = !['learning', 'admin-login', 'admin-dashboard'].includes(activeTab);

  // Enforce Admin Security: If trying to access admin-dashboard without admin token, redirect to admin-login
  if (activeTab === 'admin-dashboard' && !adminUser && !getAdminToken()) {
    return (
      <AdminLoginPage
        onLoginSuccess={handleAdminLoginSuccess}
        onGoHome={() => {
          setActiveTab('home');
          window.history.pushState(null, '', '/');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FAFDFB] text-slate-900 selection:bg-brand-100 selection:text-brand-900 has-bottom-nav md:pb-0">
      
      {/* Top Header */}
      {isPublicPage && (
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAuth={handleOpenAuth}
          onSearchSubmit={handleSearchSubmit}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          studentUser={studentUser}
          onLogoutStudent={handleStudentLogout}
        />
      )}

      {/* Main Content Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <HeroSection
              onExploreClick={() => {
                setActiveTab('courses');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onWatchVideoClick={() => setVideoModalOpen(true)}
            />
            <PopularCourses
              courses={courses}
              studentUser={studentUser}
              onSelectCourse={handleSelectCourse}
              onEnrollCourse={handleEnrollCourse}
              onViewAllCourses={() => {
                setActiveTab('courses');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            <WhyLearnWithUs />
            <CtaSection
              onExploreClick={() => {
                setActiveTab('courses');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </>
        )}

        {activeTab === 'courses' && (
          <CoursesPage
            courses={courses}
            studentUser={studentUser}
            onSelectCourse={handleSelectCourse}
            onEnrollCourse={handleEnrollCourse}
            initialSearch={searchQuery}
            initialCategory={selectedCategoryFilter}
          />
        )}

        {activeTab === 'course-details' && (
          <CourseDetailsPage
            course={currentSelectedCourse}
            onBack={() => setActiveTab('courses')}
            onStartLearning={handleStartLearning}
          />
        )}

        {activeTab === 'learning' && (
          <LearningPage
            course={currentSelectedCourse}
            activeModuleId={selectedModuleId}
            onBack={() => setActiveTab('course-details')}
            onToggleModuleComplete={handleToggleModuleComplete}
            onViewCertificate={handleViewCertificate}
          />
        )}

        {activeTab === 'certificate' && (
          <CertificatePage
            certificate={currentCert}
            studentUser={studentUser}
            onBack={() => setActiveTab('dashboard')}
            onVerifyClick={handleVerifyClick}
          />
        )}

        {activeTab === 'verify' && (
          <CertificateVerifyPage
            certId={selectedCertId}
            studentUser={studentUser}
            onBack={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'dashboard' && (
          <StudentDashboard
            studentUser={studentUser}
            courses={courses}
            onSelectCourse={handleSelectCourse}
            onStartLearning={handleStartLearning}
            onViewCertificate={handleViewCertificate}
            onExploreCourses={() => {
              setActiveTab('courses');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Dedicated Admin Authentication Page */}
        {activeTab === 'admin-login' && (
          <AdminLoginPage
            onLoginSuccess={handleAdminLoginSuccess}
            onGoHome={() => {
              setActiveTab('home');
              window.history.pushState(null, '', '/');
            }}
          />
        )}

        {/* Dedicated Secure Admin Management Portal */}
        {activeTab === 'admin-dashboard' && (
          <AdminDashboard
            admin={adminUser}
            onLogout={handleAdminLogout}
            onCourseDataChanged={fetchCoursesFromBackend}
          />
        )}

        {activeTab === 'categories' && (
          <CategoriesPage
            onCategorySelect={(catName) => {
              setSelectedCategoryFilter(catName);
              setActiveTab('courses');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'about' && <AboutPage />}
        {activeTab === 'contact' && <ContactPage />}
      </main>

      {/* Footer */}
      {isPublicPage && (
        <Footer setActiveTab={setActiveTab} />
      )}

      {/* Mobile Navigation Bar */}
      {isPublicPage && (
        <MobileBottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAuth={handleOpenAuth}
        />
      )}

      {/* Modals */}
      <LoginModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onSuccess={handleStudentAuthSuccess}
      />

      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
      />

    </div>
  );
}
