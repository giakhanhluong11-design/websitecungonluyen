import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Trophy, 
  Timer, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  Link2, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle 
} from 'lucide-react';
import { MatchingPair, MATCHING_GAMES_DATA } from '../../data/minigamesData';
import { MinigameResult } from '../../types';

interface MatchingGameProps {
  gameId: string;
  onBackToHub: () => void;
  onSaveResult: (result: MinigameResult) => { isNewBest: boolean };
  currentBestScore: number;
}

interface ColumnItem {
  id: string; // pair ID
  indexTag: string; // e.g. "A1", "B3"
  text: string;
  matched: boolean;
  matchedWithTag?: string;
}

interface MatchedPairLog {
  pairId: string;
  leftTag: string;
  leftText: string;
  rightTag: string;
  rightText: string;
}

export const MatchingGame: React.FC<MatchingGameProps> = ({
  gameId,
  onBackToHub,
  onSaveResult,
  currentBestScore
}) => {
  const gameInfo = MATCHING_GAMES_DATA[gameId] || MATCHING_GAMES_DATA['toan-matching-hangdangthuc'];

  // Game items
  const [leftItems, setLeftItems] = useState<ColumnItem[]>([]);
  const [rightItems, setRightItems] = useState<ColumnItem[]>([]);

  // Selection
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [mismatchPair, setMismatchPair] = useState<{ left: string; right: string } | null>(null);
  const [justMatchedPair, setJustMatchedPair] = useState<string | null>(null);
  const [matchedPairsList, setMatchedPairsList] = useState<MatchedPairLog[]>([]);
  const [showMatchedList, setShowMatchedList] = useState<boolean>(true);

  // Stats & Scoring
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [matchedCount, setMatchedCount] = useState<number>(0);
  const [mistakeCount, setMistakeCount] = useState<number>(0);

  // Timer
  const [seconds, setSeconds] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const lastMatchTimeRef = useRef<number>(Date.now());

  // Result summary
  const [finalSummary, setFinalSummary] = useState<{
    total: number;
    matched: number;
    score: number;
    maxCombo: number;
    timeSeconds: number;
    isNewBest: boolean;
  } | null>(null);

  // Initialize Game
  const initializeGame = () => {
    const rawPairs = gameInfo.pairs;

    // Column A items
    const left: ColumnItem[] = rawPairs.map((p, idx) => ({
      id: p.id,
      indexTag: `A${idx + 1}`,
      text: p.left,
      matched: false
    }));

    // Column B items (shuffled order)
    const shuffledPairs = [...rawPairs].sort(() => 0.5 - Math.random());
    const right: ColumnItem[] = shuffledPairs.map((p, idx) => ({
      id: p.id,
      indexTag: `B${idx + 1}`,
      text: p.right,
      matched: false
    }));

    setLeftItems(left);
    setRightItems(right);
    setSelectedLeft(null);
    setSelectedRight(null);
    setMismatchPair(null);
    setJustMatchedPair(null);
    setMatchedPairsList([]);
    setMatchedCount(0);
    setMistakeCount(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setSeconds(0);
    setIsFinished(false);
    setTimerActive(true);
    lastMatchTimeRef.current = Date.now();
  };

  useEffect(() => {
    initializeGame();
  }, [gameId]);

  // Timer loop
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

  // Pair check logic
  const checkPair = (leftId: string, rightId: string) => {
    const isCorrect = leftId === rightId;
    const elapsedSinceLastMatch = (Date.now() - lastMatchTimeRef.current) / 1000;

    const leftItem = leftItems.find(i => i.id === leftId);
    const rightItem = rightItems.find(i => i.id === rightId);

    if (isCorrect && leftItem && rightItem) {
      // Correct match!
      setJustMatchedPair(leftId);
      setTimeout(() => setJustMatchedPair(null), 400);

      const newCombo = combo + 1;
      const newMaxCombo = Math.max(maxCombo, newCombo);

      // Base 100 + combo bonus (up to 75) + speed bonus (up to 25)
      let points = 100;
      const comboBonus = Math.min(75, (newCombo - 1) * 15);
      const speedBonus = elapsedSinceLastMatch < 5 ? Math.round(Math.max(0, 25 - elapsedSinceLastMatch * 2.5)) : 0;
      points += comboBonus + speedBonus;

      const newScore = score + points;
      const newMatchedCount = matchedCount + 1;

      setScore(newScore);
      setCombo(newCombo);
      setMaxCombo(newMaxCombo);
      setMatchedCount(newMatchedCount);

      // Update item statuses
      setLeftItems(prev => prev.map(item => 
        item.id === leftId ? { ...item, matched: true, matchedWithTag: rightItem.indexTag } : item
      ));
      setRightItems(prev => prev.map(item => 
        item.id === rightId ? { ...item, matched: true, matchedWithTag: leftItem.indexTag } : item
      ));

      // Append to matched log
      setMatchedPairsList(prev => [
        ...prev,
        {
          pairId: leftId,
          leftTag: leftItem.indexTag,
          leftText: leftItem.text,
          rightTag: rightItem.indexTag,
          rightText: rightItem.text
        }
      ]);

      setSelectedLeft(null);
      setSelectedRight(null);
      lastMatchTimeRef.current = Date.now();

      // Check if finished
      if (newMatchedCount === gameInfo.pairs.length) {
        setTimerActive(false);
        setIsFinished(true);

        const result: MinigameResult = {
          id: `match-res-${Date.now()}`,
          player: 'Bạn',
          subject: gameInfo.subject,
          gameType: 'matching',
          gameId,
          gameTitle: gameInfo.title,
          score: newScore,
          correct: newMatchedCount,
          total: gameInfo.pairs.length,
          bestCombo: newMaxCombo,
          timeSeconds: seconds,
          createdAt: new Date().toISOString()
        };

        const { isNewBest } = onSaveResult(result);
        setFinalSummary({
          total: gameInfo.pairs.length,
          matched: newMatchedCount,
          score: newScore,
          maxCombo: newMaxCombo,
          timeSeconds: seconds,
          isNewBest
        });
      }
    } else {
      // Mismatch
      setMistakeCount(prev => prev + 1);
      setCombo(0);
      setMismatchPair({ left: leftId, right: rightId });
      setTimeout(() => {
        setMismatchPair(null);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 450);
    }
  };

  const handleSelectLeft = (id: string) => {
    if (mismatchPair) return;
    if (selectedLeft === id) {
      setSelectedLeft(null);
      return;
    }
    setSelectedLeft(id);
    if (selectedRight) {
      checkPair(id, selectedRight);
    }
  };

  const handleSelectRight = (id: string) => {
    if (mismatchPair) return;
    if (selectedRight === id) {
      setSelectedRight(null);
      return;
    }
    setSelectedRight(id);
    if (selectedLeft) {
      checkPair(selectedLeft, id);
    }
  };

  // Helper texts
  const colALabel = gameInfo.columnALabel || 'Cột A';
  const colBLabel = gameInfo.columnBLabel || 'Cột B';

  const selectedLeftObj = leftItems.find(i => i.id === selectedLeft);
  const selectedRightObj = rightItems.find(i => i.id === selectedRight);

  // -------------------------------------------------------------
  // RESULT SCREEN
  // -------------------------------------------------------------
  if (isFinished && finalSummary) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center space-y-5 shadow-sm">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <Trophy className="h-7 w-7" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Ghép nối hoàn tất!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Bạn đã ghép đúng toàn bộ {finalSummary.total}/{finalSummary.total} cặp giữa <strong>Cột A</strong> và <strong>Cột B</strong>
            </p>
          </div>

          {finalSummary.isNewBest && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Kỷ lục mới của bạn!</span>
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
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Đã nối đúng</div>
              <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                {finalSummary.matched}/{finalSummary.total}
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

          {/* Review of all connected pairs */}
          <div className="text-left pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Các cặp đã ghép nối ({matchedPairsList.length}):</span>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 text-xs">
              {matchedPairsList.map((pair, idx) => (
                <div 
                  key={pair.pairId}
                  className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2"
                >
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 shrink-0">
                    {pair.leftTag} ↔ {pair.rightTag}
                  </span>
                  <div className="flex-1 text-slate-700 dark:text-slate-200 truncate">
                    <span className="font-medium">{pair.leftText}</span>
                    <span className="mx-1 text-slate-400">➔</span>
                    <span className="text-slate-600 dark:text-slate-300">{pair.rightText}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-500 dark:text-slate-400">
            Điểm cao nhất của bạn: <strong className="text-slate-700 dark:text-slate-200">{Math.max(currentBestScore, finalSummary.score).toLocaleString()}</strong>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <button
              type="button"
              onClick={initializeGame}
              className="w-full py-3 px-4 min-h-[48px] rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer active:scale-98"
            >
              Chơi lại
            </button>
            <button
              type="button"
              onClick={onBackToHub}
              className="w-full py-3 px-4 min-h-[48px] rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold transition-all cursor-pointer active:scale-98"
            >
              Đổi trò chơi khác
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ACTIVE 2-COLUMN PLAYING SCREEN
  // -------------------------------------------------------------
  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-3 sm:py-6">
      {/* Top HUD bar */}
      <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
        <button
          type="button"
          onClick={onBackToHub}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Về Minigame</span>
          <span className="sm:hidden">Thoát</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <span>Tiến độ:</span>
            <strong className="text-slate-900 dark:text-white">
              {matchedCount}/{gameInfo.pairs.length}
            </strong>
          </div>

          {combo > 1 && (
            <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <Flame className="h-3.5 w-3.5 fill-amber-500" />
              <span>x{combo}</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <Timer className="h-3.5 w-3.5" />
            <span>{formatTimer(seconds)}</span>
          </div>

          <div className="text-indigo-600 dark:text-indigo-400 font-bold">
            {score.toLocaleString()} đ
          </div>
        </div>
      </div>

      {/* Header with Title & Matching Instruction */}
      <div className="my-3 sm:my-4 text-center">
        <h2 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white">
          {gameInfo.title}
        </h2>
        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {gameInfo.description}
        </p>
      </div>

      {/* Real-time Matching Status Bar */}
      <div className="mb-3 p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 transition-all bg-indigo-50/70 border-indigo-200/80 dark:bg-indigo-950/30 dark:border-indigo-900/40 text-indigo-900 dark:text-indigo-200">
        <div className="flex items-center gap-2">
          <Link2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <div>
            {mismatchPair ? (
              <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 inline" /> Chưa khớp cặp! Hãy thử chọn lại.
              </span>
            ) : selectedLeftObj && !selectedRightObj ? (
              <span>
                Đang chọn <strong className="font-bold text-indigo-700 dark:text-indigo-300">[{selectedLeftObj.indexTag}] {selectedLeftObj.text}</strong>. Hãy chọn ô tương ứng ở <strong>Cột B</strong>.
              </span>
            ) : selectedRightObj && !selectedLeftObj ? (
              <span>
                Đang chọn <strong className="font-bold text-indigo-700 dark:text-indigo-300">[{selectedRightObj.indexTag}] {selectedRightObj.text}</strong>. Hãy chọn ô tương ứng ở <strong>Cột A</strong>.
              </span>
            ) : justMatchedPair ? (
              <span className="text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 inline" /> Ghép đúng! Chuỗi combo tăng!
              </span>
            ) : (
              <span>
                Chạm chọn 1 ô ở <strong>Cột A</strong> và 1 ô ở <strong>Cột B</strong> để nối/ghép đôi.
              </span>
            )}
          </div>
        </div>

        {(selectedLeft || selectedRight) && !mismatchPair && (
          <button
            type="button"
            onClick={() => {
              setSelectedLeft(null);
              setSelectedRight(null);
            }}
            className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 underline shrink-0 cursor-pointer"
          >
            Hủy chọn
          </button>
        )}
      </div>

      {/* 2-COLUMN MATCHING BOARD: COLUMN A (LEFT) & COLUMN B (RIGHT) */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:gap-6">
        {/* ================= COLUMN A ================= */}
        <div className="space-y-2">
          {/* Column A Header */}
          <div className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-center gap-1.5">
              <span className="inline-block px-1.5 py-0.5 rounded bg-indigo-600 text-white text-[10px] sm:text-xs font-black">
                CỘT A
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                {colALabel}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
              {leftItems.filter(i => i.matched).length}/{leftItems.length} xong
            </span>
          </div>

          {/* Column A Items */}
          <div className="space-y-2">
            {leftItems.map(item => {
              const isSelected = selectedLeft === item.id;
              const isMismatch = mismatchPair?.left === item.id;
              const isJustMatched = justMatchedPair === item.id;

              if (item.matched) {
                return (
                  <div
                    key={item.id}
                    className="p-2.5 sm:p-3 min-h-[50px] sm:min-h-[56px] rounded-xl border border-emerald-200/80 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20 text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium flex items-center justify-between gap-2 opacity-75 select-none"
                  >
                    <div className="flex items-start gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[10px] sm:text-xs font-bold shrink-0">
                        {item.indexTag}
                      </span>
                      <span className="break-words line-through text-slate-500 dark:text-slate-400 leading-snug">
                        {item.text}
                      </span>
                    </div>
                    {item.matchedWithTag && (
                      <span className="text-[10px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0 flex items-center gap-0.5 bg-emerald-100/70 dark:bg-emerald-900/50 px-1.5 py-0.5 rounded">
                        <Check className="h-3 w-3" /> {item.matchedWithTag}
                      </span>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectLeft(item.id)}
                  className={`w-full p-2.5 sm:p-3 min-h-[50px] sm:min-h-[56px] rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none flex items-start gap-2 active:scale-98 ${
                    isMismatch
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 ring-2 ring-rose-400 animate-shake'
                      : isJustMatched
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      : isSelected
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 dark:bg-indigo-950/80 dark:text-indigo-200 shadow-xs ring-2 ring-indigo-500/60'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-100 shadow-xs'
                  }`}
                >
                  <span className={`px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-bold shrink-0 ${
                    isSelected 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    {item.indexTag}
                  </span>
                  <span className="break-words leading-snug flex-1">
                    {item.text}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= COLUMN B ================= */}
        <div className="space-y-2">
          {/* Column B Header */}
          <div className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-center gap-1.5">
              <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[10px] sm:text-xs font-black">
                CỘT B
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                {colBLabel}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
              {rightItems.filter(i => i.matched).length}/{rightItems.length} xong
            </span>
          </div>

          {/* Column B Items */}
          <div className="space-y-2">
            {rightItems.map(item => {
              const isSelected = selectedRight === item.id;
              const isMismatch = mismatchPair?.right === item.id;
              const isJustMatched = justMatchedPair === item.id;

              if (item.matched) {
                return (
                  <div
                    key={item.id}
                    className="p-2.5 sm:p-3 min-h-[50px] sm:min-h-[56px] rounded-xl border border-emerald-200/80 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20 text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium flex items-center justify-between gap-2 opacity-75 select-none"
                  >
                    <div className="flex items-start gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[10px] sm:text-xs font-bold shrink-0">
                        {item.indexTag}
                      </span>
                      <span className="break-words line-through text-slate-500 dark:text-slate-400 leading-snug">
                        {item.text}
                      </span>
                    </div>
                    {item.matchedWithTag && (
                      <span className="text-[10px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0 flex items-center gap-0.5 bg-emerald-100/70 dark:bg-emerald-900/50 px-1.5 py-0.5 rounded">
                        <Check className="h-3 w-3" /> {item.matchedWithTag}
                      </span>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectRight(item.id)}
                  className={`w-full p-2.5 sm:p-3 min-h-[50px] sm:min-h-[56px] rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none flex items-start gap-2 active:scale-98 ${
                    isMismatch
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 ring-2 ring-rose-400 animate-shake'
                      : isJustMatched
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      : isSelected
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 dark:bg-indigo-950/80 dark:text-indigo-200 shadow-xs ring-2 ring-indigo-500/60'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-100 shadow-xs'
                  }`}
                >
                  <span className={`px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-bold shrink-0 ${
                    isSelected 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    {item.indexTag}
                  </span>
                  <span className="break-words leading-snug flex-1">
                    {item.text}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Matched Pairs Log (Collapsible) */}
      {matchedPairsList.length > 0 && (
        <div className="mt-6 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
          <button
            type="button"
            onClick={() => setShowMatchedList(prev => !prev)}
            className="w-full p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Các cặp đã nối chính xác ({matchedPairsList.length}/{gameInfo.pairs.length})</span>
            </div>
            {showMatchedList ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showMatchedList && (
            <div className="p-3 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {matchedPairsList.map(pair => (
                <div key={pair.pairId} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {pair.leftTag}
                    </span>
                    <span className="font-medium">{pair.leftText}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                    <Link2 className="h-3 w-3 text-emerald-500" />
                    <span>nối</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 text-right">
                    <span className="text-slate-700 dark:text-slate-300">{pair.rightText}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {pair.rightTag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bottom control buttons */}
      <div className="mt-5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <button
          type="button"
          onClick={initializeGame}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium cursor-pointer transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Trộn & chơi lại</span>
        </button>

        <span>
          Cột A ({leftItems.length} mục) ↔ Cột B ({rightItems.length} mục)
        </span>
      </div>
    </div>
  );
};
