import React, { useState } from 'react';
import { 
  RotateCw, 
  RotateCcw, 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Check, 
  X, 
  Lightbulb, 
  ChevronRight, 
  ChevronLeft,
  ExternalLink,
  Award,
  HelpCircle,
  Sparkles,
  AlertTriangle,
  RotateCcw as ResetIcon
} from 'lucide-react';
import { CourseModule } from '../data/curriculumData';
import { CURRICULUM_LESSONS } from '../data/curriculumLessonsData';
import { TopicCardIllustration } from './TopicCardIllustration';

interface TopicFlashcardProps {
  module: CourseModule;
  isCompleted: boolean;
  onToggleComplete: (moduleId: string) => void;
  onOpenLessonModal: (module: CourseModule) => void;
}

export const TopicFlashcard: React.FC<TopicFlashcardProps> = ({
  module,
  isCompleted,
  onToggleComplete,
  onOpenLessonModal
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [frontTab, setFrontTab] = useState<'formulas' | 'mistakes' | 'example'>('formulas');

  const lesson = CURRICULUM_LESSONS[module.id];
  const lessonNumber = module.code.replace(/^[A-Z]+/, '');
  const exercises = lesson?.exercises || [];
  
  // Extract formulas / theory points
  const keyFormulas = lesson?.formulas && lesson.formulas.length > 0
    ? lesson.formulas
    : module.subtopics;

  const mistakes = module.mistakesToAvoid || [];
  const firstExample = lesson?.examples && lesson.examples.length > 0 ? lesson.examples[0] : null;

  const currentExercise = exercises[currentExIndex];
  const selectedAnswer = selectedAnswers[currentExIndex];
  const isAnswered = selectedAnswer !== undefined;
  const isCorrect = isAnswered && selectedAnswer === currentExercise?.correctAnswer;

  // Calculate score on back
  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = exercises.reduce((acc, ex, idx) => {
    return acc + (selectedAnswers[idx] === ex.correctAnswer ? 1 : 0);
  }, 0);
  const isAllAnswered = exercises.length > 0 && answeredCount === exercises.length;

  const handleSelectOption = (option: string) => {
    if (isAnswered) return; // Prevent changing after answer
    setSelectedAnswers(prev => ({
      ...prev,
      [currentExIndex]: option
    }));
  };

  const handleNextExercise = () => {
    if (currentExIndex < exercises.length - 1) {
      setCurrentExIndex(prev => prev + 1);
    }
  };

  const handlePrevExercise = () => {
    if (currentExIndex > 0) {
      setCurrentExIndex(prev => prev - 1);
    }
  };

  const handleResetExercises = () => {
    setSelectedAnswers({});
    setCurrentExIndex(0);
  };

  const percent = isCompleted ? 100 : 0;

  return (
    <div className="relative w-full h-[550px] perspective-1000 group">
      <div
        className={`w-full h-full relative transition-transform duration-700 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* MẶT TRƯỚC (FRONT): LÝ THUYẾT & GHI NHỚ TRỌNG TÂM                    */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        <div 
          className={`absolute inset-0 w-full h-full backface-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden ${
            isFlipped ? 'pointer-events-none' : ''
          }`}
        >
          {/* Top: Ảnh minh hoạ chuyên đề */}
          <div className="relative shrink-0 overflow-hidden">
            <TopicCardIllustration module={module} />

            {/* Quick complete button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete(module.id);
              }}
              className="absolute top-2.5 left-2.5 p-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 shadow-md hover:scale-110 active:scale-95 transition-transform cursor-pointer z-10"
              title={isCompleted ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}
            >
              {isCompleted ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
              ) : (
                <Circle className="h-5 w-5 text-slate-400 hover:text-slate-600 dark:text-slate-500" />
              )}
            </button>

            {/* Front Tag & Quick Flip Button */}
            <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full bg-slate-900/80 text-white border border-white/20 backdrop-blur-md shadow-xs uppercase tracking-wider">
                <BookOpen className="w-3 h-3 text-indigo-300" />
                Mặt 1: Lý thuyết
              </span>
              <button
                type="button"
                onClick={() => setIsFlipped(true)}
                className="p-1 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors shadow-xs cursor-pointer"
                title="Lật thẻ bài tập"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Middle: Tiêu đề & Nội dung Lý thuyết / Bẫy / Ví dụ */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between overflow-hidden">
            <div className="space-y-2.5">
              {/* Tên chuyên đề */}
              <div className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-950/80 dark:to-amber-900/40 border border-amber-300 dark:border-amber-700/80 flex items-center justify-center shrink-0 shadow-xs">
                  <BookOpen className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase leading-snug line-clamp-2">
                    BÀI {lessonNumber}: {module.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {module.chapter}
                  </p>
                </div>
              </div>

              {/* Tabs chuyển đổi: Ghi nhớ / Bẫy thi / Ví dụ mẫu */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setFrontTab('formulas')}
                  className={`flex-1 py-1 px-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    frontTab === 'formulas'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3 h-3 shrink-0" />
                  <span className="truncate">Ghi nhớ ({keyFormulas.length})</span>
                </button>

                {mistakes.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setFrontTab('mistakes')}
                    className={`flex-1 py-1 px-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      frontTab === 'mistakes'
                        ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-2xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    <AlertTriangle className="w-3 h-3 shrink-0" />
                    <span className="truncate">Bẫy điểm ({mistakes.length})</span>
                  </button>
                )}

                {firstExample && (
                  <button
                    type="button"
                    onClick={() => setFrontTab('example')}
                    className={`flex-1 py-1 px-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      frontTab === 'example'
                        ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-2xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    <Lightbulb className="w-3 h-3 shrink-0" />
                    <span className="truncate">Ví dụ</span>
                  </button>
                )}
              </div>

              {/* Hộp nội dung tương ứng theo Tab */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 min-h-[110px] max-h-[125px] overflow-y-auto pr-1">
                {frontTab === 'formulas' && (
                  <div className="space-y-1.5">
                    {keyFormulas.slice(0, 4).map((item, idx) => (
                      <div 
                        key={idx} 
                        className="text-[11px] text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-2 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-1.5 leading-relaxed font-mono"
                      >
                        <span className="text-indigo-500 font-bold shrink-0">•</span>
                        <span className="line-clamp-2">{item}</span>
                      </div>
                    ))}
                    {keyFormulas.length > 4 && (
                      <div className="text-[10px] text-slate-400 italic text-center pt-0.5">
                        + {keyFormulas.length - 4} quy tắc khác trong bài học chi tiết
                      </div>
                    )}
                  </div>
                )}

                {frontTab === 'mistakes' && (
                  <div className="space-y-1.5">
                    {mistakes.map((mistake, idx) => (
                      <div 
                        key={idx} 
                        className="text-[11px] text-amber-900 dark:text-amber-200 bg-amber-50/80 dark:bg-amber-950/40 px-2 py-1.5 rounded-xl border border-amber-200/80 dark:border-amber-800/60 flex items-start gap-1.5 leading-relaxed"
                      >
                        <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0">⚠️</span>
                        <span>{mistake}</span>
                      </div>
                    ))}
                  </div>
                )}

                {frontTab === 'example' && firstExample && (
                  <div className="space-y-1.5 text-[11px]">
                    <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>{firstExample.title}</span>
                    </div>
                    <div className="text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60 leading-relaxed font-mono line-clamp-3">
                      {firstExample.question}
                    </div>
                    <div className="text-[10px] text-slate-400 italic">
                      Lời giải chi tiết: {firstExample.solution.slice(0, 100)}...
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tiến độ và Nút lật sang bài tập vận dụng */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className={percent === 100 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}>
                    Tiến độ: {percent}%
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenLessonModal(module)}
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Bài giảng chi tiết</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      percent === 100 ? 'bg-emerald-500' : 'bg-transparent'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Nút LẬT THẺ sang mặt sau */}
              <button
                type="button"
                onClick={() => setIsFlipped(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
              >
                <RotateCw className="w-4 h-4" />
                <span>Lật sang bài tập vận dụng ({exercises.length} câu)</span>
              </button>
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════════════ */}
        {/* MẶT SAU (BACK): BÀI TẬP VẬN DỤNG TƯƠNG TÁC                         */}
        {/* ═════════════════════════════════════════════════════════════════════ */}
        <div 
          className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl border-2 border-indigo-400 dark:border-indigo-600 bg-gradient-to-b from-white via-slate-50 to-indigo-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/60 shadow-xl flex flex-col justify-between overflow-hidden p-4 sm:p-5 ${
            !isFlipped ? 'pointer-events-none' : ''
          }`}
        >
          {/* Header Mặt sau */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-indigo-600 text-white uppercase tracking-wider shadow-xs">
                Mặt 2: Bài tập vận dụng
              </span>
              {exercises.length > 0 && (
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                  Câu {currentExIndex + 1}/{exercises.length}
                </span>
              )}
            </div>

            {/* Nút lật về lý thuyết */}
            <button
              type="button"
              onClick={() => setIsFlipped(false)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Về lý thuyết</span>
            </button>
          </div>

          {/* Dải số câu hỏi nhanh [1] [2] [3] [4] [5] */}
          {exercises.length > 0 && (
            <div className="flex items-center gap-1.5 py-2 overflow-x-auto shrink-0">
              <span className="text-[10px] font-bold text-slate-400 mr-1 uppercase">Câu:</span>
              {exercises.map((ex, idx) => {
                const ans = selectedAnswers[idx];
                const answered = ans !== undefined;
                const isRight = answered && ans === ex.correctAnswer;
                const isActive = idx === currentExIndex;

                let pillColor = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
                if (answered) {
                  pillColor = isRight 
                    ? 'bg-emerald-500 text-white border-emerald-600 font-bold'
                    : 'bg-rose-500 text-white border-rose-600 font-bold';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentExIndex(idx)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center border transition-all cursor-pointer ${pillColor} ${
                      isActive ? 'ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-slate-900 scale-105' : 'hover:opacity-80'
                    }`}
                    title={`Câu ${idx + 1}${answered ? (isRight ? ' (Đúng)' : ' (Sai)') : ' (Chưa làm)'}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          )}

          {/* Body Mặt sau: Nội dung câu hỏi và các lựa chọn đáp án */}
          <div className="flex-1 flex flex-col justify-between py-2 overflow-hidden">
            {exercises.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center h-full p-4 space-y-3">
                <HelpCircle className="w-12 h-12 text-slate-400" />
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs leading-relaxed">
                  Chuyên đề này hiện đang cập nhật thêm bộ câu hỏi trắc nghiệm tương tác. Bạn có thể mở bài giảng chi tiết để xem toàn bộ dạng bài.
                </p>
                <button
                  type="button"
                  onClick={() => onOpenLessonModal(module)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
                >
                  Mở bài học chi tiết
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between space-y-2 overflow-hidden">
                {/* Đề bài */}
                <div className="bg-white dark:bg-slate-850 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs max-h-24 overflow-y-auto">
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                    {currentExercise.question}
                  </div>
                </div>

                {/* Danh sách 4 đáp án A, B, C, D */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                  {currentExercise.options?.map((opt, idx) => {
                    const isSelected = selectedAnswer === opt;
                    const isCorrectOpt = opt === currentExercise.correctAnswer;
                    
                    let btnClass = 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-400';
                    if (isAnswered) {
                      if (isCorrectOpt) {
                        btnClass = 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs';
                      } else if (isSelected) {
                        btnClass = 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs';
                      } else {
                        btnClass = 'bg-slate-100 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800 opacity-60';
                      }
                    }

                    const optLetter = String.fromCharCode(65 + idx);

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isAnswered}
                        onClick={() => handleSelectOption(opt)}
                        className={`p-2 rounded-xl border text-left text-xs flex items-center justify-between gap-1.5 transition-all cursor-pointer ${btnClass}`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-5 h-5 rounded-lg bg-black/10 dark:bg-white/10 text-[10px] font-black flex items-center justify-center shrink-0">
                            {optLetter}
                          </span>
                          <span className="truncate">{opt}</span>
                        </div>
                        {isAnswered && isCorrectOpt && <Check className="w-4 h-4 shrink-0 text-white" />}
                        {isAnswered && isSelected && !isCorrectOpt && <X className="w-4 h-4 shrink-0 text-white" />}
                      </button>
                    );
                  })}
                </div>

                {/* Lời giải chi tiết sau khi bấm trả lời */}
                {isAnswered && (
                  <div className={`p-2.5 rounded-xl border text-xs leading-relaxed animate-in fade-in duration-200 max-h-24 overflow-y-auto ${
                    isCorrect
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                      : 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                  }`}>
                    <div className="font-bold flex items-center gap-1.5 mb-1">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>Chính xác! Lời giải:</span>
                        </>
                      ) : (
                        <>
                          <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          <span>Giải thích chi tiết:</span>
                        </>
                      )}
                    </div>
                    <p className="text-[11px] opacity-90">{currentExercise.explanation}</p>
                  </div>
                )}

                {/* Banner hoàn thành khi làm xong toàn bộ câu hỏi */}
                {isAllAnswered && (
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between gap-2 animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      <div className="text-xs">
                        <span className="font-bold text-indigo-950 dark:text-indigo-200">
                          Kết quả: {correctCount}/{exercises.length} câu đúng
                        </span>
                        {correctCount >= 4 && !isCompleted && (
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            Xuất sắc! Bạn đã sẵn sàng hoàn thành chuyên đề này.
                          </div>
                        )}
                      </div>
                    </div>
                    {correctCount >= 4 && !isCompleted && (
                      <button
                        type="button"
                        onClick={() => onToggleComplete(module.id)}
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shrink-0 transition-colors shadow-xs cursor-pointer"
                      >
                        Đánh dấu xong
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Mặt sau: Chuyển câu & Lật lại */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentExIndex === 0}
                onClick={handlePrevExercise}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors cursor-pointer text-xs font-semibold"
                title="Câu trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={currentExIndex === exercises.length - 1}
                onClick={handleNextExercise}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1"
                title="Câu sau"
              >
                <span>Câu sau</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              {answeredCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetExercises}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors cursor-pointer text-xs"
                  title="Làm lại từ đầu"
                >
                  <ResetIcon className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Nút lật về mặt trước */}
            <button
              type="button"
              onClick={() => setIsFlipped(false)}
              className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-98"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xem lại lý thuyết</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
