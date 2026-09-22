import React, { useState } from 'react';
import { Sparkles, FileText, CheckCircle2, ChevronRight, AlertCircle, RefreshCw, Send, ArrowLeft, FileCheck2, XCircle, AlertTriangle, BookOpen, TrendingUp } from 'lucide-react';
import { LiteratureExam, LiteratureGradingResult } from '../../types/practiceExamTypes';
import { gradeLiteratureSubmission } from '../../services/literatureGradingService';

interface LiteraturePracticeWorkspaceProps {
  exam: LiteratureExam;
  onExit: () => void;
  onRegenerateNew: () => void;
  onFinishScore: (score: number) => void;
  isRegenerating?: boolean;
  onOpenGeminiConfig?: () => void;
}

export const LiteraturePracticeWorkspace: React.FC<LiteraturePracticeWorkspaceProps> = ({
  exam,
  onExit,
  onRegenerateNew,
  onFinishScore,
  isRegenerating = false,
  onOpenGeminiConfig
}) => {
  const [activeTab, setActiveTab] = useState<'part1' | 'part2' | 'rubric'>('part1');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isGrading, setIsGrading] = useState<boolean>(false);
  const [gradingStatus, setGradingStatus] = useState<string>('');
  const [gradingResult, setGradingResult] = useState<LiteratureGradingResult | null>(null);

  const handleAnswerChange = (key: string, val: string) => {
    setAnswers(prev => ({ ...prev, [key]: val }));
  };

  const calculateWordCount = (text: string) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const handleGradeSubmission = async () => {
    setIsGrading(true);
    try {
      const result = await gradeLiteratureSubmission(exam, answers, (status) => {
        setGradingStatus(status);
      });
      setGradingResult(result);
      onFinishScore(result.totalScore);
      setActiveTab('rubric');
    } catch (error) {
      console.warn('Thông báo khi chấm bài thi Ngữ Văn:', error);
    } finally {
      setIsGrading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header info card */}
      <div className="rounded-2xl border border-indigo-100 dark:border-indigo-950/60 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300">
                Môn Ngữ Văn • Tuyển sinh 10
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300">
                Đề luyện thi mới
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                120 phút • 10.0 điểm
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {exam.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Chủ đề: <strong className="text-slate-800 dark:text-slate-200">{exam.topic}</strong> — Dạng bài: {exam.subtopic}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRegenerateNew}
              disabled={isGrading || isRegenerating}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 min-h-[44px] text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors active:scale-95 disabled:opacity-50"
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

        {/* Tab switchers */}
        <div className="flex flex-wrap items-center gap-2 mt-5 border-t border-slate-100 dark:border-slate-800/80 pt-4">
          <button
            onClick={() => setActiveTab('part1')}
            className={`px-3.5 py-2.5 min-h-[44px] text-xs sm:text-sm font-semibold rounded-xl transition-all ${
              activeTab === 'part1'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Phần I: Đọc hiểu văn học & Đoạn văn (5.0đ)
          </button>
          <button
            onClick={() => setActiveTab('part2')}
            className={`px-3.5 py-2.5 min-h-[44px] text-xs sm:text-sm font-semibold rounded-xl transition-all ${
              activeTab === 'part2'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Phần II: Đọc hiểu thông tin & Bài văn NLXH (5.0đ)
          </button>
          {gradingResult && (
            <button
              onClick={() => setActiveTab('rubric')}
              className={`px-3.5 py-2.5 min-h-[44px] text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                activeTab === 'rubric'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
              }`}
            >
              Bảng điểm & Nhận xét chi tiết ({gradingResult.totalScore}/10)
            </button>
          )}
        </div>
      </div>

      {/* Part 1 Content */}
      {activeTab === 'part1' && (
        <div className="space-y-6">
          {/* Ngữ liệu Phần 1 */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                I. Đọc hiểu văn bản văn học ({exam.part1.passageType})
              </span>
              <span className="text-xs text-slate-400">
                Khoảng {exam.part1.wordCount} chữ • Nguồn: Ngoài SGK
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-4 mb-2">
              "{exam.part1.passageTitle}"
            </h3>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 rounded-xl text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line font-serif italic border-l-4 border-indigo-400 dark:border-indigo-600">
              {exam.part1.passageText}
            </div>
            <p className="text-[11px] text-right text-slate-400 dark:text-slate-500 mt-2">
              ({exam.part1.passageSource})
            </p>
          </div>

          {/* Câu 1: 4 câu hỏi đọc hiểu */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>Câu 1 (3.0 điểm): Trả lời các câu hỏi đọc hiểu</span>
            </h4>

            {exam.part1.question1SubQuestions.map((q, idx) => (
              <div key={q.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center">
                      1.{idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {q.levelLabel} {q.isVietnameseKnowledge && '• Câu hỏi Tiếng Việt'}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                    {q.points} điểm
                  </span>
                </div>

                <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
                  {q.question}
                </p>

                <div>
                  <textarea
                    rows={3}
                    placeholder="Gõ câu trả lời của em ở đây (diễn đạt tự nhiên, rõ ý)..."
                    value={answers[q.id] || ''}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>Số từ: {calculateWordCount(answers[q.id] || '')}</span>
                    <span>Tiêu chí: {q.gradingCriteria}</span>
                  </div>
                </div>

                {/* Nếu đã chấm thì hiện kết quả tương ứng */}
                {gradingResult && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-indigo-600 dark:text-indigo-400">
                      <span>Nhận xét bài làm:</span>
                      <span>
                        {gradingResult.questionScores.find(qs => qs.questionId === q.id)?.score || 0} / {q.points} đ
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      {gradingResult.questionScores.find(qs => qs.questionId === q.id)?.feedback}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 italic pt-1 border-t border-slate-200 dark:border-slate-700">
                      Gợi ý đáp án: {q.guideAnswer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Câu 2: Viết đoạn văn 200 chữ */}
          <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Câu 2: Viết đoạn văn khoảng 200 chữ ({exam.part1.question2.points} điểm)
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300">
                Nhiệm vụ: {exam.part1.question2.taskType}
              </span>
            </div>

            <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
              {exam.part1.question2.prompt}
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Yêu cầu hình thức: Đoạn văn duy nhất, không xuống dòng tách đoạn.</span>
                <span className={`font-bold ${
                  calculateWordCount(answers['p1_q2_essay'] || '') >= 150 && calculateWordCount(answers['p1_q2_essay'] || '') <= 250
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-600 dark:text-amber-400'
                }`}>
                  Đã viết: {calculateWordCount(answers['p1_q2_essay'] || '')} từ (~200 từ chuẩn)
                </span>
              </div>

              <textarea
                rows={7}
                placeholder="Nhập đoạn văn của em vào đây..."
                value={answers['p1_q2_essay'] || ''}
                onChange={(e) => handleAnswerChange('p1_q2_essay', e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
              />
            </div>
          </div>
        </div>
      )}

      {/* Part 2 Content */}
      {activeTab === 'part2' && (
        <div className="space-y-6">
          {/* Ngữ liệu phần 2 */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                II. Đọc hiểu văn bản nghị luận / thông tin
              </span>
              <span className="text-xs text-slate-400">
                Khoảng {exam.part2.wordCount} chữ • Nguồn: Ngoài SGK
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-4 mb-2">
              "{exam.part2.passageTitle}"
            </h3>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 rounded-xl text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line border-l-4 border-indigo-400 dark:border-indigo-600">
              {exam.part2.passageText}
            </div>
            <p className="text-[11px] text-right text-slate-400 dark:text-slate-500 mt-2">
              ({exam.part2.passageSource})
            </p>
          </div>

          {/* Câu 3: Đọc hiểu 1.0 điểm */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Câu 3: Đọc hiểu văn bản thông tin / nghị luận (1.0 điểm)
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300">
                {exam.part2.question3.levelLabel}
              </span>
            </div>

            <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
              {exam.part2.question3.question}
            </p>

            <textarea
              rows={3}
              placeholder="Nhập câu trả lời của em..."
              value={answers['p2_q3'] || ''}
              onChange={(e) => handleAnswerChange('p2_q3', e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Câu 4: Bài văn NLXH 4.0 điểm */}
          <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Câu 4: Viết bài văn nghị luận xã hội ({exam.part2.question4.points} điểm)
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Dạng: {exam.part2.question4.essayType}
              </span>
            </div>

            <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
              {exam.part2.question4.prompt}
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Cấu trúc: Mở bài - Thân bài (các luận điểm, dẫn chứng thực tế, phản biện) - Kết bài</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  Đã viết: {calculateWordCount(answers['p2_q4'] || '')} từ
                </span>
              </div>

              <textarea
                rows={12}
                placeholder="Viết bài văn nghị luận xã hội của em ở đây (khoảng 1.5 trang giấy thi)..."
                value={answers['p2_q4'] || ''}
                onChange={(e) => handleAnswerChange('p2_q4', e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
              />
            </div>
          </div>
        </div>
      )}

      {/* Rubric View */}
      {activeTab === 'rubric' && gradingResult && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-700 via-purple-700 to-blue-800 p-6 text-white shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                    Kết quả bài thi Ngữ Văn
                  </span>
                  {gradingResult.isAiGraded ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                      <Sparkles className="h-3 w-3 text-yellow-300" />
                      Thẩm định bởi Gemini AI (GDPT 2018)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/20 text-indigo-100">
                      Thẩm định sư phạm dự phòng
                    </span>
                  )}
                </div>
                <h2 className="text-3xl font-black mt-1">
                  {gradingResult.totalScore} / {gradingResult.maxScore} điểm
                </h2>
                <div className="mt-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/15 max-w-3xl">
                  <p className="text-xs uppercase tracking-wider font-bold text-indigo-200 mb-1">
                    Góc nhìn của giám khảo chấm thi:
                  </p>
                  <p className="text-xs sm:text-sm text-white leading-relaxed">
                    {gradingResult.overallComment}
                  </p>
                </div>
              </div>

              {!gradingResult.isAiGraded && onOpenGeminiConfig && (
                <button
                  onClick={onOpenGeminiConfig}
                  className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                  <span>Kích hoạt Gemini AI</span>
                </button>
              )}
            </div>
          </div>

          {/* 1. Bảng điểm chi tiết từng câu */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Bảng điểm chi tiết từng câu</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                    <th className="py-2.5 px-3">Câu</th>
                    <th className="py-2.5 px-3">Nội dung câu hỏi / Yêu cầu</th>
                    <th className="py-2.5 px-3 text-center">Điểm đạt</th>
                    <th className="py-2.5 px-3 text-center">Điểm tối đa</th>
                    <th className="py-2.5 px-3 text-right">Đánh giá</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {gradingResult.questionScores.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-3 font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                        {item.title.split('-')[0] || `Câu ${idx + 1}`}
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
                            <CheckCircle2 className="h-3 w-3" /> Đạt trọn vẹn
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
            {/* Top 3 Lỗi quan trọng nhất */}
            <div className="rounded-2xl border border-rose-200 dark:border-rose-950 bg-rose-50/70 dark:bg-rose-950/30 p-5 space-y-3">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                <AlertCircle className="h-4 w-4" />
                <span>3 Điểm yếu quan trọng cần khắc phục</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-rose-900 dark:text-rose-200">
                {(gradingResult.topWeaknesses && gradingResult.topWeaknesses.length > 0 ? gradingResult.topWeaknesses : [
                  'Cần bám sát trọng tâm câu hỏi đọc hiểu, tránh trích dẫn nguyên văn',
                  'Đoạn văn cần phân tích sâu hơn giá trị nghệ thuật đặc sắc',
                  'Bài văn NLXH cần mở rộng dẫn chứng thời sự và phần phản biện'
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
                  'Xác định đúng thể loại và tư tưởng chủ đề ngữ liệu',
                  'Văn phong nghị luận có cảm xúc và thái độ tích cực'
                ]).map((s, sIdx) => (
                  <li key={sIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Gợi ý chủ đề cần ôn tập */}
            <div className="rounded-2xl border border-indigo-200 dark:border-indigo-950 bg-indigo-50/70 dark:bg-indigo-950/30 p-5 space-y-3">
              <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
                <BookOpen className="h-4 w-4" />
                <span>Gợi ý chủ đề cần ôn tập</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-indigo-900 dark:text-indigo-200">
                {(gradingResult.reviewTopics && gradingResult.reviewTopics.length > 0 ? gradingResult.reviewTopics : [
                  'Phương pháp chỉ ra và nêu tác dụng của biện pháp tu từ',
                  'Kỹ thuật viết đoạn văn 200 chữ diễn dịch / quy nạp / tổng-phân-hợp',
                  'Cách lập dàn ý bài văn nghị luận xã hội chuẩn cấu trúc 3 phần'
                ]).map((t, tIdx) => (
                  <li key={tIdx} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3. Chi tiết từng câu */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <span>Đánh giá chi tiết từng câu theo Rubric giáo dục</span>
            </h3>

            {gradingResult.questionScores.map((item, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.score === item.maxScore
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                      : item.score > 0
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300'
                      : 'bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                  }`}>
                    {item.score} / {item.maxScore} điểm
                  </span>
                </div>

                {/* Bài làm của em */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm whitespace-pre-line text-slate-800 dark:text-slate-200 leading-relaxed">
                  <span className="text-[11px] font-sans font-bold uppercase text-slate-500 block mb-1">
                    Bài làm của em:
                  </span>
                  {item.studentAnswer || '(Chưa làm bài này)'}
                </div>

                {item.criteriaScores && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                    {Object.entries(item.criteriaScores).map(([crit, sc], cIdx) => (
                      <div key={cIdx} className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg text-[11px]">
                        <span className="text-slate-500 dark:text-slate-400 block truncate">{crit}</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{sc} điểm</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Phân tích Sư phạm chi tiết */}
                <div className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl space-y-2 leading-relaxed">
                  <p><strong className="text-slate-900 dark:text-white">Nhận xét bài làm: </strong> {item.feedback}</p>

                  {item.correctPoints && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                      <strong>✓ Ý đúng: </strong> {item.correctPoints}
                    </div>
                  )}

                  {item.incorrectPoints && (
                    <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 space-y-1">
                      <div><strong>✗ Ý sai hoặc chưa đầy đủ: </strong> {item.incorrectPoints}</div>
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
                      <strong>⚠ Ý còn thiếu: </strong> {item.missingPoints}
                    </div>
                  )}

                  {item.strengths && !item.correctPoints && (
                    <p className="text-emerald-700 dark:text-emerald-400"><strong>Ưu điểm: </strong> {item.strengths}</p>
                  )}
                  {item.weaknesses && !item.incorrectPoints && (
                    <p className="text-rose-600 dark:text-rose-400"><strong>Điểm cần lưu ý: </strong> {item.weaknesses}</p>
                  )}
                  {item.suggestions && !item.suggestedFix && (
                    <p className="text-amber-700 dark:text-amber-400"><strong>Gợi ý cải thiện: </strong> {item.suggestions}</p>
                  )}
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2 leading-relaxed">
                  <strong>Gợi ý đáp án / Hướng trả lời tham khảo:</strong>
                  <div className="mt-1 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300">
                    {item.guideAnswer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer action bar */}
      <div className="sticky bottom-4 z-20 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-4 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {Object.keys(answers).length} / 7 câu đã nhập câu trả lời
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGradeSubmission}
            disabled={isGrading}
            className="flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50 active:scale-95 cursor-pointer"
          >
            {isGrading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>{gradingStatus || 'Đang chấm điểm...'}</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Nộp bài & Chấm điểm</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
