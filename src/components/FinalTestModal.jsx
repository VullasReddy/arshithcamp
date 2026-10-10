import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, AlertCircle, CheckCircle, XCircle, ArrowRight, 
  ArrowLeft, BookOpen, RefreshCw, X, AlertTriangle, Award, Check
} from 'lucide-react';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

export default function FinalTestModal({ 
  isOpen, 
  onClose, 
  course, 
  onTestPassed, 
  onViewCourseProgress 
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [qId]: selectedIndex }
  const [remainingSeconds, setRemainingSeconds] = useState(45 * 60);

  // States: 'taking' | 'submitting' | 'result' | 'review'
  const [testState, setTestState] = useState('taking');
  const [resultData, setResultData] = useState(null);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const [autoSubmitMessage, setAutoSubmitMessage] = useState(null);
  const [mobileMatrixOpen, setMobileMatrixOpen] = useState(false);

  const [assignedPaper, setAssignedPaper] = useState(null);
  const [availablePapers, setAvailablePapers] = useState([]);

  let savedUser = {};
  try {
    const raw = localStorage.getItem('studentUser') || localStorage.getItem('student_user');
    if (raw && raw !== 'undefined' && raw !== 'null') savedUser = JSON.parse(raw);
  } catch (e) {
    savedUser = {};
  }
  const userId = savedUser?.id || savedUser?.email || 'student-001';
  const studentName = (savedUser?.name && savedUser.name.trim()) ? savedUser.name.trim() : (savedUser?.email && savedUser.email.trim() ? savedUser.email.trim() : 'Student');

  const timerRef = useRef(null);

  // Helper for offline fallback name matching
  const getPaperSetForName = (name, papers = []) => {
    if (!papers || papers.length === 0) return null;
    const firstLetter = (name || '').trim().toUpperCase().charAt(0);
    if (firstLetter >= 'A' && firstLetter <= 'F') return papers[0];
    if (firstLetter >= 'G' && firstLetter <= 'L') return papers[1] || papers[0];
    if (firstLetter >= 'M' && firstLetter <= 'R') return papers[2] || papers[0];
    if (firstLetter >= 'S' && firstLetter <= 'Z') return papers[3] || papers[0];
    return papers[0];
  };

  // Start / Resume Final Test Session
  useEffect(() => {
    if (isOpen) {
      startOrResumeFinalTest();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen]);

  // Countdown timer effect
  useEffect(() => {
    if (testState === 'taking' && remainingSeconds > 0) {
      timerRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testState, remainingSeconds]);

  const startOrResumeFinalTest = async (overridePaperCode = null) => {
    setLoading(true);
    setError(null);
    setTestState('taking');
    setCurrentIndex(0);
    setAnswers({});
    setResultData(null);
    setConfirmSubmitOpen(false);
    setAutoSubmitMessage(null);

    // Restore saved answers from localStorage if available
    const savedAnswers = localStorage.getItem(`${course?.id || 'course'}_final_answers_${userId}`);
    if (savedAnswers) {
      try {
        setAnswers(JSON.parse(savedAnswers));
      } catch (e) {}
    }

    try {
      const res = await api.startFinalTest({ 
        userId, 
        studentName, 
        courseId: course?.id, 
        paperCode: overridePaperCode 
      });
      if (res.success && res.questions) {
        setQuestions(res.questions);
        setSessionId(res.sessionId);
        setRemainingSeconds(res.remainingSeconds || (45 * 60));
        if (res.assignedPaper) setAssignedPaper(res.assignedPaper);
        if (res.availablePapers) setAvailablePapers(res.availablePapers);
      } else {
        throw new Error('Fallback to local papers');
      }
    } catch (err) {
      console.warn('Final test API fallback to local course data:', err);
      if (course?.finalTest?.questionPapers) {
        const papers = course.finalTest.questionPapers;
        let selected = null;
        if (overridePaperCode) {
          selected = papers.find(p => p.paperCode === overridePaperCode);
        }
        if (!selected) {
          selected = getPaperSetForName(studentName, papers);
        }
        setAssignedPaper(selected);
        setAvailablePapers(papers);
        setQuestions(selected?.questions || []);
      } else if (course?.finalTest?.questions) {
        setQuestions(course.finalTest.questions);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optionIndex) => {
    if (!questions[currentIndex]) return;
    const currentQId = questions[currentIndex].id;
    const updated = {
      ...answers,
      [currentQId]: optionIndex
    };
    setAnswers(updated);
    localStorage.setItem(`${course?.id || 'course'}_final_answers_${userId}`, JSON.stringify(updated));
  };

  const handleAutoSubmit = () => {
    setAutoSubmitMessage("Time is up. Your test has been submitted automatically.");
    executeSubmit(true);
  };

  const executeSubmit = async (isAuto = false) => {
    setConfirmSubmitOpen(false);
    setTestState('submitting');

    try {
      const res = await api.submitFinalTest({
        userId,
        studentName,
        courseId: course?.id,
        sessionId,
        paperCode: assignedPaper?.paperCode,
        answers
      });

      if (res.success && res.result) {
        setResultData(res.result);
        setTestState('result');
        localStorage.removeItem(`${course?.id || 'course'}_final_answers_${userId}`);

        if (res.result.passed) {
          localStorage.setItem(`arb_final_passed_${course?.id}_${userId}`, 'true');
          localStorage.setItem(`final_test_passed_${course?.id}`, 'true');
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 }
          });
          if (onTestPassed) onTestPassed();
        }
      } else {
        throw new Error('Submission error.');
      }
    } catch (err) {
      console.error('Final test submit error:', err);
      setError('Failed to submit assessment. Please check network.');
      setTestState('taking');
    }
  };

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];
  const totalQ = questions.length;
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = Math.max(0, totalQ - answeredCount);

  // Format Timer MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border-2 border-brand-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[94vh]">
        
        {/* Header with Sticky Timer */}
        <div className="px-6 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-sm">
              ★
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">Final Certification Exam</span>
              <h3 className="text-sm font-black text-white truncate max-w-xs sm:max-w-md">
                {course?.title || 'Course'} Final Assessment
              </h3>
            </div>
          </div>

          {/* Prominent 45-Minute Timer Display */}
          {testState === 'taking' && (
            <div className={`px-4 py-1.5 rounded-2xl border flex items-center gap-2 font-mono font-black text-sm sm:text-base transition-all ${
              remainingSeconds < 300 
                ? 'bg-rose-950/80 border-rose-500 text-rose-400 animate-pulse ring-2 ring-rose-500/50' 
                : 'bg-slate-900 border-amber-500/50 text-amber-300'
            }`}>
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Time Remaining: {formatTime(remainingSeconds)}</span>
            </div>
          )}

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-16 text-center space-y-4 my-auto">
            <RefreshCw className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-200">Initializing 45-Minute SQL Final Assessment Session...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-12 text-center space-y-4 my-auto">
            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
            <p className="text-sm text-rose-300 font-bold">{error}</p>
            <button
              onClick={startOrResumeFinalTest}
              className="px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-lg"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* TAKING ASSESSMENT WORKSPACE */}
        {testState === 'taking' && !loading && !error && currentQ && (
          <div className="flex-1 grid lg:grid-cols-12 overflow-hidden">
            
            {/* Left Main Question Stage (8 Cols) */}
            <div className="lg:col-span-8 p-5 sm:p-8 overflow-y-auto space-y-6 flex flex-col justify-between">
              
              <div className="space-y-6">
                {/* Candidate & Alphabetical Paper Set Banner */}
                {assignedPaper && (
                  <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-emerald-800/80 flex flex-wrap items-center justify-between gap-2 animate-fade-in">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2.5 py-0.5 bg-emerald-900/80 text-emerald-300 font-extrabold rounded-md text-[10px] tracking-wider uppercase border border-emerald-700/60">
                        Alphabetical Assignment
                      </span>
                      <span className="text-slate-200 font-bold">Candidate: <strong className="text-emerald-400 font-black">{studentName}</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-800/60 shadow-xs">
                        {assignedPaper.paperCode} ({assignedPaper.groupName || assignedPaper.letterRange})
                      </span>

                      {availablePapers && availablePapers.length > 1 && (
                        <select
                          value={assignedPaper.paperCode}
                          onChange={(e) => startOrResumeFinalTest(e.target.value)}
                          className="bg-slate-900 text-xs font-bold text-slate-300 border border-slate-700 rounded-lg px-2.5 py-1 outline-none cursor-pointer hover:border-slate-500"
                          title="Switch Assigned Paper Set"
                        >
                          {availablePapers.map(p => (
                            <option key={p.paperCode} value={p.paperCode}>
                              {p.paperCode} ({p.groupName || p.letterRange})
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                )}

                {/* Question Info */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-slate-950 text-slate-300 text-xs font-black uppercase rounded-lg border border-slate-800">
                    Question {currentIndex + 1} of {totalQ}
                  </span>
                  <span className="text-xs font-extrabold uppercase text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-md border border-amber-800/60">
                    Difficulty: {currentQ.difficulty || 'Medium'}
                  </span>
                </div>

                {/* Question Stem Card */}
                <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
                  <h4 className="text-base sm:text-lg font-bold text-white font-mono leading-relaxed">
                    {currentQ.questionText}
                  </h4>
                </div>

                {/* Options List */}
                <div className="space-y-3">
                  {currentQ.options?.map((opt, optIdx) => {
                    const isSelected = answers[currentQ.id] === optIdx;
                    const letter = String.fromCharCode(65 + optIdx);

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full p-4 rounded-2xl text-left transition-all flex items-start gap-3.5 border ${
                          isSelected
                            ? 'bg-amber-950/50 text-white border-amber-400 shadow-xl ring-2 ring-amber-400/40'
                            : 'bg-slate-950/60 hover:bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 border-amber-300 font-black'
                            : 'bg-slate-900 text-slate-400 border-slate-700'
                        }`}>
                          {letter}
                        </div>
                        <span className="text-xs sm:text-sm font-medium pt-1 font-mono leading-relaxed">
                          {opt}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Nav Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-800 shrink-0">
                <button
                  onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="px-5 py-3 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-xl transition-all border border-slate-700 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {currentIndex < totalQ - 1 ? (
                  <button
                    onClick={() => setCurrentIndex(prev => Math.min(totalQ - 1, prev + 1))}
                    className="px-6 py-3 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl transition-all flex items-center gap-1.5 border border-brand-700 shadow-lg"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setConfirmSubmitOpen(true)}
                    className="px-7 py-3 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-xl flex items-center gap-2"
                  >
                    <CheckCircle className="w-4.5 h-4.5 text-slate-950" />
                    <span>Submit Final Assessment</span>
                  </button>
                )}
              </div>

            </div>

            {/* Right Question Navigation Panel Matrix (4 Cols) */}
            <div className="lg:col-span-4 bg-slate-950 border-l border-slate-800 p-6 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">Question Matrix Navigator</h4>
                  <p className="text-xs text-slate-400 font-medium pt-0.5">Click any number to jump directly to that question.</p>
                </div>

                {/* Progress Summary Card */}
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-400">Total Answered</span>
                    <span className="text-emerald-400 font-mono font-black">{answeredCount} / {totalQ}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-300"
                      style={{ width: `${(answeredCount / totalQ) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-400 pt-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Answered ({answeredCount})
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700 inline-block" /> Unanswered ({unansweredCount})
                    </span>
                  </div>
                </div>

                {/* 1-25 Question Matrix Grid */}
                <div className="grid grid-cols-5 gap-2.5">
                  {questions.map((q, idx) => {
                    const isAnswered = answers[q.id] !== undefined;
                    const isCurrent = idx === currentIndex;

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-11 rounded-xl text-xs font-black flex items-center justify-center transition-all border ${
                          isCurrent
                            ? 'bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-400/50 shadow-lg scale-105'
                            : isAnswered
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80 hover:bg-emerald-900/60'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800">
                <button
                  onClick={() => setConfirmSubmitOpen(true)}
                  className="w-full py-3.5 px-4 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4.5 h-4.5 text-slate-950" />
                  <span>Submit Assessment ({answeredCount}/{totalQ})</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* SUBMITTING SPINNER */}
        {testState === 'submitting' && (
          <div className="p-20 text-center space-y-4 my-auto">
            <RefreshCw className="w-12 h-12 text-amber-400 animate-spin mx-auto" />
            <p className="text-base font-black text-white">Grading SQL Final Assessment & Verifying Server Logs...</p>
          </div>
        )}

        {/* FINAL TEST RESULT PAGE */}
        {testState === 'result' && resultData && (
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 text-center">
            
            {/* Header */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase text-amber-400 tracking-widest bg-amber-950/40 px-3 py-1 rounded-full border border-amber-800">
                Official Certification Result
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">SQL FINAL ASSESSMENT</h2>
            </div>

            {/* Result Card */}
            <div className={`max-w-xl mx-auto p-8 rounded-3xl border-2 shadow-2xl space-y-6 ${
              resultData.passed 
                ? 'bg-emerald-950/30 border-emerald-400 text-emerald-200' 
                : 'bg-rose-950/30 border-rose-500 text-rose-200'
            }`}>
              <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl font-black border-2 ${
                resultData.passed 
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400' 
                  : 'bg-rose-500/20 border-rose-500 text-rose-400'
              }`}>
                {resultData.passed ? '🎓' : '✕'}
              </div>

              <div>
                <span className={`px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                  resultData.passed ? 'bg-emerald-400 text-slate-950 shadow-lg' : 'bg-rose-500 text-white'
                }`}>
                  STATUS: {resultData.passed ? 'PASSED' : 'NOT PASSED'}
                </span>
                <p className="text-xs text-slate-400 font-medium pt-3">
                  Passing criteria: 60% (15 out of 25 correct)
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-2">
                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Score</p>
                  <p className="text-xl font-black text-white">{resultData.score} / {resultData.totalQuestions}</p>
                </div>
                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Percentage</p>
                  <p className="text-xl font-black text-emerald-400">{resultData.percentage}%</p>
                </div>
                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                  <p className="text-[10px] text-emerald-400 font-bold uppercase">Correct</p>
                  <p className="text-xl font-black text-emerald-400">{resultData.correctCount}</p>
                </div>
                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                  <p className="text-[10px] text-rose-400 font-bold uppercase">Incorrect</p>
                  <p className="text-xl font-black text-rose-400">{resultData.incorrectCount}</p>
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 font-medium flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Time Taken: <strong>{resultData.timeTakenFormatted}</strong></span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-slate-800">
              <button
                onClick={() => setTestState('review')}
                className="px-6 py-3.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 flex items-center gap-2 transition-all shadow-md"
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Review Answers</span>
              </button>

              <button
                onClick={startOrResumeFinalTest}
                className="px-6 py-3.5 text-xs font-bold text-amber-300 bg-amber-950/60 hover:bg-amber-900/80 rounded-xl border border-amber-700 flex items-center gap-2 transition-all shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retake Assessment</span>
              </button>

              {onViewCourseProgress && (
                <button
                  onClick={() => {
                    onClose();
                    onViewCourseProgress();
                  }}
                  className="px-7 py-3.5 text-xs font-black text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-xl flex items-center gap-2 transition-all"
                >
                  <Award className="w-4 h-4 text-slate-950" />
                  <span>View Course Progress</span>
                </button>
              )}
            </div>

          </div>
        )}

        {/* FINAL TEST REVIEW SYSTEM */}
        {testState === 'review' && resultData && (
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-base font-black text-white">Final Assessment Answer Review</h4>
                <p className="text-xs text-slate-400">Score: {resultData.score}/{resultData.totalQuestions} ({resultData.percentage}%) • Time: {resultData.timeTakenFormatted}</p>
              </div>
              <button
                onClick={() => setTestState('result')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-xl border border-slate-700"
              >
                Back to Results Card
              </button>
            </div>

            <div className="space-y-6">
              {resultData.questionsReview?.map((qRev, qIdx) => {
                const userSelectedOpt = qRev.selectedAnswer !== null ? qRev.options[qRev.selectedAnswer] : 'No answer selected';
                const correctOpt = qRev.options[qRev.correctAnswer];

                return (
                  <div
                    key={qRev.id}
                    className={`p-5 rounded-2xl border-2 space-y-3 ${
                      qRev.isCorrect 
                        ? 'bg-slate-950/80 border-emerald-500/60' 
                        : 'bg-slate-950/80 border-rose-500/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-xs font-black text-slate-400">Question {qIdx + 1} of {resultData.totalQuestions}</span>
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase flex items-center gap-1 ${
                        qRev.isCorrect ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-rose-950 text-rose-300 border border-rose-700'
                      }`}>
                        {qRev.isCorrect ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-rose-400" />}
                        {qRev.isCorrect ? 'CORRECT' : 'INCORRECT'}
                      </span>
                    </div>

                    <h5 className="text-sm font-bold text-white font-mono leading-relaxed">
                      {qRev.questionText}
                    </h5>

                    <div className="grid sm:grid-cols-2 gap-3 text-xs pt-1">
                      <div className={`p-3 rounded-xl border ${
                        qRev.isCorrect 
                          ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800' 
                          : 'bg-rose-950/40 text-rose-300 border-rose-800'
                      }`}>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Your Answer:</span>
                        <span className="font-semibold font-mono">{userSelectedOpt}</span>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-950/40 text-emerald-300 border border-emerald-800">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Correct Answer:</span>
                        <span className="font-semibold font-mono">{correctOpt}</span>
                      </div>
                    </div>

                    {qRev.explanation && (
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                        <span className="text-[10px] font-black uppercase text-emerald-400">Explanation:</span>
                        <p className="font-normal leading-relaxed text-slate-300">{qRev.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setTestState('result')}
                className="px-6 py-2.5 bg-amber-400 text-slate-950 font-black text-xs rounded-xl hover:bg-amber-300"
              >
                Back to Results Card
              </button>
            </div>
          </div>
        )}

      </div>

      {/* CONFIRMATION MODAL BEFORE SUBMISSION */}
      {confirmSubmitOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 text-center shadow-2xl">
            <div className="w-14 h-14 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto text-2xl border border-amber-500/40">
              ⚠️
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-white">Are you sure you want to submit?</h3>
              <p className="text-xs text-slate-400">Please review your submission status below:</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-2 text-left font-mono">
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Answered Questions:</span>
                <span className="text-emerald-400 font-bold">{answeredCount} / {totalQ}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Unanswered Questions:</span>
                <span className="text-rose-400 font-bold">{unansweredCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Time Remaining:</span>
                <span className="text-amber-300 font-bold">{formatTime(remainingSeconds)}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmSubmitOpen(false)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold border border-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => executeSubmit(false)}
                className="flex-1 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black shadow-lg"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
