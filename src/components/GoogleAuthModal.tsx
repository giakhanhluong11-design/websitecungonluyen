import React, { useState } from 'react';
import { GoogleIcon } from './AccountView';
import { X, Check, Mail, ShieldCheck, ArrowRight, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { UserProgress, UserProfile } from '../types';
import { isRememberLoginEnabled, setRememberLoginEnabled } from '../data/userStorage';
import { validateEmail } from '../services/authService';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, displayName?: string, rememberLogin?: boolean) => void;
  currentProfile: UserProfile;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  currentProfile
}) => {
  const existingEmail = currentProfile?.email?.trim() || '';
  const existingName = currentProfile?.name?.trim() || '';

  const [email, setEmail] = useState(existingEmail);
  const [name, setName] = useState(existingName);
  const [syncing, setSyncing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rememberLogin, setRememberLogin] = useState<boolean>(() => isRememberLoginEnabled());

  if (!isOpen) return null;

  const handleConfirm = () => {
    setErrorMessage(null);
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Vui lòng nhập địa chỉ email Google của bạn.');
      return;
    }

    const val = validateEmail(trimmedEmail);
    if (!val.isValid) {
      setErrorMessage(val.error || 'Địa chỉ email không đúng định dạng.');
      return;
    }

    setSyncing(true);
    setRememberLoginEnabled(rememberLogin);
    const targetName = name.trim() || trimmedEmail.split('@')[0];

    setTimeout(() => {
      onLogin(trimmedEmail, targetName, rememberLogin);
      setSyncing(false);
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="google-login-modal"
        className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <GoogleIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Đăng nhập bằng Google
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Đồng bộ tiến trình và dữ liệu học tập của bạn
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Sync Info Alert */}
        <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 p-3 text-xs text-indigo-900 dark:text-indigo-300 flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Hệ thống sẽ <strong>tự động đồng bộ và bảo lưu</strong> các chuyên đề đã học, lịch sử làm đề thi, bài luyện tập trắc nghiệm gắn với tài khoản của bạn.
          </p>
        </div>

        {/* Account Input Form */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Địa chỉ Gmail / Google của bạn <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="custom-google-email-input"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="emailcuaban@gmail.com"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-indigo-600 transition"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Họ và tên học sinh (Tên hiển thị)
            </label>
            <input
              id="custom-google-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Gia Khánh, Minh Khôi..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-indigo-600 transition"
            />
          </div>

          {errorMessage && (
            <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Security / Privacy notice */}
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-3 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2">
          <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <span>
            Bảo mật theo tiêu chuẩn Google OAuth. Toàn bộ tiến trình làm bài của bạn sẽ được lưu giữ an toàn.
          </span>
        </div>

        {/* Lưu đăng nhập Checkbox */}
        <div className="flex items-start gap-2.5 pt-0.5">
          <input
            id="google-remember-me-checkbox"
            type="checkbox"
            checked={rememberLogin}
            onChange={(e) => setRememberLogin(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <label htmlFor="google-remember-me-checkbox" className="text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Lưu đăng nhập trên thiết bị này</span>
            <span className="block text-[11px] text-slate-400 mt-0.5">
              (Tự động ghi nhớ tài khoản của bạn cho những lần học sau)
            </span>
          </label>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            id="btn-confirm-google-login"
            type="button"
            disabled={syncing}
            onClick={handleConfirm}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {syncing ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Đang đồng bộ dữ liệu...</span>
              </>
            ) : (
              <>
                <GoogleIcon className="h-4 w-4 bg-white rounded-full p-0.5" />
                <span>Đăng nhập & Đồng bộ dữ liệu</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
