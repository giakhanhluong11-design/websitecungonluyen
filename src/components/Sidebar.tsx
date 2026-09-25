import React from 'react';
import { 
  Home, 
  BookOpen, 
  CheckSquare, 
  FileText, 
  Gamepad2, 
  BarChart3, 
  Settings, 
  Sun, 
  Moon, 
  LogOut, 
  ChevronRight, 
  User,
  X
} from 'lucide-react';
import { UserProgress } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  progress: UserProgress;
  darkMode: boolean;
  toggleDarkMode: () => void;
  onOpenAccount: () => void;
  onLogout: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  progress,
  darkMode,
  toggleDarkMode,
  onOpenAccount,
  onLogout,
  isMobileOpen,
  onCloseMobile,
}) => {
  const handleNav = (tabId: string) => {
    setCurrentTab(tabId);
    onCloseMobile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAccountClick = () => {
    onOpenAccount();
    onCloseMobile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mục tiêu điểm thi (mặc định 21đ nếu chưa cài)
  const targetScoreDisplay = progress.profile.targetScore 
    ? `${progress.profile.targetScore}đ` 
    : (progress.targetSchool.targetScore ? `${progress.targetSchool.targetScore}đ` : '21đ');

  const studentName = progress.profile.name || 'Robin Lương';

  const navHocTap = [
    { id: 'home', label: 'Trang chủ', icon: Home },
    { id: 'knowledge', label: 'Kiến thức', icon: BookOpen },
    { id: 'practice', label: 'Luyện tập', icon: CheckSquare },
    { id: 'exams', label: 'Thư viện đề thi', icon: FileText },
  ];

  const navTienIch = [
    { id: 'minigame', label: 'Minigame', icon: Gamepad2 },
    { id: 'benchmarks', label: 'Điểm chuẩn THPT', icon: BarChart3 },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between select-none">
      {/* Top area */}
      <div className="space-y-4">
        {/* Mobile close button */}
        <div className="lg:hidden flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Thực đơn</span>
          <button 
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Đóng thanh điều hướng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Card (Floating badge as in mockup) */}
        <div 
          onClick={handleAccountClick}
          className="group relative flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-700/80 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 cursor-pointer"
          title="Xem và chỉnh sửa hồ sơ & mục tiêu"
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar circle */}
            <div className="relative h-11 w-11 shrink-0 rounded-full overflow-hidden bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-950 dark:to-slate-800 border-2 border-indigo-200/80 dark:border-indigo-700 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold shadow-xs">
              {progress.profile.avatar ? (
                <span className="text-xl leading-none">{progress.profile.avatar}</span>
              ) : (
                <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              )}
              {/* Online pulse dot */}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-850 rounded-full" />
            </div>

            {/* User name & target */}
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {studentName}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                Mục tiêu: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{targetScoreDisplay}</span>
              </div>
            </div>
          </div>

          {/* Chevron */}
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
        </div>

        {/* Section: HỌC TẬP */}
        <div className="pt-2">
          <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-1.5">
            HỌC TẬP
          </div>
          <nav className="space-y-1">
            {navHocTap.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50/80 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Section: TIỆN ÍCH */}
        <div className="pt-1">
          <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-1.5">
            TIỆN ÍCH
          </div>
          <nav className="space-y-1">
            {navTienIch.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50/80 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Area: Settings, Theme Toggle & Logout */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
        {/* Account / Settings button */}
        <button
          onClick={handleAccountClick}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
            currentTab === 'account'
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
          <span>Cài đặt tài khoản</span>
        </button>

        {/* Light / Dark Mode Toggle with Switch (exact as mockup) */}
        <div className="flex items-center justify-between px-3 py-2 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-3">
            {darkMode ? (
              <Moon className="w-4 h-4 text-indigo-400 shrink-0" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500 shrink-0" />
            )}
            <span className="text-slate-700 dark:text-slate-300 font-medium text-xs sm:text-sm">Giao diện Sáng/Tối</span>
          </div>

          {/* Realistic Switch Toggle */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              darkMode ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
            role="switch"
            aria-checked={darkMode}
            title={darkMode ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                darkMode ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            onCloseMobile();
            onLogout();
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 h-screen sticky top-0 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-30 p-4 shrink-0 transition-colors">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 transition-opacity animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Panel */}
      <div 
        className={`lg:hidden fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 p-4 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};
