import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Target, 
  TrendingUp, 
  Clock, 
  Calendar, 
  ChevronRight, 
  BookOpen, 
  FileText, 
  Calculator, 
  Languages, 
  User, 
  CheckCircle2,
  ArrowUpRight,
  BarChart2,
  Flame
} from 'lucide-react';
import { UserProgress } from '../types';

interface HomeDashboardWidgetsProps {
  progress: UserProgress;
  onNavigate: (tab: string, subjectFilter?: string, topicId?: string) => void;
  overallPercent: number;
  totalCompletedTopics: number;
  totalTopicsCount: number;
  allScores: Array<{
    type: 'practice' | 'exam';
    title?: string;
    topicName?: string;
    score: number;
    date: string;
  }>;
}

export const HomeDashboardWidgets: React.FC<HomeDashboardWidgetsProps> = ({
  progress,
  onNavigate,
  overallPercent,
  totalCompletedTopics,
  totalTopicsCount,
  allScores,
}) => {
  const [activeWaveTab, setActiveWaveTab] = useState<'tong-quan' | 'diem-so'>('tong-quan');

  const studentName = progress.profile.name?.trim() || 'Học sinh';
  const targetScore = progress.profile.targetScore || 21;
  const targetSchool = progress.profile.targetSchool || 'Chưa chọn trường';

  // 1. Accuracy of 5 recent practice attempts
  const accuracyPercent = useMemo(() => {
    const recent = progress.practiceAttempts.slice(0, 5);
    if (recent.length === 0) return 0;
    const totalCorrect = recent.reduce((acc, curr) => acc + curr.correctCount, 0);
    const totalQ = recent.reduce((acc, curr) => acc + curr.totalQuestions, 0);
    return Math.round((totalCorrect / Math.max(1, totalQ)) * 100);
  }, [progress.practiceAttempts]);

  // Donut chart calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius; // ~238.76
  const strokeDashoffset = circumference - (Math.min(accuracyPercent, 100) / 100) * circumference;

  // 2. Weekly study time (Hours) for Current Week (Mon-Sun)
  const weeklyStudyBars = useMemo(() => {
    const days = [
      { key: 1, day: 'T2' }, { key: 2, day: 'T3' }, { key: 3, day: 'T4' },
      { key: 4, day: 'T5' }, { key: 5, day: 'T6' }, { key: 6, day: 'T7' }, { key: 0, day: 'CN' }
    ];
    
    const today = new Date();
    const currentDay = today.getDay();
    const distToMonday = currentDay === 0 ? 6 : currentDay - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - distToMonday);
    monday.setHours(0,0,0,0);

    const bars = days.map(d => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + (d.key === 0 ? 6 : d.key - 1));
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;

      const mins = progress.dailyStudyTime?.[dateStr] || 0;
      const hours = +(mins / 60).toFixed(1);
      return { ...d, hours, dateStr };
    });

    const maxVal = Math.max(...bars.map(b => b.hours), 1);
    return bars.map(b => ({
      ...b,
      height: b.hours > 0 ? Math.min(100, Math.round((b.hours / maxVal) * 100)) : 0
    }));
  }, [progress.dailyStudyTime]);

  // Real Recent activities (from real scores only, no mock data)
  const recentActivities = useMemo(() => {
    return allScores.slice(0, 4).map((item, idx) => {
      let timeAgo = 'Vừa xong';
      try {
        const itemTime = new Date(item.date).getTime();
        const diffMs = Date.now() - itemTime;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) timeAgo = `${diffDays} ngày trước`;
        else if (diffHours > 0) timeAgo = `${diffHours} giờ trước`;
        else if (diffMins > 0) timeAgo = `${diffMins} phút trước`;
        else timeAgo = 'Hôm nay';
      } catch {
        timeAgo = item.date || 'Gần đây';
      }

      return {
        id: `score-${idx}`,
        title: item.title || item.topicName || (item.type === 'exam' ? 'Đề thi thử Tuyển sinh 10' : 'Luyện tập chuyên đề'),
        author: studentName,
        time: timeAgo,
        score: `${item.score}đ`,
        type: item.type,
      };
    });
  }, [allScores, studentName]);

  // 3. Real scores for Wave Chart (Chronological order) - Only Comprehensive Exams
  const scoreTrendPoints = useMemo(() => {
    const list = progress.examAttempts.slice(0, 7).reverse(); // Oldest to newest
    if (list.length === 0) return [];
    
    const svgWidth = 480;
    const svgHeight = 120;
    const padX = 30;
    const padY = 20;

    return list.map((item, idx) => {
      const x = list.length === 1 
        ? svgWidth / 2 
        : padX + (idx / (list.length - 1)) * (svgWidth - 2 * padX);
      // Score from 0 to 10
      const scoreNormalized = Math.max(0, Math.min(10, item.score)) / 10;
      const y = svgHeight - padY - scoreNormalized * (svgHeight - 2 * padY);
      return {
        x,
        y,
        score: item.score,
        date: item.date,
        title: item.examTitle || 'Đề thi thử'
      };
    });
  }, [progress.examAttempts]);

  return (
    <section className="space-y-4 sm:space-y-6">
      {/* Top Header: Title "Home Dashboard" + CTA button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Home Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Bảng điều khiển học tập & theo dõi tiến trình thực tế của bạn
          </p>
        </div>

        <button
          onClick={() => onNavigate('exams')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>+ Luyện đề ngay</span>
        </button>
      </div>

      {/* Row 1: 3 Stat Cards (Based 100% on real user progress) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        
        {/* Card 1: Progress charts (Circular Donut Chart) */}
        <div className="rounded-2xl bg-white/95 dark:bg-slate-850/95 backdrop-blur-xs border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <span>Tỉ lệ làm đúng (5 bài gần nhất)</span>
          </div>

          <div className="flex flex-col items-center justify-center my-2">
            {/* Donut SVG */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-100 dark:text-slate-700/60"
                  fill="transparent"
                />
                {/* Active Progress Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="text-indigo-600 dark:text-indigo-400 transition-all duration-700 ease-out"
                  fill="transparent"
                />
              </svg>

              {/* Number in center (strictly real) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-800 dark:text-slate-100 leading-none">
                  {accuracyPercent}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">%</span>
              </div>
            </div>

            {/* Target Legend */}
            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0" />
              <span>Mục tiêu: <strong className="text-slate-700 dark:text-slate-200 font-bold">{targetScore}đ</strong></span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 text-center">
            {progress.practiceAttempts.length === 0 ? 'Chưa có bài luyện tập nào' : 'Lấy từ luyện tập chuyên đề'}
          </div>
        </div>

        {/* Card 2: Progress (Weekly Bar Chart) */}
        <div className="rounded-2xl bg-white/95 dark:bg-slate-850/95 backdrop-blur-xs border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <span>Chuỗi ngày học liên tục</span>
          </div>

          <div className="flex flex-col items-center justify-center flex-1 py-2">
            <div className="relative">
              {progress.streakDays > 0 ? (
                <>
                  <div className="absolute inset-0 bg-rose-500/20 blur-xl rounded-full" />
                  <Flame className="w-14 h-14 sm:w-16 sm:h-16 text-rose-500 fill-rose-500 animate-pulse drop-shadow-md relative z-10" />
                </>
              ) : (
                <Flame className="w-14 h-14 sm:w-16 sm:h-16 text-slate-300 dark:text-slate-600 relative z-10" />
              )}
            </div>
            <div className="mt-2 text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100 drop-shadow-xs">
              {progress.streakDays || 0}
            </div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
              Ngày liên tiếp
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-center text-center">
            Hoàn thành 1 chuyên đề bất kỳ để nối chuỗi
          </div>
        </div>

        <div className="rounded-2xl bg-white/95 dark:bg-slate-850/95 backdrop-blur-xs border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <span>Thời lượng học tuần này (Giờ)</span>
          </div>

          <div className="flex items-end justify-between gap-1.5 h-28 my-2 px-1">
            {weeklyStudyBars.map((bar) => (
              <div key={bar.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div className="w-full max-w-[28px] bg-slate-100 dark:bg-slate-800 rounded-t-lg h-full flex items-end overflow-hidden p-0.5">
                  <div 
                    className="w-full bg-emerald-500 dark:bg-emerald-400 rounded-t-md transition-all duration-500 group-hover:bg-emerald-600"
                    style={{ height: `${bar.height}%` }}
                    title={`${bar.day} (${bar.dateStr}): ${bar.hours} giờ`}
                  />
                </div>
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                  {bar.day}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Tổng giờ học tuần này:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {weeklyStudyBars.reduce((acc, curr) => acc + curr.hours, 0).toFixed(1)}h
            </span>
          </div>
        </div>

      </div>

      {/* Row 2: Real Wave / Area Chart (Left) + Real Recent Activity List (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        
        {/* Wave / Area Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-white/95 dark:bg-slate-850/95 backdrop-blur-xs border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Biểu đồ tiến độ & điểm số thực tế</span>
            
            {/* Functional Toggle Tab */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveWaveTab('tong-quan')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeWaveTab === 'tong-quan'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Tổng quan
              </button>
              <button
                type="button"
                onClick={() => setActiveWaveTab('diem-so')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeWaveTab === 'diem-so'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Điểm bài thi gần đây ({allScores.length})
              </button>
            </div>
          </div>

          {/* Chart Canvas Area */}
          <div className="relative w-full h-44 sm:h-48 my-1 flex items-center justify-center">
            {scoreTrendPoints.length === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/30">
                <BarChart2 className="w-8 h-8 text-slate-400 dark:text-slate-500 mb-2" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Chưa có dữ liệu điểm số thật
                </p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-sm">
                  Hãy hoàn thành bài thi thử hoặc bài luyện tập chuyên đề đầu tiên để kích hoạt biểu đồ theo dõi điểm số thật.
                </p>
                <button
                  onClick={() => onNavigate('practice')}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-black shadow-lg shadow-orange-500/30 transition-all cursor-pointer transform hover:scale-105"
                >
                  Bắt đầu làm bài ngay
                </button>
              </div>
            ) : (
              <svg 
                className="w-full h-full overflow-visible" 
                viewBox="0 0 500 130" 
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="realWaveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Score Grid Lines (10đ, 7.5đ, 5đ) */}
                <line x1="0" y1="20" x2="500" y2="20" stroke="currentColor" strokeDasharray="3 3" className="text-slate-100 dark:text-slate-800" strokeWidth="1" />
                <text x="5" y="18" className="text-[9px] fill-slate-400 font-mono">10đ</text>
                
                <line x1="0" y1="65" x2="500" y2="65" stroke="currentColor" strokeDasharray="3 3" className="text-slate-100 dark:text-slate-800" strokeWidth="1" />
                <text x="5" y="63" className="text-[9px] fill-slate-400 font-mono">5đ</text>

                <line x1="0" y1="110" x2="500" y2="110" stroke="currentColor" strokeDasharray="3 3" className="text-slate-100 dark:text-slate-800" strokeWidth="1" />
                <text x="5" y="108" className="text-[9px] fill-slate-400 font-mono">0đ</text>

                {/* Draw Real Trend Line */}
                {(() => {
                  if (scoreTrendPoints.length === 1) {
                    const pt = scoreTrendPoints[0];
                    return (
                      <g>
                        <circle cx={pt.x} cy={pt.y} r="6" className="fill-indigo-600 stroke-white stroke-2" />
                      </g>
                    );
                  }

                  const pathD = scoreTrendPoints.reduce((acc, pt, idx) => {
                    return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
                  }, '');

                  const areaD = `${pathD} L ${scoreTrendPoints[scoreTrendPoints.length - 1].x},120 L ${scoreTrendPoints[0].x},120 Z`;

                  return (
                    <g>
                      <path d={areaD} fill="url(#realWaveGradient)" />
                      <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
                      {scoreTrendPoints.map((pt, idx) => (
                        <g key={idx} className="cursor-pointer group">
                          <circle cx={pt.x} cy={pt.y} r="5" className="fill-white stroke-indigo-600 stroke-2 group-hover:r-7 transition-all" />
                          <title>{`${pt.title}: ${pt.score}đ (${pt.date})`}</title>
                        </g>
                      ))}
                    </g>
                  );
                })()}
              </svg>
            )}
          </div>

          {/* X Axis Timeline Labels from real scores */}
          <div className="flex items-center justify-between text-[10px] font-medium text-slate-500 dark:text-slate-400 pt-3 mt-2 border-t border-slate-200 dark:border-slate-700 w-full px-1">
            {scoreTrendPoints.length > 0 ? (
              scoreTrendPoints.map((pt, idx) => (
                <span key={idx} className="truncate max-w-[80px]" title={pt.title}>
                  {pt.score}đ
                </span>
              ))
            ) : (
              <>
                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">Bắt đầu ôn thi</span>
                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">Luyện chuyên đề</span>
                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">Đề thi thử</span>
                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">Tuyển sinh 10</span>
              </>
            )}
          </div>
        </div>

        {/* Recent Activity List Card (Matching right card in mockup) */}
        <div className="rounded-2xl bg-white/95 dark:bg-slate-850/95 backdrop-blur-xs border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
            <span>Hoạt động gần đây</span>
            {recentActivities.length > 0 && (
              <button 
                onClick={() => onNavigate('account')}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Lịch sử hồ sơ
              </button>
            )}
          </div>

          {/* List items or Honest Empty State */}
          <div className="space-y-3 flex-1 flex flex-col justify-center">
            {recentActivities.length === 0 ? (
              <div className="py-8 px-3 text-center space-y-2">
                <Clock className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Bạn chưa làm bài tập nào
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Lịch sử làm bài và điểm số thật của bạn sẽ xuất hiện tại đây ngay khi hoàn thành bài đầu tiên.
                </p>
              </div>
            ) : (
              recentActivities.map((act) => (
                <div 
                  key={act.id} 
                  className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-slate-700 flex items-center justify-center text-indigo-700 dark:text-indigo-300 shrink-0 font-bold text-xs">
                      {progress.profile.avatar ? (
                        <span>{progress.profile.avatar}</span>
                      ) : (
                        <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                        {act.author}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate" title={act.title}>
                        {act.title}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[10px] text-slate-400 font-medium">
                      {act.time}
                    </div>
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                      {act.score}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              onClick={() => onNavigate('practice')}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
                recentActivities.length === 0 
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600' 
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
              }`}
            >
              {recentActivities.length === 0 ? '+ Bắt đầu luyện tập ngay →' : 'Tiếp tục luyện tập →'}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
