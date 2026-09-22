import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Play, 
  X, 
  ArrowLeft,
  Sparkles, 
  AlertTriangle, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft,
  FileText,
  RotateCcw,
  Flame,
  Award,
  Eye
} from 'lucide-react';

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteLesson: () => void;
}

export const Lesson1MathModal: React.FC<LessonModalProps> = ({
  isOpen,
  onClose,
  onCompleteLesson
}) => {
  const [activeStep, setActiveStep] = useState<
    'theory' | 'examples' | 'mistakes' | 'exercises' | 'minitest' | 'checklist'
  >('theory');

  // Exercise and MiniTest interactive states
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});
  const [showExampleSolutions, setShowExampleSolutions] = useState<Record<number, boolean>>({});
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({
    'c1': false,
    'c2': false,
    'c3': false,
    'c4': false,
    'c5': false
  });

  if (!isOpen) return null;

  const handleSelectAnswer = (qId: string, ans: string) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: ans }));
  };

  const handleToggleResult = (qId: string) => {
    setShowResults(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const toggleChecklistItem = (id: string) => {
    setChecklistState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const exercises = [
    {
      id: 'l1-ex1',
      level: '⭐ Nhận biết',
      levelType: 'basic',
      question: 'Căn thức √(2x - 8) có nghĩa (xác định) khi và chỉ khi:',
      options: ['A. x ≥ 4', 'B. x > 4', 'C. x ≤ 4', 'D. x ≥ -4'],
      correctAnswer: 'A. x ≥ 4',
      explanation: 'Biểu thức √(A) xác định ⇔ A ≥ 0. Ở đây 2x - 8 ≥ 0 ⇔ 2x ≥ 8 ⇔ x ≥ 4. Vì vậy đáp án chính xác là A.'
    },
    {
      id: 'l1-ex2',
      level: '⭐ Nhận biết',
      levelType: 'basic',
      question: 'Giá trị của biểu thức √((-7)²) bằng:',
      options: ['A. -7', 'B. 7', 'C. ±7', 'D. 49'],
      correctAnswer: 'B. 7',
      explanation: 'Áp dụng hằng đẳng thức √(A²) = |A|. Ta có √((-7)²) = |-7| = 7. Rất nhiều học sinh viết nhầm là -7.'
    },
    {
      id: 'l1-ex3',
      level: '⭐⭐ Thông hiểu',
      levelType: 'comprehend',
      question: 'Rút gọn biểu thức P = √(4 - 2√3) ta được kết quả là:',
      options: ['A. 2 - √3', 'B. √3 - 1', 'C. 1 - √3', 'D. √3 + 1'],
      correctAnswer: 'B. √3 - 1',
      explanation: 'Ta phân tích 4 - 2√3 = 3 - 2.√3.1 + 1 = (√3 - 1)². \nDo đó √(4 - 2√3) = √((√3 - 1)²) = |√3 - 1|. Vì √3 ≈ 1.732 > 1 nên |√3 - 1| = √3 - 1.'
    },
    {
      id: 'l1-ex4',
      level: '⭐⭐⭐ Vận dụng',
      levelType: 'apply',
      question: 'Trục căn thức ở mẫu của phân số 2 / (√5 - 1) ta được:',
      options: ['A. (√5 + 1)/2', 'B. √5 + 1', 'C. (√5 - 1)/2', 'D. 2(√5 + 1)'],
      correctAnswer: 'A. (√5 + 1)/2',
      explanation: 'Nhân cả tử và mẫu với lượng liên hợp (√5 + 1): \n2(√5 + 1) / ((√5 - 1)(√5 + 1)) = 2(√5 + 1) / (5 - 1) = 2(√5 + 1)/4 = (√5 + 1)/2.'
    },
    {
      id: 'l1-ex5',
      level: '⭐⭐⭐⭐ Vận dụng cao',
      levelType: 'advanced',
      question: 'Tìm giá trị nhỏ nhất của biểu thức A = √(x² - 6x + 9) + √(x² - 10x + 25):',
      options: ['A. 2', 'B. 4', 'C. 8', 'D. 0'],
      correctAnswer: 'A. 2',
      explanation: 'Ta có A = √((x - 3)²) + √((x - 5)²) = |x - 3| + |x - 5| = |x - 3| + |5 - x|. \nÁp dụng bất đẳng thức giá trị tuyệt đối |a| + |b| ≥ |a + b|: \nA ≥ |(x - 3) + (5 - x)| = |2| = 2. \nDấu "=" xảy ra khi (x - 3)(5 - x) ≥ 0 ⇔ 3 ≤ x ≤ 5. Vậy Min A = 2.'
    }
  ];

  const miniTest = [
    {
      id: 'mt-1',
      question: 'Câu 1 (ĐKXĐ): Biểu thức 1 / √(5 - x) xác định khi nào?',
      options: ['A. x ≤ 5', 'B. x < 5', 'C. x ≥ 5', 'D. x > 5'],
      correctAnswer: 'B. x < 5',
      explanation: 'Do căn thức nằm ở mẫu nên điều kiện bắt buộc là 5 - x > 0 (không lấy dấu bằng vì mẫu phải khác 0) ⇔ x < 5.'
    },
    {
      id: 'mt-2',
      question: 'Câu 2 (Rút gọn): Rút gọn biểu thức M = √(x² + 4x + 4) với x < -2:',
      options: ['A. x + 2', 'B. -(x + 2)', 'C. x - 2', 'D. 2 - x'],
      correctAnswer: 'B. -(x + 2)',
      explanation: '√(x² + 4x + 4) = √((x + 2)²) = |x + 2|. Vì x < -2 nên x + 2 < 0 ⇒ |x + 2| = -(x + 2) = -x - 2.'
    }
  ];

  const STEPS = [
    { id: 'theory' as const, label: '1. Lý thuyết & Công thức', shortLabel: 'Lý thuyết' },
    { id: 'examples' as const, label: '2. Ví dụ mẫu & Phân tích', shortLabel: 'Ví dụ' },
    { id: 'mistakes' as const, label: '3. Lỗi thường gặp & Bẫy thi', shortLabel: 'Lỗi sai' },
    { id: 'exercises' as const, label: '4. Bài tập 4 cấp độ tư duy', shortLabel: 'Bài tập' },
    { id: 'minitest' as const, label: '5. Mini Test đánh giá nhanh', shortLabel: 'Mini Test' },
    { id: 'checklist' as const, label: '6. Checklist năng lực', shortLabel: 'Checklist' },
  ];

  const currentStepIndex = STEPS.findIndex(s => s.id === activeStep);
  const canGoPrev = currentStepIndex > 0;
  const canGoNext = currentStepIndex < STEPS.length - 1;

  const handlePrev = () => {
    if (canGoPrev) {
      setActiveStep(STEPS[currentStepIndex - 1].id);
      const container = document.getElementById('lesson1-content-scroll');
      if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setActiveStep(STEPS[currentStepIndex + 1].id);
      const container = document.getElementById('lesson1-content-scroll');
      if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div id="lesson1-math-fullscreen-window" className="fixed inset-0 z-50 flex flex-col w-screen h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 animate-in fade-in duration-200 overflow-hidden">
      <div 
        id="lesson1-math-modal-dialog"
        className="flex flex-col w-full h-full bg-white dark:bg-slate-900 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer shrink-0"
              title="Quay lại danh sách bài học"
            >
              <ArrowLeft className="h-4 w-4 text-slate-600 dark:text-slate-300" />
              <span className="hidden sm:inline">Quay lại</span>
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-600 text-white">
                  BÀI 1 — TOÁN 9 (T1)
                </span>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                  🔥 TRỌNG TÂM THI (🔴 Rất quan trọng)
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate mt-0.5">
                Căn Bậc Hai & Căn Thức (Chương trình KNTT 2018)
              </h2>
            </div>
          </div>

          {/* Right: 2 Nút Tiến/Lùi trên Header + Nút Đóng */}
          <div className="flex items-center gap-2 shrink-0">
            {/* 2 Nút Tiến / Lùi nhỏ gọn trên Header */}
            <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-700 rounded-xl p-1 bg-slate-50 dark:bg-slate-800">
              <button
                id="btn-lesson1-header-prev"
                onClick={handlePrev}
                disabled={!canGoPrev}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  canGoPrev
                    ? 'text-slate-700 hover:bg-white dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer shadow-2xs'
                    : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                }`}
                title={currentStepIndex > 0 ? `Lùi về: ${STEPS[currentStepIndex - 1].label}` : 'Đã ở bước đầu'}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Lùi</span>
              </button>

              <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 px-1.5">
                {currentStepIndex + 1}/{STEPS.length}
              </span>

              <button
                id="btn-lesson1-header-next"
                onClick={handleNext}
                disabled={!canGoNext}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  canGoNext
                    ? 'text-blue-600 hover:bg-white dark:text-blue-400 dark:hover:bg-slate-700 cursor-pointer shadow-2xs'
                    : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                }`}
                title={currentStepIndex < STEPS.length - 1 ? `Tiến sang: ${STEPS[currentStepIndex + 1].label}` : 'Đã hoàn thành các bước'}
              >
                <span className="hidden sm:inline">Tiến</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Đóng cửa sổ"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Body Content */}
        <div id="lesson1-content-scroll" className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* 1. LÝ THUYẾT & CÔNG THỨC */}
          {activeStep === 'theory' && (
            <div className="space-y-5 animate-in fade-in">
              {/* Tiêu đề chữ lớn độc lập, không đặt trong card bo góc, không thêm gì khác */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight pt-1 pb-1">
                Bài 1: Căn Bậc Hai & Căn Thức
              </h1>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  I. Khái niệm & Điều kiện xác định
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  1. Với số thực <code className="text-blue-600 font-bold">a ≥ 0</code>, căn bậc hai số học của a là số <code className="text-blue-600 font-bold">x ≥ 0</code> sao cho <code className="text-blue-600 font-bold">x² = a</code> (kí hiệu √a).
                </p>
                <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs text-blue-700 dark:text-blue-300">
                  √(A) xác định (có nghĩa) ⇔ A ≥ 0
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Lưu ý: Nếu biểu thức có dạng <code className="font-mono text-slate-800 dark:text-slate-200">1 / √(A)</code> thì điều kiện phải là <code className="font-mono text-slate-800 dark:text-slate-200">A &gt; 0</code> (vì mẫu số phải khác 0).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  II. Hằng đẳng thức cốt lõi & Biến đổi
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                    √(A²) = |A| = A (nếu A ≥ 0)
                  </div>
                  <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                    √(A²) = |A| = -A (nếu A &lt; 0)
                  </div>
                  <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                    √(A.B) = √A . √B (với A, B ≥ 0)
                  </div>
                  <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                    √(A/B) = √A / √B (với A ≥ 0, B &gt; 0)
                  </div>
                </div>

                <div className="mt-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200">
                  <strong>Quy tắc Trục căn thức ở mẫu:</strong>
                  <br />• Dạng 1: <code className="font-mono">m / √A = m√A / A</code> (với A &gt; 0)
                  <br />• Dạng 2 (Nhân lượng liên hợp): <code className="font-mono">m / (√A ± √B) = m(√A ∓ √B) / (A - B)</code>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setActiveStep('objectives')}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Quay lại
                </button>
                <button
                  onClick={() => setActiveStep('examples')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white cursor-pointer"
                >
                  <span>Xem Ví dụ mẫu</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* 3. VÍ DỤ MẪU */}
          {activeStep === 'examples' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Ví dụ 1 */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-xs font-bold">
                    Ví dụ 1 (Đưa về bình phương để khai căn)
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                  Đề bài: Rút gọn biểu thức A = √(7 - 4√3) + √3
                </p>
                <div className="pt-1">
                  <button
                    onClick={() => setShowExampleSolutions(prev => ({ ...prev, 1: !prev[1] }))}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
                  >
                    <Eye className="h-4 w-4 text-white shrink-0" />
                    <span className="text-white font-bold">{showExampleSolutions[1] ? 'Ẩn đáp án' : 'Hiện đáp án'}</span>
                  </button>
                </div>
                {showExampleSolutions[1] && (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-800 dark:text-slate-200 space-y-1.5 font-mono animate-in fade-in">
                    <p><strong>Bước 1:</strong> Phân tích 7 - 4√3 = 2² - 2.(2).(√3) + (√3)² = (2 - √3)².</p>
                    <p><strong>Bước 2:</strong> Áp dụng hằng đẳng thức khai căn: √(7 - 4√3) = √((2 - √3)²) = |2 - √3|.</p>
                    <p><strong>Bước 3:</strong> Vì 2 = √4 &gt; √3 nên 2 - √3 &gt; 0 ⇒ |2 - √3| = 2 - √3.</p>
                    <p><strong>Bước 4:</strong> Thay vào A: A = (2 - √3) + √3 = 2.</p>
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium pt-1 border-t border-slate-200 dark:border-slate-700">
                      💡 <em>Mẹo giải nhanh:</em> Tách hệ số của căn bậc hai thành 2.a.b, sau đó kiểm tra a² + b² có đúng bằng số đứng trước hay không.
                    </div>
                  </div>
                )}
              </div>

              {/* Ví dụ 2 */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold">
                    Ví dụ 2 (Trục căn thức & Rút gọn phân thức)
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                  Đề bài: Cho biểu thức B = (√x / (√x + 3) + 3 / (√x - 3)) . (x - 9) / (x + 9) với x ≥ 0, x ≠ 9.
                </p>
                <div className="pt-1">
                  <button
                    onClick={() => setShowExampleSolutions(prev => ({ ...prev, 2: !prev[2] }))}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
                  >
                    <Eye className="h-4 w-4 text-white shrink-0" />
                    <span className="text-white font-bold">{showExampleSolutions[2] ? 'Ẩn đáp án' : 'Hiện đáp án'}</span>
                  </button>
                </div>
                {showExampleSolutions[2] && (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-800 dark:text-slate-200 space-y-1.5 font-mono animate-in fade-in">
                    <p>• MTC của ngoặc đầu: (√x + 3)(√x - 3) = x - 9.</p>
                    <p>• Tử số trong ngoặc: √x(√x - 3) + 3(√x + 3) = x - 3√x + 3√x + 9 = x + 9.</p>
                    <p>• Vậy ngoặc đầu = (x + 9) / (x - 9).</p>
                    <p>• Nhân với phần sau: B = [(x + 9)/(x - 9)] . [(x - 9)/(x + 9)] = 1.</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setActiveStep('theory')}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Quay lại
                </button>
                <button
                  onClick={() => setActiveStep('mistakes')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white cursor-pointer"
                >
                  <span>Xem Lỗi thường gặp</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* 4. LỖI THƯỜNG GẶP */}
          {activeStep === 'mistakes' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 space-y-3">
                <h3 className="text-sm font-bold text-rose-900 dark:text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-600" />
                  3 Lỗi sai "chết người" khiến học sinh mất trọn 0.5 - 1.0 điểm:
                </h3>

                <div className="space-y-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60">
                    <p className="font-bold text-rose-700 dark:text-rose-400">
                      ❌ Lỗi 1: Bỏ quên dấu giá trị tuyệt đối khi khai căn
                    </p>
                    <p className="mt-1 text-slate-600 dark:text-slate-400">
                      Học sinh hay viết: <code className="line-through text-red-500 font-mono">√((1 - √3)²) = 1 - √3</code> (Sai vì 1 &lt; √3, kết quả bị âm).
                      <br />
                      <strong>Cách làm chuẩn:</strong> <code className="text-emerald-600 font-mono font-bold">√((1 - √3)²) = |1 - √3| = √3 - 1</code>.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60">
                    <p className="font-bold text-rose-700 dark:text-rose-400">
                      ❌ Lỗi 2: Quên đối chiếu điều kiện xác định sau khi tìm ra x
                    </p>
                    <p className="mt-1 text-slate-600 dark:text-slate-400">
                      Đề cho ĐKXĐ là <code className="font-mono">x ≥ 0, x ≠ 4</code>. Sau khi giải ra nghiệm <code className="font-mono">x = 4</code>, học sinh vội vàng kết luận mà quên loại nghiệm.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60">
                    <p className="font-bold text-rose-700 dark:text-rose-400">
                      ❌ Lỗi 3: Đổi dấu sai khi nhân lượng liên hợp
                    </p>
                    <p className="mt-1 text-slate-600 dark:text-slate-400">
                      Khi mẫu là <code className="font-mono">√5 - 2</code>, lượng liên hợp là <code className="font-mono">√5 + 2</code>. Mẫu số thu được là <code className="font-mono">(√5)² - 2² = 5 - 4 = 1</code>, không được viết nhầm thành 5 + 4.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setActiveStep('examples')}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Quay lại
                </button>
                <button
                  onClick={() => setActiveStep('exercises')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white cursor-pointer"
                >
                  <span>Luyện Bài tập 4 cấp độ</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* 5. BÀI TẬP 4 CẤP ĐỘ */}
          {activeStep === 'exercises' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Bài tập phân cấp: ⭐ Cơ bản → ⭐⭐ Thông hiểu → ⭐⭐⭐ Vận dụng → ⭐⭐⭐⭐ Vận dụng cao
                </h3>
                <span className="text-xs text-slate-500">5 câu chọn lọc</span>
              </div>

              <div className="space-y-4">
                {exercises.map((ex, idx) => {
                  const isAnswered = selectedAnswers[ex.id] !== undefined;
                  const isCorrect = selectedAnswers[ex.id] === ex.correctAnswer;
                  const isRevealed = showResults[ex.id];

                  return (
                    <div 
                      key={ex.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          ex.levelType === 'basic'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : ex.levelType === 'comprehend'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : ex.levelType === 'apply'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                        }`}>
                          {ex.level}
                        </span>
                        <span className="text-xs text-slate-400">Câu {idx + 1}</span>
                      </div>

                      <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                        {ex.question}
                      </p>

                      {/* Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {ex.options.map((opt) => {
                          const isSelected = selectedAnswers[ex.id] === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => handleSelectAnswer(ex.id, opt)}
                              className={`p-2.5 rounded-lg text-left text-xs font-medium border transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-950/60 dark:text-blue-200 dark:border-blue-400'
                                  : 'border-slate-200 hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {/* Toggle Solution / Explanation */}
                      <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                        <div>
                          {isAnswered && (
                            <span className={`text-xs font-bold ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {isCorrect ? '✓ Chính xác!' : '✕ Chưa đúng, hãy xem giải thích!'}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => handleToggleResult(ex.id)}
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
                        >
                          <Eye className="h-4 w-4 text-white shrink-0" />
                          <span className="text-white font-bold">{isRevealed ? 'Ẩn đáp án' : 'Hiện đáp án'}</span>
                        </button>
                      </div>

                      {isRevealed && (
                        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 animate-in fade-in">
                          <p className="font-bold text-slate-900 dark:text-white">
                            Đáp án: {ex.correctAnswer}
                          </p>
                          <p className="mt-1 text-slate-600 dark:text-slate-300 whitespace-pre-line">
                            {ex.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setActiveStep('mistakes')}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Quay lại
                </button>
                <button
                  onClick={() => setActiveStep('minitest')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white cursor-pointer"
                >
                  <span>Làm Mini Test</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* 6. MINI TEST */}
          {activeStep === 'minitest' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900">
                <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-2">
                  <Award className="h-4 w-4 text-indigo-600" />
                  Mini Test Đánh Giá Nhanh Sau Bài Học (2 câu)
                </h3>
                <p className="text-xs text-indigo-800 dark:text-indigo-300 mt-1">
                  Kiểm tra xem bạn đã thực sự vững kiến thức hay chưa trước khi tích checklist hoàn thành bài.
                </p>
              </div>

              <div className="space-y-4">
                {miniTest.map((q) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isCorrect = selectedAnswers[q.id] === q.correctAnswer;
                  const isRevealed = showResults[q.id];

                  return (
                    <div 
                      key={q.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3"
                    >
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                        {q.question}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleSelectAnswer(q.id, opt)}
                            className={`p-2.5 rounded-lg text-left text-xs font-medium border transition-all cursor-pointer ${
                              selectedAnswers[q.id] === opt
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-200 dark:border-indigo-400'
                                : 'border-slate-200 hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                        <div>
                          {isAnswered && (
                            <span className={`text-xs font-bold ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {isCorrect ? '✓ Hoàn hảo!' : '✕ Xem lại điều kiện nhé!'}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => handleToggleResult(q.id)}
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
                        >
                          <Eye className="h-4 w-4 text-white shrink-0" />
                          <span className="text-white font-bold">{isRevealed ? 'Ẩn đáp án' : 'Hiện đáp án'}</span>
                        </button>
                      </div>

                      {isRevealed && (
                        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          <strong>Đáp án: {q.correctAnswer}</strong>
                          <p className="mt-1">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setActiveStep('exercises')}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Quay lại
                </button>
                <button
                  onClick={() => setActiveStep('checklist')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white cursor-pointer"
                >
                  <span>Tích Checklist & Hoàn thành</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* 7. CHECKLIST */}
          {activeStep === 'checklist' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Bảng Checklist Tự Đánh Giá Năng Lực Bài 1:
                </h3>
                <p className="text-xs text-slate-500">
                  Học sinh tích chọn các mục mình đã tự tin để ghi nhận vào hệ thống hồ sơ học tập.
                </p>

                <div className="space-y-2.5 pt-2">
                  {[
                    { id: 'c1', label: 'Tôi đã hiểu rõ khái niệm căn bậc hai số học và tìm đúng ĐKXĐ √(A) ⇔ A ≥ 0.' },
                    { id: 'c2', label: 'Tôi không bị nhầm dấu khi khai căn: luôn nhớ √(A²) = |A|.' },
                    { id: 'c3', label: 'Tôi thành thạo biến đổi dạng √(a ± 2√b) về bình phương một tổng hoặc hiệu.' },
                    { id: 'c4', label: 'Tôi biết trục căn thức ở mẫu bằng cách nhân lượng liên hợp.' },
                    { id: 'c5', label: 'Tôi đã hoàn thành đầy đủ bài tập và Mini Test đạt yêu cầu.' },
                  ].map(item => (
                    <div 
                      key={item.id}
                      onClick={() => toggleChecklistItem(item.id)}
                      className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                    >
                      {checklistState[item.id] ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-400 shrink-0" />
                      )}
                      <span className={`text-xs sm:text-sm font-medium ${checklistState[item.id] ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-emerald-900 dark:text-emerald-200">
                  🎉 <strong>Xuất sắc!</strong> Sau khi hoàn thành bài 1, bạn có thể đánh dấu hoàn tất để chuyển sang bài tiếp theo.
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onCompleteLesson();
                      onClose();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-extrabold text-white shadow-md cursor-pointer transition-all"
                  >
                    Đánh dấu đã hoàn thành Bài 1
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* STICKY BOTTOM ACTION BAR: 2 Nút Tiến Lùi Trước Sau nổi bật */}
        <footer className="sticky bottom-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-lg">
          {/* Nút Lùi (Trước) */}
          <button
            id="btn-lesson1-nav-prev"
            onClick={handlePrev}
            disabled={!canGoPrev}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
              canGoPrev
                ? 'bg-white text-slate-800 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-700 shadow-xs cursor-pointer active:scale-95'
                : 'opacity-40 bg-slate-100 text-slate-400 border-transparent dark:bg-slate-800/40 dark:text-slate-600 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>
              {currentStepIndex > 0 
                ? `Trước: ${STEPS[currentStepIndex - 1].shortLabel}` 
                : 'Bước đầu'}
            </span>
          </button>

          {/* Chỉ số bước ở giữa */}
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center">
            <div className="flex items-center gap-1.5">
              {STEPS.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === currentStepIndex
                      ? 'w-6 bg-blue-600 dark:bg-blue-400'
                      : idx < currentStepIndex
                      ? 'w-2 bg-emerald-500'
                      : 'w-2 bg-slate-300 dark:bg-slate-700'
                  }`}
                  title={step.label}
                />
              ))}
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">
              Bước {currentStepIndex + 1}/{STEPS.length}: <strong className="text-blue-600 dark:text-blue-400">{STEPS[currentStepIndex].label}</strong>
            </span>
          </div>

          {/* Nút Tiến (Sau) */}
          <button
            id="btn-lesson1-nav-next"
            onClick={handleNext}
            disabled={!canGoNext}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              canGoNext
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer active:scale-95'
                : 'opacity-40 bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
            }`}
          >
            <span>
              {currentStepIndex < STEPS.length - 1 
                ? `Tiếp: ${STEPS[currentStepIndex + 1].shortLabel}` 
                : 'Hoàn thành bước'}
            </span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </footer>
      </div>
    </div>
  );
};
