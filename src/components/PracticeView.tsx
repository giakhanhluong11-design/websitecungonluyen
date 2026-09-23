import React, { useState, useEffect, useMemo } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  HelpCircle, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Flag, 
  ArrowRight, 
  BookOpen, 
  Award, 
  AlertTriangle,
  RefreshCw,
  Cpu,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SubjectId, Topic, TopicExercise, PracticeAttempt } from '../types';
import { LiteratureExam, MathExam, EnglishExam } from '../types/practiceExamTypes';
import { generateRandomLiteratureExam } from '../services/literatureExamGenerator';
import { generateRandomMathExam } from '../services/mathExamGenerator';
import { generateRandomEnglishExam } from '../services/englishExamGenerator';
import { LiteraturePracticeWorkspace } from './practice/LiteraturePracticeWorkspace';
import { MathPracticeWorkspace } from './practice/MathPracticeWorkspace';
import { EnglishPracticeWorkspace } from './practice/EnglishPracticeWorkspace';
import { ExamGeneratingOverlay } from './practice/ExamGeneratingOverlay';
import { 
  evaluateSingleAttempt, 
  calculateAggregatedCompetency, 
  SingleAssessmentResult, 
  AggregatedCompetencyResult 
} from '../services/competencyService';
import { CompetencyAssessmentBlock } from './CompetencyAssessmentBlock';
import { loadUserProgress } from '../data/userStorage';

