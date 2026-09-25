import React, { useState, useEffect, useRef } from 'react';
import {
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
  Calendar,
  BookOpen,
  Sparkles,
  Trophy,
  Star,
} from 'lucide-react';
import {
  validateEmail,
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  requestForgotPassword,
  AuthUser,
} from '../services/authService';
import { isRememberLoginEnabled, setRememberLoginEnabled } from '../data/userStorage';

type LoginPageMode = 'login' | 'register' | 'forgot';

interface LoginPageProps {
  onSuccess: (user: AuthUser, token: string, rememberLogin?: boolean) => void;
}

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-float-particle"
          style={{
            width: `${(i % 4) + 3}px`,
            height: `${(i % 4) + 3}px`,
            left: `${(i * 17 + 5) % 100}%`,
            top: `${(i * 23 + 10) % 100}%`,
            background: i % 3 === 0 ? '#818cf8' : i % 3 === 1 ? '#34d399' : '#f472b6',
            opacity: 0.2,
            animationDelay: `${i * 0.4}s`,
            animationDuration: `${(i % 5) + 8}s`,
          }}
        />
      ))}
    </div>
  );
}

function FeatureBadge({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-xs font-medium border border-white/20">
      <Icon className="h-3.5 w-3.5 text-indigo-300" />
      <span>{label}</span>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
    </svg>
  );
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<LoginPageMode>('login');
  const [rememberLogin, setRememberLogin] = useState(() => isRememberLoginEnabled());

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [currentSchool, setCurrentSchool] = useState('');
  const [currentClass, setCurrentClass] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    setName(''); setEmail(''); setPassword(''); setConfirmPassword('');
    setBirthYear(''); setCurrentSchool(''); setCurrentClass('');
    setTouchedFields({}); setServerError(null); setServerSuccess(null);
    setShowPassword(false); setShowConfirmPassword(false);
    setFormKey(k => k + 1);
  }, [mode]);

  const getEmailError = (): string | null => {
    if (!touchedFields.email) return null;
    if (!email.trim()) return 'Email không được để trống.';
    const v = validateEmail(email);
    return v.isValid ? null : (v.error || 'Email không đúng định dạng.');
  };

  const getPasswordError = (): string | null => {
    if (!touchedFields.password) return null;
    if (!password) return 'Mật khẩu không được để trống.';
    if (mode === 'register' && password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự.';
    return null;
  };

  const getNameError = (): string | null => {
    if (mode !== 'register' || !touchedFields.name) return null;
    if (!name.trim()) return 'Vui lòng nhập họ và tên.';
    return null;
  };

  const getConfirmPasswordError = (): string | null => {
    if (mode !== 'register' || !touchedFields.confirmPassword) return null;
    if (!confirmPassword) return 'Vui lòng nhập lại mật khẩu.';
    if (confirmPassword !== password) return 'Mật khẩu nhập lại không khớp.';
    return null;
  };

  const getBirthYearError = (): string | null => {
    if (mode !== 'register' || !birthYear) return null;
    const y = parseInt(birthYear, 10);
    if (isNaN(y) || y < 2000 || y > 2015) return 'Năm sinh không hợp lệ (2000–2015).';
    return null;
  };

  const isFormValid = (): boolean => {
    const ev = validateEmail(email);
    if (!ev.isValid) return false;
    if (mode === 'login') return Boolean(password.trim());
    if (mode === 'register') return Boolean(name.trim() && password.length >= 6 && confirmPassword === password);
    if (mode === 'forgot') return ev.isValid;
    return false;
  };

  const markAllTouched = () =>
    setTouchedFields({ name: true, email: true, password: true, confirmPassword: true, birthYear: true });

  const handleBlur = (field: string) =>
    setTouchedFields(p => ({ ...p, [field]: true }));

  const handleGoogleLogin = async () => {
    setIsSubmitting(true); setServerError(null);
    try {
      const res = await loginWithGoogle();
      setIsSubmitting(false);
      if (res.success && res.user && res.token) {
        setRememberLoginEnabled(rememberLogin);
        onSuccess(res.user, res.token, rememberLogin);
      } else if (res.error) {
        setServerError(res.error);
      }
    } catch {
      setIsSubmitting(false);
      setServerError('Không thể kết nối đến Google. Vui lòng thử lại.');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); markAllTouched();
    if (!validateEmail(email).isValid || !password) return;
    setIsSubmitting(true); setServerError(null);
    const res = await loginWithEmail(email, password);
    setIsSubmitting(false);
    if (res.success && res.user && res.token) {
      setRememberLoginEnabled(rememberLogin);
      onSuccess(res.user, res.token, rememberLogin);
    } else {
      setServerError(res.error || 'Email hoặc mật khẩu không chính xác.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); markAllTouched();
    if (!isFormValid()) return;
    const birthYearNum = birthYear.trim() ? parseInt(birthYear.trim(), 10) : undefined;
    if (birthYear.trim() && (isNaN(birthYearNum!) || birthYearNum! < 2000 || birthYearNum! > 2015)) return;
    setIsSubmitting(true); setServerError(null);
    const res = await registerWithEmail(name, email, password, {
      birthYear: birthYearNum,
      currentSchool: currentSchool.trim() || undefined,
      currentClass: currentClass.trim() || undefined,
    });
    setIsSubmitting(false);
    if (res.success && res.user && res.token) {
      setRememberLoginEnabled(rememberLogin);
      onSuccess(res.user, res.token, rememberLogin);
    } else {
      setServerError(res.error || 'Đăng ký không thành công. Vui lòng thử lại.');
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouchedFields(p => ({ ...p, email: true }));
    if (!validateEmail(email).isValid) return;
    setIsSubmitting(true); setServerError(null);
    const res = await requestForgotPassword(email);
    setIsSubmitting(false);
    if (res.success) {
      setServerSuccess(res.message || `Đã gửi liên kết đặt lại mật khẩu đến ${email.trim()}. Vui lòng kiểm tra hộp thư (cả mục Spam).`);
    } else {
      setServerError(res.error || 'Không thể gửi yêu cầu đặt lại mật khẩu.');
    }
  };

  const switchMode = (m: LoginPageMode) => {
    setServerError(null); setServerSuccess(null); setMode(m);
  };

  const emailErr = getEmailError();
  const passwordErr = getPasswordError();
  const nameErr = getNameError();
  const confirmErr = getConfirmPasswordError();
  const birthYearErr = getBirthYearError();

  const inputCls = (err: string | null | undefined) =>
    `w-full h-11 pl-10 pr-3.5 rounded-xl border text-sm text-slate-900 bg-slate-50 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all ${
      err
        ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
        : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
    }`;

  const PasswordToggle = ({ show, toggle }: { show: boolean; toggle: () => void }) => (
    <button
      type="button"
      onClick={toggle}
      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
      tabIndex={-1}
    >
      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );

  const FieldError = ({ msg }: { msg: string }) => (
    <p className="text-[11px] font-medium text-rose-500 flex items-center gap-1 mt-0.5">
      <AlertCircle className="h-3 w-3 shrink-0" />{msg}
    </p>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 overflow-hidden">
      {/* LEFT HERO */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-700 via-violet-700 to-purple-800">
        <Particles />
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full bg-indigo-500/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-60px] right-[-60px] w-64 h-64 rounded-full bg-violet-500/30 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-[-40px] w-48 h-48 rounded-full bg-purple-400/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full justify-between px-12 py-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-extrabold text-xl tracking-tight">
              Cùng Ôn Luyện<span className="text-indigo-200">.AI</span>
            </span>
          </div>

          {/* Main copy */}
          <div className="space-y-6 max-w-md">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5 text-xs text-indigo-200 font-semibold border border-white/20">
                <Sparkles className="h-3 w-3" />
                Nền tảng ôn thi Tuyển sinh 10 TP.HCM
              </div>
              <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight">
                Chinh phục kỳ thi{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-violet-200">
                  Tuyển sinh 10
                </span>
              </h1>
              <p className="text-base text-white/70 leading-relaxed">
                Hệ thống ôn luyện thông minh với AI, ngân hàng đề thi TP.HCM và lộ trình học tập cá nhân hoá cho Toán – Văn – Anh.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <FeatureBadge icon={Trophy} label="Kho đề thi TP.HCM" />
              <FeatureBadge icon={Star} label="Luyện tập AI" />
              <FeatureBadge icon={BookOpen} label="Kiến thức hệ thống" />
              <FeatureBadge icon={Sparkles} label="Minigame học tập" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '3 môn', label: 'Toán · Văn · Anh' },
              { value: '100+', label: 'Đề thi thực tế' },
              { value: 'AI', label: 'Chấm bài thông minh' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/15 text-center">
                <div className="text-2xl font-black text-white">{value}</div>
                <div className="text-xs text-white/60 mt-1 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 sm:px-8 lg:px-12 bg-white lg:bg-slate-50 overflow-y-auto">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2.5 mb-8">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <span className="text-slate-900 font-extrabold text-lg">
            Cùng Ôn Luyện<span className="text-indigo-600">.AI</span>
          </span>
        </div>

        {/* Card */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-100 p-6 sm:p-8 space-y-5">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900">
              {mode === 'login' && 'Chào mừng trở lại!'}
              {mode === 'register' && 'Tạo tài khoản mới'}
              {mode === 'forgot' && 'Quên mật khẩu?'}
            </h2>
            <p className="text-sm text-slate-500">
              {mode === 'login' && 'Đăng nhập để tiếp tục ôn luyện và đồng bộ tiến trình của bạn.'}
              {mode === 'register' && 'Tạo tài khoản miễn phí để lưu tiến độ ôn thi mọi lúc, mọi nơi.'}
              {mode === 'forgot' && 'Nhập email để nhận liên kết đặt lại mật khẩu qua thư.'}
            </p>
          </div>

          {serverSuccess && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Yêu cầu đã được gửi!</p>
                <p className="text-[12px] text-emerald-700 leading-relaxed mt-1">{serverSuccess}</p>
              </div>
            </div>
          )}

          {serverError && (
            <div id="login-page-server-error" className="rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-sm text-rose-700 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
              <p className="font-medium leading-relaxed">{serverError}</p>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form key={formKey} onSubmit={handleLoginSubmit} noValidate className="space-y-4">
              <button type="button" id="lp-google-login-btn" onClick={handleGoogleLogin} disabled={isSubmitting}
                className="w-full h-11 flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all cursor-pointer shadow-sm hover:shadow-md disabled:opacity-60 active:scale-[0.98]">
                <GoogleIcon /><span>Đăng nhập với Google</span>
              </button>

              <div className="relative my-1 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                <span className="relative bg-white px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">hoặc</span>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="lp-login-email" className="block text-xs font-bold text-slate-700">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400"><Mail className="h-4 w-4" /></div>
                  <input id="lp-login-email" type="email" value={email}
                    onChange={e => { setEmail(e.target.value); if (serverError) setServerError(null); }}
                    onBlur={() => handleBlur('email')} placeholder="tennguoidung@tenmien.com"
                    autoComplete="email" className={inputCls(emailErr).replace('pr-3.5', 'pr-3.5')} />
                </div>
                {emailErr && <FieldError msg={emailErr} />}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="lp-login-password" className="block text-xs font-bold text-slate-700">Mật khẩu</label>
                  <button type="button" id="lp-forgot-link" onClick={() => switchMode('forgot')}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer">
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400"><Lock className="h-4 w-4" /></div>
                  <input id="lp-login-password" type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => { setPassword(e.target.value); if (serverError) setServerError(null); }}
                    onBlur={() => handleBlur('password')} placeholder="Nhập mật khẩu của bạn"
                    autoComplete="current-password"
                    className={`w-full h-11 pl-10 pr-10 rounded-xl border text-sm text-slate-900 bg-slate-50 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all ${passwordErr ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'}`} />
                  <PasswordToggle show={showPassword} toggle={() => setShowPassword(p => !p)} />
                </div>
                {passwordErr && <FieldError msg={passwordErr} />}
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <input id="lp-login-remember" type="checkbox" checked={rememberLogin}
                  onChange={e => setRememberLogin(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-indigo-600 cursor-pointer" />
                <label htmlFor="lp-login-remember" className="text-xs text-slate-600 cursor-pointer select-none">
                  <span className="font-semibold text-slate-800">Lưu đăng nhập trên thiết bị này</span>
                  <span className="block text-[11px] text-slate-400 mt-0.5">(Nếu không chọn, tài khoản sẽ tự động chuyển về Khách khi đóng trình duyệt)</span>
                </label>
              </div>

              <button type="submit" id="lp-submit-login" disabled={isSubmitting}
                className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-sm font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2 active:scale-[0.98]">
                {isSubmitting ? (<><Loader2 className="h-4 w-4 animate-spin" /><span>Đang đăng nhập...</span></>) : (<><span>Đăng nhập</span><ArrowRight className="h-4 w-4" /></>)}
              </button>

              <p className="text-center text-xs text-slate-500 pt-1">
                Chưa có tài khoản?{' '}
                <button type="button" id="lp-switch-to-register" onClick={() => switchMode('register')}
                  className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer">Đăng ký ngay</button>
              </p>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <form key={formKey} onSubmit={handleRegisterSubmit} noValidate className="space-y-3.5">
              <button type="button" onClick={handleGoogleLogin} disabled={isSubmitting}
                className="w-full h-11 flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all cursor-pointer shadow-sm hover:shadow-md disabled:opacity-60 active:scale-[0.98]">
                <GoogleIcon /><span>Đăng ký nhanh với Google</span>
              </button>

              <div className="relative my-1 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                <span className="relative bg-white px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">hoặc</span>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label htmlFor="lp-reg-name" className="block text-xs font-bold text-slate-700">Họ và tên</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400"><User className="h-4 w-4" /></div>
                  <input id="lp-reg-name" type="text" value={name}
                    onChange={e => { setName(e.target.value); if (serverError) setServerError(null); }}
                    onBlur={() => handleBlur('name')} placeholder="Ví dụ: Nguyễn Hoàng Nam"
                    autoComplete="name" className={inputCls(nameErr)} />
                </div>
                {nameErr && <FieldError msg={nameErr} />}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="lp-reg-email" className="block text-xs font-bold text-slate-700">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400"><Mail className="h-4 w-4" /></div>
                  <input id="lp-reg-email" type="email" value={email}
                    onChange={e => { setEmail(e.target.value); if (serverError) setServerError(null); }}
                    onBlur={() => handleBlur('email')} placeholder="tennguoidung@tenmien.com"
                    autoComplete="email" className={inputCls(emailErr)} />
                </div>
                {emailErr && <FieldError msg={emailErr} />}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="lp-reg-password" className="block text-xs font-bold text-slate-700">Mật khẩu</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400"><Lock className="h-4 w-4" /></div>
                  <input id="lp-reg-password" type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => { setPassword(e.target.value); if (serverError) setServerError(null); }}
                    onBlur={() => handleBlur('password')} placeholder="Ít nhất 6 ký tự"
                    autoComplete="new-password"
                    className={`w-full h-11 pl-10 pr-10 rounded-xl border text-sm text-slate-900 bg-slate-50 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all ${passwordErr ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'}`} />
                  <PasswordToggle show={showPassword} toggle={() => setShowPassword(p => !p)} />
                </div>
                {passwordErr && <FieldError msg={passwordErr} />}
              </div>

              {/* Confirm */}
              <div className="space-y-1.5">
                <label htmlFor="lp-reg-confirm" className="block text-xs font-bold text-slate-700">Nhập lại mật khẩu</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400"><Lock className="h-4 w-4" /></div>
                  <input id="lp-reg-confirm" type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword}
                    onChange={e => { setConfirmPassword(e.target.value); if (serverError) setServerError(null); }}
                    onBlur={() => handleBlur('confirmPassword')} placeholder="Nhập lại chính xác mật khẩu trên"
                    autoComplete="new-password"
                    className={`w-full h-11 pl-10 pr-10 rounded-xl border text-sm text-slate-900 bg-slate-50 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all ${confirmErr ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'}`} />
                  <PasswordToggle show={showConfirmPassword} toggle={() => setShowConfirmPassword(p => !p)} />
                </div>
                {confirmErr && <FieldError msg={confirmErr} />}
              </div>

              {/* Optional fields */}
              <div className="pt-1 border-t border-slate-100">
                <p className="text-[11px] text-slate-400 mb-2.5 font-medium uppercase tracking-wider">Thông tin học sinh (tuỳ chọn)</p>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label htmlFor="lp-reg-birthyear" className="block text-xs font-bold text-slate-700">Năm sinh</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400"><Calendar className="h-4 w-4" /></div>
                      <input id="lp-reg-birthyear" type="number" value={birthYear}
                        onChange={e => setBirthYear(e.target.value)} onBlur={() => handleBlur('birthYear')}
                        placeholder="VD: 2010" min={2000} max={2015}
                        className={`w-full h-10 pl-9 pr-2 rounded-xl border text-xs text-slate-900 bg-slate-50 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all ${birthYearErr ? 'border-rose-400' : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'}`} />
                    </div>
                    {birthYearErr && <p className="text-[11px] font-medium text-rose-500">{birthYearErr}</p>}
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="lp-reg-class" className="block text-xs font-bold text-slate-700">Lớp</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400"><User className="h-4 w-4" /></div>
                      <input id="lp-reg-class" type="text" value={currentClass}
                        onChange={e => setCurrentClass(e.target.value)} placeholder="VD: 9A1"
                        className="w-full h-10 pl-9 pr-2 rounded-xl border text-xs text-slate-900 bg-slate-50 placeholder:text-slate-400 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none focus:bg-white transition-all" />
                    </div>
                  </div>
                </div>
                <div className="space-y-1 mt-2.5">
                  <label htmlFor="lp-reg-school" className="block text-xs font-bold text-slate-700">Tên trường</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400"><School className="h-4 w-4" /></div>
                    <input id="lp-reg-school" type="text" value={currentSchool}
                      onChange={e => setCurrentSchool(e.target.value)} placeholder="VD: THCS Lê Quý Đôn"
                      className="w-full h-10 pl-10 pr-3.5 rounded-xl border text-xs text-slate-900 bg-slate-50 placeholder:text-slate-400 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none focus:bg-white transition-all" />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <input id="lp-reg-remember" type="checkbox" checked={rememberLogin}
                  onChange={e => setRememberLogin(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-indigo-600 cursor-pointer" />
                <label htmlFor="lp-reg-remember" className="text-xs text-slate-600 cursor-pointer select-none">
                  <span className="font-semibold text-slate-800">Lưu đăng nhập trên thiết bị này</span>
                  <span className="block text-[11px] text-slate-400 mt-0.5">(Nếu không chọn, tài khoản sẽ tự động chuyển về Khách khi đóng trình duyệt)</span>
                </label>
              </div>

              <button type="submit" id="lp-submit-register" disabled={isSubmitting}
                className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-sm font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2 active:scale-[0.98]">
                {isSubmitting ? (<><Loader2 className="h-4 w-4 animate-spin" /><span>Đang tạo tài khoản...</span></>) : (<><span>Tạo tài khoản</span><ArrowRight className="h-4 w-4" /></>)}
              </button>

              <p className="text-center text-xs text-slate-500 pt-1">
                Đã có tài khoản?{' '}
                <button type="button" id="lp-switch-to-login" onClick={() => switchMode('login')}
                  className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer">Đăng nhập</button>
              </p>
            </form>
          )}

          {/* FORGOT FORM */}
          {mode === 'forgot' && (
            <form key={formKey} onSubmit={handleForgotSubmit} noValidate className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="lp-forgot-email" className="block text-xs font-bold text-slate-700">Email tài khoản</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400"><Mail className="h-4 w-4" /></div>
                  <input id="lp-forgot-email" type="email" value={email}
                    onChange={e => { setEmail(e.target.value); if (serverError) setServerError(null); }}
                    onBlur={() => handleBlur('email')} placeholder="tennguoidung@tenmien.com"
                    autoComplete="email" className={inputCls(emailErr)} />
                </div>
                {emailErr && <FieldError msg={emailErr} />}
              </div>

              <button type="submit" id="lp-submit-forgot" disabled={isSubmitting}
                className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-sm font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2 active:scale-[0.98]">
                {isSubmitting ? (<><Loader2 className="h-4 w-4 animate-spin" /><span>Đang gửi email...</span></>) : (<><span>Gửi liên kết đặt lại mật khẩu</span><ArrowRight className="h-4 w-4" /></>)}
              </button>

              <p className="text-center text-xs text-slate-500 pt-1">
                <button type="button" id="lp-back-to-login" onClick={() => switchMode('login')}
                  className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer">
                  ← Quay lại Đăng nhập
                </button>
              </p>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-[11px] text-slate-400 max-w-xs">
          Bằng cách đăng nhập, bạn đồng ý với điều khoản sử dụng của Cùng Ôn Luyện.AI.
        </p>
      </div>

      <style>{`
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.15; }
          33% { transform: translateY(-20px) translateX(10px); opacity: 0.3; }
          66% { transform: translateY(-10px) translateX(-15px); opacity: 0.2; }
        }
        .animate-float-particle { animation: floatParticle linear infinite; }
      `}</style>
    </div>
  );
};
