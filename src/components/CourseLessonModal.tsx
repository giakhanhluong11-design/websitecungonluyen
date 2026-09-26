import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  ArrowLeft,
  BookOpen, 
  Zap, 
  HelpCircle, 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  ChevronRight, 
  ChevronLeft,
  Check, 
  Eye, 
  Lightbulb,
  Play,
  Sparkles,
  Clock,
  Award,
  Flame,
  FileText
} from 'lucide-react';
import { CourseModule } from '../data/curriculumData';
import { CURRICULUM_LESSONS } from '../data/curriculumLessonsData';
import { ENGLISH_GRAMMAR_RULES } from '../data/englishGrammarData';
import { EnglishGrammarCard } from './EnglishGrammarCard';

interface TheorySectionItem {
  id: string;
  heading?: string;
  body: string;
}

function parseTheorySections(rawTheory: string): TheorySectionItem[] {
  if (!rawTheory) return [];
  const normalized = rawTheory.replace(/\r\n/g, '\n').trim();
  const rawBlocks = normalized.split(/\n\s*\n+/).map(b => b.trim()).filter(Boolean);

  const sections: TheorySectionItem[] = [];
  let currentHeading: string | undefined = undefined;
  let currentBodyLines: string[] = [];

  const flush = () => {
    if (currentHeading || currentBodyLines.length > 0) {
      sections.push({
        id: `sec-${sections.length}`,
        heading: currentHeading,
        body: currentBodyLines.join('\n').trim()
      });
      currentHeading = undefined;
      currentBodyLines = [];
    }
  };

  for (const block of rawBlocks) {
    const lines = block.split('\n');
    const firstLine = lines[0].trim();
    const isHeading = /^(?:[I|V|X]+\.|\d+\.)\s+/i.test(firstLine);

    if (isHeading) {
      flush();
      currentHeading = firstLine;
      if (lines.length > 1) {
        currentBodyLines.push(...lines.slice(1));
      }
    } else {
      currentBodyLines.push(block);
    }
  }
  flush();

  return sections.length > 0 ? sections : [{ id: 'sec-0', body: rawTheory }];
}

function cleanPresentation(text: string): string {
  if (!text) return '';
  return text
    // Remove opening chatter
    .replace(/^Chúng ta cùng [^\n]+\n+/i, '')
    .replace(/^Hướng dẫn [^\n]+\n+/i, '')
    .replace(/^Cùng trình bày [^\n]+\n+/i, '')
    // Remove "• Bước X: " or "- Bước X: " or "Bước X: "
    .replace(/^[•\-\*]?\s*Bước\s+\d+\s*:\s*/gim, '')
    .trim();
}

interface CourseLessonModalProps {
  module: CourseModule | null;
  modulesList?: CourseModule[];
  onSelectModule?: (mod: CourseModule) => void;
  onClose: () => void;
  isCompleted: boolean;
  onCompleteLesson: (moduleId: string) => void;
  onStartPractice?: (subjectId: string, topicId: string) => void;
}

const SECTIONS = [
  { id: 'theory' as const, label: 'Lý thuyết trọng tâm', shortLabel: 'Lý thuyết' },
  { id: 'formulas' as const, label: 'Công thức & Ghi nhớ', shortLabel: 'Công thức' },
  { id: 'exercises' as const, label: 'Bài tập tự luyện', shortLabel: 'Bài tập' },
  { id: 'mistakes' as const, label: 'Bẫy thi & Lỗi sai cần tránh', shortLabel: 'Lỗi sai' },
];

