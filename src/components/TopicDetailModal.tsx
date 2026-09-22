import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Circle, 
  BookOpen, 
  Zap, 
  Code2, 
  HelpCircle, 
  Play, 
  ChevronDown, 
  ChevronUp, 
  Lightbulb,
  Award
} from 'lucide-react';
import { Topic, TopicExercise } from '../types';
import { ENGLISH_GRAMMAR_RULES } from '../data/englishGrammarData';
import { EnglishGrammarCard } from './EnglishGrammarCard';

interface TopicDetailModalProps {
  topic: Topic | null;
  onClose: () => void;
  isCompleted: boolean;
  onToggleComplete: (topicId: string) => void;
  onStartPractice: (subjectId: string, topicId: string) => void;
}

export const TopicDetailModal: React.FC<TopicDetailModalProps> = ({
  topic,
  onClose,
  isCompleted,
  onToggleComplete,
  onStartPractice
}) => {
  const [activeTab, setActiveTab] = useState<'theory' | 'formulas' | 'examples' | 'exercises'>('theory');
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  if (!topic) return null;

  const toggleSolution = (exerciseId: string) => {
    setRevealedSolutions(prev => ({ ...prev, [exerciseId]: !prev[exerciseId] }));
  };

  const handleSelectOption = (exerciseId: string, option: string) => {
    setSelectedAnswers(prev => ({ ...prev, [exerciseId]: option }));
  };

  // Group exercises by level
  const basicExercises = topic.exercises.filter(e => e.level === 'de');
  const mediumExercises = topic.exercises.filter(e => e.level === 'trung-binh');
  const hardExercises = topic.exercises.filter(e => e.level === 'kho');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="topic-detail-modal-container"
        className="relative flex flex-col w-full max-w-4xl max-h-[92vh] rounded-2xl bg-white shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                topic.subjectId === 'toan'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60'
                  : topic.subjectId === 'van'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/60'
                  : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60'
              }`}>
                {topic.subjectId === 'toan' ? 'Toán học' : topic.subjectId === 'van' ? 'Ngữ văn' : 'Tiếng Anh'} • {topic.categoryLabel}
              </span>

              {topic.hcmFocus && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60">
                  Trọng tâm TP.HCM
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              {topic.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {topic.weightInExam}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Learned */}
            <button
              id="toggle-topic-learned-btn"
              onClick={() => onToggleComplete(topic.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Đã học</span>
                </>
              ) : (
                <>
                  <Circle className="h-4 w-4 text-slate-400" />
                  <span>Đánh dấu đã học</span>
                </>
              )}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              id="close-topic-modal-btn"
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-5 bg-slate-50/50 dark:bg-slate-900 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('theory')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'theory'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Tóm tắt lý thuyết
          </button>

          <button
            onClick={() => setActiveTab('formulas')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'formulas'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Zap className="h-4 w-4" />
            Công thức & Quy tắc ({topic.keyFormulas.length})
          </button>

          <button
            onClick={() => setActiveTab('examples')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'examples'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Code2 className="h-4 w-4" />
            Ví dụ minh họa ({topic.examples.length})
          </button>

          <button
            onClick={() => setActiveTab('exercises')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'exercises'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            Bài tập tự luyện ({topic.exercises.length})
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm">
          {/* TAB: THEORY */}
          {activeTab === 'theory' && (
            <div className="space-y-4">
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Tổng quan chuyên đề
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-normal">
                  {topic.theorySummary}
                </p>
              </div>

              {topic.hcmFocus && (
                <div className="rounded-xl bg-amber-50/70 p-4 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs mb-1">
                    <Lightbulb className="h-4 w-4 text-amber-600" />
                    Lưu ý đặc biệt cho đề thi Tuyển sinh 10 TP.HCM
                  </div>
                  <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                    Đề thi Sở GD&ĐT TP.HCM đặc biệt chú trọng tính ứng dụng thực tế. Luôn viết rõ ràng các đơn vị đo lường (m, cm, lít, đồng, %), lập luận từng bước chặt chẽ và không bỏ sót các điều kiện của ẩn số.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB: FORMULAS */}
          {activeTab === 'formulas' && (
            <div className="space-y-4">
              {topic.subjectId === 'anh' && ENGLISH_GRAMMAR_RULES[topic.id] && ENGLISH_GRAMMAR_RULES[topic.id].length > 0 ? (
                <div className="space-y-5">
                  <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5 text-indigo-600" />
                      Cấu trúc & Công thức ngữ pháp ({ENGLISH_GRAMMAR_RULES[topic.id].length} điểm ngữ pháp)
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-5">
                    {ENGLISH_GRAMMAR_RULES[topic.id].map((rule, idx) => (
                      <EnglishGrammarCard key={rule.id || idx} rule={rule} index={idx} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Các công thức & quy tắc cốt lõi cần nhớ
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {topic.keyFormulas.map((formula, index) => (
                      <div 
                        key={index}
                        className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-850 flex items-center gap-3 font-mono text-xs font-semibold text-slate-800 dark:text-slate-200"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-[10px] font-bold">
                          {index + 1}
                        </span>
                        <span className="select-all">{formula}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: EXAMPLES */}
          {activeTab === 'examples' && (
            <div className="space-y-4">
              {topic.examples.map((example, idx) => (
                <div 
                  key={idx}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-4 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                      Ví dụ {idx + 1}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {example.title}
                    </h4>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 font-normal text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                    {example.problem}
                  </div>

                  <div className="p-3.5 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-lg border border-indigo-100 dark:border-indigo-900/50 space-y-2">
                    <div className="text-[11px] font-bold uppercase text-indigo-900 dark:text-indigo-300">
                      Lời giải chi tiết:
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-mono">
                      {example.solution}
                    </p>
                  </div>

                  {example.tip && (
                    <div className="flex items-start gap-2 text-xs text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/50">
                      <Lightbulb className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                      <span><strong>Mẹo thi:</strong> {example.tip}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB: EXERCISES */}
          {activeTab === 'exercises' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Luyện tập phân cấp: Cơ bản → Vận dụng → Nâng cao
                </span>
                <button
                  onClick={() => onStartPractice(topic.subjectId, topic.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  <Play className="h-3.5 w-3.5 fill-white" />
                  Mở chế độ trắc nghiệm tính giờ
                </button>
              </div>

              {/* Render Exercise Group */}
              {renderExerciseList('Cơ bản', basicExercises, revealedSolutions, toggleSolution, selectedAnswers, handleSelectOption)}
              {renderExerciseList('Vận dụng', mediumExercises, revealedSolutions, toggleSolution, selectedAnswers, handleSelectOption)}
              {renderExerciseList('Nâng cao', hardExercises, revealedSolutions, toggleSolution, selectedAnswers, handleSelectOption)}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/60">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Trạng thái: <strong className={isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}>
              {isCompleted ? 'Đã hoàn thành lý thuyết' : 'Chưa đánh dấu đã học'}
            </strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Đóng
            </button>
            <button
              id="modal-start-practice-btn"
              onClick={() => onStartPractice(topic.subjectId, topic.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              <Play className="h-3.5 w-3.5 fill-white" />
              Luyện tập chuyên đề này ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function renderExerciseList(
  levelLabel: string,
  exercises: TopicExercise[],
  revealedSolutions: Record<string, boolean>,
  toggleSolution: (id: string) => void,
  selectedAnswers: Record<string, string>,
  onSelectOption: (id: string, opt: string) => void
) {
  if (exercises.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
          levelLabel === 'Cơ bản'
            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60'
            : levelLabel === 'Vận dụng'
            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/60'
            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60'
        }`}>
          {levelLabel}
        </span>
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          ({exercises.length} câu)
        </span>
      </div>

      <div className="space-y-3">
        {exercises.map((ex, i) => {
          const isRevealed = revealedSolutions[ex.id];
          const userSelected = selectedAnswers[ex.id];
          const isCorrect = userSelected === ex.correctAnswer;

          return (
            <div 
              key={ex.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-4 space-y-3 shadow-2xs"
            >
              <div className="font-semibold text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">Câu {i + 1}:</span>
                <span className="leading-relaxed">{ex.question}</span>
              </div>

              {ex.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {ex.options.map((opt, optIdx) => {
                    const isChoice = userSelected === opt;
                    const showCorrectness = isRevealed || !!userSelected;
                    const isAnswerKey = opt === ex.correctAnswer;

                    let optStyle = 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800';
                    if (isChoice) {
                      optStyle = 'border-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 font-semibold';
                    }
                    if (showCorrectness && isAnswerKey) {
                      optStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 font-bold';
                    } else if (showCorrectness && isChoice && !isCorrect) {
                      optStyle = 'border-rose-300 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 font-semibold';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => onSelectOption(ex.id, opt)}
                        className={`text-left p-2.5 rounded-lg border text-xs transition-all flex items-center gap-2 cursor-pointer ${optStyle}`}
                      >
                        <span className="font-bold text-[10px] uppercase opacity-70">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Reveal explanation button */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => toggleSolution(ex.id)}
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  {isRevealed ? (
                    <>
                      <ChevronUp className="h-3.5 w-3.5" /> Ẩn lời giải & đáp án
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3.5 w-3.5" /> Xem đáp án & lời giải chi tiết
                    </>
                  )}
                </button>

                {userSelected && (
                  <span className={`text-[11px] font-bold ${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {isCorrect ? '✓ Chọn chính xác' : '✗ Chọn chưa đúng'}
                  </span>
                )}
              </div>

              {/* Solution box */}
              {isRevealed && (
                <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-lg border border-indigo-100 dark:border-indigo-900/50 text-xs space-y-1.5 animate-in fade-in">
                  <div className="font-bold text-indigo-900 dark:text-indigo-300">
                    Đáp án đúng: {ex.correctAnswer}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {ex.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
