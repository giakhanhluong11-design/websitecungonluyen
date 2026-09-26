import React, { useEffect } from 'react';
import { Flame, Sparkles, X, Award, ChevronRight, CheckCircle2 } from 'lucide-react';

interface StreakFlameCelebrationProps {
  streakDays: number;
  onClose: () => void;
}

export const StreakFlameCelebration: React.FC<StreakFlameCelebrationProps> = ({
  streakDays,
  onClose
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      {/* Background ambient fire glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-r from-orange-600/30 via-amber-500/20 to-rose-600/30 blur-3xl animate-pulse" />
      </div>

      {/* Celebration Card */}
      <div className="relative w-full max-w-md rounded-3xl border border-orange-500/40 bg-gradient-to-b from-slate-900 via-slate-900 to-orange-950/60 p-6 sm:p-8 shadow-2xl text-center space-y-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Đóng (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Floating Embers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute left-[20%] bottom-[40%] w-2 h-2 rounded-full bg-amber-400 animate-ember-float" style={{ animationDelay: '0s' }} />
          <div className="absolute left-[35%] bottom-[35%] w-1.5 h-1.5 rounded-full bg-orange-400 animate-ember-float" style={{ animationDelay: '0.4s' }} />
          <div className="absolute right-[25%] bottom-[38%] w-2.5 h-2.5 rounded-full bg-rose-400 animate-ember-float" style={{ animationDelay: '0.8s' }} />
          <div className="absolute right-[40%] bottom-[42%] w-1.5 h-1.5 rounded-full bg-yellow-300 animate-ember-float" style={{ animationDelay: '1.2s' }} />
          <div className="absolute left-[50%] bottom-[30%] w-2 h-2 rounded-full bg-amber-300 animate-ember-float" style={{ animationDelay: '1.6s' }} />
        </div>

        {/* Central Fire Emblem */}
        <div className="relative flex flex-col items-center justify-center pt-2">
          {/* Circular halo */}
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-amber-500/20 via-orange-500/30 to-rose-600/20 border-2 border-orange-400/50 flex items-center justify-center relative shadow-inner">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-orange-600/40 via-amber-400/30 to-rose-500/40 animate-ping absolute opacity-30" />
            
            {/* Blazing Flame */}
            <div className="relative animate-flame-ignite">
              <div className="animate-flame-pulse-glow">
                <Flame className="w-20 h-20 sm:w-24 sm:h-24 text-amber-400 fill-amber-400 drop-shadow-[0_0_25px_rgba(245,158,11,0.9)]" />
              </div>
              <Sparkles className="w-7 h-7 text-amber-200 absolute -top-1 -right-2 animate-bounce" />
            </div>
          </div>

          {/* New Streak Counter */}
          <div className="mt-5 space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-md uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-current" />
              Thắp sáng chuỗi ngày học
            </span>
            <div className="flex items-baseline justify-center gap-2 mt-2">
              <span className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-amber-300 via-orange-400 to-rose-500 bg-clip-text text-transparent">
                {streakDays}
              </span>
              <span className="text-lg sm:text-xl font-black text-amber-300 uppercase tracking-widest">
                Ngày liên tiếp
              </span>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2 bg-slate-800/80 border border-orange-500/20 rounded-2xl p-4 text-xs text-slate-300 leading-relaxed">
          <div className="font-bold text-amber-300 flex items-center justify-center gap-1.5 text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Đã hoàn thành Chuyên đề & Bài tập!</span>
          </div>
          <p>
            Bạn đã đọc hết lý thuyết và vượt qua các bài tập vận dụng. Chuỗi học tập đã tăng thêm <strong className="text-white">+1 ngày</strong> (tối đa 1 lần mỗi ngày).
          </p>
          <div className="text-[11px] text-amber-200/80 italic pt-1">
            "Mỗi ngày một chuyên đề — Cánh cửa vào lớp 10 trường mơ ước đang rộng mở!"
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-black text-sm sm:text-base shadow-xl hover:shadow-orange-500/40 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Tiếp tục học tập</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