export const CourseLessonModal: React.FC<CourseLessonModalProps> = ({
  module,
  modulesList = [],
  onSelectModule,
  onClose,
  isCompleted,
  onCompleteLesson,
  onStartPractice
}) => {
  const [activeTab, setActiveTab] = useState<'theory' | 'formulas' | 'exercises' | 'mistakes'>('theory');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});
  const [hasReadTheory, setHasReadTheory] = useState<boolean>(isCompleted);

  // Reset tab when module changes
  useEffect(() => {
    setActiveTab('theory');
    setSelectedAnswers({});
    setShowExplanations({});
    setHasReadTheory(isCompleted);
  }, [module?.id, isCompleted]);

  // Handle keyboard navigation (Escape = close, ArrowLeft = prev, ArrowRight = next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const theorySections = useMemo(() => {
    if (!module) return [];
    const lesson = CURRICULUM_LESSONS[module.id];
    const rawTheory = lesson?.theory || module.description || '';
    return parseTheorySections(rawTheory);
  }, [module]);

  if (!module) return null;

  const lesson = CURRICULUM_LESSONS[module.id];

  // Find index in module list for Previous / Next navigation between modules
  const currentModuleIndex = modulesList.findIndex(m => m.id === module.id);
  const prevModule = currentModuleIndex > 0 ? modulesList[currentModuleIndex - 1] : null;
  const nextModule = currentModuleIndex >= 0 && currentModuleIndex < modulesList.length - 1 ? modulesList[currentModuleIndex + 1] : null;

  // Find current section index within the lesson
  const currentSectionIndex = SECTIONS.findIndex(s => s.id === activeTab);
  const canGoPrev = currentSectionIndex > 0 || !!prevModule;
  const canGoNext = currentSectionIndex < SECTIONS.length - 1 || !!nextModule;

  const handlePrev = () => {
    if (currentSectionIndex > 0) {
      setActiveTab(SECTIONS[currentSectionIndex - 1].id);
      // scroll content to top
      const container = document.getElementById('lesson-content-scroll');
      if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (prevModule && onSelectModule) {
      onSelectModule(prevModule);
      setActiveTab('mistakes');
    }
  };

  const handleNext = () => {
    if (currentSectionIndex < SECTIONS.length - 1) {
      setActiveTab(SECTIONS[currentSectionIndex + 1].id);
      // scroll content to top
      const container = document.getElementById('lesson-content-scroll');
      if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (nextModule && onSelectModule) {
      onSelectModule(nextModule);
      setActiveTab('theory');
    }
  };

  const exercises = lesson?.exercises || [];
  const answeredCount = exercises.filter(ex => selectedAnswers[ex.id] !== undefined).length;
  const allExercisesDone = exercises.length === 0 || answeredCount === exercises.length;
  const isEligibleToComplete = hasReadTheory && allExercisesDone;

  const handleSelectOption = (exerciseId: string, option: string) => {
    setSelectedAnswers(prev => ({ ...prev, [exerciseId]: option }));
  };

  const toggleExplanation = (exerciseId: string) => {
    setShowExplanations(prev => ({ ...prev, [exerciseId]: !prev[exerciseId] }));
  };

  const subjectBadgeColor = 
    module.subjectId === 'toan'
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800'
      : module.subjectId === 'van'
      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800';

  const subjectLabel = 
    module.subjectId === 'toan' ? 'Toán học 9' : module.subjectId === 'van' ? 'Ngữ văn 9' : 'Tiếng Anh 9';

  return (
    <div 
      id="course-lesson-fullscreen-window"
      className="fixed inset-0 z-50 flex flex-col w-screen h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 animate-in fade-in duration-200 overflow-hidden"
    >
      {/* Top Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Left: Back Button & Lesson Info */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            id="btn-back-to-curriculum"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer shrink-0"
            title="Quay lại danh sách khóa học (Esc)"
          >
            <ArrowLeft className="h-4 w-4 text-slate-600 dark:text-slate-300" />
            <span className="hidden sm:inline">Quay lại danh sách</span>
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block shrink-0" />

          {/* Breadcrumb / Title */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap text-[11px]">
              <span className={`font-black px-2 py-0.5 rounded-md uppercase tracking-wider border ${subjectBadgeColor}`}>
                {module.code} • {subjectLabel}
              </span>
              <span className="text-slate-500 dark:text-slate-400 truncate max-w-[150px] sm:max-w-[280px]">
                {module.chapter}
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
              {module.title}
            </h1>
          </div>
        </div>

        {/* Right: 2 Nút Tiến/Lùi trên Header + Trạng thái hoàn thành + Nút Đóng */}
        <div className="flex items-center gap-2 shrink-0">
          {/* 2 Nút Tiến / Lùi nhỏ gọn trên Header */}
          <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-700 rounded-xl p-1 bg-slate-50 dark:bg-slate-800">
            <button
              id="btn-header-prev"
              onClick={handlePrev}
              disabled={!canGoPrev}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                canGoPrev
                  ? 'text-slate-700 hover:bg-white dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer shadow-2xs'
                  : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
              }`}
              title={currentSectionIndex > 0 ? `Lùi về: ${SECTIONS[currentSectionIndex - 1].label}` : prevModule ? `Bài trước: ${prevModule.code}` : 'Đã ở phần đầu'}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden md:inline">Lùi</span>
            </button>

            <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 px-1.5">
              {currentSectionIndex + 1}/{SECTIONS.length}
            </span>

            <button
              id="btn-header-next"
              onClick={handleNext}
              disabled={!canGoNext}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                canGoNext
                  ? 'text-indigo-600 hover:bg-white dark:text-indigo-400 dark:hover:bg-slate-700 cursor-pointer shadow-2xs'
                  : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
              }`}
              title={currentSectionIndex < SECTIONS.length - 1 ? `Tiến sang: ${SECTIONS[currentSectionIndex + 1].label}` : nextModule ? `Bài tiếp theo: ${nextModule.code}` : 'Đã hoàn thành bài'}
            >
              <span className="hidden md:inline">Tiến</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Trạng thái / Tiêu chí hoàn thành (Không cho bấm ảo) */}
          {isCompleted ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-400 dark:border-emerald-800 shadow-2xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Đã hoàn thành</span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <span className={hasReadTheory ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400"}>
                {hasReadTheory ? "✓ Lý thuyết" : "○ Lý thuyết"}
              </span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className={allExercisesDone ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400"}>
                {allExercisesDone ? `✓ Bài tập (${answeredCount}/${exercises.length})` : `○ Bài tập (${answeredCount}/${exercises.length})`}
              </span>
            </div>
          )}

          {/* Practice Action */}
          {onStartPractice && (
            <button
              onClick={() => {
                onClose();
                onStartPractice(module.subjectId, module.id);
              }}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-xs cursor-pointer transition-all"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Luyện đề thi</span>
            </button>
          )}

          {/* Close Window */}
          <button
            id="btn-close-lesson-window"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Đóng cửa sổ"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main Reading & Interactive Area (No Sidebar - Full Screen Immersion) */}
      <main 
        id="lesson-content-scroll"
        className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 dark:bg-slate-950"
      >
        <div className="max-w-4xl mx-auto space-y-6 pb-24">
          {/* TAB 1: LÝ THUYẾT TRỌNG TÂM */}
          {activeTab === 'theory' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Tiêu đề của bài: chữ lớn độc lập ở phần đầu tiên, không đặt trong card bo góc, không thêm gì khác */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight pt-1 pb-1 break-words">
                {module.title}
              </h1>



              {/* Tách đoạn các kiến thức sao cho dễ nhìn và mỗi phần cho vào một card bo góc */}
              {theorySections.map((sec, idx) => (
                <div 
                  key={sec.id || idx}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5"
                >
                  {sec.heading && (
                    <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="h-5 w-1 bg-indigo-600 dark:bg-indigo-400 rounded-full shrink-0" />
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white break-words">
                        {sec.heading}
                      </h3>
                    </div>
                  )}
                  <div className="text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal break-words">
                    {sec.body}
                  </div>
                </div>
              ))}

              {/* Nút xác nhận đã đọc xong lý thuyết */}
              <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                <div className="text-xs sm:text-sm text-indigo-950 dark:text-indigo-200">
                  <div className="font-bold flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Bước 1: Nắm vững lý thuyết chuyên đề</span>
                  </div>
                  <p className="mt-0.5 text-slate-600 dark:text-slate-400 text-xs">
                    Sau khi đọc xong các định nghĩa và quy tắc, hãy bấm xác nhận để chuyển sang bài tập tự luyện.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setHasReadTheory(true);
                    setActiveTab('exercises');
                    const container = document.getElementById('lesson-content-scroll');
                    if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer shrink-0 flex items-center gap-1.5 active:scale-95"
                >
                  <span>✓ Đã đọc xong lý thuyết → Làm bài tập</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CÔNG THỨC & GHI NHỚ - BẢNG CÔNG THỨC RÕ RÀNG HOẶC FLASHCARD NGỮ PHÁP TIẾNG ANH */}
          {activeTab === 'formulas' && (
            <div className="space-y-6 animate-in fade-in">
              {module.subjectId === 'anh' && ENGLISH_GRAMMAR_RULES[module.id] && ENGLISH_GRAMMAR_RULES[module.id].length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-2">
                        <Zap className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                        Hệ thống cấu trúc & công thức ngữ pháp trực quan ({ENGLISH_GRAMMAR_RULES[module.id].length} điểm ngữ pháp)
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Cấu trúc phân mục: <span className="font-semibold text-sky-600 dark:text-sky-400">💡 USE</span> • <span className="font-semibold text-rose-600 dark:text-rose-400">📝 FORM</span> • <span className="font-semibold text-amber-600 dark:text-amber-400">🏷️ SIGNAL WORDS</span> • <span className="font-semibold text-indigo-600 dark:text-indigo-400">✨ EXAMPLES</span> • <span className="font-semibold text-red-600 dark:text-red-400">⚠️ COMMON MISTAKES</span>
                      </p>
                    </div>
                    <span className="text-xs text-slate-400 font-semibold shrink-0">Phần 2 / 4</span>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {ENGLISH_GRAMMAR_RULES[module.id].map((rule, rIdx) => (
                      <EnglishGrammarCard key={rule.id || rIdx} rule={rule} index={rIdx} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                        <Zap className="h-4 w-4 shrink-0" />
                        Bảng công thức ghi nhớ
                      </h3>
                    </div>
                    <span className="text-xs text-slate-400 font-semibold shrink-0">Phần 2 / 4</span>
                  </div>

                  {lesson?.formulas && lesson.formulas.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            <th scope="col" className="py-3 px-3 sm:px-4 text-center w-14 sm:w-16 font-bold">
                              STT
                            </th>
                            <th scope="col" className="py-3 px-4 font-bold">
                              Công thức & Quy tắc
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs sm:text-sm">
                          {lesson.formulas.map((formula, idx) => (
                            <tr 
                              key={idx}
                              className="hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-colors"
                            >
                              {/* Thứ tự 1, 2, 3 được căn giữa */}
                              <td className="py-3.5 px-3 sm:px-4 text-center align-middle font-bold text-slate-700 dark:text-slate-300">
                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-black text-indigo-600 dark:text-indigo-400">
                                  {idx + 1}
                                </span>
                              </td>

                              {/* Công thức nằm ở trong ô, font rõ ràng */}
                              <td className="py-3.5 px-4 align-middle">
                                <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/80 dark:bg-slate-950/60 font-mono text-xs sm:text-sm font-semibold text-slate-900 dark:text-indigo-200 leading-relaxed break-words">
                                  {formula}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500 p-6 text-center">
                      Chuyên đề này chú trọng vào các kỹ năng đọc hiểu và lập luận ngữ văn. Hãy xem kỹ phần lý thuyết và bài tập.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BÀI TẬP TỰ LUYỆN TẠI CHỖ */}
          {activeTab === 'exercises' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    3. Bài tập tự luyện kiểm tra năng lực tức thì ({lesson?.exercises?.length || 5} câu)
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">Phần 3 / 4</span>
                </div>

                {lesson?.exercises && lesson.exercises.length > 0 ? (
                  <div className="space-y-4">
                    {lesson.exercises.map((ex, idx) => {
                      const isAnswered = !!selectedAnswers[ex.id];
                      const isCorrect = selectedAnswers[ex.id] === ex.correctAnswer;
                      const showExp = showExplanations[ex.id];

                      return (
                        <div 
                          key={ex.id}
                          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 p-5 space-y-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="rounded-md bg-indigo-600 px-2 py-0.5 text-xs font-bold text-white uppercase">
                                Câu {idx + 1}
                              </span>
                              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                [{ex.levelLabel}]
                              </span>
                            </div>

                            {isAnswered && (
                              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                                isCorrect
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              }`}>
                                {isCorrect ? 'Chính xác ✓' : 'Chưa đúng ✕'}
                              </span>
                            )}
                          </div>

                          <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white break-words">
                            {ex.question}
                          </p>

                          {/* Options */}
                          {ex.options && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                              {ex.options.map((opt, optIdx) => {
                                const isSelected = selectedAnswers[ex.id] === opt;
                                const isThisCorrect = opt === ex.correctAnswer;

                                let btnClasses = 'border-slate-200 bg-white hover:border-indigo-300 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300';

                                if (isAnswered) {
                                  if (isThisCorrect) {
                                    btnClasses = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold dark:bg-emerald-950/60 dark:text-emerald-300';
                                  } else if (isSelected && !isCorrect) {
                                    btnClasses = 'border-rose-500 bg-rose-50 text-rose-800 font-bold dark:bg-rose-950/60 dark:text-rose-300';
                                  }
                                } else if (isSelected) {
                                  btnClasses = 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold dark:bg-indigo-950/60 dark:text-indigo-300';
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    onClick={() => handleSelectOption(ex.id, opt)}
                                    className={`flex items-center gap-2.5 p-3.5 text-left rounded-xl border text-xs sm:text-sm transition-all cursor-pointer ${btnClasses}`}
                                  >
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-bold">
                                      {String.fromCharCode(65 + optIdx)}
                                    </span>
                                    <span className="flex-1">{opt}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {/* Nút hiện đáp án: ngay dưới câu hỏi, chữ màu trắng, có biểu tượng con mắt kế bên trái */}
                          <div className="pt-2">
                            <button
                              id={`btn-toggle-exercise-${ex.id}`}
                              onClick={() => toggleExplanation(ex.id)}
                              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
                            >
                              <Eye className="h-4 w-4 text-white shrink-0" />
                              <span className="text-white font-bold">{showExp ? 'Ẩn đáp án' : 'Hiện đáp án'}</span>
                            </button>
                          </div>

                          {showExp && (
                            <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/40 text-xs sm:text-sm text-indigo-950 dark:text-indigo-200 leading-relaxed font-mono space-y-2.5 animate-in fade-in">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs uppercase text-indigo-700 dark:text-indigo-300">Đáp án chính xác:</span>
                                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white font-black text-xs">
                                  {ex.correctAnswer}
                                </span>
                              </div>
                              <div>
                                <span className="font-bold">Hướng dẫn giải chi tiết:</span>
                                <p className="mt-1 text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-sans">{ex.explanation}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    Chưa có câu hỏi cho phần này.
                  </div>
                )}

                {/* Completion Box in Exercises Tab */}
                {isCompleted ? (
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between gap-3">
                    <div className="text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span><strong>Bạn đã hoàn thành chuyên đề này!</strong> Toàn bộ bài tập đã được ghi nhận.</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 text-white shadow-lg space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="font-black text-sm sm:text-base flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-amber-300" />
                          <span>Điều kiện hoàn thành chuyên đề</span>
                        </div>
                        <div className="text-xs text-indigo-100 mt-1 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span>{hasReadTheory ? '✓' : '○'} Đọc hết lý thuyết:</span>
                            <strong className={hasReadTheory ? 'text-emerald-300 font-bold' : 'text-amber-200'}>
                              {hasReadTheory ? 'Đã hoàn tất' : 'Chưa xác nhận đọc'}
                            </strong>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span>{allExercisesDone ? '✓' : '○'} Làm bài tập tự luyện:</span>
                            <strong className={allExercisesDone ? 'text-emerald-300 font-bold' : 'text-amber-200'}>
                              {allExercisesDone ? `Đã làm đủ ${exercises.length}/${exercises.length} câu` : `Còn ${exercises.length - answeredCount} câu chưa làm`}
                            </strong>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 w-full sm:w-auto">
                        {isEligibleToComplete ? (
                          <button
                            type="button"
                            onClick={() => onCompleteLesson(module.id)}
                            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                          >
                            <Flame className="w-4 h-4 text-orange-600 fill-orange-600 animate-pulse" />
                            <span>Xác nhận hoàn thành & Nhận Streak 🔥</span>
                          </button>
                        ) : !hasReadTheory ? (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab('theory');
                              const container = document.getElementById('lesson-content-scroll');
                              if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors cursor-pointer"
                          >
                            Quay lại đọc lý thuyết
                          </button>
                        ) : (
                          <div className="text-[11px] text-amber-200 font-semibold bg-black/20 px-3 py-2 rounded-xl text-center">
                            Trả lời đủ {exercises.length} câu để hoàn tất
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: LỖI SAI CẦN TRÁNH TRONG ĐỀ THI */}
          {activeTab === 'mistakes' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    4. Bẫy điểm liệt & Lỗi sai thường gặp khi làm bài thi vào 10
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">Phần 4 / 4</span>
                </div>

                <div className="space-y-3">
                  {module.mistakesToAvoid.map((mistake, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200 font-bold text-xs mt-0.5">
                        !
                      </span>
                      <p className="text-xs sm:text-sm text-amber-950 dark:text-amber-200 leading-relaxed break-words">
                        {mistake}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Completion Action Box */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-extrabold text-base sm:text-lg">
                    {isCompleted ? 'Bạn đã hoàn thành bài học này! 🎉' : isEligibleToComplete ? 'Đã đủ điều kiện hoàn thành bài học! 🔥' : 'Tiến trình hoàn thành bài học'}
                  </h4>
                  <p className="text-xs sm:text-sm opacity-90 mt-1">
                    {isCompleted
                      ? 'Tiến độ chuyên đề đã được lưu vào hệ thống và chuỗi học tập của bạn.'
                      : isEligibleToComplete
                      ? 'Bạn đã đọc hết lý thuyết và trả lời đầy đủ các bài tập tự luyện.'
                      : `Điều kiện: Đọc lý thuyết (${hasReadTheory ? '✓ Xong' : 'Chưa xong'}) và làm bài tập (${answeredCount}/${exercises.length} câu).`}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {!isCompleted && isEligibleToComplete && (
                    <button
                      type="button"
                      onClick={() => onCompleteLesson(module.id)}
                      className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                    >
                      <Flame className="w-4 h-4 text-orange-600 fill-orange-600 animate-pulse" />
                      <span>Hoàn thành & Nhận Streak 🔥</span>
                    </button>
                  )}

                  {nextModule && (
                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectModule) {
                          onSelectModule(nextModule);
                          setActiveTab('theory');
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-white font-bold text-xs border border-emerald-400/40 transition-all cursor-pointer"
                    >
                      Sang bài tiếp theo: {nextModule.code} →
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* STICKY BOTTOM ACTION BAR: 2 Nút Tiến Lùi Trước Sau nổi bật */}
      <footer className="sticky bottom-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-lg">
        {/* Nút Lùi (Trước) */}
        <button
          id="btn-nav-prev"
          onClick={handlePrev}
          disabled={!canGoPrev}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
            canGoPrev
              ? 'bg-white text-slate-800 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-700 shadow-xs cursor-pointer active:scale-95'
              : 'opacity-40 bg-slate-100 text-slate-400 border-transparent dark:bg-slate-800/40 dark:text-slate-600 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>
            {currentSectionIndex > 0 
              ? `Trước: ${SECTIONS[currentSectionIndex - 1].shortLabel}` 
              : prevModule 
              ? `Bài trước: ${prevModule.code}` 
              : 'Phần đầu'}
          </span>
        </button>

        {/* Chỉ số ở giữa */}
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center">
          <div className="flex items-center gap-1.5">
            {SECTIONS.map((sec, idx) => (
              <button
                key={sec.id}
                onClick={() => setActiveTab(sec.id)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentSectionIndex
                    ? 'w-6 bg-indigo-600 dark:bg-indigo-400'
                    : idx < currentSectionIndex
                    ? 'w-2 bg-emerald-500'
                    : 'w-2 bg-slate-300 dark:bg-slate-700'
                }`}
                title={`${idx + 1}. ${sec.label}`}
              />
            ))}
          </div>
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">
            Phần {currentSectionIndex + 1}/{SECTIONS.length}: <strong className="text-indigo-600 dark:text-indigo-400">{SECTIONS[currentSectionIndex].label}</strong>
          </span>
        </div>

        {/* Nút Tiến (Sau) */}
        <button
          id="btn-nav-next"
          onClick={handleNext}
          disabled={!canGoNext}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            canGoNext
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md cursor-pointer active:scale-95'
              : 'opacity-40 bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
          }`}
        >
          <span>
            {currentSectionIndex < SECTIONS.length - 1 
              ? `Tiếp: ${SECTIONS[currentSectionIndex + 1].shortLabel}` 
              : nextModule 
              ? `Sang bài: ${nextModule.code}` 
              : 'Hoàn thành bài'}
          </span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </footer>
    </div>
  );
};
