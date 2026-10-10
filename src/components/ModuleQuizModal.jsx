import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, XCircle, AlertCircle, RefreshCw, 
  ArrowRight, Award, HelpCircle, Check, X, BookOpen, AlertTriangle
} from 'lucide-react';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

export default function ModuleQuizModal({ 
  isOpen, 
  onClose, 
  module, 
  courseId = 'sql-data-analysis',
  onQuizPassed,
  onContinueNextModule 
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [qId]: selectedIndex }
  const [showUnansweredWarning, setShowUnansweredWarning] = useState(false);

  // Status: 'taking' | 'submitting' | 'result' | 'review'
  const [quizState, setQuizState] = useState('taking');
  const [resultData, setResultData] = useState(null);

  let savedUser = {};
  try {
    const raw = localStorage.getItem('student_user');
    if (raw && raw !== 'undefined' && raw !== 'null') savedUser = JSON.parse(raw);
  } catch (e) {
    savedUser = {};
  }
  const userId = savedUser?.id || savedUser?.email || 'student-001';
  const studentName = savedUser?.name || 'Arshith Student';

  useEffect(() => {
    if (isOpen && module) {
      fetchQuizQuestions();
    }
  }, [isOpen, module]);

  const fetchQuizQuestions = async () => {
    setLoading(true);
    setError(null);
    setQuizState('taking');
    setCurrentIndex(0);
    setAnswers({});
    setResultData(null);
    setShowUnansweredWarning(false);

    try {
      const res = await api.getModuleQuiz(module.id);
      if (res.success && res.questions && res.questions.length > 0) {
        setQuestions(res.questions);
      } else {
        throw new Error('Failed to load quiz questions.');
      }
    } catch (err) {
      console.warn('Quiz load API error, checking local module quiz fallback:', err);
      if (module?.quiz?.questions && module.quiz.questions.length > 0) {
        const safeQuestions = module.quiz.questions.map(q => {
          const { correctAnswer, explanation, ...safeQ } = q;
          return safeQ;
        });
        setQuestions(safeQuestions);
      } else {
        setError('Could not load quiz questions. Please check connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !module) return null;

  const currentQ = questions[currentIndex];
  const totalQ = questions.length;
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = totalQ - answeredCount;

  const handleSelectOption = (optionIndex) => {
    if (!currentQ) return;
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionIndex
    }));
    setShowUnansweredWarning(false);
  };

  const handleAttemptSubmit = () => {
    if (unansweredCount > 0) {
      setShowUnansweredWarning(true);
      return;
    }
    executeSubmit();
  };

  const executeSubmit = async () => {
    setQuizState('submitting');
    setShowUnansweredWarning(false);

    try {
      const res = await api.submitModuleQuiz(module.id, {
        userId,
        studentName,
        courseId: courseId || module?.courseId || 'python-programming',
        answers
      });

      if (res.success && res.result) {
        setResultData(res.result);
        setQuizState('result');

        if (res.result.passed) {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 }
          });
          if (onQuizPassed) onQuizPassed(module.id);
        }
      } else {
        throw new Error('Submission failed.');
      }
    } catch (err) {
      console.error('Quiz submit error:', err);
      setError('Error submitting quiz. Please try again.');
      setQuizState('taking');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-brand-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-900 border border-brand-700 flex items-center justify-center text-emerald-400 font-black text-sm">
              Q
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Module Quiz</span>
              <h3 className="text-sm font-black text-white truncate max-w-xs sm:max-w-md">
                {module.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-12 text-center space-y-4">
            <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-300">Loading Module Quiz Questions...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-8 text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
            <p className="text-xs text-rose-300 font-bold">{error}</p>
            <button
              onClick={fetchQuizQuestions}
              className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold"
            >
              Retry Loading
            </button>
          </div>
        )}

        {/* TAKING QUIZ STATE */}
        {quizState === 'taking' && !loading && !error && currentQ && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
            
            {/* Progress Bar & Question Matrix */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-400">Question {currentIndex + 1} of {totalQ}</span>
                <span className="text-emerald-400 font-mono">{answeredCount} / {totalQ} Answered</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-brand-600 to-emerald-400 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / totalQ) * 100}%` }}
                />
              </div>

              {/* Question Navigation Chips */}
              <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1">
                {questions.map((q, idx) => {
                  const isAnswered = answers[q.id] !== undefined;
                  const isCurrent = idx === currentIndex;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all shrink-0 border ${
                        isCurrent
                          ? 'bg-brand-600 text-white border-emerald-400 ring-2 ring-emerald-500/40 shadow-lg'
                          : isAnswered
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question Stem Card */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-extrabold uppercase rounded-md border border-slate-700">
                  Difficulty: {currentQ.difficulty || 'Medium'}
                </span>
                <span className="text-[10px] font-mono text-slate-500">QID: {currentQ.id}</span>
              </div>

              <h4 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                {currentQ.questionText}
              </h4>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQ.options?.map((opt, optIdx) => {
                const isSelected = answers[currentQ.id] === optIdx;
                const letter = String.fromCharCode(65 + optIdx); // A, B, C, D

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full p-4 rounded-xl text-left transition-all flex items-start gap-3 border ${
                      isSelected
                        ? 'bg-brand-900/60 text-white border-emerald-400 shadow-md ring-1 ring-emerald-400/50'
                        : 'bg-slate-950/60 hover:bg-slate-950 text-slate-300 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 border ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
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

            {/* Unanswered Warning Alert */}
            {showUnansweredWarning && (
              <div className="bg-amber-950/60 border border-amber-500/50 p-4 rounded-xl text-amber-300 text-xs font-bold flex items-center justify-between gap-3 animate-pulse">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>You have {unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}. Are you sure you want to submit?</span>
                </div>
                <button
                  onClick={executeSubmit}
                  className="px-3 py-1.5 bg-amber-500 text-slate-950 rounded-lg text-xs font-black shrink-0 hover:bg-amber-400"
                >
                  Confirm Submit
                </button>
              </div>
            )}

            {/* Nav controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2.5 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-xl transition-all border border-slate-700"
              >
                Previous
              </button>

              {currentIndex < totalQ - 1 ? (
                <button
                  onClick={() => setCurrentIndex(prev => Math.min(totalQ - 1, prev + 1))}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl transition-all flex items-center gap-1.5 border border-brand-700 shadow-md"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleAttemptSubmit}
                  className="px-6 py-2.5 text-xs font-black text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-lg flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4 text-slate-950" />
                  <span>Submit Module Quiz</span>
                </button>
              )}
            </div>

          </div>
        )}

        {/* SUBMITTING SPINNER */}
        {quizState === 'submitting' && (
          <div className="p-16 text-center space-y-4">
            <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-200">Evaluating your answers and logging results...</p>
          </div>
        )}

        {/* QUIZ RESULT PAGE / CARD */}
        {quizState === 'result' && resultData && (
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 text-center">
            
            {/* Status Badge & Header */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                {module.title}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">MODULE QUIZ RESULT</h2>
            </div>

            <div className={`max-w-md mx-auto p-6 rounded-3xl border-2 shadow-2xl space-y-4 ${
              resultData.passed 
                ? 'bg-emerald-950/40 border-emerald-400 text-emerald-200' 
                : 'bg-rose-950/40 border-rose-500 text-rose-200'
            }`}>
              <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-3xl font-black border-2 ${
                resultData.passed 
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400' 
                  : 'bg-rose-500/20 border-rose-500 text-rose-400'
              }`}>
                {resultData.passed ? '✓' : '✕'}
              </div>

              <div>
                <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                  resultData.passed ? 'bg-emerald-400 text-slate-950' : 'bg-rose-500 text-white'
                }`}>
                  STATUS: {resultData.passed ? 'PASSED' : 'NOT PASSED'}
                </span>
                <p className="text-xs text-slate-400 font-medium pt-2">
                  Passing criteria: 70% (4 out of 5 correct)
                </p>
              </div>

              {/* Score Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-2">
                <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Score</p>
                  <p className="text-lg font-black text-white">{resultData.score} / {resultData.totalQuestions}</p>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Percentage</p>
                  <p className="text-lg font-black text-emerald-400">{resultData.percentage}%</p>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                  <p className="text-[10px] text-emerald-400 font-bold uppercase">Correct</p>
                  <p className="text-lg font-black text-emerald-400">{resultData.correctCount}</p>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                  <p className="text-[10px] text-rose-400 font-bold uppercase">Incorrect</p>
                  <p className="text-lg font-black text-rose-400">{resultData.incorrectCount}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setQuizState('review')}
                className="px-5 py-3 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all"
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Review Answers</span>
              </button>

              <button
                onClick={fetchQuizQuestions}
                className="px-5 py-3 text-xs font-bold text-amber-300 bg-amber-950/60 hover:bg-amber-900/80 rounded-xl border border-amber-700 flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry Quiz</span>
              </button>

              {onContinueNextModule && (
                <button
                  onClick={() => {
                    onClose();
                    onContinueNextModule();
                  }}
                  className="px-6 py-3 text-xs font-black text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg flex items-center gap-1.5 transition-all"
                >
                  <span>Continue to Next Module</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              )}
            </div>

          </div>
        )}

        {/* ANSWER REVIEW SYSTEM */}
        {quizState === 'review' && resultData && (
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-base font-black text-white">Quiz Answer Review</h4>
                <p className="text-xs text-slate-400">Score: {resultData.score}/{resultData.totalQuestions} ({resultData.percentage}%)</p>
              </div>
              <button
                onClick={() => setQuizState('result')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-lg border border-slate-700"
              >
                Back to Results
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

                    {/* Explanation */}
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
                onClick={() => setQuizState('result')}
                className="px-5 py-2.5 bg-brand-600 text-white font-bold text-xs rounded-xl hover:bg-brand-500"
              >
                Back to Results Card
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
