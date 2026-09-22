import React, { useState } from 'react';
import { X, Clock, Play, BookOpen, CheckCircle2, ChevronDown, ChevronUp, Share2 } from 'lucide-react';
import { Exam } from '../types';

interface ExamPreviewModalProps {
  exam: Exam | null;
  onClose: () => void;
  onStartExam: (exam: Exam) => void;
}

export const ExamPreviewModal: React.FC<ExamPreviewModalProps> = ({
  exam,
  onClose,
  onStartExam
}) => {
  const [showAllSolutions, setShowAllSolutions] = useState<boolean>(false);
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});

  if (!exam) return null;

  const toggleSolution = (qid: string) => {
    setExpandedSolutions(prev => ({
      ...prev,
      [qid]: !prev[qid]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        id="exam-preview-modal"
        className="relative flex flex-col w-full max-w-4xl max-h-[90vh] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 uppercase">
                {exam.subjectId === 'toan' ? 'Môn Toán' : exam.subjectId === 'van' ? 'Môn Ngữ văn' : 'Môn Tiếng Anh'} • {exam.year}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {exam.province}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
              {exam.title}
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Thời gian: {exam.durationMinutes} phút
              </span>
              <span>•</span>
              <span>{exam.questionsCount} câu hỏi</span>
              <span>•</span>
              <span>Độ khó: {exam.difficulty === 'chuan-thi-that' ? 'Chuẩn thi thật' : exam.difficulty === 'nang-cao' ? 'Nâng cao / Chuyên' : 'Cơ bản'}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-slate-50/80 dark:bg-slate-850/40 border-b border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            Chế độ xem trước nội dung & đáp án gợi ý
          </span>
          <button
            onClick={() => setShowAllSolutions(!showAllSolutions)}
            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            {showAllSolutions ? 'Ẩn tất cả lời giải' : 'Hiện tất cả lời giải'}
          </button>
        </div>

        {/* Questions list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {exam.questions.map((q) => {
            const isExpanded = showAllSolutions || !!expandedSolutions[q.id];

            return (
              <div 
                key={q.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-850 space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      Câu {q.number}:
                    </span>
                    <span className="font-medium text-slate-500 dark:text-slate-400">
                      [{q.topicName}]
                    </span>
                  </div>
                  {q.points && (
                    <span className="font-semibold text-slate-500 dark:text-slate-400">
                      ({q.points} điểm)
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-line">
                  {q.text}
                </p>

                {q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt, oIdx) => (
                      <div 
                        key={oIdx}
                        className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200"
                      >
                        <span className="font-bold mr-1.5">{String.fromCharCode(65 + oIdx)}.</span>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Solution reveal */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => toggleSolution(q.id)}
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-3.5 w-3.5" /> Ẩn đáp án
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3.5 w-3.5" /> Xem đáp án & hướng dẫn chấm
                      </>
                    )}
                  </button>

                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    Sở GD&ĐT TP.HCM
                  </span>
                </div>

                {isExpanded && (
                  <div className="p-3.5 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/60 text-xs space-y-1.5 animate-in fade-in">
                    <div className="font-bold text-indigo-900 dark:text-indigo-300">
                      Đáp án chính thức: {q.correctAnswer}
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/60">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Đóng
          </button>

          <button
            id="start-exam-from-preview-btn"
            onClick={() => {
              onClose();
              onStartExam(exam);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            <Play className="h-4 w-4 fill-white" />
            Làm đề này có tính giờ ({exam.durationMinutes} phút)
          </button>
        </div>
      </div>
    </div>
  );
};
