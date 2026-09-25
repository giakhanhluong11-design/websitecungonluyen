import React, { useState } from 'react';
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
  ArrowUpRight
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

  const studentName = progress.profile.name || 'Robin Lương';
  const targetScore = progress.profile.targetScore || progress.targetSchool.targetScore || '21';
  const targetSchool = progress.profile.targetSchool || 'THPT Chuyên / Công Lập';

  // Weekly study data for the vertical bar chart (Mocked based on progress or days)
  const weeklyData = [
    { day: 'Mo', height: 45, label: 'Thứ 2' },
    { day: 'Tue', height: 78, label: 'Thứ 3' },
    { day: 'Wed', height: 32, label: 'Thứ 4' },
    { day: 'Thu', height: 92, label: 'Thứ 5' },
    { day: 'Fri', height: 60, label: 'Thứ 6' },
  ];

  // Subject completion data for the 3rd bar chart
  const subjectBars = [
    { label: 'Jan', count: 18, color: 'bg-indigo-200 dark:bg-indigo-900/60' },
    { label: 'Feb', count: 32, color: 'bg-indigo-300 dark:bg-indigo-800/60' },
    { label: 'Mar', count: 56, color: 'bg-indigo-400 dark:bg-indigo-700/60' },
    { label: 'Apr', count: 72, color: 'bg-indigo-500 dark:bg-indigo-600' },
    { label: 'May', count: 88, color: 'bg-indigo-600 dark:bg-indigo-500' },
  ];

  // Donut chart calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius; // ~238.76
  const strokeDashoffset = circumference - (Math.min(overallPercent, 100) / 100) * circumference;

  // Recent activities (from real scores or fallback examples matching student)
  const recentActivities = allScores.slice(0, 3).map((item, idx) => ({
    id: `score-${idx}`,
    title: item.title || item.topicName || (item.type === 'exam' ? 'Đề thi thử Tuyển sinh 10' : 'Luyện tập chuyên đề'),
    author: studentName,
    time: idx === 0 ? '1m ago' : idx === 1 ? '1h ago' : '1d ago',
    score: `${item.score}đ`,
    type: item.type,
  }));

  // Fallback if no scores yet
  if (recentActivities.length === 0) {
    recentActivities.push(
      {
        id: 'default-1',
        title: 'Mục tiêu & Kế hoạch ôn tập',
        author: studentName,
        time: '1m ago',
        score: `${targetScore}đ`,
        type: 'exam',
      },
      {
        id: 'default-2',
        title: `Điểm chuẩn THPT - ${targetSchool}`,
        author: 'Tuyển sinh 10',
        time: '1h ago',
        score: '2025',
        type: 'practice',
      },
      {
        id: 'default-3',
        title: 'Luyện thi Chuyên đề Toán & Văn',
        author: studentName,
        time: '2d ago',
        score: 'Mới',
        type: 'practice',
      }
    );
  }

  return (
    <section className="space-y-4 sm:space-y-6">
      {/* Top Header: Title "Home Dashboard" + CTA button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Home Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Bảng điều khiển học tập & theo dõi tiến trình tuyển sinh 10
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

      {/* Row 1: 3 Stat Cards (Matching Mockup exactly) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        
        {/* Card 1: Progress charts (Circular Donut Chart) */}
        <div className="rounded-2xl bg-white/95 dark:bg-slate-850/95 backdrop-blur-xs border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <span>Progress charts</span>
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

              {/* Number in center (e.g. "31") */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-800 dark:text-slate-100 leading-none">
                  {overallPercent > 0 ? overallPercent : 31}
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
            {totalCompletedTopics} / {totalTopicsCount} chuyên đề đã học
          </div>
        </div>

        {/* Card 2: Progress (Weekly Bar Chart) */}
        <div className="rounded-2xl bg-white/95 dark:bg-slate-850/95 backdrop-blur-xs border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <span>Thời gian ôn luyện (tuần)</span>
          </div>

          {/* Vertical Bars Mo -> Fri */}
          <div className="flex items-end justify-between gap-2 h-28 my-2 px-1">
            {weeklyData.map((item, idx) => (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div className="w-full max-w-[28px] bg-slate-100 dark:bg-slate-800 rounded-t-lg h-full flex items-end overflow-hidden p-0.5">
                  <div 
                    className="w-full bg-indigo-500 dark:bg-indigo-500 rounded-t-md transition-all duration-500 group-hover:bg-indigo-600"
                    style={{ height: `${item.height}%` }}
                    title={`${item.label}: ${item.height}% năng suất`}
                  />
                </div>
                <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                  {item.day}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Chuỗi liên tục:</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{progress.streakDays || 1} ngày</span>
          </div>
        </div>

        {/* Card 3: Recent activity (Monthly/Topic Bar Chart) */}
        <div className="rounded-2xl bg-white/95 dark:bg-slate-850/95 backdrop-blur-xs border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <span>Recent activity</span>
          </div>

          {/* Monthly Bars Jan -> May */}
          <div className="flex items-end justify-between gap-2 h-28 my-2 px-1">
            {subjectBars.map((bar) => (
              <div key={bar.label} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div className="w-full max-w-[24px] bg-slate-100 dark:bg-slate-800 rounded-t-lg h-full flex items-end overflow-hidden p-0.5">
                  <div 
                    className={`w-full ${bar.color} rounded-t-md transition-all duration-500`}
                    style={{ height: `${bar.count}%` }}
                    title={`${bar.label}: ${bar.count}%`}
                  />
                </div>
                <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                  {bar.label}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Thời lượng học:</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{(progress.studyTimeMinutes / 60).toFixed(1)}h</span>
          </div>
        </div>

      </div>

      {/* Row 2: Wave Chart (Left) + Recent Activity List (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        
        {/* Wave / Area Chart (Span 2 columns on desktop) */}
        <div className="lg:col-span-2 rounded-2xl bg-white/95 dark:bg-slate-850/95 backdrop-blur-xs border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Recent activity</span>
            
            {/* Quick toggle tab as in mockup */}
            <div className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Tổng quan</span>
            </div>
          </div>

          {/* Smooth Wave Area Chart (SVG with linear gradient) */}
          <div className="relative w-full h-44 sm:h-48 my-1">
            <svg 
              className="w-full h-full overflow-visible" 
              viewBox="0 0 500 160" 
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="waveGradient2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="currentColor" strokeDasharray="3 3" className="text-slate-100 dark:text-slate-800" strokeWidth="1" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="currentColor" strokeDasharray="3 3" className="text-slate-100 dark:text-slate-800" strokeWidth="1" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="currentColor" strokeDasharray="3 3" className="text-slate-100 dark:text-slate-800" strokeWidth="1" />

              {/* Wave 2 Area (Subtle cyan) */}
              <path
                d="M 0,130 C 80,110 150,140 230,105 C 310,70 390,95 500,65 L 500,160 L 0,160 Z"
                fill="url(#waveGradient2)"
              />
              <path
                d="M 0,130 C 80,110 150,140 230,105 C 310,70 390,95 500,65"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeOpacity="0.8"
              />

              {/* Wave 1 Area (Primary indigo) */}
              <path
                d="M 0,140 C 70,125 140,90 220,115 C 300,140 380,60 500,45 L 500,160 L 0,160 Z"
                fill="url(#waveGradient)"
              />
              <path
                d="M 0,140 C 70,125 140,90 220,115 C 300,140 380,60 500,45"
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
              />

              {/* Highlight Point on Wave */}
              <circle cx="220" cy="115" r="4.5" className="fill-white stroke-indigo-600 stroke-2" />
              <circle cx="380" cy="75" r="4.5" className="fill-white stroke-indigo-600 stroke-2" />
            </svg>

            {/* Floating Marker Badge as in mockup */}
            <div className="absolute top-[35%] left-[40%] transform -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 rounded-lg bg-indigo-600 text-white text-[10px] font-bold shadow-md pointer-events-none flex items-center gap-1">
              <span>Điểm số</span>
            </div>
          </div>

          {/* X Axis Timeline Labels */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Ngày 1</span>
            <span>Ngày 5</span>
            <span>Ngày 10</span>
            <span>Ngày 15</span>
            <span>Hôm nay</span>
          </div>
        </div>

        {/* Recent Activity List Card (Matching right card in mockup) */}
        <div className="rounded-2xl bg-white/95 dark:bg-slate-850/95 backdrop-blur-xs border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
            <span>Recent activity</span>
            <button 
              onClick={() => onNavigate('account')}
              className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Xem tất cả
            </button>
          </div>

          {/* List items */}
          <div className="space-y-3 flex-1">
            {recentActivities.map((act) => (
              <div 
                key={act.id} 
                className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Avatar thumbnail */}
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
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
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
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              onClick={() => onNavigate('practice')}
              className="w-full py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              Tiếp tục luyện tập →
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
