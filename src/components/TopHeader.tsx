import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Sparkles, 
  User, 
  X,
  ExternalLink,
  BookOpen,
  FileText
} from 'lucide-react';
import { UserProgress } from '../types';

interface TopHeaderProps {
  onToggleSidebar: () => void;
  progress: UserProgress;
  onOpenAccount: () => void;
  onOpenGeminiConfig?: () => void;
  onNavigateSearch?: (query: string) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onToggleSidebar,
  progress,
  onOpenAccount,
  onOpenGeminiConfig,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: '1',
      title: 'Kỳ thi Tuyển sinh 10 đang đến gần!',
      desc: 'Hãy duy trì chuỗi học và làm ít nhất 1 đề thi mỗi tuần.',
      time: 'Hôm nay',
      unread: true
    },
    {
      id: '2',
      title: 'Đã cập nhật đề thi mới',
      desc: 'Bộ đề thi chính thức TP.HCM các năm đã sẵn sàng.',
      time: 'Hôm qua',
      unread: false
    }
  ];

  return (
    <header className="sticky top-0 z-20 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* Left side: Hamburger Toggle + Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          {/* Hamburger Menu Toggle (Visible on Mobile/Tablet) */}
          <button
            onClick={onToggleSidebar}
            title="Mở thanh điều hướng"
            aria-label="Mở thanh điều hướng"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer active:scale-95 lg:hidden"
          >
            <Menu className="h-5 w-5 stroke-[2.2]" />
          </button>

          {/* Search Bar matching mockup */}
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 pr-8 py-2 text-sm rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-transparent focus:border-indigo-400 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-850 text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right side: AI Config + Notifications + Profile Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Gemini AI Config button */}
          {onOpenGeminiConfig && (
            <button
              onClick={onOpenGeminiConfig}
              title="Cấu hình Trợ lý AI Gemini"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Trợ lý AI</span>
            </button>
          )}

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              title="Thông báo"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer active:scale-95"
            >
              <Bell className="h-4 w-4" />
              {/* Red notification dot with number 1 like mockup */}
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
                1
              </span>
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowNotifications(false)} 
                />
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100">Thông báo học tập</span>
                    <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">1 mới</span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-700/60 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="py-2.5 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{n.title}</span>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Student Profile Quick Button */}
          <button
            onClick={onOpenAccount}
            title={`Hồ sơ: ${progress.profile.name || 'Học sinh'}`}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            {progress.profile.avatar ? (
              <span className="text-xl leading-none">{progress.profile.avatar}</span>
            ) : (
              <User className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
