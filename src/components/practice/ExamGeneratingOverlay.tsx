import React, { useState, useEffect } from 'react';
import { Sparkles, BookOpen, Calculator, Languages, Clock, Award, X, BrainCircuit, Lightbulb } from 'lucide-react';
import { SubjectId } from '../../types';

interface ExamGeneratingOverlayProps {
  subjectId: SubjectId;
  stepText?: string;
  isSwitching?: boolean;
  onCancel?: () => void;
}

const TIPS = {
  toan: [
    'Môn Toán: Hãy dành 5 phút đầu đọc lướt 7 bài để chọn câu dễ làm trước, tạo tâm lý tự tin.',
    'Bài toán thực tế: Chú ý kỹ đơn vị đo (cm, m, lít, m³) và điều kiện nghiệm khi lập phương trình.',
    'Định lý Viète: Luôn nhớ kiểm tra điều kiện Δ ≥ 0 để phương trình có hai nghiệm trước khi áp dụng.',
    'Hình học không gian: Viết rõ công thức diện tích và thể tích hình trụ, nón, cầu trước khi thế số.',
    'Hình học phẳng: Vẽ hình to, rõ ràng và vẽ đường tròn phụ khi cần nhìn nhận tứ giác nội tiếp.'
  ],
  van: [
    'Môn Ngữ Văn: Phân bổ thời gian hợp lý: 45 phút cho Phần I và 75 phút cho Phần II.',
    'Đọc hiểu: Trả lời ngắn gọn, trúng trọng tâm câu hỏi và dẫn chứng chính xác từ ngữ liệu.',
    'Đoạn văn 200 chữ: Mở đoạn trực tiếp, triển khai 2-3 ý kiến sắc bén và liên hệ bài học bản thân.',
    'Nghị luận xã hội: Dẫn chứng đời sống cần tiêu biểu, tính thời sự cao và có sức thuyết phục.',
    'Tiếng Việt: Nêu rõ tên biện pháp tu từ, từ ngữ biểu hiện và tác dụng gợi hình, gợi cảm.'
  ],
  anh: [
    'Môn Tiếng Anh: Hãy làm bài thật cẩn thận, tô đáp án rõ ràng và không bỏ sót bất kỳ câu nào.',
    'Ngữ âm & Trọng âm: Đọc thầm phát âm các từ, chú ý đuôi -s/es, -ed và vị trí nhấn âm 1 hay 2.',
    'Bài đọc điền từ (Cloze): Đọc cả câu xung quanh chỗ trống để nhận diện từ loại (danh, động, tính, trạng).',
    'Viết lại câu: Kiểm tra kỹ thì động từ, đại từ nhân xưng và cấu trúc câu tương đương (Wish, If, Passive).',
    'Từ vựng: Để ý các tiền tố, hậu tố phủ định hoặc danh từ hóa trong bài Word Formation.'
  ]
};

const SUBJECT_CONFIG = {
  toan: {
    name: 'Toán học',
    badge: 'Cấu trúc Sở GD&ĐT TP.HCM • 7 bài tự luận & thực tế',
    icon: Calculator,
    themeColor: 'from-blue-600 to-indigo-600',
    accentText: 'text-blue-600 dark:text-blue-400',
    badgeBg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-900',
    glowColor: 'bg-blue-500/20'
  },
  van: {
    name: 'Ngữ văn',
    badge: 'GDPT 2018 • Ngữ liệu mới ngoài SGK • 7 câu đọc hiểu & NLXH',
    icon: BookOpen,
    themeColor: 'from-emerald-600 to-teal-600',
    accentText: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
    glowColor: 'bg-emerald-500/20'
  },
  anh: {
    name: 'Tiếng Anh',
    badge: 'Chuẩn tuyển sinh 10 • 40 câu hỏi trọn vẹn 4 phần',
    icon: Languages,
    themeColor: 'from-amber-500 to-orange-600',
    accentText: 'text-amber-600 dark:text-amber-400',
    badgeBg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-900',
    glowColor: 'bg-amber-500/20'
  }
};

export const ExamGeneratingOverlay: React.FC<ExamGeneratingOverlayProps> = ({
  subjectId,
  stepText,
  isSwitching = false,
  onCancel
}) => {
  const [tipIndex, setTipIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(20);

  const config = SUBJECT_CONFIG[subjectId] || SUBJECT_CONFIG.toan;
  const tips = TIPS[subjectId] || TIPS.toan;
  const Icon = config.icon;

  // Cycle tips every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex(prev => (prev + 1) % tips.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [tips.length]);

  // Smooth fake progress animation to keep the student engaged
  useEffect(() => {
    setProgressPercent(25);
    const t1 = setTimeout(() => setProgressPercent(50), 600);
    const t2 = setTimeout(() => setProgressPercent(75), 1800);
    const t3 = setTimeout(() => setProgressPercent(90), 3500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden">
        {/* Ambient background glow */}
        <div className={`absolute -top-24 -left-24 w-48 h-48 rounded-full ${config.glowColor} blur-3xl pointer-events-none`} />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

        {/* Top bar with close button if cancelable */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.badgeBg}`}>
              <Icon className="h-3.5 w-3.5" />
              {config.name}
            </span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {isSwitching ? 'Đổi đề thi mới' : 'Khởi tạo đề thi'}
            </span>
          </div>

          {onCancel && (
            <button
              onClick={onCancel}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Đóng"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Main Central Icon with Animation */}
        <div className="flex flex-col items-center text-center space-y-4 pt-2">
          <div className="relative">
            <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-tr from-slate-100 to-indigo-50 dark:from-slate-800 dark:to-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center shadow-inner">
              <BrainCircuit className={`h-10 w-10 ${config.accentText} animate-pulse`} />
            </div>
            <div className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-sm animate-bounce">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {isSwitching ? 'Đang đổi sang đề thi độc bản mới...' : 'AI đang tạo đề thi độc bản cho em...'}
            </h3>
            <p className="text-xs sm:text-sm font-medium text-indigo-600 dark:text-indigo-400 min-h-[20px]">
              {stepText || 'Đang biên soạn câu hỏi và ngữ cảnh mới 100%...'}
            </p>
          </div>
        </div>

        {/* Shimmer Progress Bar */}
        <div className="space-y-2">
          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
            <div 
              className={`h-full bg-gradient-to-r ${config.themeColor} rounded-full transition-all duration-700 ease-out`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400">
            <span>Chuẩn cấu trúc thi Tuyển sinh 10</span>
            <span className="font-semibold">{progressPercent}%</span>
          </div>
        </div>

        {/* Dynamic Study Tip Carousel */}
        <div className="rounded-xl border border-amber-200/70 dark:border-amber-900/50 bg-amber-50/70 dark:bg-amber-950/30 p-3.5 sm:p-4 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
            <Lightbulb className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Mẹo làm bài thi tuyển sinh:</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed transition-opacity duration-300">
            "{tips[tipIndex]}"
          </p>
        </div>

        {/* Footer info */}
        <div className="text-center">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Đề thi được AI sáng tác độc bản với số liệu và ngữ liệu mới hoàn toàn, sẵn sàng ngay trong giây lát.
          </p>
        </div>
      </div>
    </div>
  );
};
