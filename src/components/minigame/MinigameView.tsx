import React, { useState } from 'react';
import { 
  Gamepad2, 
  Layers, 
  Sparkles, 
  Trophy, 
  Play, 
  RotateCw, 
  BookOpen, 
  CheckCircle2, 
  Medal,
  Flame,
  Filter
} from 'lucide-react';
import { ALL_MINIGAMES, INITIAL_PEER_LEADERBOARD, LeaderboardItem } from '../../data/minigamesData';
import { UserProgress, MinigameResult, SubjectId } from '../../types';
import { saveMinigameResult } from '../../data/userStorage';
import { FlashcardGame } from './FlashcardGame';
import { MatchingGame } from './MatchingGame';

interface MinigameViewProps {
  progress: UserProgress;
  onUpdateProgress: (newProgress: UserProgress) => void;
}

export const MinigameView: React.FC<MinigameViewProps> = ({
  progress,
  onUpdateProgress
}) => {
  // Navigation inside minigames
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [matchingSubjectFilter, setMatchingSubjectFilter] = useState<'all' | SubjectId>('all');
  const [leaderboardSubjectFilter, setLeaderboardSubjectFilter] = useState<'all' | SubjectId>('all');

  // Handle saving result
  const handleSaveResult = (result: MinigameResult): { isNewBest: boolean } => {
    const { progress: updatedProgress, isNewBest } = saveMinigameResult(result);
    onUpdateProgress(updatedProgress);
    return { isNewBest };
  };

  // If a game is active, render that game directly
  if (activeGameId === 'anh-flashcard-10') {
    return (
      <FlashcardGame
        onBackToHub={() => setActiveGameId(null)}
        onSaveResult={handleSaveResult}
        currentBestScore={progress.minigameBestScores?.['anh-flashcard-10'] || 0}
      />
    );
  }

  if (activeGameId) {
    return (
      <MatchingGame
        gameId={activeGameId}
        onBackToHub={() => setActiveGameId(null)}
        onSaveResult={handleSaveResult}
        currentBestScore={progress.minigameBestScores?.[activeGameId] || 0}
      />
    );
  }

  // Filtered matching games
  const filteredMatchingGames = ALL_MINIGAMES.filter(g => {
    if (g.gameType !== 'matching') return false;
    if (matchingSubjectFilter === 'all') return true;
    return g.subject === matchingSubjectFilter;
  });

  const flashcardGame = ALL_MINIGAMES.find(g => g.gameType === 'flashcard');

  // Build merged leaderboard
  // Inject user's actual personal scores if available
  const userResults = progress.minigameResults || [];
  const bestScoresValues = Object.values(progress.minigameBestScores || {}) as number[];
  const highestUserScore = userResults.length > 0 
    ? Math.max(...userResults.map(r => r.score))
    : (bestScoresValues.length > 0 ? Math.max(0, ...bestScoresValues) : 0);

  const mergedLeaderboard: LeaderboardItem[] = [...INITIAL_PEER_LEADERBOARD];

  // If user has played, insert user into leaderboard
  if (highestUserScore > 0) {
    const topResult = userResults[0];
    const userSubject = topResult ? topResult.subject : 'anh';
    const userSubjectLabel = userSubject === 'toan' ? 'Toán' : userSubject === 'van' ? 'Ngữ văn' : 'Tiếng Anh';
    const userGameTitle = topResult ? topResult.gameTitle : 'Flashcard Từ Vựng Trọng Tâm';

    mergedLeaderboard.push({
      id: 'user-lb-current',
      rank: 0,
      playerName: progress.profile?.name || 'Bạn',
      subject: userSubject,
      subjectLabel: userSubjectLabel,
      gameTitle: userGameTitle,
      score: highestUserScore,
      isCurrentUser: true
    });
  }

  // Sort leaderboard by score descending and calculate ranks
  const sortedLeaderboard = mergedLeaderboard
    .filter(item => {
      if (leaderboardSubjectFilter === 'all') return true;
      return item.subject === leaderboardSubjectFilter;
    })
    .sort((a, b) => b.score - a.score)
    .map((item, index) => ({
      ...item,
      rank: index + 1
    }));

  const getSubjectBadge = (subject: SubjectId) => {
    switch (subject) {
      case 'toan':
        return { label: 'Toán', bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900/50' };
      case 'van':
        return { label: 'Ngữ văn', bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/50' };
      case 'anh':
        return { label: 'Tiếng Anh', bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50' };
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-8">
      {/* Header section */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <Gamepad2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Minigame
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Ôn nhanh – nhớ lâu – kiểm tra kiến thức theo cách nhẹ nhàng hơn.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: FLASHCARD (TIẾNG ANH) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              1. Flashcard
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium">
              Tiếng Anh
            </span>
          </div>
        </div>

        {flashcardGame && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 transition-all hover:border-slate-300 dark:hover:border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {flashcardGame.title}
                  </h3>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {flashcardGame.totalItems} thẻ ôn tập
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {flashcardGame.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span>Môn: <strong>Tiếng Anh 9</strong></span>
                  <span>•</span>
                  <span>
                    Điểm cao nhất: <strong className="text-slate-800 dark:text-slate-200">
                      {(progress.minigameBestScores?.[flashcardGame.id] || 0).toLocaleString()}
                    </strong>
                  </span>
                </div>
              </div>

              <div className="sm:shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveGameId(flashcardGame.id)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 min-h-[48px] rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span>Chơi Flashcard</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SECTION 2: GHÉP & NỐI 2 CỘT A - B (TOÁN - NGỮ VĂN - TIẾNG ANH) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              2. Ghép & nối (2 Cột A ↔ B)
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              (Toán – Ngữ văn – Tiếng Anh)
            </span>
          </div>

          {/* Subject Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'toan', label: 'Toán' },
              { id: 'van', label: 'Ngữ văn' },
              { id: 'anh', label: 'Tiếng Anh' }
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setMatchingSubjectFilter(f.id as any)}
                className={`py-1.5 px-3 min-h-[36px] rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  matchingSubjectFilter === f.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Game Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMatchingGames.map(game => {
            const badge = getSubjectBadge(game.subject);
            const bestScore = progress.minigameBestScores?.[game.id] || 0;

            return (
              <div
                key={game.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between transition-all hover:border-slate-300 dark:hover:border-slate-700"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[11px] px-2 py-0.5 rounded-md border font-bold ${badge.bg}`}>
                      {badge.label}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                      2 cột A & B • {game.totalItems} cặp
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                    {game.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {game.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-500 dark:text-slate-400">
                    Điểm cao: <strong className="text-slate-800 dark:text-slate-200">{bestScore.toLocaleString()}</strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => setActiveGameId(game.id)}
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-4 min-h-[44px] rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-all cursor-pointer active:scale-95"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Nối cột</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: BẢNG XẾP HẠNG (LEADERBOARD) */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Bảng xếp hạng Minigame
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Thành tích ôn tập thi tuyển sinh vào lớp 10
              </p>
            </div>
          </div>

          {/* Leaderboard Subject Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'toan', label: 'Toán' },
              { id: 'van', label: 'Ngữ văn' },
              { id: 'anh', label: 'Tiếng Anh' }
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setLeaderboardSubjectFilter(f.id as any)}
                className={`py-1.5 px-3 min-h-[34px] rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  leaderboardSubjectFilter === f.id
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard Table / List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                <th className="py-2.5 px-3 w-16 text-center">Hạng</th>
                <th className="py-2.5 px-3">Học sinh</th>
                <th className="py-2.5 px-3 hidden sm:table-cell">Nội dung ôn</th>
                <th className="py-2.5 px-3 text-right">Điểm số</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {sortedLeaderboard.map(entry => {
                const badge = getSubjectBadge(entry.subject);
                return (
                  <tr
                    key={entry.id}
                    className={`transition-colors ${
                      entry.isCurrentUser
                        ? 'bg-indigo-50/70 dark:bg-indigo-950/40 font-semibold'
                        : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
                    }`}
                  >
                    <td className="py-3 px-3 text-center">
                      {entry.rank === 1 ? (
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-extrabold text-xs">
                          1
                        </span>
                      ) : entry.rank === 2 ? (
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-xs">
                          2
                        </span>
                      ) : entry.rank === 3 ? (
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-amber-700/20 text-amber-800 dark:text-amber-400 font-extrabold text-xs">
                          3
                        </span>
                      ) : (
                        <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
                          #{entry.rank}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {entry.playerName}
                        </span>
                        {entry.isCurrentUser && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-600 text-white font-bold">
                            Bạn
                          </span>
                        )}
                      </div>
                      <div className="sm:hidden text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {entry.gameTitle}
                      </div>
                    </td>

                    <td className="py-3 px-3 hidden sm:table-cell text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${badge.bg}`}>
                          {badge.label}
                        </span>
                        <span className="truncate max-w-[220px]">
                          {entry.gameTitle}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {entry.score.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
