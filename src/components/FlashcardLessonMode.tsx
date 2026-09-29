import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, ArrowLeft, ChevronLeft, ChevronRight, Eye, CheckCircle2, AlertTriangle, Sparkles, Flame, Check
} from 'lucide-react';
import { CourseModule } from '../data/curriculumData';
import { CURRICULUM_LESSONS } from '../data/curriculumLessonsData';
import { ENGLISH_GRAMMAR_RULES } from '../data/englishGrammarData';
import { TopicExercise } from '../types';
import { useProgressStore } from '../store/useProgressStore';

interface FlashcardLessonModeProps {
  module: CourseModule;
  modulesList?: CourseModule[];
  onSelectModule?: (mod: CourseModule) => void;
  onClose: () => void;
  isCompleted: boolean;
  onCompleteLesson: (moduleId: string) => void;
}

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

interface FlashcardData {
  id: string;
  title: string;
  frontContent: React.ReactNode;
  exercises: TopicExercise[];
}

export const FlashcardLessonMode: React.FC<FlashcardLessonModeProps> = ({
  module,
  modulesList = [],
  onSelectModule,
  onClose,
  isCompleted,
  onCompleteLesson
}) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});
  const [viewedCards, setViewedCards] = useState<Set<number>>(new Set([0]));

  const handleUpdateTopicProgress = useProgressStore((state) => state.handleUpdateTopicProgress);

  const lesson = CURRICULUM_LESSONS[module.id];

  // Reset state on module change
  useEffect(() => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setSelectedAnswers({});
    setShowExplanations({});
    setViewedCards(isCompleted ? new Set() : new Set([0]));
  }, [module.id, isCompleted]);

  // Update viewed cards
  useEffect(() => {
    if (!isCompleted) {
      setViewedCards(prev => {
        const next = new Set(prev);
        next.add(currentCardIndex);
        return next;
      });
    }
  }, [currentCardIndex, isCompleted]);

  // Prepare flashcards data
  const flashcards: FlashcardData[] = useMemo(() => {
    let cards: FlashcardData[] = [];
    const allExercises = lesson?.exercises || [];

    if (module.subjectId === 'anh' && ENGLISH_GRAMMAR_RULES[module.id]) {
      cards = ENGLISH_GRAMMAR_RULES[module.id].map((rule, idx) => ({
        id: rule.id || `rule-${idx}`,
        title: `${rule.title} ${rule.subtitle || ''}`,
        frontContent: (
          <div className="space-y-4 text-sm sm:text-base">
            {rule.form && (
              <div className="bg-rose-50 dark:bg-rose-950/30 p-3 rounded-xl border border-rose-100 dark:border-rose-900/50">
                <span className="font-bold text-rose-700 dark:text-rose-400 block mb-1">📝 Cấu trúc:</span>
                <div className="whitespace-pre-line text-slate-800 dark:text-slate-200 font-mono text-sm">{rule.form}</div>
              </div>
            )}
            {rule.use && (
              <div>
                <span className="font-bold text-sky-700 dark:text-sky-400">💡 Cách dùng: </span>
                <span className="text-slate-700 dark:text-slate-300">{rule.use}</span>
              </div>
            )}
            {rule.signalWords && (
              <div>
                <span className="font-bold text-amber-700 dark:text-amber-400">🏷️ Dấu hiệu: </span>
                <span className="text-slate-700 dark:text-slate-300">{rule.signalWords}</span>
              </div>
            )}
            {rule.examples && rule.examples.length > 0 && (
              <div>
                <span className="font-bold text-indigo-700 dark:text-indigo-400">✨ Ví dụ: </span>
                <ul className="list-disc pl-5 mt-1 text-slate-700 dark:text-slate-300">
                  {rule.examples.map((ex, i) => <li key={i}>{ex}</li>)}
                </ul>
              </div>
            )}
          </div>
        ),
        exercises: []
      }));
    } else {
      const theorySections = parseTheorySections(lesson?.theory || module.description || '');
      cards = theorySections.map((sec, idx) => ({
        id: sec.id || `sec-${idx}`,
        title: sec.heading || 'Lý thuyết trọng tâm',
        frontContent: (
          <div className="text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {sec.body}
            {/* For Math, we can inject formulas if they exist on the first card */}
            {idx === 0 && module.subjectId === 'toan' && lesson?.formulas && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <span className="font-bold text-indigo-700 dark:text-indigo-400 block mb-2">📌 Công thức & Ghi nhớ:</span>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300 font-mono text-xs sm:text-sm">
                  {lesson.formulas.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            )}
          </div>
        ),
        exercises: []
      }));
    }

    // Distribute exercises to cards
    if (cards.length > 0 && allExercises.length > 0) {
      const exercisesPerCard = Math.ceil(allExercises.length / cards.length);
      allExercises.forEach((ex, idx) => {
        const cardIndex = Math.min(Math.floor(idx / exercisesPerCard), cards.length - 1);
        cards[cardIndex].exercises.push(ex);
      });
    }

    return cards;
  }, [module.id, module.subjectId, module.description, lesson]);

  const totalCards = flashcards.length;
  const currentCard = flashcards[currentCardIndex];

  // Navigation
  const currentModuleIndex = modulesList.findIndex(m => m.id === module.id);
  const prevModule = currentModuleIndex > 0 ? modulesList[currentModuleIndex - 1] : null;
  const nextModule = currentModuleIndex >= 0 && currentModuleIndex < modulesList.length - 1 ? modulesList[currentModuleIndex + 1] : null;

  const canGoPrev = currentCardIndex > 0 || !!prevModule;
  const canGoNext = currentCardIndex < totalCards - 1 || !!nextModule;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setIsFlipped(false);
    } else if (prevModule && onSelectModule) {
      onSelectModule(prevModule);
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    } else if (nextModule && onSelectModule) {
      onSelectModule(nextModule);
    }
  };

  // Keyboard and swipe support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentCardIndex, totalCards, prevModule, nextModule, onClose]);

  // Touch handlers for swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) handleNext();
    if (diff < -50) handlePrev();
    setTouchStart(null);
  };

  // Progress logic
  const allExercises = lesson?.exercises || [];
  const answeredCount = allExercises.filter(ex => selectedAnswers[ex.id] !== undefined).length;
  const viewedCount = isCompleted ? totalCards : viewedCards.size;
  const theoryProgress = totalCards > 0 ? (viewedCount / totalCards) * 100 : 100;
  const exercisesProgress = allExercises.length > 0 ? (answeredCount / allExercises.length) * 100 : 100;
  const currentProgress = isCompleted ? 100 : Math.round((theoryProgress + exercisesProgress) / 2);
  const isEligibleToComplete = currentProgress === 100;

  useEffect(() => {
    if (module.id && currentProgress > 0) {
      handleUpdateTopicProgress(module.id, currentProgress);
    }
  }, [currentProgress, module.id, handleUpdateTopicProgress]);

  const handleSelectOption = (e: React.MouseEvent, exerciseId: string, option: string) => {
    e.stopPropagation();
    setSelectedAnswers(prev => ({ ...prev, [exerciseId]: option }));
  };

  const toggleExplanation = (e: React.MouseEvent, exerciseId: string) => {
    e.stopPropagation();
    setShowExplanations(prev => ({ ...prev, [exerciseId]: !prev[exerciseId] }));
  };

  const subjectBadgeColor = 
    module.subjectId === 'toan'
      ? 'bg-blue-100 text-blue-800 border-blue-200'
      : 'bg-amber-100 text-amber-800 border-amber-200';

  return (
    <div className="fixed inset-0 z-50 flex flex-col w-screen h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 animate-in fade-in duration-200 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 dark:border-slate-700 text-xs font-bold transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Quay lại</span>
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px]">
              <span className={`font-black px-2 py-0.5 rounded-md uppercase border ${subjectBadgeColor}`}>
                {module.code}
              </span>
            </div>
            <h1 className="text-sm font-bold truncate mt-0.5">{module.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isCompleted ? (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              <span>Đã hoàn thành</span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              Tiến độ: {currentProgress}%
            </div>
          )}
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main Content - Flashcard */}
      <main 
        className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden relative perspective-1000"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="text-center mb-6 z-10 shrink-0">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
            Thẻ {currentCardIndex + 1} / {totalCards}
          </p>
          <div className="flex gap-1 justify-center">
            {flashcards.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all ${idx === currentCardIndex ? 'w-8 bg-indigo-600' : idx < currentCardIndex ? 'w-3 bg-emerald-500' : 'w-3 bg-slate-300 dark:bg-slate-700'}`}
              />
            ))}
          </div>
        </div>

        {currentCard && (
          <div 
            className="relative w-full max-w-3xl flex-1 max-h-[70vh] cursor-pointer group"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div 
              className={`absolute inset-0 w-full h-full transition-transform duration-500 shadow-xl rounded-3xl preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
            >
              {/* Mặt trước: Lý thuyết */}
              <div className="absolute inset-0 w-full h-full backface-hidden bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-indigo-900/50 rounded-3xl p-6 sm:p-8 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                  <h2 className="text-xl sm:text-2xl font-black text-indigo-700 dark:text-indigo-400">
                    {currentCard.title}
                  </h2>
                  <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold shrink-0 hidden sm:block">Lý thuyết</span>
                </div>
                <div className="flex-1 overflow-y-auto pb-4 hide-scrollbar">
                  {currentCard.frontContent}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400 font-medium shrink-0 animate-pulse">
                  Bấm để lật thẻ → Bài tập áp dụng
                </div>
              </div>

              {/* Mặt sau: Bài tập */}
              <div className="absolute inset-0 w-full h-full backface-hidden bg-white dark:bg-slate-900 border-2 border-emerald-100 dark:border-emerald-900/50 rounded-3xl p-6 sm:p-8 flex flex-col overflow-hidden rotate-y-180">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                  <h2 className="text-xl font-black text-emerald-700 dark:text-emerald-400">
                    Bài tập áp dụng
                  </h2>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold shrink-0 hidden sm:block">Thực hành</span>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-4 pb-4 hide-scrollbar" onClick={(e) => e.stopPropagation()}>
                  {currentCard.exercises.length > 0 ? currentCard.exercises.map((ex, idx) => {
                    const isAnswered = !!selectedAnswers[ex.id];
                    const isCorrect = selectedAnswers[ex.id] === ex.correctAnswer;
                    const showExp = showExplanations[ex.id];

                    return (
                      <div key={ex.id} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-start mb-3">
                          <span className="font-bold text-sm bg-slate-200 dark:bg-slate-700 px-2.5 py-1 rounded-lg">Câu {idx + 1}</span>
                          {isAnswered && (
                            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                              {isCorrect ? 'Đúng ✓' : 'Sai ✕'}
                            </span>
                          )}
                        </div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 mb-4">{ex.question}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {ex.options?.map((opt, optIdx) => {
                            const isSelected = selectedAnswers[ex.id] === opt;
                            const isThisCorrect = opt === ex.correctAnswer;
                            let btnClasses = 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
                            if (isAnswered) {
                              if (isThisCorrect) btnClasses = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold';
                              else if (isSelected && !isCorrect) btnClasses = 'border-rose-500 bg-rose-50 text-rose-800 font-bold';
                            } else if (isSelected) {
                              btnClasses = 'border-indigo-500 bg-indigo-50 text-indigo-800 font-bold';
                            }
                            return (
                              <button
                                key={optIdx}
                                onClick={(e) => handleSelectOption(e, ex.id, opt)}
                                className={`p-3 text-left rounded-xl border text-sm transition-all ${btnClasses}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        <div className="mt-3">
                          <button
                            onClick={(e) => toggleExplanation(e, ex.id)}
                            className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-indigo-100 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            {showExp ? 'Ẩn giải thích' : 'Hiện giải thích'}
                          </button>
                          {showExp && (
                            <div className="mt-3 p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 text-sm animate-in fade-in">
                              <p className="font-bold text-indigo-700 dark:text-indigo-400 mb-1">Đáp án: {ex.correctAnswer}</p>
                              <p className="text-slate-700 dark:text-slate-300">{ex.explanation}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 py-10">
                      <CheckCircle2 className="w-12 h-12 mb-3 text-emerald-200 dark:text-emerald-800" />
                      <p>Không có bài tập cho phần này.</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400 font-medium shrink-0 animate-pulse">
                  Bấm để lật thẻ → Xem lại lý thuyết
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Controls */}
      <footer className="flex items-center justify-between px-4 sm:px-8 py-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] shrink-0 z-20">
        <button
          onClick={handlePrev}
          disabled={!canGoPrev}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all ${
            canGoPrev ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer active:scale-95' : 'bg-slate-50 text-slate-300 dark:bg-slate-800/40 dark:text-slate-600 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden sm:inline">{currentCardIndex > 0 ? 'Thẻ trước' : 'Bài trước'}</span>
        </button>

        {!isCompleted && isEligibleToComplete && (
          <button
            onClick={() => onCompleteLesson(module.id)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black shadow-lg shadow-amber-200/50 transform hover:scale-105 transition-all cursor-pointer"
          >
            <Flame className="w-5 h-5 text-orange-600 fill-orange-600" />
            <span className="hidden sm:inline">Hoàn thành & Nhận Streak</span>
            <span className="sm:hidden">Hoàn thành</span>
          </button>
        )}

        <button
          onClick={handleNext}
          disabled={!canGoNext}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all ${
            canGoNext ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md cursor-pointer active:scale-95' : 'bg-slate-100 text-slate-400 dark:bg-slate-800/40 dark:text-slate-600 cursor-not-allowed'
          }`}
        >
          <span className="hidden sm:inline">{currentCardIndex < totalCards - 1 ? 'Thẻ tiếp' : 'Bài tiếp'}</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </footer>
      
      {/* 3D Flip Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .hide-scrollbar::-webkit-scrollbar { width: 6px; }
        .hide-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .hide-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.5); border-radius: 20px; }
      `}} />
    </div>
  );
};
