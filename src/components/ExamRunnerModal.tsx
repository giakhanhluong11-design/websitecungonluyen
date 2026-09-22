import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  Flag, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ChevronRight, 
  ChevronLeft, 
  Award, 
  RotateCcw,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Exam, ExamAttempt } from '../types';
import { 
  evaluateSingleAttempt, 
  calculateAggregatedCompetency, 
  SingleAssessmentResult, 
  AggregatedCompetencyResult 
} from '../services/competencyService';
import { CompetencyAssessmentBlock } from './CompetencyAssessmentBlock';
import { loadUserProgress } from '../data/userStorage';

interface ExamRunnerModalProps {
  exam: Exam;
  onClose: () => void;
  onSaveExamAttempt: (attempt: ExamAttempt) => void;
  onReviewTopic?: (topicId: string) => void;
}

export const ExamRunnerModal: React.FC<ExamRunnerModalProps> = ({
  exam,
  onClose,
  onSaveExamAttempt,
  onReviewTopic
}) => {
  // Timer in seconds (e.g., 120 minutes = 7200 seconds)
  const initialSeconds = exam.durationMinutes * 60;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(initialSeconds);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);

  // Question navigation
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});

  // Submission & Result state
  const [showConfirmSubmit, setShowConfirmSubmit] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [examAttempt, setExamAttempt] = useState<ExamAttempt | null>(null);
  const [assessmentResult, setAssessmentResult] = useState<SingleAssessmentResult | null>(null);
  const [historySummary, setHistorySummary] = useState<AggregatedCompetencyResult | null>(null);

  // Countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerActive && secondsRemaining > 0 && !isSubmitted) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval!);
            handleFinalSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, secondsRemaining, isSubmitted]);

  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId: string, option: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const toggleFlag = (questionId: string) => {
    setFlagged(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleFinalSubmit = () => {
    setIsTimerActive(false);
    setShowConfirmSubmit(false);

    const questions = exam.questions;
    let correctCount = 0;
    const weakMap = new Map<string, { topicId: string; topicName: string; wrongCount: number }>();

    questions.forEach(q => {
      const ans = userAnswers[q.id];
      if (ans === q.correctAnswer) {
        correctCount++;
      } else {
        const existing = weakMap.get(q.topicId) || { topicId: q.topicId, topicName: q.topicName, wrongCount: 0 };
        existing.wrongCount++;
        weakMap.set(q.topicId, existing);
      }
    });

    const wrongCount = questions.length - correctCount;
    const weakTopicsList = Array.from(weakMap.values());
    const rawScore = (correctCount / questions.length) * 10;
    const score = Math.round(rawScore * 10) / 10;
    const timeSpent = initialSeconds - secondsRemaining;
    const accuracy = Math.round((correctCount / questions.length) * 100);

    const assessment = evaluateSingleAttempt({
      correctCount,
      totalQuestions: questions.length,
      subjectId: exam.subjectId,
      weakTopics: weakTopicsList,
      questions: exam.questions,
      userAnswers
    });
    setAssessmentResult(assessment);

    const attempt: ExamAttempt = {
      id: `exam-attempt-${Date.now()}`,
      examId: exam.id,
      examTitle: exam.title,
      subjectId: exam.subjectId,
      date: new Date().toISOString().split('T')[0],
      score,
      totalQuestions: questions.length,
      correctCount,
      wrongCount,
      durationSpentSeconds: timeSpent,
      weakTopics: weakTopicsList,
      answers: userAnswers,
      accuracy,
      competencyLevel: assessment.competency.label,
      completedAt: new Date().toISOString()
    };

    setExamAttempt(attempt);
    setIsSubmitted(true);
    onSaveExamAttempt(attempt);

    try {
      const currentProgress = loadUserProgress();
      const combined = [
        ...currentProgress.practiceAttempts,
        ...currentProgress.examAttempts,
        attempt
      ];
      const agg = calculateAggregatedCompetency(combined);
      setHistorySummary(agg);
    } catch {}

    if (score >= 8.0) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch {}
    }
  };

  const currentQ = exam.questions[currentIndex];
  const isTimeCritical = secondsRemaining <= 300; // < 5 mins
  const unansweredCount = exam.questions.length - Object.keys(userAnswers).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        id="exam-runner-modal"
        className="relative flex flex-col w-full max-w-5xl h-[94vh] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/60 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60">
              {exam.subjectId === 'toan' ? 'Toán' : exam.subjectId === 'van' ? 'Ngữ văn' : 'Tiếng Anh'}
            </span>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate max-w-[200px] sm:max-w-md">
              {exam.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Countdown Timer */}
            {!isSubmitted && (
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                isTimeCritical 
                  ? 'bg-rose-50 text-rose-700 animate-pulse dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60' 
                  : 'bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
              }`}>
                <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>{formatTimer(secondsRemaining)}</span>
              </div>
            )}

            {!isSubmitted ? (
              <button
                id="exam-runner-submit-btn"
                onClick={() => setShowConfirmSubmit(true)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                Nộp bài
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Thoát
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* ================= IF SUBMITTED: RESULT VIEW ================= */}
          {isSubmitted && examAttempt ? (
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {assessmentResult ? (
                <CompetencyAssessmentBlock
                  assessment={assessmentResult}
                  historySummary={historySummary}
                  examTitle={exam.title}
                  durationText={formatTimer(examAttempt.durationSpentSeconds)}
                  onReviewTopic={(topicName) => {
                    if (onReviewTopic) {
                      const found = exam.questions.find(q => q.topicName === topicName);
                      if (found) {
                        onClose();
                        onReviewTopic(found.topicId);
                      }
                    }
                  }}
                />
              ) : (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-6 text-center shadow-xs">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    Đã hoàn thành đề thi!
                  </h3>
                  <div className="mt-4 text-3xl font-extrabold text-indigo-600">
                    {examAttempt.score} / 10 điểm
                  </div>
                </div>
              )}

              {/* Full Answer Key & Step-by-Step Solutions */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Chi tiết bài làm và đáp án chính thức
                </h4>

                <div className="space-y-3">
                  {exam.questions.map((q) => {
                    const userAns = examAttempt.answers[q.id];
                    const isCorrect = userAns === q.correctAnswer;

                    return (
                      <div
                        key={q.id}
                        className={`rounded-xl border p-4 bg-white dark:bg-slate-850 space-y-2.5 ${
                          isCorrect ? 'border-emerald-300 dark:border-emerald-800' : 'border-rose-200 dark:border-rose-900/60'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">
                            Câu {q.number}: [{q.topicName}]
                          </span>
                          <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                            isCorrect ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                          }`}>
                            {isCorrect ? '✓ Đúng' : '✗ Sai'}
                          </span>
                        </div>

                        <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                          {q.text}
                        </p>

                        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-xs space-y-1 border border-slate-200 dark:border-slate-800">
                          <div className="font-bold text-indigo-700 dark:text-indigo-400">
                            Đáp án chính thức: {q.correctAnswer}
                          </div>
                          {userAns && (
                            <div className={`text-[11px] font-medium ${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                              Câu trả lời của bạn: {userAns}
                            </div>
                          )}
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed pt-1 font-mono">
                            <strong>Hướng dẫn giải:</strong> {q.explanation}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* ================= ACTIVE EXAM INTERACTION ================= */
            <>
              {/* Question Screen */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    Câu số {currentQ.number} ({currentQ.points ? `${currentQ.points} điểm` : '1 câu'})
                  </span>

                  <button
                    onClick={() => toggleFlag(currentQ.id)}
                    className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      flagged[currentQ.id]
                        ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-900/50'
                        : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Flag className={`h-3.5 w-3.5 ${flagged[currentQ.id] ? 'fill-amber-500 text-amber-500' : ''}`} />
                    <span>{flagged[currentQ.id] ? 'Đã đánh dấu xem lại' : 'Đánh dấu câu này'}</span>
                  </button>
                </div>

                <div className="rounded-xl bg-slate-50 dark:bg-slate-850 p-4 border border-slate-200 dark:border-slate-800">
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed whitespace-pre-line">
                    {currentQ.text}
                  </p>
                </div>

                {/* Multiple Choice Options */}
                {currentQ.options && (
                  <div className="space-y-2.5">
                    {currentQ.options.map((option, oIdx) => {
                      const isChosen = userAnswers[currentQ.id] === option;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectOption(currentQ.id, option)}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center gap-3 cursor-pointer ${
                            isChosen
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-900 dark:bg-indigo-950/50 dark:text-white font-semibold shadow-xs'
                              : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-850'
                          }`}
                        >
                          <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold uppercase ${
                            isChosen
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="leading-relaxed">{option}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Bottom Step Nav */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex(i => i - 1)}
                    className="flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Câu trước
                  </button>

                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {currentIndex + 1} / {exam.questions.length}
                  </span>

                  <button
                    disabled={currentIndex === exam.questions.length - 1}
                    onClick={() => setCurrentIndex(i => i + 1)}
                    className="flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 cursor-pointer shadow-xs"
                  >
                    Câu sau
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Sidebar: Question Grid Navigation */}
              <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 p-4 bg-slate-50/70 dark:bg-slate-850/60 flex flex-col justify-between shrink-0">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Bảng câu hỏi ({exam.questions.length})
                  </h4>

                  <div className="grid grid-cols-5 gap-2">
                    {exam.questions.map((q, idx) => {
                      const isAnswered = !!userAnswers[q.id];
                      const isFlag = !!flagged[q.id];
                      const isCurrent = idx === currentIndex;

                      let btnStyle = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200';
                      if (isCurrent) {
                        btnStyle = 'ring-2 ring-indigo-600 border-indigo-600 font-bold';
                      }
                      if (isFlag) {
                        btnStyle += ' bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300';
                      } else if (isAnswered) {
                        btnStyle += ' bg-indigo-600 text-white border-indigo-600 font-bold';
                      }

                      return (
                        <button
                          key={q.id}
                          onClick={() => setCurrentIndex(idx)}
                          className={`h-8 rounded-lg border text-xs flex items-center justify-center transition-all cursor-pointer ${btnStyle}`}
                        >
                          {q.number}
                        </button>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded bg-indigo-600" />
                      <span>Đã làm ({Object.keys(userAnswers).length})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded bg-amber-200 border border-amber-400" />
                      <span>Chưa chắc ({Object.keys(flagged).filter(k => flagged[k]).length})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
                      <span>Chưa làm ({unansweredCount})</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => setShowConfirmSubmit(true)}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
                  >
                    Hoàn tất & Nộp bài
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Confirmation Modal */}
        {showConfirmSubmit && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-xl border border-slate-200 dark:border-slate-800 space-y-4 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">
                <AlertTriangle className="h-6 w-6" />
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Xác nhận nộp bài thi?
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {unansweredCount > 0 ? (
                  <span>Bạn vẫn còn <strong>{unansweredCount} câu hỏi</strong> chưa điền đáp án. Thời gian còn lại: <strong>{formatTimer(secondsRemaining)}</strong>.</span>
                ) : (
                  <span>Bạn đã hoàn thành tất cả các câu hỏi. Bạn có chắc chắn muốn nộp bài để chấm điểm ngay?</span>
                )}
              </p>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Làm tiếp
                </button>
                <button
                  onClick={handleFinalSubmit}
                  className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Nộp bài ngay
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
