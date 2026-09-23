import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Loader2, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  School,
  Calendar
} from 'lucide-react';
import { 
  validateEmail, 
  loginWithEmail, 
  registerWithEmail, 
  loginWithGoogle,
  requestForgotPassword, 
  AuthUser 
} from '../services/authService';
import { isRememberLoginEnabled, setRememberLoginEnabled } from '../data/userStorage';

export type AuthModalMode = 'login' | 'register' | 'forgot';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AuthUser, token: string, rememberLogin?: boolean) => void;
  initialMode?: AuthModalMode;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<AuthModalMode>(initialMode);

  // Remember login state (Default unchecked as requested: "lúc vào web để tài khoản là khách nhé, chỉ khi nhấn lưu đăng nhập thì mới giữ tài khoản thôi")
  const [rememberLogin, setRememberLogin] = useState<boolean>(() => isRememberLoginEnabled());

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Register optional fields
  const [birthYear, setBirthYear] = useState('');
  const [currentSchool, setCurrentSchool] = useState('');
  const [currentClass, setCurrentClass] = useState('');

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation touched states
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // Loading & submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Server error or success feedback
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  // Reset form when opening or changing mode
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setBirthYear('');
      setCurrentSchool('');
      setCurrentClass('');
      setTouchedFields({});
      setServerError(null);
      setServerSuccess(null);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  // Validation functions
  const getEmailError = (): string | null => {
    if (!touchedFields.email) return null;
    if (!email || !email.trim()) return 'Email không được để trống.';
    const validation = validateEmail(email);
    if (!validation.isValid) return validation.error || 'Email không đúng định dạng.';
    return null;
  };

  const getPasswordError = (): string | null => {
    if (!touchedFields.password) return null;
    if (!password) return 'Mật khẩu không được để trống.';
    if (mode === 'register' && password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự.';
    return null;
  };

  const getNameError = (): string | null => {
    if (mode !== 'register') return null;
    if (!touchedFields.name) return null;
    if (!name || !name.trim()) return 'Vui lòng nhập họ và tên.';
    return null;
  };

  const getConfirmPasswordError = (): string | null => {
    if (mode !== 'register') return null;
    if (!touchedFields.confirmPassword) return null;
    if (!confirmPassword) return 'Vui lòng nhập lại mật khẩu.';
    if (confirmPassword !== password) return 'Mật khẩu nhập lại không khớp.';
    return null;
  };

  const getBirthYearError = (): string | null => {
    if (mode !== 'register') return null;
    if (!birthYear) return null; // tuỳ chọn
    const year = parseInt(birthYear, 10);
    if (isNaN(year) || year < 2000 || year > 2015) return 'Năm sinh không hợp lệ (2000–2015).';
    return null;
  };

  const isFormValid = (): boolean => {
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) return false;

    if (mode === 'login') {
      return Boolean(password && password.trim());
    }

    if (mode === 'register') {
      return Boolean(
        name.trim() &&
        password &&
        password.length >= 6 &&
        confirmPassword === password
      );
    }

    if (mode === 'forgot') {
      return emailValidation.isValid;
    }

    return false;
  };

  const markAllTouched = () => {
    setTouchedFields({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      birthYear: true,
    });
  };

  const handleBlur = (field: string) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleChangeEmail = (val: string) => {
    setEmail(val);
    if (serverError) setServerError(null);
  };

  const handleChangePassword = (val: string) => {
    setPassword(val);
    if (serverError) setServerError(null);
  };

  // Google Login
  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      const res = await loginWithGoogle();
      setIsSubmitting(false);
      if (res.success && res.user && res.token) {
        setRememberLoginEnabled(rememberLogin);
        onSuccess(res.user, res.token, rememberLogin);
        onClose();
      } else if (res.error) {
        setServerError(res.error);
      }
    } catch {
      setIsSubmitting(false);
      setServerError('Không thể kết nối đến Google. Vui lòng thử lại.');
    }
  };

  // Submit Handler for Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    markAllTouched();

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid || !password) return;

    setIsSubmitting(true);
    setServerError(null);

    const res = await loginWithEmail(email, password);
    setIsSubmitting(false);

    if (res.success && res.user && res.token) {
      setRememberLoginEnabled(rememberLogin);
      onSuccess(res.user, res.token, rememberLogin);
      onClose();
    } else {
      setServerError(res.error || 'Email hoặc mật khẩu không chính xác.');
    }
  };

  // Submit Handler for Register
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    markAllTouched();

    if (!isFormValid()) return;

    // Kiểm tra năm sinh nếu được điền
    const birthYearNum = birthYear.trim() ? parseInt(birthYear.trim(), 10) : undefined;
    if (birthYear.trim() && (isNaN(birthYearNum!) || birthYearNum! < 2000 || birthYearNum! > 2015)) return;

    setIsSubmitting(true);
    setServerError(null);

    const extraProfile = {
      birthYear: birthYearNum,
      currentSchool: currentSchool.trim() || undefined,
      currentClass: currentClass.trim() || undefined,
    };

    const res = await registerWithEmail(name, email, password, extraProfile);
    setIsSubmitting(false);

    if (res.success && res.user && res.token) {
      setRememberLoginEnabled(rememberLogin);
      onSuccess(res.user, res.token, rememberLogin);
      onClose();
    } else {
      setServerError(res.error || 'Đăng ký không thành công. Vui lòng thử lại.');
    }
  };

  // Submit Handler for Forgot Password
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouchedFields((prev) => ({ ...prev, email: true }));

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) return;

    setIsSubmitting(true);
    setServerError(null);

    const res = await requestForgotPassword(email);
    setIsSubmitting(false);

    if (res.success) {
      setServerSuccess(
        res.message ||
        `Đã gửi liên kết đặt lại mật khẩu đến ${email.trim()}. Vui lòng kiểm tra hộp thư (cả mục Spam) và nhấn vào liên kết trong email để tạo mật khẩu mới.`
      );
    } else {
      setServerError(res.error || 'Không thể gửi yêu cầu đặt lại mật khẩu.');
    }
  };

  const emailErr = getEmailError();
  const passwordErr = getPasswordError();
  const nameErr = getNameError();
  const confirmErr = getConfirmPasswordError();
  const birthYearErr = getBirthYearError();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="auth-modal-container"
        className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              {mode === 'login' && 'Đăng nhập'}
              {mode === 'register' && 'Tạo tài khoản'}
              {mode === 'forgot' && 'Quên mật khẩu'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {mode === 'login' && 'Đăng nhập để đồng bộ kết quả ôn thi và bài tập qua Firebase'}
              {mode === 'register' && 'Tạo tài khoản miễn phí lưu trữ tiến độ ôn thi 24/7'}
              {mode === 'forgot' && 'Nhập email để nhận đường dẫn đặt lại mật khẩu qua thư'}
            </p>
          </div>

          <button
            id="close-auth-modal-btn"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            aria-label="Đóng cửa sổ"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Server Success Alert */}
        {serverSuccess && (
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 p-3.5 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="leading-relaxed font-semibold">Yêu cầu đã được gửi!</p>
              <p className="leading-relaxed text-[11px] opacity-90">{serverSuccess}</p>
            </div>
          </div>
        )}

        {/* Server Error Alert */}
        {serverError && (
          <div 
            id="auth-server-error-alert"
            className="rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 p-3 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2 animate-in fade-in"
          >
            <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">{serverError}</p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 1: ĐĂNG NHẬP (LOGIN)                                                 */}
        {/* ========================================================================= */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} noValidate className="space-y-3.5">
            {/* Google Login Button */}
            <button
              type="button"
              id="google-login-btn"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full h-11 flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs disabled:opacity-60"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Đăng nhập với Google</span>
            </button>

            <div className="relative my-2 flex items-center justify-center">
              <div className="border-t border-slate-200 dark:border-slate-750 w-full"></div>
              <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">hoặc</span>
            </div>

            {/* Field: Email */}
            <div className="space-y-1">
              <label 
                htmlFor="login-email-input"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="login-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => handleChangeEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  placeholder="tennguoidung@tenmien.com"
                  autoComplete="email"
                  className={`w-full h-11 pl-10 pr-3.5 rounded-xl border text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-850 placeholder:text-slate-400 focus:outline-none transition-colors ${
                    emailErr
                      ? 'border-rose-500 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'
                  }`}
                />
              </div>
              {emailErr && (
                <p id="login-email-error" className="text-[11px] font-medium text-rose-600 dark:text-rose-400 mt-1">
                  {emailErr}
                </p>
              )}
            </div>

            {/* Field: Password */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="login-password-input"
                  className="block text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Mật khẩu
                </label>
                <button
                  type="button"
                  id="link-forgot-password"
                  onClick={() => {
                    setMode('forgot');
                    setServerError(null);
                    setServerSuccess(null);
                  }}
                  className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Quên mật khẩu?
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => handleChangePassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  placeholder="Nhập mật khẩu của bạn"
                  autoComplete="current-password"
                  className={`w-full h-11 pl-10 pr-10 rounded-xl border text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-850 placeholder:text-slate-400 focus:outline-none transition-colors ${
                    passwordErr
                      ? 'border-rose-500 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'
                  }`}
                />
                <button
                  type="button"
                  id="toggle-password-visibility-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordErr && (
                <p id="login-password-error" className="text-[11px] font-medium text-rose-600 dark:text-rose-400 mt-1">
                  {passwordErr}
                </p>
              )}
            </div>

            {/* Lưu đăng nhập Checkbox */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                id="login-remember-me-checkbox"
                type="checkbox"
                checked={rememberLogin}
                onChange={(e) => setRememberLogin(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="login-remember-me-checkbox" className="text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Lưu đăng nhập trên thiết bị này</span>
                <span className="block text-[11px] text-slate-400 mt-0.5">
                  (Nếu không chọn, tài khoản sẽ tự động chuyển về Khách mỗi khi vào lại website)
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="submit-login-btn"
              disabled={isSubmitting}
              className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang đăng nhập...</span>
                </>
              ) : (
                <>
                  <span>Đăng nhập</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Toggle to Register */}
            <div className="pt-2 text-center text-xs text-slate-600 dark:text-slate-400">
              <span>Chưa có tài khoản? </span>
              <button
                type="button"
                id="link-switch-to-register"
                onClick={() => {
                  setMode('register');
                  setServerError(null);
                  setServerSuccess(null);
                }}
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Đăng ký ngay
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: ĐĂNG KÝ (REGISTER)                                                */}
        {/* ========================================================================= */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} noValidate className="space-y-3.5">
            {/* Google Signup Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full h-11 flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs disabled:opacity-60"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Đăng ký nhanh với Google</span>
            </button>

            <div className="relative my-2 flex items-center justify-center">
              <div className="border-t border-slate-200 dark:border-slate-750 w-full"></div>
              <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">hoặc</span>
            </div>

            {/* Field: Full Name */}
            <div className="space-y-1">
              <label 
                htmlFor="register-name-input"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Họ và tên
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="register-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (serverError) setServerError(null);
                  }}
                  onBlur={() => handleBlur('name')}
                  placeholder="Ví dụ: Nguyễn Hoàng Nam"
                  autoComplete="name"
                  className={`w-full h-11 pl-10 pr-3.5 rounded-xl border text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-850 placeholder:text-slate-400 focus:outline-none transition-colors ${
                    nameErr
                      ? 'border-rose-500 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'
                  }`}
                />
              </div>
              {nameErr && (
                <p id="register-name-error" className="text-[11px] font-medium text-rose-600 dark:text-rose-400 mt-1">
                  {nameErr}
                </p>
              )}
            </div>

            {/* Field: Email */}
            <div className="space-y-1">
              <label 
                htmlFor="register-email-input"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="register-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => handleChangeEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  placeholder="tennguoidung@tenmien.com"
                  autoComplete="email"
                  className={`w-full h-11 pl-10 pr-3.5 rounded-xl border text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-850 placeholder:text-slate-400 focus:outline-none transition-colors ${
                    emailErr
                      ? 'border-rose-500 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'
                  }`}
                />
              </div>
              {emailErr && (
                <p id="register-email-error" className="text-[11px] font-medium text-rose-600 dark:text-rose-400 mt-1">
                  {emailErr}
                </p>
              )}
            </div>

            {/* Field: Password */}
            <div className="space-y-1">
              <label 
                htmlFor="register-password-input"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="register-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => handleChangePassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  placeholder="Ít nhất 6 ký tự"
                  autoComplete="new-password"
                  className={`w-full h-11 pl-10 pr-10 rounded-xl border text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-850 placeholder:text-slate-400 focus:outline-none transition-colors ${
                    passwordErr
                      ? 'border-rose-500 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordErr && (
                <p id="register-password-error" className="text-[11px] font-medium text-rose-600 dark:text-rose-400 mt-1">
                  {passwordErr}
                </p>
              )}
            </div>

            {/* Field: Confirm Password */}
            <div className="space-y-1">
              <label 
                htmlFor="register-confirm-password-input"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Nhập lại mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="register-confirm-password-input"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (serverError) setServerError(null);
                  }}
                  onBlur={() => handleBlur('confirmPassword')}
                  placeholder="Nhập lại chính xác mật khẩu trên"
                  autoComplete="new-password"
                  className={`w-full h-11 pl-10 pr-10 rounded-xl border text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-850 placeholder:text-slate-400 focus:outline-none transition-colors ${
                    confirmErr
                      ? 'border-rose-500 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  title={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmErr && (
                <p id="register-confirm-password-error" className="text-[11px] font-medium text-rose-600 dark:text-rose-400 mt-1">
                  {confirmErr}
                </p>
              )}
            </div>

            {/* ── Thông tin tuỳ chọn ── */}
            <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-2.5 font-medium uppercase tracking-wider">Thông tin học sinh (tuỳ chọn)</p>
              <div className="grid grid-cols-2 gap-2.5">
                {/* Năm sinh */}
                <div className="space-y-1">
                  <label htmlFor="register-birthyear-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Năm sinh
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <input
                      id="register-birthyear-input"
                      type="number"
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value)}
                      onBlur={() => handleBlur('birthYear')}
                      placeholder="VD: 2010"
                      min={2000}
                      max={2015}
                      className={`w-full h-10 pl-9 pr-2 rounded-xl border text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-850 placeholder:text-slate-400 focus:outline-none transition-colors ${
                        birthYearErr
                          ? 'border-rose-500 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                          : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'
                      }`}
                    />
                  </div>
                  {birthYearErr && (
                    <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">{birthYearErr}</p>
                  )}
                </div>

                {/* Lớp */}
                <div className="space-y-1">
                  <label htmlFor="register-class-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Lớp
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      id="register-class-input"
                      type="text"
                      value={currentClass}
                      onChange={(e) => setCurrentClass(e.target.value)}
                      placeholder="VD: 9A1"
                      className="w-full h-10 pl-9 pr-2 rounded-xl border text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-850 placeholder:text-slate-400 border-slate-300 dark:border-slate-700 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Tên trường */}
              <div className="space-y-1 mt-2.5">
                <label htmlFor="register-school-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Tên trường
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <School className="h-4 w-4" />
                  </div>
                  <input
                    id="register-school-input"
                    type="text"
                    value={currentSchool}
                    onChange={(e) => setCurrentSchool(e.target.value)}
                    placeholder="VD: THCS Lê Quý Đôn"
                    className="w-full h-10 pl-10 pr-3.5 rounded-xl border text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-850 placeholder:text-slate-400 border-slate-300 dark:border-slate-700 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Lưu đăng nhập Checkbox */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                id="register-remember-me-checkbox"
                type="checkbox"
                checked={rememberLogin}
                onChange={(e) => setRememberLogin(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="register-remember-me-checkbox" className="text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Lưu đăng nhập trên thiết bị này</span>
                <span className="block text-[11px] text-slate-400 mt-0.5">
                  (Nếu không chọn, tài khoản sẽ tự động chuyển về Khách mỗi khi vào lại website)
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="submit-register-btn"
              disabled={isSubmitting}
              className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang tạo tài khoản...</span>
                </>
              ) : (
                <>
                  <span>Tạo tài khoản</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Toggle to Login */}
            <div className="pt-2 text-center text-xs text-slate-600 dark:text-slate-400">
              <span>Đã có tài khoản? </span>
              <button
                type="button"
                id="link-switch-to-login"
                onClick={() => {
                  setMode('login');
                  setServerError(null);
                  setServerSuccess(null);
                }}
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Đăng nhập
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: QUÊN MẬT KHẨU (FORGOT PASSWORD)                                   */}
        {/* ========================================================================= */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} noValidate className="space-y-3.5">
            <div className="space-y-1">
              <label 
                htmlFor="forgot-email-input"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Nhập Email tài khoản
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="forgot-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => handleChangeEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  placeholder="tennguoidung@tenmien.com"
                  autoComplete="email"
                  className={`w-full h-11 pl-10 pr-3.5 rounded-xl border text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-850 placeholder:text-slate-400 focus:outline-none transition-colors ${
                    emailErr
                      ? 'border-rose-500 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'
                  }`}
                />
              </div>
              {emailErr && (
                <p id="forgot-email-error" className="text-[11px] font-medium text-rose-600 dark:text-rose-400 mt-1">
                  {emailErr}
                </p>
              )}
            </div>

            <button
              type="submit"
              id="submit-forgot-btn"
              disabled={isSubmitting}
              className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang gửi email...</span>
                </>
              ) : (
                <>
                  <span>Gửi liên kết đặt lại mật khẩu</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center text-xs text-slate-600 dark:text-slate-400">
              <button
                type="button"
                id="link-back-to-login"
                onClick={() => {
                  setMode('login');
                  setServerError(null);
                  setServerSuccess(null);
                }}
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Quay lại Đăng nhập
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