interface PracticeViewProps {
  topics: Topic[];
  initialSubject?: SubjectId;
  initialTopicId?: string;
  onSavePracticeResult: (attempt: PracticeAttempt) => void;
  onReviewTopic: (topicId: string) => void;
  onOpenGeminiConfig?: () => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  topics,
  initialSubject = 'toan',
  initialTopicId = '',
  onSavePracticeResult,
  onReviewTopic,
  onOpenGeminiConfig
}) => {
  // Practice Mode: AI Full Exam (đề mới 100% chuẩn ma trận) vs Quick Exercise Quiz (bài tập chuyên đề)
  const [practiceMode, setPracticeMode] = useState<'ai_full_exam' | 'topic_quick_quiz'>('ai_full_exam');

  // Configuration state
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(initialSubject);
  const [selectedTopicId, setSelectedTopicId] = useState<string>(initialTopicId);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'de' | 'trung-binh' | 'kho' | 'all'>('all');
  const [questionCount, setQuestionCount] = useState<number>(5);

  // AI Exam Generation states
  const [isGeneratingExam, setIsGeneratingExam] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [activeLiteratureExam, setActiveLiteratureExam] = useState<LiteratureExam | null>(null);
  const [activeMathExam, setActiveMathExam] = useState<MathExam | null>(null);
  const [activeEnglishExam, setActiveEnglishExam] = useState<EnglishExam | null>(null);

  // Active quiz state (for topic_quick_quiz mode)
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);
  const [quizQuestions, setQuizQuestions] = useState<(TopicExercise & { topicId: string; topicName: string; subjectId: SubjectId })[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Result state
  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);
  const [finalAttempt, setFinalAttempt] = useState<PracticeAttempt | null>(null);
  const [quizAssessment, setQuizAssessment] = useState<SingleAssessmentResult | null>(null);
  const [historySummary, setHistorySummary] = useState<AggregatedCompetencyResult | null>(null);

  // Update initial subject/topic when passed from outside
  useEffect(() => {
    if (initialSubject) setSelectedSubject(initialSubject);
    if (initialTopicId) setSelectedTopicId(initialTopicId);
  }, [initialSubject, initialTopicId]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Filter topics for the dropdown
  const currentSubjectTopics = useMemo(() => {
    return topics.filter(t => t.subjectId === selectedSubject);
  }, [topics, selectedSubject]);

  // Bộ đệm nạp trước đề thi ở client để đổi đề tức thì
  const [prefetchedExams, setPrefetchedExams] = useState<{
    toan?: MathExam;
    van?: LiteratureExam;
    anh?: EnglishExam;
  }>({});
  const isPrefetchingRef = React.useRef(false);

  // Hàm nạp trước ngầm đề thi tiếp theo
  const prefetchNextExam = async (subject: SubjectId) => {
    if (isPrefetchingRef.current) return;
    isPrefetchingRef.current = true;
    try {
      if (subject === 'toan' && !prefetchedExams.toan) {
        const exam = await generateRandomMathExam('Chuẩn');
        if (exam) setPrefetchedExams(prev => ({ ...prev, toan: exam }));
      } else if (subject === 'van' && !prefetchedExams.van) {
        const exam = await generateRandomLiteratureExam();
        if (exam) setPrefetchedExams(prev => ({ ...prev, van: exam }));
      } else if (subject === 'anh' && !prefetchedExams.anh) {
        const exam = await generateRandomEnglishExam('Chuẩn');
        if (exam) setPrefetchedExams(prev => ({ ...prev, anh: exam }));
      }
    } catch {
      // Bỏ qua lỗi ngầm không ảnh hưởng trải nghiệm người dùng
    } finally {
      isPrefetchingRef.current = false;
    }
  };

  // Kích hoạt nạp trước ngầm sau khi học sinh mở đề bài
  useEffect(() => {
    if (activeMathExam || activeLiteratureExam || activeEnglishExam) {
      const timer = setTimeout(() => {
        prefetchNextExam(selectedSubject);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [activeMathExam?.id, activeLiteratureExam?.id, activeEnglishExam?.id, selectedSubject]);

  // Sinh đề AI hoàn toàn mới (Văn 7 câu 10đ, Toán 7 bài 10đ, Anh 40 câu 10đ)
  const handleStartAiExam = async () => {
    setIsGeneratingExam(true);

    // Kiểm tra và sử dụng đề nạp trước (Instant Swap - độ trễ chuyển đổi cực thấp)
    if (selectedSubject === 'toan' && prefetchedExams.toan) {
      const cached = prefetchedExams.toan;
      setPrefetchedExams(prev => ({ ...prev, toan: undefined }));
      setGenerationStep('Đã tải đề mới thành công! Đang chuyển đổi giao diện...');
      setTimeout(() => {
        setActiveMathExam(cached);
        setIsGeneratingExam(false);
        setGenerationStep('');
        // Nạp bù ngầm tiếp tục đề tiếp theo
        setTimeout(() => prefetchNextExam('toan'), 1500);
      }, 400);
      return;
    }

    if (selectedSubject === 'van' && prefetchedExams.van) {
      const cached = prefetchedExams.van;
      setPrefetchedExams(prev => ({ ...prev, van: undefined }));
      setGenerationStep('Đã tải đề mới thành công! Đang chuyển đổi giao diện...');
      setTimeout(() => {
        setActiveLiteratureExam(cached);
        setIsGeneratingExam(false);
        setGenerationStep('');
        setTimeout(() => prefetchNextExam('van'), 1500);
      }, 400);
      return;
    }

    if (selectedSubject === 'anh' && prefetchedExams.anh) {
      const cached = prefetchedExams.anh;
      setPrefetchedExams(prev => ({ ...prev, anh: undefined }));
      setGenerationStep('Đã tải đề mới thành công! Đang chuyển đổi giao diện...');
      setTimeout(() => {
        setActiveEnglishExam(cached);
        setIsGeneratingExam(false);
        setGenerationStep('');
        setTimeout(() => prefetchNextExam('anh'), 1500);
      }, 400);
      return;
    }

    setGenerationStep('Đang khởi tạo quy trình tạo đề ngẫu nhiên...');

    try {
      if (selectedSubject === 'van') {
        const exam = await generateRandomLiteratureExam((step) => {
          setGenerationStep(step);
        });
        setActiveLiteratureExam(exam);
      } else if (selectedSubject === 'toan') {
        const exam = await generateRandomMathExam('Chuẩn', (step) => {
          setGenerationStep(step);
        });
        setActiveMathExam(exam);
      } else {
        const exam = await generateRandomEnglishExam('Chuẩn', (step) => {
          setGenerationStep(step);
        });
        setActiveEnglishExam(exam);
      }
      // Khởi động nạp trước đề tiếp theo sau khi tạo xong
      setTimeout(() => prefetchNextExam(selectedSubject), 2000);
    } catch (err: any) {
      alert(`Lỗi khi tạo đề: ${err?.message || 'Vui lòng thử lại'}`);
    } finally {
      setIsGeneratingExam(false);
      setGenerationStep('');
    }
  };

  const handleFinishAiExamScore = (score: number) => {
    const subjectName = selectedSubject === 'toan' ? 'Toán' : selectedSubject === 'van' ? 'Ngữ văn' : 'Tiếng Anh';
    const attempt: PracticeAttempt = {
      id: `ai-exam-${Date.now()}`,
      title: `Đề Luyện Thi Chuẩn AI: Môn ${subjectName}`,
      subjectId: selectedSubject,
      date: new Date().toISOString().split('T')[0],
      score,
      totalQuestions: selectedSubject === 'van' ? 7 : selectedSubject === 'toan' ? 7 : 40,
      correctCount: Math.round((score / 10) * (selectedSubject === 'anh' ? 40 : 7)),
      wrongCount: (selectedSubject === 'anh' ? 40 : 7) - Math.round((score / 10) * (selectedSubject === 'anh' ? 40 : 7)),
      durationSpentSeconds: 3600,
      weakTopics: [],
      answers: {}
    };

    onSavePracticeResult(attempt);
    if (score >= 8.0) {
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch {}
    }
  };

  // Generate quick quiz questions from topic pool
  const handleStartQuiz = () => {
    let pool: (TopicExercise & { topicId: string; topicName: string; subjectId: SubjectId })[] = [];

    const targetTopics = selectedTopicId 
      ? topics.filter(t => t.id === selectedTopicId)
      : topics.filter(t => t.subjectId === selectedSubject);

    targetTopics.forEach(t => {
      t.exercises.forEach(e => {
        if (selectedDifficulty === 'all' || e.level === selectedDifficulty) {
          pool.push({
            ...e,
            topicId: t.id,
            topicName: t.title,
            subjectId: t.subjectId
          });
        }
      });
    });

    if (pool.length === 0) {
      targetTopics.forEach(t => {
        t.exercises.forEach(e => {
          pool.push({
            ...e,
            topicId: t.id,
            topicName: t.title,
            subjectId: t.subjectId
          });
        });
      });
    }

    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length));

    if (selected.length === 0) {
      alert('Chuyên đề này hiện đang cập nhật thêm bài tập. Vui lòng chọn chuyên đề khác!');
      return;
    }

    setQuizQuestions(selected);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setFlaggedQuestions({});
    setTimerSeconds(0);
    setIsTimerRunning(true);
    setIsQuizActive(true);
    setIsQuizFinished(false);
  };

  const handleSelectOption = (questionId: string, option: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleSubmitQuiz = () => {
    setIsTimerRunning(false);

    let correctCount = 0;
    const weakMap = new Map<string, { topicId: string; topicName: string; wrongCount: number }>();

    quizQuestions.forEach(q => {
      const ans = userAnswers[q.id];
      if (ans === q.correctAnswer) {
        correctCount++;
      } else {
        const existing = weakMap.get(q.topicId) || { topicId: q.topicId, topicName: q.topicName, wrongCount: 0 };
        existing.wrongCount++;
        weakMap.set(q.topicId, existing);
      }
    });

    const wrongCount = quizQuestions.length - correctCount;
    const rawScore = (correctCount / quizQuestions.length) * 10;
    const score = Math.round(rawScore * 10) / 10;
    const accuracy = Math.round((correctCount / quizQuestions.length) * 100);
    const weakTopicsList = Array.from(weakMap.values());

    const assessment = evaluateSingleAttempt({
      correctCount,
      totalQuestions: quizQuestions.length,
      subjectId: selectedSubject,
      weakTopics: weakTopicsList,
      questions: quizQuestions,
      userAnswers
    });
    setQuizAssessment(assessment);

    const topicTitle = selectedTopicId 
      ? topics.find(t => t.id === selectedTopicId)?.title || 'Chuyên đề'
      : `Tổng hợp ${selectedSubject === 'toan' ? 'Toán' : selectedSubject === 'van' ? 'Ngữ văn' : 'Tiếng Anh'}`;

    const attempt: PracticeAttempt = {
      id: `practice-${Date.now()}`,
      title: `Luyện tập: ${topicTitle}`,
      subjectId: selectedSubject,
      date: new Date().toISOString().split('T')[0],
      score,
      totalQuestions: quizQuestions.length,
      correctCount,
      wrongCount,
      durationSpentSeconds: timerSeconds,
      weakTopics: weakTopicsList,
      answers: userAnswers,
      accuracy,
      competencyLevel: assessment.competency.label,
      completedAt: new Date().toISOString()
    };

    setFinalAttempt(attempt);
    setIsQuizFinished(true);
    setIsQuizActive(false);
    onSavePracticeResult(attempt);

    try {
      const currentProgress = loadUserProgress();
      const combined = [
        ...currentProgress.practiceAttempts,
        ...currentProgress.examAttempts,
        attempt
      ];
      setHistorySummary(calculateAggregatedCompetency(combined));
    } catch {}

    if (score >= 8.0) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ================= WORKSPACE: ACTIVE AI EXAMS =================
  if (activeLiteratureExam) {
    return (
      <div className="relative">
        <LiteraturePracticeWorkspace
          exam={activeLiteratureExam}
          onExit={() => setActiveLiteratureExam(null)}
          onRegenerateNew={handleStartAiExam}
          onFinishScore={handleFinishAiExamScore}
          isRegenerating={isGeneratingExam}
          onOpenGeminiConfig={onOpenGeminiConfig}
        />
        {isGeneratingExam && (
          <ExamGeneratingOverlay
            subjectId="van"
            generationStep={generationStep}
            onCancel={() => setIsGeneratingExam(false)}
          />
        )}
      </div>
    );
  }

  if (activeMathExam) {
    return (
      <div className="relative">
        <MathPracticeWorkspace
          exam={activeMathExam}
          onExit={() => setActiveMathExam(null)}
          onRegenerateNew={handleStartAiExam}
          onFinishScore={handleFinishAiExamScore}
          isRegenerating={isGeneratingExam}
          onOpenGeminiConfig={onOpenGeminiConfig}
        />
        {isGeneratingExam && (
          <ExamGeneratingOverlay
            subjectId="toan"
            generationStep={generationStep}
            onCancel={() => setIsGeneratingExam(false)}
          />
        )}
      </div>
    );
  }

  if (activeEnglishExam) {
    return (
      <div className="relative">
        <EnglishPracticeWorkspace
          exam={activeEnglishExam}
          onExit={() => setActiveEnglishExam(null)}
          onRegenerateNew={handleStartAiExam}
          onFinishScore={handleFinishAiExamScore}
          isRegenerating={isGeneratingExam}
          onOpenGeminiConfig={onOpenGeminiConfig}
        />
        {isGeneratingExam && (
          <ExamGeneratingOverlay
            subjectId="anh"
            generationStep={generationStep}
            onCancel={() => setIsGeneratingExam(false)}
          />
        )}
      </div>
    );
  }

  // ================= MODAL / OVERLAY: GENERATING EXAM =================
  if (isGeneratingExam) {
    return (
      <ExamGeneratingOverlay
        subjectId={selectedSubject}
        generationStep={generationStep}
        onCancel={() => setIsGeneratingExam(false)}
      />
    );
  }

  // ================= RENDER 1: RESULT SCREEN =================
  if (isQuizFinished && finalAttempt) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-in fade-in duration-200">
        {quizAssessment ? (
          <CompetencyAssessmentBlock
            assessment={quizAssessment}
            historySummary={historySummary}
            examTitle={finalAttempt.title}
            durationText={formatSeconds(finalAttempt.durationSpentSeconds)}
            onReviewTopic={(topicName) => {
              const found = topics.find(t => t.title === topicName);
              if (found) onReviewTopic(found.id);
            }}
          />
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-6 sm:p-8 text-center shadow-md">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Kết quả bài luyện tập
            </h2>
            <div className="mt-4 text-4xl font-extrabold text-indigo-600">
              {finalAttempt.score} / 10 điểm
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              setIsQuizFinished(false);
              setIsQuizActive(false);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            Tùy chỉnh bài luyện mới
          </button>
          <button
            onClick={handleStartQuiz}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
          >
            <Play className="h-4 w-4 fill-white" />
            Làm lại bài này
          </button>
        </div>

        {/* Detailed Question Explanations */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Chi tiết đáp án & lời giải từng câu
          </h3>

          <div className="space-y-3">
            {quizQuestions.map((q, idx) => {
              const userAns = finalAttempt.answers[q.id];
              const isCorrect = userAns === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className={`rounded-xl border p-4 bg-white dark:bg-slate-900 shadow-2xs space-y-3 ${
                    isCorrect 
                      ? 'border-emerald-200 dark:border-emerald-950' 
                      : 'border-rose-200 dark:border-rose-950'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        Câu {idx + 1}:
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        [{q.topicName}]
                      </span>
                    </div>

                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                      isCorrect 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {isCorrect ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                      {isCorrect ? 'Đúng' : 'Sai'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                    {q.question}
                  </p>

                  {/* Options with highlight */}
                  {q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = userAns === opt;
                        const isKey = opt === q.correctAnswer;

                        let style = 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300';
                        if (isKey) {
                          style = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold dark:bg-emerald-950/80 dark:text-emerald-300';
                        } else if (isSelected && !isKey) {
                          style = 'border-rose-500 bg-rose-50 text-rose-800 font-semibold dark:bg-rose-950/80 dark:text-rose-300';
                        }

                        return (
                          <div 
                            key={oIdx}
                            className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${style}`}
                          >
                            <span className="font-bold uppercase text-[10px]">
                              {String.fromCharCode(65 + oIdx)}.
                            </span>
                            <span>{opt}</span>
                            {isKey && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 ml-auto shrink-0" />}
                            {isSelected && !isKey && <XCircle className="h-3.5 w-3.5 text-rose-600 ml-auto shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Explanation text */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs space-y-1">
                    <div className="font-bold text-emerald-700 dark:text-emerald-400">
                      Đáp án đúng: {q.correctAnswer}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ================= RENDER 2: ACTIVE QUIZ RUNNER =================
  if (isQuizActive && quizQuestions.length > 0) {
    const currentQ = quizQuestions[currentQuestionIndex];
    const isCurrentFlagged = !!flaggedQuestions[currentQ.id];
    const selectedOpt = userAnswers[currentQ.id];

    return (
      <div className="max-w-3xl mx-auto space-y-4 pb-16">
        {/* Top Quiz Header Bar */}
        <div className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 uppercase">
              Câu {currentQuestionIndex + 1} / {quizQuestions.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline-block">
              {currentQ.topicName}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
              <Clock className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>{formatSeconds(timerSeconds)}</span>
            </div>

            <button
              onClick={() => toggleFlag(currentQ.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                isCurrentFlagged
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Flag className={`h-3.5 w-3.5 ${isCurrentFlagged ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span className="hidden sm:inline-block">Chưa chắc chắn</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
            style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
          />
        </div>

        {/* Main Question Card */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                Câu hỏi {currentQuestionIndex + 1}:
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                (Mức độ: {currentQ.levelLabel})
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          {/* Options */}
          {currentQ.options && (
            <div className="space-y-2.5">
              {currentQ.options.map((option, oIdx) => {
                const isSelected = selectedOpt === option;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(currentQ.id, option)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-200 font-semibold shadow-2xs'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 hover:bg-slate-100/80 dark:bg-slate-800/40 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold uppercase transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                    }`}>
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span className="leading-snug">{option}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Navigation controls */}
        <div className="flex items-center justify-between gap-3">
          <button
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex(i => i - 1)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Câu trước
          </button>

          {/* Question quick jump dots */}
          <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto max-w-xs px-2">
            {quizQuestions.map((q, idx) => {
              const isAnswered = !!userAnswers[q.id];
              const isFlag = !!flaggedQuestions[q.id];
              const isCur = idx === currentQuestionIndex;

              let dotClass = 'bg-slate-200 dark:bg-slate-700 text-slate-600';
              if (isCur) dotClass = 'ring-2 ring-indigo-600 bg-indigo-600 text-white font-bold';
              else if (isFlag) dotClass = 'bg-amber-400 text-slate-900 font-bold';
              else if (isAnswered) dotClass = 'bg-emerald-500 text-white';

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`h-6 w-6 rounded-md text-[11px] flex items-center justify-center transition-all ${dotClass}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {currentQuestionIndex < quizQuestions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestionIndex(i => i + 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors dark:bg-indigo-600 dark:hover:bg-indigo-700"
            >
              Câu tiếp
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              id="submit-practice-quiz-btn"
              onClick={handleSubmitQuiz}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-colors"
            >
              <CheckCircle2 className="h-4 w-4" />
              Nộp bài
            </button>
          )}
        </div>
      </div>
    );
  }

  // ================= RENDER 3: PRACTICE CONFIGURATOR =================
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          Luyện Tập Tuyển Sinh 10
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Luyện đề thi tuyển sinh trọn vẹn hoặc rèn luyện theo từng chuyên đề trọng tâm
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60">
        <button
          type="button"
          onClick={() => setPracticeMode('ai_full_exam')}
          className={`flex items-center justify-center gap-2 py-3 px-4 min-h-[44px] rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-98 ${
            practiceMode === 'ai_full_exam'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Luyện Đề Thi Toàn Diện</span>
        </button>

        <button
          type="button"
          onClick={() => setPracticeMode('topic_quick_quiz')}
          className={`flex items-center justify-center gap-2 py-3 px-4 min-h-[44px] rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-98 ${
            practiceMode === 'topic_quick_quiz'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Luyện Theo Chuyên Đề</span>
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-6">
        {/* 1. Chọn Môn học */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            1. Chọn Môn học
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              id="practice-select-toan"
              onClick={() => {
                setSelectedSubject('toan');
                setSelectedTopicId('');
              }}
              className={`p-3.5 min-h-[56px] rounded-xl border text-xs sm:text-sm font-bold text-center transition-all flex flex-col items-center justify-center gap-1.5 active:scale-95 ${
                selectedSubject === 'toan'
                  ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 shadow-2xs'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className="text-base">📐</span>
              <span>Toán học</span>
            </button>

            <button
              id="practice-select-van"
              onClick={() => {
                setSelectedSubject('van');
                setSelectedTopicId('');
              }}
              className={`p-3.5 min-h-[56px] rounded-xl border text-xs sm:text-sm font-bold text-center transition-all flex flex-col items-center justify-center gap-1.5 active:scale-95 ${
                selectedSubject === 'van'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 shadow-2xs'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className="text-base">📖</span>
              <span>Ngữ văn</span>
            </button>

            <button
              id="practice-select-anh"
              onClick={() => {
                setSelectedSubject('anh');
                setSelectedTopicId('');
              }}
              className={`p-3.5 min-h-[56px] rounded-xl border text-xs sm:text-sm font-bold text-center transition-all flex flex-col items-center justify-center gap-1.5 active:scale-95 ${
                selectedSubject === 'anh'
                  ? 'border-amber-600 bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 shadow-2xs'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className="text-base">🇬🇧</span>
              <span>Tiếng Anh</span>
            </button>
          </div>
        </div>

        {/* NỘI DUNG THEO CHẾ ĐỘ 1: TẠO ĐỀ MỚI 100% */}
        {practiceMode === 'ai_full_exam' ? (
          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            {/* AI Grading badge & matrix banner */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 dark:from-purple-950/40 dark:via-indigo-950/40 dark:to-pink-950/30 border border-purple-200/80 dark:border-purple-900/60 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-purple-900 dark:text-purple-200">
                    Thẩm định & Chấm thi trực tiếp bằng Google Gemini AI
                  </p>
                  <p className="text-[11px] text-purple-700/80 dark:text-purple-300/80">
                    Barem điểm chi tiết theo ma trận tuyển sinh lớp 10 (GDPT 2018)
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-2">
              <div className="font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>Thông tin đề luyện tập:</span>
              </div>
              <ul className="space-y-1.5 pl-4 list-disc text-xs text-slate-600 dark:text-slate-400">
                {selectedSubject === 'van' && (
                  <>
                    <li><strong>Thời gian & thang điểm:</strong> 120 phút • 10.0 điểm. Đề thi gồm Đọc hiểu văn bản (3.0đ), Đoạn văn 200 chữ (2.0đ), Đọc hiểu nghị luận (1.0đ) và Bài văn NLXH (4.0đ).</li>
                    <li><strong>Chấm điểm AI chuẩn ma trận:</strong> AI phân tích từng luận điểm, dẫn chứng thực tế, nghệ thuật lập luận và chỉ ra lỗi diễn đạt cần khắc phục.</li>
                    <li><strong>Nhận xét tận tâm:</strong> Giám khảo AI đưa ra lời khuyên cụ thể giúp nâng cao kỹ năng hành văn và lập luận.</li>
                  </>
                )}
                {selectedSubject === 'toan' && (
                  <>
                    <li><strong>Thời gian & thang điểm:</strong> 120 phút • 10.0 điểm. Cấu trúc 7 bài toán tự luận chuẩn cấu trúc Sở GD&ĐT (đồ thị parabol, định lý Viète, toán thực tế, hình không gian và hình học phẳng 3 câu).</li>
                    <li><strong>Chấm từng bước giải:</strong> AI kiểm tra điều kiện, công thức, biến đổi số học và lý do hình học theo từng ý 0.25đ - 0.5đ.</li>
                    <li><strong>Công cụ hỗ trợ:</strong> Tích hợp bàn phím toán học chuyên dụng (căn bậc hai, số mũ, phân số, góc...).</li>
                  </>
                )}
                {selectedSubject === 'anh' && (
                  <>
                    <li><strong>Thời gian & thang điểm:</strong> 90 phút • 10.0 điểm gồm 40 câu hỏi trắc nghiệm & tự luận biến đổi câu.</li>
                    <li><strong>Chẩn đoán AI chuyên sâu:</strong> Tổng hợp các chuyên đề ngữ pháp học sinh bị mất điểm nhiều nhất và đưa ra chiến lược ôn tập thực tế.</li>
                  </>
                )}
              </ul>
            </div>

            <div className="pt-2">
              <button
                id="start-ai-practice-exam-btn"
                onClick={handleStartAiExam}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-500 py-3.5 px-6 min-h-[48px] text-sm font-bold text-white shadow-md shadow-indigo-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>Bắt đầu làm bài thi ({selectedSubject === 'toan' ? 'Môn Toán' : selectedSubject === 'van' ? 'Môn Ngữ văn' : 'Môn Tiếng Anh'})</span>
              </button>
            </div>
          </div>
        ) : (
          /* NỘI DUNG THEO CHẾ ĐỘ 2: LUYỆN TẬP THEO CHUYÊN ĐỀ TỪ NGÂN HÀNG */
          <div className="space-y-6 pt-2 border-t border-slate-100 dark:border-slate-800">
            {/* 2. Chọn Chuyên đề */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  2. Chọn Chuyên đề
                </label>
                <span className="text-[11px] text-slate-400">
                  ({currentSubjectTopics.length} chuyên đề khả dụng)
                </span>
              </div>

              <select
                id="practice-topic-dropdown"
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs sm:text-sm font-medium text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="">Tất cả chuyên đề môn {selectedSubject === 'toan' ? 'Toán' : selectedSubject === 'van' ? 'Văn' : 'Anh'}</option>
                {currentSubjectTopics.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.categoryLabel})
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Chọn Mức độ */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                3. Mức độ thử thách
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'all', label: 'Tất cả mức độ' },
                  { id: 'de', label: 'Cơ bản (Dễ)' },
                  { id: 'trung-binh', label: 'Vận dụng' },
                  { id: 'kho', label: 'Nâng cao (Khó)' }
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => setSelectedDifficulty(lvl.id as any)}
                    className={`py-2.5 px-3 min-h-[44px] rounded-xl border text-xs sm:text-sm font-semibold text-center transition-all active:scale-95 ${
                      selectedDifficulty === lvl.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300'
                        : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Chọn Số lượng câu */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                4. Số lượng câu hỏi
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((count) => (
                  <button
                    key={count}
                    onClick={() => setQuestionCount(count)}
                    className={`py-2.5 px-3 min-h-[44px] rounded-xl border text-xs sm:text-sm font-bold text-center transition-all active:scale-95 ${
                      questionCount === count
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {count} câu
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <div className="pt-2">
              <button
                id="start-practice-session-btn"
                onClick={handleStartQuiz}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 py-3.5 px-6 min-h-[48px] text-sm font-bold text-white shadow-md shadow-indigo-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <Play className="h-4 w-4 fill-white" />
                Bắt đầu làm bài luyện tập
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
