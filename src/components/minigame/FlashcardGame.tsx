import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  RotateCw, 
  Check, 
  X, 
  Trophy, 
  Timer, 
  Flame, 
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { FlashcardItem, ENGLISH_FLASHCARDS } from '../../data/minigamesData';
import { MinigameResult } from '../../types';

interface FlashcardGameProps {
  onBackToHub: () => void;
  onSaveResult: (result: MinigameResult) => { isNewBest: boolean };
  currentBestScore: number;
}

export const FlashcardGame: React.FC<FlashcardGameProps> = ({
  onBackToHub,
  onSaveResult,
  currentBestScore
}) => {
  // Game setup
  const [cardCountChoice, setCardCountChoice] = useState<number>(10);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Deck state
  const [deck, setDeck] = useState<FlashcardItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Play stats & scoring
  const [rememberedCount, setRememberedCount] = useState<number>(0);
  const [needReviewCount, setNeedReviewCount] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);

  // Timer
  const [seconds, setSeconds] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const questionStartTimeRef = useRef<number>(Date.now());

  // Final summary
  const [finalSummary, setFinalSummary] = useState<{
    total: number;
    remembered: number;
    needReview: number;
    score: number;
    maxCombo: number;
    timeSeconds: number;
    isNewBest: boolean;
  } | null>(null);

  // Swipe handling
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  // Start new game session
  const startGame = (count: number) => {
    // Shuffle and pick
    const shuffled = [...ENGLISH_FLASHCARDS].sort(() => 0.5 - Math.random());
    const selectedDeck = shuffled.slice(0, Math.min(count, shuffled.length));
    
    setDeck(selectedDeck);
    setCurrentIndex(0);
    setIsFlipped(false);
    setRememberedCount(0);
    setNeedReviewCount(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setSeconds(0);
    setIsFinished(false);
    setIsPlaying(true);
    setTimerActive(true);
    questionStartTimeRef.current = Date.now();
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive]);

  const formatTimer = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleFlip = () => {
    setIsFlipped(prev => !prev);
  };

  const proceedNext = (remembered: boolean) => {
    const elapsedSecondsOnCard = (Date.now() - questionStartTimeRef.current) / 1000;
    
    let newScore = score;
    let newCombo = combo;
    let newMaxCombo = maxCombo;
    let newRemembered = rememberedCount;
    let newNeedReview = needReviewCount;

    if (remembered) {
      newRemembered += 1;
      newCombo += 1;
      if (newCombo > newMaxCombo) newMaxCombo = newCombo;
      
      // Base score 100
      let points = 100;
      // Combo bonus (max 80)
      const comboBonus = Math.min(80, (newCombo - 1) * 15);
      // Speed bonus (max 30 if answered under 5 seconds)
      const speedBonus = elapsedSecondsOnCard < 5 ? Math.round(Math.max(0, 30 - elapsedSecondsOnCard * 3)) : 0;
      
      points += comboBonus + speedBonus;
      newScore += points;
    } else {
      newNeedReview += 1;
      newCombo = 0; // reset combo
    }

    setScore(newScore);
    setCombo(newCombo);
    setMaxCombo(newMaxCombo);
    setRememberedCount(newRemembered);
    setNeedReviewCount(newNeedReview);

    // Next card or finish
    if (currentIndex + 1 < deck.length) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
      questionStartTimeRef.current = Date.now();
    } else {
      // Finished
      setTimerActive(false);
      setIsPlaying(false);
      setIsFinished(true);

      const result: MinigameResult = {
        id: `fc-res-${Date.now()}`,
        player: 'Bạn',
        subject: 'anh',
        gameType: 'flashcard',
        gameId: 'anh-flashcard-10',
        gameTitle: 'Flashcard Từ Vựng Trọng Tâm',
        score: newScore,
        correct: newRemembered,
        total: deck.length,
        bestCombo: newMaxCombo,
        timeSeconds: seconds,
        createdAt: new Date().toISOString()
      };

      const { isNewBest } = onSaveResult(result);
      setFinalSummary({
        total: deck.length,
        remembered: newRemembered,
        needReview: newNeedReview,
        score: newScore,
        maxCombo: newMaxCombo,
        timeSeconds: seconds,
        isNewBest
      });
    }
  };

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;
    const diff = touchStartXRef.current - touchEndXRef.current;
    // Swipe left (next card)
    if (diff > 50) {
      handleFlip();
    } else if (diff < -50) {
      handleFlip();
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  const currentCard = deck[currentIndex];

  // -------------------------------------------------------------
  // MODE SELECTION SCREEN (BEFORE PLAYING)
  // -------------------------------------------------------------
  if (!isPlaying && !isFinished) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={onBackToHub}
            className="flex items-center justify-center h-10 w-10 min-h-[44px] min-w-[44px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer active:scale-95"
            aria-label="Về Minigame"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Flashcard Tiếng Anh
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Lật thẻ ôn tập từ vựng trọng tâm kỳ thi tuyển sinh vào lớp 10
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Chọn số lượng thẻ mỗi lượt ôn tập:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[10, 20, 30].map(count => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setCardCountChoice(count)}
                  className={`py-3 px-4 min-h-[48px] rounded-xl border text-sm font-bold text-center transition-all cursor-pointer active:scale-95 ${
                    cardCountChoice === count
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {count} thẻ
                </button>
              ))}
            </div>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-2">
              Kho dữ liệu hiện có {ENGLISH_FLASHCARDS.length} thẻ từ vựng chọn lọc.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-2">
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              Hướng dẫn thao tác:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-xs">
              <li>Chạm vào thẻ để lật xem nghĩa tiếng Việt và câu ví dụ.</li>
              <li>Bấm <strong>Đã nhớ</strong> khi nắm chắc từ vựng để tích điểm và chuỗi combo.</li>
              <li>Bấm <strong>Cần ôn lại</strong> nếu chưa nhớ để hệ thống lưu lại.</li>
            </ul>
          </div>

          {currentBestScore > 0 && (
            <div className="flex items-center justify-between p-3 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/30 text-xs sm:text-sm">
              <span className="font-medium text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <Trophy className="h-4 w-4 text-amber-500" />
                Điểm cao nhất của bạn:
              </span>
              <span className="font-extrabold text-amber-900 dark:text-amber-200">
                {currentBestScore.toLocaleString()}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={() => startGame(cardCountChoice)}
            className="w-full py-3.5 px-6 min-h-[48px] rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-xs cursor-pointer active:scale-98"
          >
            Bắt đầu ôn {cardCountChoice} thẻ
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RESULT SCREEN AFTER FINISHING
  // -------------------------------------------------------------
  if (isFinished && finalSummary) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center space-y-5">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <Trophy className="h-7 w-7" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Hoàn thành!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Bạn đã hoàn tất lượt ôn tập Flashcard
            </p>
          </div>

          {finalSummary.isNewBest && (
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              Kỷ lục mới!
            </div>
          )}

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Điểm đạt được
            </div>
            <div className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400">
              {finalSummary.score.toLocaleString()}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-left">
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Đã nhớ</div>
              <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                {finalSummary.remembered}/{finalSummary.total}
              </div>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Combo cao nhất</div>
              <div className="text-base font-bold text-amber-600 dark:text-amber-400">
                {finalSummary.maxCombo}
              </div>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Thời gian</div>
              <div className="text-base font-bold text-slate-700 dark:text-slate-300">
                {formatTimer(finalSummary.timeSeconds)}
              </div>
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-500 dark:text-slate-400">
            Điểm cao nhất của bạn: <strong className="text-slate-700 dark:text-slate-200">{Math.max(currentBestScore, finalSummary.score).toLocaleString()}</strong>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => startGame(cardCountChoice)}
              className="w-full py-3 px-4 min-h-[48px] rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer active:scale-98"
            >
              Chơi lại
            </button>
            <button
              type="button"
              onClick={onBackToHub}
              className="w-full py-3 px-4 min-h-[48px] rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold transition-all cursor-pointer active:scale-98"
            >
              Về Minigame
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ACTIVE GAME SCREEN
  // -------------------------------------------------------------
  return (
    <div className="max-w-xl mx-auto px-4 py-4 sm:py-6">
      {/* Top HUD bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
        <button
          type="button"
          onClick={() => {
            setTimerActive(false);
            setIsPlaying(false);
          }}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Thoát</span>
        </button>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <span>Câu:</span>
            <strong className="text-slate-900 dark:text-white">
              {currentIndex + 1}/{deck.length}
            </strong>
          </div>

          {combo > 1 && (
            <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <Flame className="h-3.5 w-3.5 fill-amber-500" />
              <span>Combo {combo}</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <Timer className="h-3.5 w-3.5" />
            <span>{formatTimer(seconds)}</span>
          </div>

          <div className="text-indigo-600 dark:text-indigo-400 font-bold">
            Điểm: {score.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Flashcard Area */}
      <div className="my-6">
        <div
          onClick={handleFlip}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="w-full min-h-[260px] sm:min-h-[300px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between cursor-pointer select-none transition-all hover:border-slate-300 dark:hover:border-slate-700 shadow-xs"
        >
          {/* Card Header Info */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="font-medium">
              {isFlipped ? 'Mặt sau (Nghĩa & Ví dụ)' : 'Mặt trước (Từ vựng)'}
            </span>
            <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
              <RotateCw className="h-3 w-3" />
              Chạm để lật
            </span>
          </div>

          {/* Card Main Content */}
          <div className="py-4 text-center my-auto">
            {!isFlipped ? (
              // FRONT
              <div className="space-y-2">
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {currentCard.word}
                </div>
                {currentCard.pronunciation && (
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {currentCard.pronunciation}
                  </div>
                )}
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                  {currentCard.partOfSpeech}
                </div>
              </div>
            ) : (
              // BACK
              <div className="space-y-3">
                <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {currentCard.meaning}
                </div>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 max-w-md mx-auto">
                  &ldquo;{currentCard.example}&rdquo;
                </div>
              </div>
            )}
          </div>

          {/* Card Footer Hint */}
          <div className="text-center text-[11px] text-slate-500 dark:text-slate-400">
            {isFlipped 
              ? 'Hãy chọn “Đã nhớ” hoặc “Cần ôn lại” bên dưới'
              : 'Chạm để lật xem lời giải đáp án'}
          </div>
        </div>
      </div>

      {/* Action Buttons: Đã nhớ / Cần ôn lại */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => proceedNext(false)}
          className="flex items-center justify-center gap-2 py-3.5 px-4 min-h-[48px] rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/70 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-bold transition-all cursor-pointer active:scale-95"
        >
          <X className="h-4 w-4" />
          <span>Cần ôn lại</span>
        </button>

        <button
          type="button"
          onClick={() => proceedNext(true)}
          className="flex items-center justify-center gap-2 py-3.5 px-4 min-h-[48px] rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer active:scale-95"
        >
          <Check className="h-4 w-4" />
          <span>Đã nhớ (+Điểm)</span>
        </button>
      </div>
    </div>
  );
};
