import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  KeyRound, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Bot,
  Zap
} from 'lucide-react';
import { fetchAiStatus, saveGeminiKey, testGeminiKey, AiConfigStatus } from '../services/aiConfigService';

interface GeminiApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved?: () => void;
}

export const GeminiApiKeyModal: React.FC<GeminiApiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeySaved
}) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState<AiConfigStatus | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadStatus();
      setFeedbackMessage(null);
    }
  }, [isOpen]);

  const loadStatus = async () => {
    setIsLoadingStatus(true);
    try {
      const data = await fetchAiStatus();
      setStatus(data);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  const handleTestKey = async () => {
    setIsTesting(true);
    setFeedbackMessage(null);
    try {
      const res = await testGeminiKey(apiKey || undefined);
      if (res.success) {
        setFeedbackMessage({
          type: 'success',
          text: `Kết nối thành công tới Gemini AI (${res.model || 'gemini-2.5-flash'})! Hệ thống đã sẵn sàng chấm thi theo ma trận tuyển sinh 10.`
        });
        await loadStatus();
      } else {
        setFeedbackMessage({
          type: 'error',
          text: res.error || 'Kiểm tra thất bại. Vui lòng kiểm tra lại API Key.'
        });
      }
    } catch (err: any) {
      setFeedbackMessage({
        type: 'error',
        text: err?.message || 'Lỗi kết nối kiểm tra'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setFeedbackMessage({
        type: 'error',
        text: 'Vui lòng nhập API Key trước khi lưu.'
      });
      return;
    }

    setIsSaving(true);
    setFeedbackMessage(null);

    try {
      const res = await saveGeminiKey(apiKey.trim());
      if (res.success) {
        setFeedbackMessage({
          type: 'success',
          text: 'Đã lưu và kích hoạt Gemini AI thành công! Toàn bộ bài thi Luyện tập sẽ được chấm trực tiếp bằng AI.'
        });
        setApiKey('');
        await loadStatus();
        if (onKeySaved) onKeySaved();
      } else {
        setFeedbackMessage({
          type: 'error',
          text: res.error || 'Không thể lưu API Key.'
        });
      }
    } catch (err: any) {
      setFeedbackMessage({
        type: 'error',
        text: err?.message || 'Lỗi kết nối máy chủ'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-950/80 shadow-2xl overflow-hidden transition-all text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header gradient banner */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md">
              <Sparkles className="h-6 w-6 text-yellow-300" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/25 text-white">
                Google Gemini AI Studio
              </span>
              <h3 className="text-xl font-black mt-0.5">
                Cấu hình Chấm Thi Tuyển Sinh AI
              </h3>
            </div>
          </div>
          <p className="text-xs text-indigo-100 max-w-md leading-relaxed mt-1">
            Liên kết mô hình Gemini 2.5 Flash để tự động chấm điểm từng bước, phân tích lỗi sai và nhận xét sư phạm chi tiết theo đúng ma trận tuyển sinh vào lớp 10.
          </p>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Status Badge */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${
                status?.configured 
                  ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400'
                  : 'bg-amber-100 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400'
              }`}>
                {status?.configured ? <ShieldCheck className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Trạng thái kết nối
                </p>
                <p className="text-sm font-extrabold flex items-center gap-1.5 mt-0.5">
                  <span className={`inline-block h-2 w-2 rounded-full ${
                    status?.configured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`} />
                  {isLoadingStatus ? (
                    'Đang kiểm tra...'
                  ) : status?.configured ? (
                    <span className="text-emerald-600 dark:text-emerald-400">Gemini AI Đang Sẵn Sàng</span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400">Chưa liên kết API Key</span>
                  )}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-mono px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold">
                {status?.model || 'gemini-2.5-flash'}
              </span>
            </div>
          </div>

          {/* Feedback message banner */}
          {feedbackMessage && (
            <div className={`p-4 rounded-2xl text-xs sm:text-sm font-medium flex items-start gap-3 ${
              feedbackMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
                : feedbackMessage.type === 'error'
                ? 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
                : 'bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-200 border border-blue-200 dark:border-blue-900'
            }`}>
              {feedbackMessage.type === 'success' ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
              )}
              <div className="flex-1 leading-relaxed">
                {feedbackMessage.text}
              </div>
            </div>
          )}

          {/* API Key Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Gemini API Key (Google AI Studio)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Dán mã API Key dạng AIzaSy..."
                  className="w-full pl-10 pr-20 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  tabIndex={-1}
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={isSaving || !apiKey.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Đang lưu & kích hoạt...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    <span>Lưu & Kích Hoạt AI</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleTestKey}
                disabled={isTesting}
                className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                {isTesting ? (
                  <RefreshCw className="h-4 w-4 animate-spin text-indigo-500" />
                ) : (
                  <Sparkles className="h-4 w-4 text-amber-500" />
                )}
                <span>Kiểm tra kết nối</span>
              </button>
            </div>
          </form>

          {/* Quick Guide to get Free API Key */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs text-slate-700 dark:text-slate-300 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                Cách lấy Gemini API Key miễn phí (1 phút):
              </span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <span>Mở Google AI Studio</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <ol className="list-decimal pl-4 space-y-1 text-slate-600 dark:text-slate-400">
              <li>Truy cập vào <strong>aistudio.google.com/app/apikey</strong> và đăng nhập bằng tài khoản Google.</li>
              <li>Bấm nút <strong>Create API key</strong> (Tạo khóa API mới).</li>
              <li>Sao chép mã API Key và dán vào ô bên trên, sau đó bấm <strong>Lưu & Kích Hoạt AI</strong>.</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Khóa API được lưu an toàn cục bộ cho phiên làm việc</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
