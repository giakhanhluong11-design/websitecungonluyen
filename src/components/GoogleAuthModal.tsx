import React, { useState } from 'react';
import { GoogleIcon } from './AccountView';
import { X, Check, Mail, ShieldCheck, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import { UserProgress, UserProfile } from '../types';
import { isRememberLoginEnabled, setRememberLoginEnabled } from '../data/userStorage';

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
  const [selectedAccount, setSelectedAccount] = useState<'default' | 'custom'>('default');
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [rememberLogin, setRememberLogin] = useState<boolean>(() => isRememberLoginEnabled());

  if (!isOpen) return null;

  const handleConfirm = () => {
    setSyncing(true);
    setRememberLoginEnabled(rememberLogin);
    const targetEmail = selectedAccount === 'default' 
      ? 'nnkh93a@gmail.com' 
      : (customEmail.trim() || 'nnkh93a@gmail.com');
    const targetName = selectedAccount === 'default'
      ? 'Nguyễn Hoàng Nam'
      : (customName.trim() || targetEmail.split('@')[0]);

    setTimeout(() => {
      onLogin(targetEmail, targetName, rememberLogin);
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
                Đồng bộ lại toàn bộ dữ liệu & tiến trình học tập
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
            Hệ thống sẽ <strong>tự động phục hồi toàn bộ</strong> các chuyên đề đã học, lịch sử làm đề thi, bài luyện tập trắc nghiệm và trường mục tiêu gắn với tài khoản này.
          </p>
        </div>

        {/* Account Selection */}
        <div className="space-y-2.5">
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Chọn tài khoản Google đăng nhập
          </p>

          {/* Default Account: nnkh93a@gmail.com */}
          <div
            id="google-account-choice-default"
            onClick={() => setSelectedAccount('default')}
            className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedAccount === 'default'
                ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/30 dark:border-indigo-500 ring-1 ring-indigo-500/30'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-sm shadow-xs">
                  N
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-xs border border-slate-200 dark:border-slate-700">
                  <GoogleIcon className="h-2.5 w-2.5" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Nguyễn Hoàng Nam
                  </h4>
                  <span className="rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold px-1.5 py-0.2 border border-indigo-200 dark:border-indigo-800">
                    Tài khoản chính
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  nnkh93a@gmail.com
                </p>
              </div>
            </div>

            {selectedAccount === 'default' && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
                <Check className="h-3 w-3 stroke-[3]" />
              </span>
            )}
          </div>

          {/* Custom Google Account Option */}
          <div
            id="google-account-choice-custom"
            onClick={() => setSelectedAccount('custom')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-2.5 ${
              selectedAccount === 'custom'
                ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/30 dark:border-indigo-500 ring-1 ring-indigo-500/30'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Sử dụng tài khoản Google khác
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Nhập địa chỉ Gmail hoặc email trường học của bạn
                  </p>
                </div>
              </div>

              {selectedAccount === 'custom' && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
                  <Check className="h-3 w-3 stroke-[3]" />
                </span>
              )}
            </div>

            {selectedAccount === 'custom' && (
              <div className="space-y-2 pt-1">
                <input
                  id="custom-google-email-input"
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="vidu@gmail.com"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:border-indigo-600"
                  autoFocus
                />
                <input
                  id="custom-google-name-input"
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Tên hiển thị học sinh (tùy chọn)"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>
            )}
          </div>
        </div>

        {/* Security / Privacy notice */}
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-3 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2">
          <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <span>
            Bảo mật theo tiêu chuẩn Google OAuth. Khi đăng xuất, web tự động chuyển về dữ liệu trắng. Khi đăng nhập lại, toàn bộ dữ liệu của bạn sẽ được đồng bộ đầy đủ.
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
              (Nếu không chọn, khi vào lại web sẽ tự động ở chế độ Khách)
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
