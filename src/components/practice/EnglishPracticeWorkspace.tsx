import React, { useState } from 'react';
import { RefreshCw, ArrowLeft, Send, CheckCircle2, XCircle, ChevronDown, ChevronUp, BookOpen, AlertTriangle, Sparkles, Lightbulb, AlertCircle, TrendingUp, FileCheck2 } from 'lucide-react';
import { EnglishExam } from '../../types/practiceExamTypes';
import { gradeEnglishSubmission, EnglishGradingSubmissionResult } from '../../services/englishGradingService';

interface EnglishPracticeWorkspaceProps {
  exam: EnglishExam;
  onExit: () => void;
  onRegenerateNew: () => void;
  onFinishScore: (score: number) => void;
  isRegenerating?: boolean;
  onOpenGeminiConfig?: () => void;
}

export const EnglishPracticeWorkspace: React.FC<EnglishPracticeWorkspaceProps> = ({
  exam,
  onExit,
  onRegenerateNew,
  onFinishScore,
  isRegenerating = false,
  onOpenGeminiConfig
}) => {
  const [activePart, setActivePart] = useState<1 | 2 | 3 | 4>(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isGrading, setIsGrading] = useState<boolean>(false);
  const [gradingProgress, setGradingProgress] = useState<string>('');
  const [gradingResult, setGradingResult] = useState<EnglishGradingSubmissionResult | null>(null);

  const part1Questions = exam.questions.filter(q => q.partIndex === 1);
  const part2Questions = exam.questions.filter(q => q.partIndex === 2);
  const part3Questions = exam.questions.filter(q => q.partIndex === 3);
  const part4Questions = exam.questions.filter(q => q.partIndex === 4);

  const handleSelectAnswer = (qId: string, val: string) => {
    if (isGrading) return;
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const calculateScore = () => {
    let totalScore = 0;
    exam.questions.forEach(q => {
      const studentAns = (answers[q.id] || '').trim().toLowerCase();
      const correctAns = q.correctAnswer.trim().toLowerCase();
      const alternatives = (q.acceptableAlternativeAnswers || []).map(a => a.trim().toLowerCase());

      if (studentAns === correctAns || alternatives.includes(studentAns)) {
        totalScore += q.points;
      }
    });
    return Math.round(totalScore * 100) / 100;
  };

  const handleSubmit = async () => {
    setIsGrading(true);
    setGradingProgress('AI đang thẩm định 40 câu hỏi và phân tích ngữ pháp...');
    try {
      const result = await gradeEnglishSubmission(exam, answers, (msg) => {
        setGradingProgress(msg);
      });
      setGradingResult(result);
      setIsSubmitted(true);
      onFinishScore(result.totalScore);
    } catch (err) {
      console.warn('Thông báo khi chấm bài thi Tiếng Anh:', err);
      const fallbackScore = calculateScore();
      setIsSubmitted(true);
      onFinishScore(fallbackScore);
    } finally {
      setIsGrading(false);
      setGradingProgress('');
    }
  };

  const currentQuestions = 
    activePart === 1 ? part1Questions :
    activePart === 2 ? part2Questions :
    activePart === 3 ? part3Questions : part4Questions;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="rounded-2xl border border-indigo-100 dark:border-indigo-950/60 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300">
                Môn Tiếng Anh • Tuyển sinh 10
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300">
                Đề thi 40 câu trọn vẹn
              </span>
              <span className="text-xs text-slate-500">90 phút • 10.0 điểm</span>
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

        {/* 4 Parts Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 border-t border-slate-100 dark:border-slate-800 pt-4">
          <button
            onClick={() => setActivePart(1)}
            className={`p-3 min-h-[44px] rounded-xl text-xs font-bold transition-all text-left flex items-center ${
              activePart === 1
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Phần 1: Ngữ âm (4 câu)
          </button>
          <button
            onClick={() => setActivePart(2)}
            className={`p-3 min-h-[44px] rounded-xl text-xs font-bold transition-all text-left flex items-center ${
              activePart === 2
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Phần 2: Từ vựng & Ngữ pháp (12 câu)
          </button>
          <button
            onClick={() => setActivePart(4)}
            className={`p-3 min-h-[44px] rounded-xl text-xs font-bold transition-all text-left flex items-center ${
              activePart === 4
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Phần 3: Đọc hiểu (12 câu)
          </button>
          <button
            onClick={() => setActivePart(3)}
            className={`p-3 min-h-[44px] rounded-xl text-xs font-bold transition-all text-left flex items-center ${
              activePart === 3
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Phần 4: Kĩ năng Viết (12 câu)
          </button>
        </div>
      </div>

      {/* Score overview & Góc nhìn giám khảo when submitted */}
      {isSubmitted && gradingResult && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-amber-600 via-orange-600 to-indigo-800 p-6 text-white shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-100">
                    Kết quả bài thi Tiếng Anh
                  </span>
                  {gradingResult.isAiGraded ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-400/25 text-emerald-100 border border-emerald-300/40">
                      <Sparkles className="h-3 w-3 text-yellow-300" />
                      Chẩn đoán bởi Gemini AI (GDPT 2018)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/20 text-amber-100">
                      Chẩn đoán tiêu chuẩn dự phòng
                    </span>
                  )}
                </div>
                <h2 className="text-3xl font-black mt-1">
                  {gradingResult.totalScore} / {gradingResult.maxScore} điểm
                </h2>
                <p className="text-xs text-amber-100 mt-1">
                  Đúng {gradingResult.correctCount} / 40 câu • Chưa đúng {gradingResult.wrongCount} câu
                </p>

                <div className="mt-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/15 max-w-3xl">
                  <p className="text-xs uppercase tracking-wider font-bold text-amber-100 mb-1">
                    Góc nhìn sư phạm của giáo viên luyện thi:
                  </p>
                  <p className="text-xs sm:text-sm text-white leading-relaxed">
                    {gradingResult.teacherReview}
                  </p>
                </div>
              </div>

              {!gradingResult.isAiGraded && onOpenGeminiConfig && (
                <button
                  onClick={onOpenGeminiConfig}
                  className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-white text-orange-700 hover:bg-orange-50 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                  <span>Kích hoạt Gemini AI</span>
                </button>
              )}
            </div>
          </div>

          {/* Bộ ba chẩn đoán sư phạm: 3 Lỗi quan trọng nhất - Điểm mạnh - Gợi ý ôn tập */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Top 3 lỗi quan trọng nhất */}
            <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/20 space-y-2">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs uppercase tracking-wider">
                <AlertCircle className="h-4 w-4" />
                <span>3 Lỗi quan trọng cần sửa:</span>
              </div>
              <ul className="text-xs sm:text-sm text-rose-900 dark:text-rose-200 space-y-1 pl-4 list-disc">
                {(gradingResult.topWeaknesses && gradingResult.topWeaknesses.length > 0 ? gradingResult.topWeaknesses : [
                  'Word Formation: Cần nhận biết chính xác tiền tố và hậu tố',
                  'Sentence Transformation: Chú ý thì của câu gốc và cấu trúc tương đương',
                  'Prepositions: Ôn lại các cụm giới từ đi kèm tính từ/động từ'
                ]).slice(0, 3).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Những phần học sinh làm tốt */}
            <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/20 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider">
                <TrendingUp className="h-4 w-4" />
                <span>Những phần em làm tốt:</span>
              </div>
              <ul className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 space-y-1 pl-4 list-disc">
                {(gradingResult.keyStrengths && gradingResult.keyStrengths.length > 0 ? gradingResult.keyStrengths : [
                  'Nắm vững ngữ âm và phát âm các đuôi thông dụng',
                  'Hoàn thành bài thi với tốc độ tương đối tốt'
                ]).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Gợi ý chủ đề cần ôn tập */}
            <div className="p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/70 dark:bg-indigo-950/20 space-y-2">
              <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider">
                <BookOpen className="h-4 w-4" />
                <span>Gợi ý chủ đề cần ôn tập:</span>
              </div>
              <ul className="text-xs sm:text-sm text-indigo-900 dark:text-indigo-200 space-y-1 pl-4 list-disc">
                {(gradingResult.reviewTopics && gradingResult.reviewTopics.length > 0 ? gradingResult.reviewTopics : [
                  'Họ từ (Word family) và bảng tiền tố phủ định',
                  'Cấu trúc viết lại câu với So/Such, Although/In spite of',
                  'Kỹ thuật đọc lướt (skimming) và quét từ khóa (scanning)'
                ]).map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Part 3 Special Passages View */}
      {activePart === 4 && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
              Văn bản 1: Bài điền khuyết (Cloze Passage - Câu 17 đến 22)
            </h3>
            <p className="text-sm font-serif leading-relaxed text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl">
              {exam.clozePassage.text}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
              Văn bản 2: Đọc hiểu văn bản (Reading Comprehension - Câu 23 đến 28)
            </h3>
            <p className="text-sm font-serif leading-relaxed text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl">
              {exam.readingPassage.text}
            </p>
          </div>
        </div>
      )}

      {/* Questions list */}
      <div className="space-y-4">
        {currentQuestions.map((q) => {
          const studentAns = (answers[q.id] || '').trim();
          const isCorrect = 
            studentAns.toLowerCase() === q.correctAnswer.toLowerCase() ||
            (q.acceptableAlternativeAnswers || []).some(a => a.toLowerCase() === studentAns.toLowerCase());

          return (
            <div
              key={q.id}
              className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/60 dark:bg-emerald-950/20'
                    : 'border-rose-200 bg-rose-50/40 dark:border-rose-900/60 dark:bg-rose-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center">
                    {q.index}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {q.partTitle}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {isSubmitted && (
                    isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" /> Đúng (+{q.points}đ)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                        <XCircle className="h-4 w-4" /> Chưa đúng (0đ)
                      </span>
                    )
                  )}
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {q.points}đ
                  </span>
                </div>
              </div>

              <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 mb-3 leading-relaxed">
                {q.prompt}
              </p>

              {/* Options selection */}
              {q.options && q.options.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, oIdx) => {
                    const optLetter = opt.charAt(0);
                    const isSelected = answers[q.id] === optLetter;
                    const isTheCorrectOne = isSubmitted && optLetter.toLowerCase() === q.correctAnswer.toLowerCase();

                    return (
                      <button
                        key={oIdx}
                        disabled={isGrading}
                        onClick={() => handleSelectAnswer(q.id, optLetter)}
                        className={`p-3 min-h-[44px] rounded-xl text-xs sm:text-sm text-left transition-all flex items-center gap-2.5 ${
                          isTheCorrectOne
                            ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200 font-bold border-2 border-emerald-500'
                            : isSelected
                            ? isSubmitted
                              ? 'bg-rose-100 text-rose-900 dark:bg-rose-900/60 dark:text-rose-200 line-through'
                              : 'bg-indigo-600 text-white font-semibold shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <span className="font-bold">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Điền từ hoặc viết câu */
                <div className="space-y-1">
                  <input
                    type="text"
                    disabled={isGrading}
                    placeholder="Gõ đáp án của bạn..."
                    value={answers[q.id] || ''}
                    onChange={(e) => handleSelectAnswer(q.id, e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              {/* Giải thích chi tiết khi nộp */}
              {isSubmitted && (
                <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1 border border-slate-200 dark:border-slate-700">
                  <p>
                    <strong className="text-indigo-600 dark:text-indigo-400">Đáp án chuẩn: </strong>
                    {q.correctAnswer}
                    {q.acceptableAlternativeAnswers && q.acceptableAlternativeAnswers.length > 0 && (
                      <span className="text-slate-400"> (Chấp nhận: {q.acceptableAlternativeAnswers.join(', ')})</span>
                    )}
                  </p>
                  <p>
                    <strong>Giải thích: </strong> {q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Submit Bar */}
      <div className="sticky bottom-4 z-20 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-4 shadow-xl flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {Object.keys(answers).length} / 40 câu đã điền
        </span>

        <button
          onClick={handleSubmit}
          disabled={isGrading}
          className="flex items-center justify-center gap-2 px-6 py-2.5 min-h-[44px] rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
        >
          {isGrading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>{gradingProgress || 'Đang thẩm định...'}</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>{isSubmitted ? 'Chấm lại bài thi' : 'Nộp bài & Thẩm định'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
