import React, { useState } from 'react';
import { 
  User, 
  Target, 
  School, 
  Moon, 
  Sun, 
  Bookmark, 
  Save, 
  RotateCcw, 
  ShieldCheck, 
  Award,
  Sparkles,
  HelpCircle,
  FileText,
  CheckCircle2,
  AlertCircle,
  Mail,
  RefreshCw,
  LogOut,
  ExternalLink,
  Check,
  X,
  Lock
} from 'lucide-react';
import { UserProfile, UserProgress, Exam } from '../types';
import { HCM_SCHOOLS } from '../data/examsData';
import { isRememberLoginEnabled, setRememberLoginEnabled } from '../data/userStorage';

// Official 4-color Google G Icon
export const GoogleIcon: React.FC<{ className?: string }> = ({ className = "h-4 w-4" }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

const AVATAR_OPTIONS = ['🎓', '🎒', '📚', '🏆', '⭐', '🚀', '💡', '🦁', '🐯', '🦉', '🎯', '✨'];

interface AccountViewProps {
  progress: UserProgress;
  exams: Exam[];
  darkMode: boolean;
  onToggleDarkMode: (event?: React.MouseEvent) => void;
  onUpdateProfile: (profile: UserProfile) => void;
  onResetProgress: () => void;
  onLinkGoogle?: (email: string, displayName?: string) => void;
  onUnlinkGoogle?: () => void;
  onLoginGoogle?: (email: string, displayName?: string) => void;
  onLogoutGoogle?: () => void;
  onOpenAuthModal?: (mode?: 'login' | 'register') => void;
  onLogoutAuth?: () => void;
  onStartExam: (exam: Exam) => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  progress,
  exams,
  darkMode,
  onToggleDarkMode,
  onUpdateProfile,
  onResetProgress,
  onLinkGoogle,
  onUnlinkGoogle,
  onLoginGoogle,
  onLogoutGoogle,
  onOpenAuthModal,
  onLogoutAuth,
  onStartExam
}) => {
  const [name, setName] = useState(progress.profile.name || '');
  const [avatar, setAvatar] = useState(progress.profile.avatar || '🎓');
  const [email, setEmail] = useState(progress.profile.email || '');
  const [currentSchool, setCurrentSchool] = useState(progress.profile.currentSchool || '');
  const [currentClass, setCurrentClass] = useState(progress.profile.currentClass || '');
  const [targetSchool, setTargetSchool] = useState(progress.profile.targetSchool || '');
  const [targetScore, setTargetScore] = useState(progress.profile.targetScore ?? 21.0);
  const [nv2School, setNv2School] = useState(progress.profile.nv2School || '');
  const [nv3School, setNv3School] = useState(progress.profile.nv3School || '');
  
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Google Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [selectedGoogleAccount, setSelectedGoogleAccount] = useState<'default' | 'custom'>('default');
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [googleNotification, setGoogleNotification] = useState<string | null>(null);

  // Remember login state
  const [rememberLogin, setRememberLogin] = useState<boolean>(() => isRememberLoginEnabled());

  // Bookmarked exams list (safeguarded against undefined exams)
  const bookmarkedExams = (exams || []).filter(e => progress?.bookmarkedExamIds?.includes(e.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...progress.profile,
      name: name.trim() || 'Học sinh Lớp 9',
      avatar,
      email: email.trim() || 'nnkh93a@gmail.com',
      currentSchool: currentSchool.trim() || 'THCS tại TP.HCM',
      currentClass: currentClass.trim() || '9A1',
      targetSchool,
      targetScore: Number(targetScore) || 23.5,
      nv2School,
      nv3School
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleConfirmGoogleLink = () => {
    const targetEmail = selectedGoogleAccount === 'default' 
      ? 'nnkh93a@gmail.com' 
      : (customGoogleEmail.trim() || 'nnkh93a@gmail.com');
    const targetName = selectedGoogleAccount === 'default'
      ? 'Nguyễn Hoàng Nam'
      : (name || targetEmail.split('@')[0]);
    
    setEmail(targetEmail);
    if (onLoginGoogle) {
      onLoginGoogle(targetEmail, targetName);
    } else if (onLinkGoogle) {
      onLinkGoogle(targetEmail, targetName);
    }

    setShowGoogleModal(false);
    setGoogleNotification(`Đã đăng nhập Google (${targetEmail}) và đồng bộ lại toàn bộ dữ liệu thành công!`);
    setTimeout(() => setGoogleNotification(null), 4000);
  };

  const handleConfirmLogout = () => {
    if (onLogoutAuth) {
      onLogoutAuth();
    } else if (onLogoutGoogle) {
      onLogoutGoogle();
    } else if (onUnlinkGoogle) {
      onUnlinkGoogle();
    }
    setShowLogoutConfirm(false);
    setGoogleNotification('Đã đăng xuất tài khoản. Dữ liệu đã chuyển về trạng thái trắng (0).');
    setTimeout(() => setGoogleNotification(null), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          Hồ Sơ Người Dùng & Tài Khoản Google
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Quản lý tài khoản đăng nhập Google, email đồng bộ đám mây, thông tin học sinh và mục tiêu tuyển sinh Lớp 10 TP.HCM
        </p>
      </div>

      {/* Success/Action notification banner */}
      {googleNotification && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 p-3.5 text-xs sm:text-sm font-semibold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-sm animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{googleNotification}</span>
        </div>
      )}

      {/* SECTION 1: Google Account Linking Card */}
      <div 
        id="google-account-card"
        className="rounded-2xl border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-2xs overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-5 py-4 bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <GoogleIcon className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Tài Khoản Đăng Nhập & Đồng Bộ Dữ Liệu
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Đăng xuất để về dữ liệu trắng, đăng nhập lại sẽ tự động đồng bộ lại toàn bộ tiến trình học tập
              </p>
            </div>
          </div>

          {progress.profile.email && (progress.profile.isAuthenticated || progress.profile.isGoogleLinked) ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Đã đăng nhập • Đang đồng bộ
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
              Chế độ Khách (Dữ liệu trắng)
            </span>
          )}
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          {progress.profile.email && (progress.profile.isAuthenticated || progress.profile.isGoogleLinked) ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-indigo-100 dark:border-indigo-950/70 bg-gradient-to-r from-indigo-50/60 via-sky-50/40 to-slate-50 dark:from-indigo-950/30 dark:via-slate-900 dark:to-slate-900 p-4">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-900 text-2xl shadow-xs">
                    {progress.profile.avatar || '🎓'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white dark:bg-slate-900 shadow border border-slate-200 dark:border-slate-700">
                    {progress.profile.isGoogleLinked ? (
                      <GoogleIcon className="h-3 w-3" />
                    ) : (
                      <Mail className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      {progress.profile.googleDisplayName || progress.profile.name}
                    </h3>
                    <span className="rounded-md bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
                      {progress.profile.isGoogleLinked ? 'Tài khoản Google' : 'Tài khoản Email'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{progress.profile.email}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-emerald-500" />
                    Dữ liệu được sao lưu an toàn • Đăng xuất sẽ về dữ liệu trắng, đăng nhập lại sẽ đồng bộ đầy đủ
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 sm:pt-0">
                <button
                  id="switch-account-btn"
                  onClick={() => {
                    if (onOpenAuthModal) {
                      onOpenAuthModal('login');
                    } else {
                      setShowGoogleModal(true);
                    }
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-2xs"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
                  Đổi tài khoản
                </button>

                {showLogoutConfirm ? (
                  <div className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/60 p-1.5 rounded-xl border border-rose-200 dark:border-rose-900">
                    <button
                      id="confirm-logout-btn"
                      onClick={handleConfirmLogout}
                      className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700 transition-colors cursor-pointer"
                    >
                      Xác nhận đăng xuất
                    </button>
                    <button
                      onClick={() => setShowLogoutConfirm(false)}
                      className="rounded-lg border border-slate-200 dark:border-slate-700 px-2 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 cursor-pointer"
                    >
                      Hủy
                    </button>
                  </div>
                ) : (
                  <button
                    id="logout-btn"
                    onClick={() => setShowLogoutConfirm(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 px-3.5 py-2 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer"
                    title="Đăng xuất tài khoản (Dữ liệu sẽ chuyển về trắng)"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Đăng xuất
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-amber-300 dark:border-amber-800/80 bg-amber-50/40 dark:bg-amber-950/20 p-5 text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs text-indigo-600 dark:text-indigo-400">
                <Mail className="h-6 w-6" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Đang ở chế độ Khách (Dữ liệu trắng)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Bạn chưa đăng nhập hoặc vừa đăng xuất. Đăng nhập tài khoản Email hoặc Google — hệ thống sẽ tự động đồng bộ lại toàn bộ dữ liệu học tập, chuyên đề đã hoàn thành và bài thi thử của bạn!
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  id="account-view-email-login-btn"
                  onClick={() => onOpenAuthModal && onOpenAuthModal('login')}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 text-xs font-bold shadow-md transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <Mail className="h-4 w-4" />
                  Đăng nhập Email
                </button>

                <button
                  id="account-view-email-register-btn"
                  onClick={() => onOpenAuthModal && onOpenAuthModal('register')}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 px-4 py-2.5 text-xs font-bold shadow-2xs transition-all cursor-pointer"
                >
                  <User className="h-4 w-4 text-slate-500" />
                  Tạo tài khoản mới
                </button>

                <button
                  id="login-google-sync-btn"
                  onClick={() => setShowGoogleModal(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-3.5 py-2.5 text-xs font-semibold transition-all cursor-pointer"
                >
                  <GoogleIcon className="h-3.5 w-3.5 bg-white rounded-full p-0.5" />
                  Đăng nhập Google
                </button>
              </div>
            </div>
          )}

          {/* Tùy chọn Lưu trạng thái đăng nhập (Ghi nhớ đăng nhập) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/80">
            <div className="flex items-start sm:items-center gap-3">
              <div className={`p-2 rounded-xl shrink-0 ${rememberLogin ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Lưu đăng nhập trên thiết bị này
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${rememberLogin ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                    {rememberLogin ? '● Đã bật (Lưu tài khoản)' : '○ Đang tắt (Mặc định Khách)'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {rememberLogin
                    ? 'Tài khoản của bạn sẽ được giữ nguyên khi truy cập lại trang web.'
                    : 'Khi vào lại web sẽ bắt đầu ở chế độ Khách (chỉ giữ tài khoản khi bạn chọn Lưu đăng nhập).'}
                </p>
              </div>
            </div>

            <button
              type="button"
              id="toggle-remember-login-btn"
              onClick={() => {
                const next = !rememberLogin;
                setRememberLogin(next);
                setRememberLoginEnabled(next);
              }}
              className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                rememberLogin
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
              }`}
            >
              {rememberLogin ? 'Đang lưu đăng nhập ✓' : 'Bật lưu đăng nhập'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Profile form */}
        <div className="md:col-span-2 space-y-6">
          <form 
            onSubmit={handleSaveProfile}
            className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-2xs space-y-5"
          >
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <School className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Thông tin học sinh & Nguyện vọng xét tuyển
            </h2>

            {/* Avatar Selector */}
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3.5 border border-slate-200/70 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Hình đại diện học sinh (đồng bộ với biểu tượng góc trên bên trái)
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {AVATAR_OPTIONS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setAvatar(item)}
                    className={`h-10 w-10 rounded-xl flex items-center justify-center text-xl transition-all cursor-pointer ${
                      avatar === item
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 shadow-md scale-110'
                        : 'bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:scale-105'
                    }`}
                    title={`Chọn biểu tượng ${item}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Họ và tên học sinh
                </label>
                <input
                  id="input-student-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs sm:text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  placeholder="Ví dụ: Nguyễn Hoàng Nam"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email tài khoản Google đăng nhập
                </label>
                <div className="relative">
                  <input
                    id="input-google-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 pl-8 pr-3 py-2 text-xs sm:text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white font-medium"
                    placeholder="nnkh93a@gmail.com"
                    required
                  />
                  <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <GoogleIcon className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lớp học hiện tại
                </label>
                <input
                  id="input-current-class"
                  type="text"
                  value={currentClass}
                  onChange={(e) => setCurrentClass(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs sm:text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  placeholder="Ví dụ: 9A1"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Trường THCS đang theo học
                </label>
                <input
                  id="input-current-school"
                  type="text"
                  value={currentSchool}
                  onChange={(e) => setCurrentSchool(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs sm:text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  placeholder="Ví dụ: THCS Lê Quý Đôn (Quận 3)"
                />
              </div>
            </div>

            {/* Target Settings */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Mục tiêu tuyển sinh vào Lớp 10 tại TP.HCM
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Trường THPT Nguyện vọng 1 (NV1)
                  </label>
                  <select
                    id="select-target-school"
                    value={targetSchool}
                    onChange={(e) => setTargetSchool(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {HCM_SCHOOLS.map(sc => (
                      <option key={sc.id} value={sc.name}>
                        {sc.name}
                      </option>
                    ))}
                    <option value="Trường THPT khác tại TP.HCM">Trường THPT khác tại TP.HCM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mục tiêu tổng điểm 3 môn (Toán + Văn + Anh)
                  </label>
                  <div className="relative">
                    <input
                      id="input-target-score"
                      type="number"
                      step="0.25"
                      min="10"
                      max="30"
                      value={targetScore}
                      onChange={(e) => setTargetScore(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs sm:text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white pr-10"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">
                      điểm
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Mục tiêu trung bình mỗi môn: ~{(targetScore / 3).toFixed(1)} điểm
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Trường Nguyện vọng 2 (NV2)
                  </label>
                  <input
                    id="input-nv2-school"
                    type="text"
                    value={nv2School}
                    onChange={(e) => setNv2School(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs sm:text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    placeholder="THPT Bùi Thị Xuân"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Trường Nguyện vọng 3 (NV3)
                  </label>
                  <input
                    id="input-nv3-school"
                    type="text"
                    value={nv3School}
                    onChange={(e) => setNv3School(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs sm:text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    placeholder="THPT Tây Thạnh"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {savedSuccess ? (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  ✓ Đã lưu thông tin hồ sơ thành công!
                </span>
              ) : (
                <span className="text-xs text-slate-400">
                  Dữ liệu được lưu trữ và liên kết với tài khoản Google
                </span>
              )}

              <button
                id="save-profile-button"
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Save className="h-4 w-4" />
                Lưu hồ sơ
              </button>
            </div>
          </form>

          {/* Bookmarked Exams list */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-rose-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Đề Thi Đã Đánh Dấu Yêu Thích ({bookmarkedExams.length})
                </h3>
              </div>
            </div>

            {bookmarkedExams.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-400">
                Bạn chưa lưu đề thi nào. Hãy bấm biểu tượng bookmark ở Thư viện đề thi để lưu lại.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {bookmarkedExams.map((exam) => (
                  <div key={exam.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        {exam.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {exam.year} • {exam.durationMinutes} phút • {exam.questionsCount} câu hỏi
                      </p>
                    </div>
                    <button
                      onClick={() => onStartExam(exam)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-400 font-bold transition-colors cursor-pointer"
                    >
                      Làm đề
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Preferences & Danger Zone */}
        <div className="space-y-6">
          {/* Target Summary Card */}
          <div className="rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 p-5 text-white shadow-md space-y-4 border border-indigo-950">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                Nguyện vọng 1
              </span>
              <Award className="h-5 w-5 text-amber-400" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">
                {progress.profile.targetSchool}
              </h3>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-amber-400">{progress.profile.targetScore}</span>
                <span className="text-xs text-slate-300">điểm chuẩn mục tiêu</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 text-xs text-slate-300 space-y-2">
              <div className="flex justify-between items-center">
                <span>Tài khoản:</span>
                <span className="font-medium text-white flex items-center gap-1">
                  <GoogleIcon className="h-3 w-3" />
                  <span className="truncate max-w-[130px]">{progress.profile.email}</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span>Điểm TB hiện tại:</span>
                <strong className="text-white">
                  {((progress?.practiceAttempts?.length || 0) + (progress?.examAttempts?.length || 0)) > 0
                    ? (((progress?.practiceAttempts || []).reduce((a, b) => a + (b.score || 0), 0) + (progress?.examAttempts || []).reduce((a, b) => a + (b.score || 0), 0)) / ((progress?.practiceAttempts?.length || 0) + (progress?.examAttempts?.length || 0))).toFixed(1)
                    : '0.0'}đ
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Chuỗi ngày học:</span>
                <strong className="text-orange-400">{progress?.streakDays || 0} ngày 🔥</strong>
              </div>
            </div>
          </div>

          {/* Theme Switcher */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Giao diện ứng dụng
            </h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {darkMode ? <Moon className="h-4 w-4 text-indigo-400" /> : <Sun className="h-4 w-4 text-amber-500" />}
                <span>{darkMode ? 'Chế độ tối (Dark Mode)' : 'Chế độ sáng (Light Mode)'}</span>
              </div>

              <button
                id="toggle-dark-mode-account-btn"
                onClick={(e) => onToggleDarkMode(e)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Chuyển đổi
              </button>
            </div>
          </div>

          {/* Reset progress */}
          <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5 dark:border-rose-950 dark:bg-rose-950/20 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400">
              Khởi động lại dữ liệu
            </h3>
            <p className="text-xs text-rose-700/80 dark:text-rose-300/80 leading-relaxed">
              Xóa toàn bộ lịch sử làm bài, các chuyên đề đã đánh dấu đã học và đưa tiến trình về 0 để ôn tập lại từ đầu.
            </p>

            {showResetConfirm ? (
              <div className="space-y-2 pt-1">
                <p className="text-xs font-bold text-rose-900 dark:text-rose-200">
                  Bạn có chắc chắn muốn reset tiến trình về 0 không?
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    id="confirm-reset-progress-btn"
                    onClick={() => {
                      onResetProgress();
                      setShowResetConfirm(false);
                      setGoogleNotification('Đã reset toàn bộ tiến trình học tập về 0!');
                      setTimeout(() => setGoogleNotification(null), 3000);
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
                  >
                    Xác nhận reset về 0
                  </button>
                </div>
              </div>
            ) : (
              <button
                id="reset-progress-btn"
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-900 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/80 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Đặt lại toàn bộ tiến độ về 0
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Google Account Linking Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <GoogleIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Đăng nhập bằng Google
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Chọn tài khoản để tiếp tục với Cùng Ôn Luyện Lớp 10
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowGoogleModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Account List */}
            <div className="space-y-3">
              {/* Default User Google Account */}
              <div 
                onClick={() => setSelectedGoogleAccount('default')}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedGoogleAccount === 'default'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 dark:border-indigo-500 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-sm">
                    N
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      Nguyễn Hoàng Nam
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      nnkh93a@gmail.com
                    </p>
                  </div>
                </div>

                {selectedGoogleAccount === 'default' && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </span>
                )}
              </div>

              {/* Custom Google Account Option */}
              <div 
                onClick={() => setSelectedGoogleAccount('custom')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-2.5 ${
                  selectedGoogleAccount === 'custom'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 dark:border-indigo-500 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        Sử dụng một tài khoản Google khác
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Nhập địa chỉ Gmail cá nhân hoặc tài khoản trường học
                      </p>
                    </div>
                  </div>

                  {selectedGoogleAccount === 'custom' && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                  )}
                </div>

                {selectedGoogleAccount === 'custom' && (
                  <div className="pt-1">
                    <input
                      type="email"
                      value={customGoogleEmail}
                      onChange={(e) => setCustomGoogleEmail(e.target.value)}
                      placeholder="vidu@gmail.com"
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs text-slate-900 dark:text-white dark:bg-slate-800 focus:outline-none focus:border-indigo-500"
                      autoFocus
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Privacy notice */}
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                Cùng Ôn Luyện chỉ đồng bộ điểm số và bài tập trên tài khoản này. Thông tin bảo mật theo tiêu chuẩn Google OAuth.
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                id="confirm-link-google-modal-btn"
                type="button"
                onClick={handleConfirmGoogleLink}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                <GoogleIcon className="h-3.5 w-3.5 bg-white rounded-full p-0.5" />
                Xác nhận liên kết
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
