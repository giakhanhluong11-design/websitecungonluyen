import React, { useState } from 'react';
import { 
  RefreshCw, 
  ArrowLeft, 
  Send, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Calculator,
  Sparkles,
  AlertCircle,
  FileCheck2,
  Edit3,
  XCircle,
  AlertTriangle,
  BookOpen,
  TrendingUp,
  HelpCircle
} from 'lucide-react';
import { MathExam } from '../../types/practiceExamTypes';
import { MathKeyboard } from './MathKeyboard';
import { gradeMathSubmission, MathGradingResultDetailed } from '../../services/mathGradingService';

interface MathPracticeWorkspaceProps {
  exam: MathExam;
  onExit: () => void;
  onRegenerateNew: () => void;
  onFinishScore: (score: number) => void;
  isRegenerating?: boolean;
  onOpenGeminiConfig?: () => void;
}

export const MathPracticeWorkspace: React.FC<MathPracticeWorkspaceProps> = ({
  exam,
  onExit,
  onRegenerateNew,
  onFinishScore,
  isRegenerating = false,
  onOpenGeminiConfig
}) => {
  const [activeTab, setActiveTab] = useState<'working' | 'evaluation'>('working');
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showMathKeyboard, setShowMathKeyboard] = useState<boolean>(true);
  const [activeInputKey, setActiveInputKey] = useState<string>('bai1');
  const [isGrading, setIsGrading] = useState<boolean>(false);
  const [gradingProgress, setGradingProgress] = useState<string>('');
  const [gradingResult, setGradingResult] = useState<MathGradingResultDetailed | null>(null);
  const [showSolution, setShowSolution] = useState<Record<string, boolean>>({});

  const currentExercise = exam.exercises[activeExerciseIndex];

  const handleInsertSymbol = (symbol: string) => {
    const current = answers[activeInputKey] || '';
    setAnswers(prev => ({
      ...prev,
      [activeInputKey]: current + symbol
    }));
  };

  const handleBackspace = () => {
    const current = answers[activeInputKey] || '';
    if (current.length > 0) {
      setAnswers(prev => ({
        ...prev,
        [activeInputKey]: current.slice(0, -1)
      }));
    }
  };

  const handleClear = () => {
    setAnswers(prev => ({
      ...prev,
      [activeInputKey]: ''
    }));
  };

  const handleGradeExam = async () => {
    setIsGrading(true);
    setGradingProgress('Bắt đầu thẩm định bài thi môn Toán...');
    try {
      const result = await gradeMathSubmission(exam, answers, (msg) => {
        setGradingProgress(msg);
      });
      setGradingResult(result);
      onFinishScore(result.totalScore);
      setActiveTab('evaluation');
    } catch (err) {
      console.warn('Thông báo khi thẩm định bài thi Toán:', err);
    } finally {
      setIsGrading(false);
      setGradingProgress('');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="rounded-2xl border border-indigo-100 dark:border-indigo-950/60 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300">
                Môn Toán • Tuyển sinh 10
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300">
                7 bài tự luận & hình học
              </span>
              <span className="text-xs text-slate-500">120 phút • 10.0 điểm</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {exam.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRegenerateNew}
              disabled={isGrading || isRegenerating}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 min-h-[44px] text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-xl transition-colors active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRegenerating ? 'animate-spin text-indigo-500' : ''}`} />
              {isRegenerating ? 'Đang tạo đề mới...' : 'Đổi đề khác'}
            </button>
            <button
              onClick={onExit}
              disabled={isRegenerating}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 min-h-[44px] text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl transition-colors active:scale-95"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Thoát
            </button>
          </div>
        </div>

        {/* View tab switcher */}
        <div className="flex items-center gap-2 mt-5 border-t border-slate-100 dark:border-slate-800 pt-4 flex-wrap">
          <button
            onClick={() => setActiveTab('working')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all min-h-[40px] flex items-center gap-2 ${
              activeTab === 'working'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            Làm bài thi (7 bài)
          </button>

          {gradingResult && (
            <button
              onClick={() => setActiveTab('evaluation')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all min-h-[40px] flex items-center gap-2 ${
                activeTab === 'evaluation'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
              }`}
            >
              <FileCheck2 className="h-3.5 w-3.5" />
              Bảng thẩm định chi tiết ({gradingResult.totalScore}/10đ)
            </button>
          )}
        </div>

        {/* 7 bài switcher (khi ở tab làm bài) */}
        {activeTab === 'working' && (
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mt-4">
            {exam.exercises.map((ex, idx) => (
              <button
                key={ex.id}
                onClick={() => {
                  setActiveExerciseIndex(idx);
                  setActiveInputKey(ex.id);
                }}
                className={`py-2 px-1 rounded-xl text-center transition-all min-h-[48px] flex flex-col justify-center items-center ${
                  activeExerciseIndex === idx
                    ? 'bg-indigo-600 text-white shadow-sm font-bold'
                    : answers[ex.id]?.trim()
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 font-medium'
                }`}
              >
                <span className="text-[10px] block opacity-85">Bài {ex.baiNumber}</span>
                <span className="text-xs font-bold">{ex.points}đ</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tab 1: Vùng làm bài */}
      {activeTab === 'working' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-7 w-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-black text-sm flex items-center justify-center">
                {currentExercise.baiNumber}
              </span>
              <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                {currentExercise.title}
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {currentExercise.topicCategory}
            </span>
          </div>

          {/* Nội dung đề bài */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 rounded-xl text-slate-900 dark:text-slate-100 text-sm sm:text-base font-medium leading-relaxed whitespace-pre-line border border-slate-200 dark:border-slate-700">
            {currentExercise.problemText}
          </div>

          {/* Minh họa hình vẽ nếu có */}
          {currentExercise.svgIllustration && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-center space-y-2">
              <div dangerouslySetInnerHTML={{ __html: currentExercise.svgIllustration.svgContent }} />
              <p className="text-xs text-slate-500 italic">
                {currentExercise.svgIllustration.caption}
              </p>
            </div>
          )}

          {/* Vùng gõ lời giải */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <span>Lời giải bài {currentExercise.baiNumber}:</span>
              </label>

              <button
                type="button"
                onClick={() => setShowMathKeyboard(prev => !prev)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <Calculator className="h-3.5 w-3.5" />
                {showMathKeyboard ? 'Thu gọn bàn phím toán' : 'Mở bàn phím toán học'}
              </button>
            </div>

            <textarea
              rows={8}
              placeholder={`Trình bày các bước biến đổi, lập luận và kết luận cho Bài ${currentExercise.baiNumber} tại đây...`}
              value={answers[currentExercise.id] || ''}
              onFocus={() => setActiveInputKey(currentExercise.id)}
              onChange={(e) => setAnswers(prev => ({ ...prev, [currentExercise.id]: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-xs sm:text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />

            {/* Bàn phím ký hiệu toán học */}
            {showMathKeyboard && (
              <MathKeyboard
                onInsert={handleInsertSymbol}
                onBackspace={handleBackspace}
                onClear={handleClear}
              />
            )}
          </div>

          {/* Nếu bài này đã được chấm thì hiển thị nhanh nhận xét ngay bên dưới */}
          {gradingResult && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm space-y-2">
              <div className="flex items-center justify-between font-bold">
                <span className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  Đánh giá bài {currentExercise.baiNumber}:
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
                  {gradingResult.exerciseScores.find(es => es.exerciseId === currentExercise.id)?.score || 0} / {currentExercise.points} điểm
                </span>
              </div>
              <p className="text-slate-700 dark:text-slate-300">
                {gradingResult.exerciseScores.find(es => es.exerciseId === currentExercise.id)?.feedback}
              </p>
              {gradingResult.exerciseScores.find(es => es.exerciseId === currentExercise.id)?.mistakes && (
                <p className="text-rose-600 dark:text-rose-400">
                  <strong>Lưu ý sơ suất:</strong> {gradingResult.exerciseScores.find(es => es.exerciseId === currentExercise.id)?.mistakes}
                </p>
              )}
            </div>
          )}

          {/* Lời giải mẫu */}
          {gradingResult && (
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-2">
              <button
                type="button"
                onClick={() => setShowSolution(prev => ({ ...prev, [currentExercise.id]: !prev[currentExercise.id] }))}
                className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400"
              >
                {showSolution[currentExercise.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                <span>Xem đáp án mẫu và thang điểm chi tiết (Bài {currentExercise.baiNumber})</span>
              </button>

              {showSolution[currentExercise.id] && (
                <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 space-y-3 font-mono leading-relaxed">
                  <div className="font-sans font-bold text-emerald-800 dark:text-emerald-300">
                    Lời giải chi tiết:
                  </div>
                  <div className="whitespace-pre-line bg-white/80 dark:bg-slate-900/80 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900">
                    {currentExercise.sampleSolution}
                  </div>

                  <div className="font-sans font-bold text-emerald-800 dark:text-emerald-300 pt-1">
                    Biểu điểm từng bước:
                  </div>
                  <div className="space-y-1 font-sans">
                    {currentExercise.guideSteps.map((gs, gIdx) => (
                      <div key={gIdx} className="flex items-center justify-between text-xs py-1 border-b border-emerald-100 dark:border-emerald-900/50">
                        <span>• {gs.step}</span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">+{gs.points}đ</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Bảng thẩm định chi tiết & Góc nhìn giám khảo */}
      {activeTab === 'evaluation' && gradingResult && (
        <div className="space-y-6">
          {/* Banner điểm tổng quát & Góc nhìn giám khảo */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 p-6 text-white shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                    Kết quả bài thi môn Toán
                  </span>
                  {gradingResult.isAiGraded ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                      <Sparkles className="h-3 w-3 text-yellow-300" />
                      Thẩm định bởi Gemini AI (GDPT 2018)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/20 text-blue-100">
                      Thẩm định sư phạm dự phòng
                    </span>
                  )}
                </div>
                <h2 className="text-3xl font-black mt-1">
                  {gradingResult.totalScore} / {gradingResult.maxScore} điểm
                </h2>
                <div className="mt-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/15 max-w-3xl">
                  <p className="text-xs uppercase tracking-wider font-bold text-blue-200 mb-1">
                    Góc nhìn của giám khảo chấm thi môn Toán:
                  </p>
                  <p className="text-xs sm:text-sm text-white leading-relaxed">
                    {gradingResult.overallComment}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* 1. Bảng điểm từng câu tổng quát */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Bảng điểm chi tiết từng câu</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                    <th className="py-2.5 px-3">Bài</th>
                    <th className="py-2.5 px-3">Nội dung / Dạng toán</th>
                    <th className="py-2.5 px-3 text-center">Điểm đạt</th>
                    <th className="py-2.5 px-3 text-center">Điểm tối đa</th>
                    <th className="py-2.5 px-3 text-right">Đánh giá</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {gradingResult.exerciseScores.map((item) => (
                    <tr key={item.exerciseId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-3 font-bold text-indigo-600 dark:text-indigo-400">
                        Bài {item.baiNumber}
                      </td>
                      <td className="py-3 px-3 text-slate-800 dark:text-slate-200 font-medium">
                        {item.title}
                      </td>
                      <td className="py-3 px-3 text-center font-extrabold text-slate-900 dark:text-white">
                        {item.score}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-500">
                        {item.maxScore}đ
                      </td>
                      <td className="py-3 px-3 text-right">
                        {item.score === item.maxScore ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            <CheckCircle2 className="h-3 w-3" /> Đạt tối đa
                          </span>
                        ) : item.score > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                            <AlertTriangle className="h-3 w-3" /> Đạt một phần
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                            <XCircle className="h-3 w-3" /> 0 điểm
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. Bộ ba chẩn đoán sư phạm: 3 Lỗi quan trọng nhất - Điểm mạnh - Gợi ý ôn tập */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Top 3 Lỗi / Điểm yếu quan trọng nhất */}
            <div className="rounded-2xl border border-rose-200 dark:border-rose-950 bg-rose-50/70 dark:bg-rose-950/30 p-5 space-y-3">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                <AlertCircle className="h-4 w-4" />
                <span>3 Lỗi quan trọng cần sửa</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-rose-900 dark:text-rose-200">
                {(gradingResult.topWeaknesses && gradingResult.topWeaknesses.length > 0 ? gradingResult.topWeaknesses : [
                  'Chưa đối chiếu đầy đủ điều kiện xác định của ẩn số',
                  'Còn vắn tắt các bước biến đổi đại số trung gian',
                  'Lập luận hình học cần nêu rõ căn cứ định lý'
                ]).slice(0, 3).map((w, wIdx) => (
                  <li key={wIdx} className="flex items-start gap-2">
                    <span className="font-black text-rose-600 dark:text-rose-400 min-w-4">0{wIdx + 1}.</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Những phần học sinh làm tốt */}
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-950 bg-emerald-50/70 dark:bg-emerald-950/30 p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <TrendingUp className="h-4 w-4" />
                <span>Những phần em làm tốt</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200">
                {(gradingResult.keyStrengths && gradingResult.keyStrengths.length > 0 ? gradingResult.keyStrengths : [
                  'Nắm được phương pháp giải cơ bản cho các dạng bài',
                  'Thái độ làm bài nghiêm túc, cố gắng hoàn thành đề thi'
                ]).map((s, sIdx) => (
                  <li key={sIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Gợi ý nội dung cần ôn lại */}
            <div className="rounded-2xl border border-indigo-200 dark:border-indigo-950 bg-indigo-50/70 dark:bg-indigo-950/30 p-5 space-y-3">
              <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
                <BookOpen className="h-4 w-4" />
                <span>Gợi ý chủ đề cần ôn tập</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-indigo-900 dark:text-indigo-200">
                {(gradingResult.reviewTopics && gradingResult.reviewTopics.length > 0 ? gradingResult.reviewTopics : [
                  'Hệ thức Vi-ét và các bài toán phân số đối xứng',
                  'Các bước giải bài toán bằng cách lập hệ phương trình',
                  'Chứng minh tứ giác nội tiếp và tam giác đồng dạng'
                ]).map((t, tIdx) => (
                  <li key={tIdx} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3. Chi tiết từng bài */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <span>Đánh giá chi tiết từng bài (Bài 1 đến Bài 7)</span>
            </h3>

            {gradingResult.exerciseScores.map((item) => (
              <div 
                key={item.exerciseId}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="h-7 w-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-black text-xs flex items-center justify-center">
                      {item.baiNumber}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                      {item.title}
                    </h4>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black ${
                    item.score === item.maxScore
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                      : item.score > 0
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300'
                      : 'bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                  }`}>
                    {item.score} / {item.maxScore} điểm
                  </span>
                </div>

                {/* Bài làm của học sinh */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-mono whitespace-pre-line text-slate-800 dark:text-slate-200 leading-relaxed">
                  <span className="text-[11px] font-sans font-bold uppercase text-slate-500 block mb-1">
                    Bài giải của em:
                  </span>
                  {item.studentAnswer || '(Chưa làm bài này)'}
                </div>

                {/* Phân tích Sư phạm: Đúng / Sai / Tại sao sai / Cách sửa / Thiếu ý */}
                <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 text-xs sm:text-sm space-y-2 leading-relaxed">
                  <p className="text-slate-800 dark:text-slate-200">
                    <strong className="text-indigo-900 dark:text-indigo-300 font-bold">Nhận xét bài làm: </strong> 
                    {item.feedback}
                  </p>

                  {item.correctPoints && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                      <strong>✓ Ý / bước giải đúng: </strong> {item.correctPoints}
                    </div>
                  )}

                  {item.incorrectPoints && (
                    <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 space-y-1">
                      <div><strong>✗ Ý / bước giải sai hoặc chưa đầy đủ: </strong> {item.incorrectPoints}</div>
                      {item.whyWrong && (
                        <div className="text-rose-700 dark:text-rose-400 pl-3 border-l-2 border-rose-400">
                          <strong>Tại sao sai: </strong> {item.whyWrong}
                        </div>
                      )}
                      {item.suggestedFix && (
                        <div className="text-amber-800 dark:text-amber-300 pl-3 border-l-2 border-amber-400 mt-1">
                          <strong>Đề xuất cách sửa: </strong> {item.suggestedFix}
                        </div>
                      )}
                    </div>
                  )}

                  {item.missingPoints && (
                    <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                      <strong>⚠ Các ý / bước còn thiếu: </strong> {item.missingPoints}
                    </div>
                  )}

                  {item.strengths && !item.correctPoints && (
                    <p className="text-emerald-700 dark:text-emerald-400">
                      <strong>Ưu điểm: </strong> {item.strengths}
                    </p>
                  )}
                  {item.mistakes && !item.incorrectPoints && (
                    <p className="text-rose-600 dark:text-rose-400">
                      <strong>Lưu ý / Sơ suất: </strong> {item.mistakes}
                    </p>
                  )}
                  {item.suggestions && !item.suggestedFix && (
                    <p className="text-amber-700 dark:text-amber-400">
                      <strong>Lời khuyên cải thiện: </strong> {item.suggestions}
                    </p>
                  )}
                </div>

                {/* Đáp án mẫu tham khảo */}
                {item.sampleSolution && (
                  <details className="text-xs text-slate-600 dark:text-slate-400 pt-1">
                    <summary className="font-semibold text-emerald-600 dark:text-emerald-400 cursor-pointer hover:underline">
                      Xem đáp án / hướng trả lời tham khảo và biểu điểm chi tiết
                    </summary>
                    <div className="p-3 mt-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 whitespace-pre-line font-mono leading-relaxed">
                      {item.sampleSolution}
                    </div>
                  </details>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Navigation & Submit */}
      <div className="sticky bottom-4 z-20 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-4 shadow-xl flex items-center justify-between">
        {activeTab === 'working' ? (
          <div className="flex items-center gap-2">
            <button
              disabled={activeExerciseIndex === 0}
              onClick={() => {
                setActiveExerciseIndex(prev => prev - 1);
                setActiveInputKey(exam.exercises[activeExerciseIndex - 1].id);
              }}
              className="px-4 py-2.5 min-h-[44px] rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40 transition-colors"
            >
              ← Bài trước
            </button>
            <button
              disabled={activeExerciseIndex === exam.exercises.length - 1}
              onClick={() => {
                setActiveExerciseIndex(prev => prev + 1);
                setActiveInputKey(exam.exercises[activeExerciseIndex + 1].id);
              }}
              className="px-4 py-2.5 min-h-[44px] rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40 transition-colors"
            >
              Bài tiếp theo →
            </button>
          </div>
        ) : (
          <button
            onClick={() => setActiveTab('working')}
            className="px-4 py-2.5 min-h-[44px] rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors"
          >
            ← Quay lại làm bài
          </button>
        )}

        <button
          onClick={handleGradeExam}
          disabled={isGrading}
          className="flex items-center justify-center gap-2 px-6 py-2.5 min-h-[44px] rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
        >
          {isGrading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>{gradingProgress || 'Đang thẩm định bài làm...'}</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>{gradingResult ? 'Chấm lại bài thi' : 'Nộp bài & Thẩm định'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
