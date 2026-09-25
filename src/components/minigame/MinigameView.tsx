import React, { useState } from 'react';
import { 
  Gamepad2, 
  Sparkles, 
  Trophy, 
  Play, 
  Zap,
  Lock,
  Flame,
  Award,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { ALL_MINIGAMES, INITIAL_PEER_LEADERBOARD, LeaderboardItem, MinigameDefinition } from '../../data/minigamesData';
import { UserProgress, MinigameResult } from '../../types';
import { saveMinigameResult, getUserProgress } from '../../data/userStorage';
import { MathyBirdGame } from './MathyBirdGame';

interface MinigameViewProps {
  progress?: UserProgress;
  onUpdateProgress?: (newProgress: UserProgress) => void;
}

export const MinigameView: React.FC<MinigameViewProps> = ({
  progress: passedProgress,
  onUpdateProgress
}) => {
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  // Safe fallback if progress is undefined
  const progress = passedProgress || getUserProgress();
  const safeBestScores = progress?.minigameBestScores || {};
  const userBestScore = safeBestScores['mathy-bird'] || 0;

  // Handle saving result
  const handleSaveResult = (result: MinigameResult): { isNewBest: boolean } => {
    const { progress: updatedProgress, isNewBest } = saveMinigameResult(result);
    if (onUpdateProgress) {
      onUpdateProgress(updatedProgress);
    }
    return { isNewBest };
  };

  // If Mathy Bird is active, render full game canvas view
  if (activeGameId === 'mathy-bird') {
    return (
      <MathyBirdGame
        onBackToHub={() => setActiveGameId(null)}
        onSaveResult={handleSaveResult}
        currentBestScore={userBestScore}
      />
    );
  }

  // Active game metadata
  const featuredGame = ALL_MINIGAMES.find(g => g.id === 'mathy-bird') || ALL_MINIGAMES[0];

  // Build user's real personal leaderboard from minigameResults
  const userResults = progress?.minigameResults || [];
  const sortedLeaderboard: LeaderboardItem[] = [...userResults]
    .sort((a, b) => b.score - a.score)
    .map((item, index) => ({
      id: item.id,
      rank: index + 1,
      playerName: progress?.profile?.name?.trim() || 'Bạn',
      subject: 'toan',
      subjectLabel: 'Toán',
      gameTitle: 'Mathy Bird',
      score: item.score,
      isCurrentUser: true
    }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-8 animate-in fade-in duration-300">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-lg shadow-orange-500/20">
            <Gamepad2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Kho Minigame Ôn Luyện
              </h1>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60 font-bold flex items-center gap-1">
                <Flame className="w-3 h-3" /> Arcade Mode
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Rèn luyện phản xạ – Nhớ nhanh kiến thức thi vào 10 qua các thử thách tương tác
            </p>
          </div>
        </div>

        {/* Link to standalone version */}
        <div className="flex items-center gap-2">
          <a
            href="/games/mathy-bird.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title="Mở game ở tab riêng độc lập"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Mở tab riêng (Standalone)</span>
          </a>
        </div>
      </div>

      {/* FEATURED BANNER HERO CARD: MATHY BIRD */}
      {featuredGame && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-1 shadow-xl shadow-orange-500/10">
          <div className="relative bg-white dark:bg-slate-900 rounded-[22px] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 overflow-hidden">
            {/* Background decorative circles */}
            <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-gradient-to-br from-amber-400/20 to-rose-400/20 blur-2xl pointer-events-none" />

            <div className="space-y-4 max-w-2xl relative z-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black px-3 py-1 rounded-full bg-rose-500 text-white tracking-wide uppercase shadow-sm">
                  Tựa game tâm điểm
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
                  Toán học 9 • Phản xạ nhanh
                </span>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Độ khó: Thử thách
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {featuredGame.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {featuredGame.description}
                </p>
              </div>

              {/* Feature bullet tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-600 dark:text-slate-400">
                {featuredGame.features?.map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              {/* Personal stats badge */}
              <div className="flex items-center gap-4 pt-2 text-xs">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-medium">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Kỷ lục của bạn: <strong className="text-slate-900 dark:text-white font-mono text-sm">{userBestScore} điểm</strong></span>
                </div>
              </div>
            </div>

            {/* Play Button CTA */}
            <div className="lg:shrink-0 relative z-10 flex flex-col gap-3 sm:flex-row lg:flex-col items-center">
              <button
                type="button"
                onClick={() => setActiveGameId(featuredGame.id)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 py-4 px-8 min-h-[56px] rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-black text-sm sm:text-base tracking-wide transition-all shadow-xl shadow-orange-500/25 cursor-pointer hover:scale-105 active:scale-95"
              >
                <Play className="h-5 w-5 fill-white" />
                <span>CHƠI NGAY</span>
              </button>

              <span className="text-[11px] text-slate-400 font-medium">
                Hỗ trợ phím Space, chuột và cảm ứng
              </span>
            </div>
          </div>
        </div>
      )}

      {/* CATALOG / GAME LIST (READY FOR FUTURE EXPANSIONS) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Danh Sách Trò Chơi
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {ALL_MINIGAMES.filter(g => g.status === 'active').length} đang hoạt động • {ALL_MINIGAMES.filter(g => g.status === 'coming_soon').length} sắp ra mắt
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ALL_MINIGAMES.map((game) => {
            const isActive = game.status === 'active';

            return (
              <div
                key={game.id}
                className={`group relative rounded-2xl border transition-all flex flex-col justify-between p-5 ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 border-amber-300/60 dark:border-amber-500/30 hover:shadow-lg hover:border-amber-400'
                    : 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-80'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isActive 
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {isActive ? 'Đang hoạt động' : 'Sắp ra mắt'}
                    </span>

                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      {game.subject === 'toan' ? 'Toán 9' : game.subject === 'van' ? 'Ngữ văn 9' : 'Tiếng Anh 9'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 mt-1.5 leading-relaxed">
                      {game.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {game.tags?.map((t, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800">
                  {isActive ? (
                    <button
                      type="button"
                      onClick={() => setActiveGameId(game.id)}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 cursor-pointer active:scale-95 transition"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>Chơi trò chơi này</span>
                    </button>
                  ) : (
                    <div className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-semibold">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Đang phát triển</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* LEADERBOARD (BẢNG THÀNH TÍCH & KỶ LỤC CỦA BẠN) */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Kỷ Lục Điểm Số Của Bạn (Mathy Bird)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Lịch sử thành tích và kỷ lục điểm số phản xạ thực tế qua các lượt chơi
              </p>
            </div>
          </div>
          {userBestScore > 0 && (
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-xl border border-amber-200 dark:border-amber-900">
              Điểm cao nhất: {userBestScore}
            </span>
          )}
        </div>

        {/* Leaderboard Table or Empty state */}
        {sortedLeaderboard.length === 0 ? (
          <div className="py-10 px-4 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <Gamepad2 className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
              Chưa có lượt chơi nào được ghi nhận
            </p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Hãy nhấn nút "CHƠI NGAY" ở trên để giải toán vượt chướng ngại vật và thiết lập kỷ lục đầu tiên của bạn!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3 font-bold w-12 text-center">Lần</th>
                  <th className="py-2.5 px-3 font-bold">Người chơi</th>
                  <th className="py-2.5 px-3 font-bold">Trò chơi</th>
                  <th className="py-2.5 px-3 font-bold text-right">Điểm số</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {sortedLeaderboard.map((item) => {
                  return (
                    <tr
                      key={item.id}
                      className="bg-amber-50/50 dark:bg-amber-950/20 font-bold transition-colors"
                    >
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 font-bold text-xs">
                          #{item.rank}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {item.playerName}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500 text-white font-bold">
                            Bạn
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                        {item.gameTitle}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-sm sm:text-base">
                          {item.score}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
