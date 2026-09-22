import React, { useState, useEffect } from 'react';
import { 
  Menu,
  X,
  GraduationCap, 
  BookOpen, 
  CheckSquare, 
  FileText, 
  Sun, 
  Moon, 
  User, 
  Target,
  LogOut,
  ChevronRight,
  Sparkles,
  BarChart3,
  Gamepad2
} from 'lucide-react';
import { UserProgress } from '../types';
import { GoogleIcon } from './AccountView';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  progress: UserProgress;
  darkMode?: boolean;
  toggleDarkMode?: () => void;
  isDarkMode?: boolean;
  setIsDarkMode?: (val: boolean) => void;
  onOpenAccount?: () => void;
  onOpenGoogleLogin?: () => void;
  onLogoutGoogle?: () => void;
  onOpenAuthModal?: (mode?: 'login' | 'register') => void;
  onLogoutAuth?: () => void;
  onOpenGeminiConfig?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  progress,
  darkMode,
  toggleDarkMode,
  isDarkMode,
  setIsDarkMode,
  onOpenAccount,
  onOpenGoogleLogin,
  onLogoutGoogle,
  onOpenAuthModal,
  onLogoutAuth,
  onOpenGeminiConfig
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const activeDarkMode = darkMode !== undefined ? darkMode : (isDarkMode ?? false);
  const handleToggleTheme = toggleDarkMode || (() => setIsDarkMode && setIsDarkMode(!activeDarkMode));

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsDrawerOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  const handleOpenProfile = () => {
    if (onOpenAccount) {
      onOpenAccount();
    } else {
      setCurrentTab('account');
    }
    setIsDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setIsDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Note: "Tiến trình" is removed as requested; user views progress directly on Home
  const navItems = [
    { id: 'home', label: 'Trang chủ', desc: 'Tổng quan & Tiến độ học', icon: GraduationCap },
    { id: 'knowledge', label: 'Kiến thức', desc: 'Lý thuyết trọng tâm 3 môn', icon: BookOpen },
    { id: 'practice', label: 'Luyện tập', desc: 'Rèn luyện theo chuyên đề', icon: CheckSquare },
    { id: 'exams', label: 'Thư viện đề thi', desc: 'Đề thi chính thức có bấm giờ', icon: FileText },
    { id: 'minigame', label: 'Minigame', desc: 'Flashcard & Ghép nối 3 môn', icon: Gamepad2 },
    { id: 'benchmarks', label: 'Điểm chuẩn THPT', desc: 'So sánh điểm chuẩn 6 tỉnh/thành', icon: BarChart3 },
    { id: 'account', label: 'Mục tiêu & Tài khoản', desc: 'Nguyện vọng tuyển sinh 10', icon: Target }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Top-Left: Hamburger Menu Button (3 gạch ngang) + Student Avatar & Brand Logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger Button (3 horizontal lines) - Opens sliding drawer */}
            <button
              id="main-drawer-hamburger-btn"
              onClick={() => setIsDrawerOpen(true)}
              title="Mở thanh công cụ điều hướng"
              aria-label="Mở thanh công cụ"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-indigo-400 transition-colors shadow-2xs cursor-pointer active:scale-95"
            >
              <Menu className="h-5 w-5 stroke-[2.2]" />
            </button>

            {/* Student Avatar Button */}
            <button
              id="top-left-avatar-btn"
              onClick={handleOpenProfile}
              title={`Hồ sơ học sinh: ${progress.profile.name} (Nhấn để xem & sửa mục tiêu)`}
              className={`group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all cursor-pointer select-none shadow-xs ${
                currentTab === 'account'
                  ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 bg-indigo-600 text-white shadow-sm scale-105'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 shadow-2xs hover:scale-105 active:scale-95'
              }`}
              aria-label="Truy cập hồ sơ học sinh"
            >
              {progress.profile.avatar ? (
                <span className="text-xl leading-none select-none group-hover:scale-110 transition-transform">
                  {progress.profile.avatar}
                </span>
              ) : (
                <User className="h-5 w-5 group-hover:scale-110 transition-transform" />
              )}
              {/* Active / Google status dot */}
              {progress.profile.isGoogleLinked ? (
                <span 
                  className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs" 
                  title={`Đã liên kết tài khoản Google: ${progress.profile.email}`}
                >
                  <GoogleIcon className="h-2.5 w-2.5" />
                </span>
              ) : (
                <span 
                  className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" 
                  title="Đang hoạt động"
                />
              )}
            </button>

            {/* Brand Logo & Title */}
            <div 
              className="flex items-center cursor-pointer select-none"
              onClick={() => {
                setCurrentTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              id="brand-logo-btn"
              title="Về Trang chủ Cùng Ôn Luyện.AI"
            >
              <div className="flex items-baseline gap-0.5">
                <span className="text-base sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Cùng Ôn Luyện
                </span>
                <span className="text-base sm:text-xl font-black text-indigo-600 dark:text-indigo-400">
                  .AI
                </span>
              </div>
            </div>
          </div>

          {/* Center: Desktop Navigation Bar - Icons only */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navItems.slice(0, 6).map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`desktop-nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  title={`${item.label} - ${item.desc}`}
                  aria-label={item.label}
                  className={`group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400 shadow-2xs scale-105 ring-1 ring-indigo-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${isActive ? 'stroke-[2.3]' : 'stroke-[1.9]'}`} />
                  {isActive && (
                    <span className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: Target School, Theme Toggle & Account */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Gemini AI Settings / Connection Button */}
            {onOpenGeminiConfig && (
              <button
                id="navbar-gemini-ai-btn"
                onClick={onOpenGeminiConfig}
                title="Cấu hình Google Gemini AI chấm thi theo ma trận tuyển sinh 10"
                className="flex items-center gap-1.5 h-9 px-2.5 sm:px-3 rounded-lg border border-purple-200/90 dark:border-purple-900/60 bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 dark:from-purple-950/50 dark:via-indigo-950/50 dark:to-pink-950/40 text-purple-700 dark:text-purple-300 hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-900/70 dark:hover:to-indigo-900/70 transition-all shadow-2xs cursor-pointer active:scale-95 text-xs font-bold"
                aria-label="Cấu hình Gemini AI"
              >
                <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 fill-purple-500/20" />
                <span className="hidden sm:inline">Gemini AI</span>
              </button>
            )}

            {/* Target School Badge / Button - Icon only with informative tooltip */}
            <button 
              onClick={handleOpenProfile}
              id="target-school-badge-btn"
              title={`Mục tiêu trường lớp 10: ${progress.profile.targetSchool} (${progress.profile.targetScore} điểm)`}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer active:scale-95"
              aria-label={`Mục tiêu trường: ${progress.profile.targetSchool}`}
            >
              <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={(e) => handleToggleTheme(e)}
              title={activeDarkMode ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer active:scale-95 overflow-hidden"
              aria-label="Toggle dark mode"
            >
              <span className={`inline-flex items-center justify-center transition-transform duration-500 ease-out ${activeDarkMode ? 'rotate-180 scale-105' : 'rotate-0 scale-100'}`}>
                {activeDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600 dark:text-slate-300" />}
              </span>
            </button>

            {/* Auth Action Button */}
            {progress.profile.email && (progress.profile.isAuthenticated || progress.profile.isGoogleLinked) ? (
              <button
                id="navbar-user-profile-btn"
                onClick={handleOpenProfile}
                title={`Tài khoản: ${progress.profile.name || progress.profile.email}`}
                className="flex items-center gap-1.5 h-9 pl-2 pr-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer active:scale-95 text-xs font-bold"
              >
                <span className="text-sm leading-none">{progress.profile.avatar || '🎓'}</span>
                <span className="hidden sm:inline max-w-[90px] truncate text-xs">
                  {progress.profile.name?.split(' ').pop() || progress.profile.email.split('@')[0]}
                </span>
              </button>
            ) : (
              <button
                id="navbar-login-btn"
                onClick={() => (onOpenAuthModal ? onOpenAuthModal('login') : handleOpenProfile())}
                className="flex items-center gap-1.5 h-9 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer active:scale-95"
              >
                <User className="h-3.5 w-3.5" />
                <span>Đăng nhập</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* SLIDING TOOLBAR DRAWER (TRƯỢT DẦN RA TỪ BÊN TRÁI KHI ẤN BA GẠCH NGANG)     */}
      {/* ========================================================================= */}
      
      {/* Backdrop Overlay */}
      <div
        aria-hidden="true"
        onClick={() => setIsDrawerOpen(false)}
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ${
          isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer Panel */}
      <aside
        id="sliding-navigation-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Thanh công cụ điều hướng"
        className={`fixed inset-y-0 left-0 z-50 w-[280px] sm:w-[320px] max-w-[85vw] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between transform transition-transform duration-300 ease-out ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 shadow-xs">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-baseline gap-0.5">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                    Cùng Ôn Luyện
                  </span>
                  <span className="font-black text-sm text-indigo-600 dark:text-indigo-400">
                    .AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Luyện thi tinh gọn & hiệu quả
                </p>
              </div>
            </div>

            <button
              id="close-drawer-btn"
              onClick={() => setIsDrawerOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Đóng thanh công cụ"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Student Profile Quick Snippet in Drawer */}
          <div 
            onClick={handleOpenProfile}
            className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:border-indigo-300 dark:hover:border-indigo-600 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-base">
                {progress.profile.avatar || <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />}
              </span>
              <div className="min-w-0">
                <p className="font-bold text-xs text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {progress.profile.name || 'Sĩ tử lớp 9'}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                  <Target className="h-3 w-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Mục tiêu: {progress.profile.targetSchool} ({progress.profile.targetScore}đ)</span>
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Drawer Navigation Links */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1.5">
          <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Menu Chức năng
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`drawer-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400 font-bold shadow-2xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                }`}
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 shadow-xs'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs sm:text-sm font-semibold truncate leading-tight">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {item.desc}
                  </div>
                </div>
                {isActive && (
                  <span className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                )}
              </button>
            );
          })}

          {onOpenGeminiConfig && (
            <button
              id="drawer-gemini-ai-config-btn"
              onClick={() => {
                setIsDrawerOpen(false);
                onOpenGeminiConfig();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 border border-purple-200/80 dark:border-purple-900/60 text-purple-700 dark:text-purple-300 font-bold transition-all cursor-pointer shadow-2xs hover:from-purple-100 hover:to-indigo-100 mt-2"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/60 dark:text-purple-300 shadow-xs">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm font-bold truncate leading-tight">
                  Cấu hình Gemini AI
                </div>
                <div className="text-[11px] text-purple-600/80 dark:text-purple-300/80 truncate">
                  Chấm thi theo ma trận chuẩn
                </div>
              </div>
            </button>
          )}
        </div>

        {/* Drawer Footer Actions: Dark Mode & Sync */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Giao diện {activeDarkMode ? 'Tối' : 'Sáng'}
            </span>
            <button
              onClick={(e) => handleToggleTheme(e)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer"
            >
              {activeDarkMode ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  <span>Bật Sáng</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
                  <span>Bật Tối</span>
                </>
              )}
            </button>
          </div>

          {progress.profile.email && (progress.profile.isAuthenticated || progress.profile.isGoogleLinked) ? (
            <div className="pt-2 space-y-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-base">{progress.profile.avatar || '🎓'}</span>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate">
                      {progress.profile.name || progress.profile.email}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {progress.profile.email}
                    </p>
                  </div>
                </div>
                <button
                  id="drawer-logout-btn"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    if (onLogoutAuth) {
                      onLogoutAuth();
                    } else if (onLogoutGoogle) {
                      onLogoutGoogle();
                    }
                  }}
                  className="shrink-0 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer px-2 py-1"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-2 space-y-2 border-t border-slate-200 dark:border-slate-800">
              <button
                id="drawer-login-email-btn"
                onClick={() => {
                  setIsDrawerOpen(false);
                  if (onOpenAuthModal) onOpenAuthModal('login');
                  else handleOpenProfile();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white py-2 text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <User className="h-3.5 w-3.5" />
                <span>Đăng nhập Email</span>
              </button>

              <button
                id="drawer-register-email-btn"
                onClick={() => {
                  setIsDrawerOpen(false);
                  if (onOpenAuthModal) onOpenAuthModal('register');
                  else handleOpenProfile();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 py-2 text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                <span>Tạo tài khoản mới</span>
              </button>

              {onOpenGoogleLogin && (
                <button
                  id="drawer-google-login-btn"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    onOpenGoogleLogin();
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 py-1.5 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  <GoogleIcon className="h-3 w-3 bg-white rounded-full p-0.5" />
                  <span>Hoặc đăng nhập với Google</span>
                </button>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
