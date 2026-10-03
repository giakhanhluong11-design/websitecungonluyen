import React, { useState, useEffect, useCallback } from 'react';
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
  BookOpen,
  RefreshCw,
  Globe
} from 'lucide-react';
import { ALL_MINIGAMES, LeaderboardItem, MinigameDefinition } from '../../data/minigamesData';
import { UserProgress, MinigameResult } from '../../types';
import { saveMinigameResult, getUserProgress } from '../../data/userStorage';
import { fetchGlobalLeaderboard, GlobalLeaderboardEntry } from '../../services/firestoreService';
import { getCurrentUserId } from '../../services/authService';
import { MathyBirdGame } from './MathyBirdGame';
import { LiteratureGame } from './LiteratureGame';
import { FruitNinjaApp } from '../games/fruit-ninja/FruitNinjaApp';

interface MinigameViewProps {
  progress?: UserProgress;
  onUpdateProgress?: (newProgress: UserProgress) => void;
}

export const MinigameView: React.FC<MinigameViewProps> = ({
  progress: passedProgress,
  onUpdateProgress
}) => {
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [leaderboardFilter, setLeaderboardFilter] = useState<string>('all');
  const [globalEntries, setGlobalEntries] = useState<GlobalLeaderboardEntry[]>([]);
  const [isLoadingBoard, setIsLoadingBoard] = useState(false);
  const [boardError, setBoardError] = useState<string | null>(null);

  const loadGlobalBoard = useCallback(async () => {
    setIsLoadingBoard(true);
    setBoardError(null);
    try {
      const entries = await fetchGlobalLeaderboard();
      setGlobalEntries(entries);
    } catch (err) {
      console.error('Lỗi tải bảng xếp hạng online:', err);
      setBoardError('Không tải được bảng xếp hạng online. Hãy đăng nhập và thử lại.');
    } finally {
      setIsLoadingBoard(false);
    }
  }, []);

  // Tải lại BXH online mỗi khi quay về sảnh (sau khi chơi xong)
  useEffect(() => {
    if (activeGameId === null) {
      // Đợi 1 chút để điểm mới kịp đồng bộ lên Firestore
      const t = setTimeout(loadGlobalBoard, 800);
      return () => clearTimeout(t);
    }
  }, [activeGameId, loadGlobalBoard]);

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

  if (activeGameId === 'ai-la-nha-van') {
    return (
      <LiteratureGame
        onBack={() => setActiveGameId(null)}
        onSaveResult={handleSaveResult}
      />
    );
  }

  if (activeGameId === 'english-fruit-ninja') {
    return (
      <FruitNinjaApp onClose={() => setActiveGameId(null)} onSaveResult={handleSaveResult} />
    );
  }


  // ===== BẢNG XẾP HẠNG ONLINE: mỗi người chơi chỉ 1 dòng / game = điểm cao nhất =====
  const currentUid = getCurrentUserId();
  const myName = progress?.profile?.name?.trim() || 'Bạn';
  const gameMeta = (gameId: string) => ALL_MINIGAMES.find(g => g.id === gameId);
  const subjectLabelOf = (s: string) => (s === 'toan' ? 'Toán' : s === 'van' ? 'Ngữ Văn' : 'Tiếng Anh');

  // key = `${playerKey}__${gameId}` -> LeaderboardItem (giữ điểm cao nhất)
  const boardMap = new Map<string, LeaderboardItem & { gameId: string }>();
  const upsert = (playerKey: string, playerName: string, gameId: string, score: number, isMe: boolean) => {
    const meta = gameMeta(gameId);
    if (!meta || score <= 0) return;
    const key = `${playerKey}__${gameId}`;
    const existing = boardMap.get(key);
    if (existing && existing.score >= score) return;
    boardMap.set(key, {
      id: key,
      rank: 0,
      playerName,
      subject: meta.subject,
      subjectLabel: subjectLabelOf(meta.subject),
      gameTitle: meta.title,
      gameId,
      score,
      isCurrentUser: isMe
    });
  };

  // 1) Điểm thật của mọi người chơi trên Firestore
  globalEntries.forEach(e => {
    const isMe = !!currentUid && e.userId === currentUid;
    upsert(isMe ? 'me' : e.userId, isMe ? myName : e.playerName, e.gameId, e.score, isMe);
  });

  // 2) Điểm cao nhất của chính mình trên máy này (phòng khi chưa kịp đồng bộ)
  Object.entries(safeBestScores).forEach(([gameId, score]) => {
    upsert('me', myName, gameId, Number(score) || 0, true);
  });
  (progress?.minigameResults || []).forEach(r => {
    upsert('me', myName, r.gameId, r.score, true);
  });

  const sortedLeaderboard = Array.from(boardMap.values())
    .filter(item => leaderboardFilter === 'all' || item.gameId === leaderboardFilter)
    .sort((a, b) => b.score - a.score)
    .map((item, index) => ({
      ...item,
      rank: index + 1
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Bảng Xếp Hạng & Kỷ Lục Điểm Số
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Globe className="h-3 w-3" /> Online – điểm cao nhất của bạn và tất cả người chơi khác
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              id="leaderboard-game-filter"
              value={leaderboardFilter}
              onChange={(e) => setLeaderboardFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            >
              <option value="all">Tất cả trò chơi</option>
              {ALL_MINIGAMES.filter(g => g.status === 'active').map(g => (
                <option key={g.id} value={g.id}>{g.title}</option>
              ))}
            </select>
            <button
              id="leaderboard-refresh-btn"
              type="button"
              onClick={loadGlobalBoard}
              disabled={isLoadingBoard}
              title="Tải lại bảng xếp hạng"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${isLoadingBoard ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {boardError && (
          <p className="text-[11px] text-rose-500 bg-rose-50 dark:bg-rose-950/30 rounded-lg px-3 py-2">{boardError}</p>
        )}

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
                  <th className="py-2.5 px-3 font-bold w-12 text-center">Hạng</th>
                  <th className="py-2.5 px-3 font-bold">Người chơi</th>
                  <th className="py-2.5 px-3 font-bold">Trò chơi</th>
                  <th className="py-2.5 px-3 font-bold text-right">Điểm cao nhất</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {sortedLeaderboard.map((item) => {
                  return (
                    <tr
                      key={item.id}
                      className={item.isCurrentUser
                        ? 'bg-amber-50/50 dark:bg-amber-950/20 font-bold transition-colors'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors'}
                    >
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center justify-center w-7 h-6 rounded-full font-bold text-xs ${
                          item.rank === 1 ? 'bg-yellow-400 text-yellow-900'
                          : item.rank === 2 ? 'bg-slate-300 text-slate-800'
                          : item.rank === 3 ? 'bg-orange-300 text-orange-900'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}>
                          #{item.rank}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {item.playerName}
                          </span>
                          {item.isCurrentUser && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500 text-white font-bold">
                              Bạn
                            </span>
                          )}
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
