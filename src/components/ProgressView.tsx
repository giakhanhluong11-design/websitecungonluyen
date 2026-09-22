import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  Target, 
  Sparkles, 
  Flame, 
  BookOpen,
  History,
  RotateCcw
} from 'lucide-react';
import { UserProgress, Topic } from '../types';
import { StudentCompetencyDashboard } from './StudentCompetencyDashboard';
import { getCompetencyByScore } from '../services/competencyService';

interface ProgressViewProps {
  progress: UserProgress;
  topics: Topic[];
  onReviewTopic: (topicId: string) => void;
  onClearHistory?: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  progress,
  topics,
  onReviewTopic,
  onClearHistory
}) => {
  const [historyTab, setHistoryTab] = useState<'all' | 'exam' | 'practice'>('all');

  // Completed counts
  const mathTopics = topics.filter(t => t.subjectId === 'toan');
  const mathDone = mathTopics.filter(t => progress.completedTopicIds.includes(t.id)).length;
  const mathPercent = Math.round((mathDone / Math.max(mathTopics.length, 1)) * 100);

  const vanTopics = topics.filter(t => t.subjectId === 'van');
  const vanDone = vanTopics.filter(t => progress.completedTopicIds.includes(t.id)).length;
  const vanPercent = Math.round((vanDone / Math.max(vanTopics.length, 1)) * 100);

  const anhTopics = topics.filter(t => t.subjectId === 'anh');
  const anhDone = anhTopics.filter(t => progress.completedTopicIds.includes(t.id)).length;
  const anhPercent = Math.round((anhDone / Math.max(anhTopics.length, 1)) * 100);

  // Overall calculations
  const allScores = [
    ...progress.practiceAttempts.map(p => ({ ...p, type: 'practice' as const })),
    ...progress.examAttempts.map(e => ({ ...e, type: 'exam' as const, title: e.examTitle }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalSessions = allScores.length;
  const avgScore = totalSessions > 0
    ? (allScores.reduce((acc, cur) => acc + cur.score, 0) / totalSessions).toFixed(1)
    : '0.0';

  const maxScore = totalSessions > 0
    ? Math.max(...allScores.map(s => s.score)).toFixed(1)
    : '0.0';

  const studyHours = (progress.studyTimeMinutes / 60).toFixed(1);

  // Consolidated Weak Knowledge Points
  const consolidatedWeakTopics = useMemo(() => {
    const map = new Map<string, { topicId: string; topicName: string; wrongCount: number }>();
    
    // Aggregate from practice attempts
    progress.practiceAttempts.forEach(p => {
      p.weakTopics.forEach(w => {
        const existing = map.get(w.topicId) || { topicId: w.topicId, topicName: w.topicName, wrongCount: 0 };
        existing.wrongCount += w.wrongCount;
        map.set(w.topicId, existing);
      });
    });

    // Aggregate from exam attempts
    progress.examAttempts.forEach(e => {
      e.weakTopics.forEach(w => {
        const existing = map.get(w.topicId) || { topicId: w.topicId, topicName: w.topicName, wrongCount: 0 };
        existing.wrongCount += w.wrongCount;
        map.set(w.topicId, existing);
      });
    });

    return Array.from(map.values()).sort((a, b) => b.wrongCount - a.wrongCount);
  }, [progress]);

  // Filtered History list
  const filteredHistory = useMemo(() => {
    if (historyTab === 'exam') return allScores.filter(s => s.type === 'exam');
    if (historyTab === 'practice') return allScores.filter(s => s.type === 'practice');
    return allScores;
  }, [allScores, historyTab]);

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Tiến Độ & Phân Tích Kết Quả Học Tập
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Theo dõi sự tiến bộ hàng ngày, chẩn đoán lỗ hổng kiến thức và lịch sử làm bài chi tiết
          </p>
        </div>

        {/* Target School Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-900 text-xs">
          <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-slate-700 dark:text-slate-300">
            NV1: <strong className="text-indigo-700 dark:text-indigo-300">{progress.profile.targetSchool}</strong> ({progress.profile.targetScore}đ)
          </span>
        </div>
      </div>

      {/* 4 Core Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Số bài đã luyện</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <TrendingUp className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalSessions}</span>
            <span className="text-xs text-slate-400">bài</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {progress.examAttempts.length} đề thi, {progress.practiceAttempts.length} bài luyện
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Điểm trung bình</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <Award className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{avgScore}</span>
            <span className="text-xs text-slate-400">/10đ</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Độ chuẩn bị tổng thể</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Điểm cao nhất</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <Sparkles className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{maxScore}</span>
            <span className="text-xs text-slate-400">/10đ</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Thành tích kỷ lục</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Thời gian học tập</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{studyHours}</span>
            <span className="text-xs text-slate-400">giờ</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Chuỗi: {progress.streakDays} ngày liên tiếp</p>
        </div>
      </div>

      {/* Đánh Giá Năng Lực Học Sinh Chi Tiết */}
      <StudentCompetencyDashboard
        progress={progress}
        onReviewTopic={onReviewTopic}
      />

      {/* Completion Rate for 3 Subjects */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-2xs space-y-4">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
          Tỷ Lệ Hoàn Thành Kiến Thức Từng Môn
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Môn Toán */}
          <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 dark:border-blue-950 dark:bg-blue-950/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 dark:text-blue-300">Môn Toán</span>
              <span className="text-xs font-extrabold text-blue-700 dark:text-blue-400">{mathPercent}%</span>
            </div>
            <div className="h-2 w-full bg-blue-200/60 dark:bg-blue-900/60 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${mathPercent}%` }} />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Đã học {mathDone} / {mathTopics.length} chuyên đề
            </p>
          </div>

          {/* Môn Ngữ văn */}
          <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 dark:border-emerald-950 dark:bg-emerald-950/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">Môn Ngữ văn</span>
              <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">{vanPercent}%</span>
            </div>
            <div className="h-2 w-full bg-emerald-200/60 dark:bg-emerald-900/60 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full transition-all duration-500" style={{ width: `${vanPercent}%` }} />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Đã học {vanDone} / {vanTopics.length} chuyên đề
            </p>
          </div>

          {/* Môn Tiếng Anh */}
          <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/50 dark:border-amber-950 dark:bg-amber-950/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300">Môn Tiếng Anh</span>
              <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400">{anhPercent}%</span>
            </div>
            <div className="h-2 w-full bg-amber-200/60 dark:bg-amber-900/60 rounded-full overflow-hidden">
              <div className="h-full bg-amber-600 rounded-full transition-all duration-500" style={{ width: `${anhPercent}%` }} />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Đã học {anhDone} / {anhTopics.length} chuyên đề
            </p>
          </div>
        </div>
      </div>

      {/* Weak Points Diagnostic Section */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Kiến Thức Còn Yếu (Cần Ôn Luyện Lại)
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Tự động phát hiện từ các câu trả lời sai
          </span>
        </div>

        {consolidatedWeakTopics.length === 0 ? (
          <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 text-center space-y-1">
            <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
            <p className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-300">
              Tuyệt vời! Bạn chưa có phần kiến thức yếu nào cần cảnh báo.
            </p>
            <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80">
              Hãy tiếp tục làm đề thi thử để hệ thống liên tục đánh giá năng lực của bạn.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {consolidatedWeakTopics.map((item) => (
              <div
                key={item.topicId}
                className="p-4 rounded-xl border border-rose-200 dark:border-rose-950 bg-rose-50/40 dark:bg-rose-950/20 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-rose-600 dark:text-rose-400 font-bold">
                      {item.wrongCount} câu sai
                    </span>
                    <span className="text-[10px] text-rose-500">Độ ưu tiên cao</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {item.topicName}
                  </h4>
                </div>

                <div className="mt-3 pt-2 border-t border-rose-200/60 dark:border-rose-900/60 flex items-center justify-end">
                  <button
                    onClick={() => onReviewTopic(item.topicId)}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                  >
                    Ôn tập ngay <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History Log */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Lịch Sử Làm Bài Chi Tiết
            </h2>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium">
            <button
              onClick={() => setHistoryTab('all')}
              className={`px-3 py-1 rounded-md transition-colors ${
                historyTab === 'all' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-2xs' : 'text-slate-500'
              }`}
            >
              Tất cả ({allScores.length})
            </button>
            <button
              onClick={() => setHistoryTab('exam')}
              className={`px-3 py-1 rounded-md transition-colors ${
                historyTab === 'exam' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-2xs' : 'text-slate-500'
              }`}
            >
              Đề thi ({progress.examAttempts.length})
            </button>
            <button
              onClick={() => setHistoryTab('practice')}
              className={`px-3 py-1 rounded-md transition-colors ${
                historyTab === 'practice' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-2xs' : 'text-slate-500'
              }`}
            >
              Chuyên đề ({progress.practiceAttempts.length})
            </button>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-500">
            Chưa có bài thi hoặc bài luyện tập nào trong mục này.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredHistory.map((item) => {
              const minutesSpent = Math.round(item.durationSpentSeconds / 60);

              return (
                <div key={item.id} className="py-3.5 flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.type === 'exam' 
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' 
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}>
                        {item.type === 'exam' ? 'Đề thi thử' : 'Luyện tập'}
                      </span>
                      {(() => {
                        const comp = getCompetencyByScore(item.score);
                        return (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${comp.badgeBg} ${comp.badgeText} ${comp.badgeBorder}`}>
                            {item.competencyLevel || comp.label}
                          </span>
                        );
                      })()}
                      <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                        {item.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {item.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {minutesSpent} phút làm bài
                      </span>
                      <span>•</span>
                      <span>{item.correctCount}/{item.totalQuestions} câu đúng</span>
                      <span>•</span>
                      <span className="font-medium text-indigo-600 dark:text-indigo-400">
                        {typeof item.accuracy === 'number' ? item.accuracy : Math.round((item.correctCount / Math.max(1, item.totalQuestions)) * 100)}% chính xác
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-base sm:text-lg font-black ${
                      item.score >= 8.0 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : item.score >= 5.0 
                        ? 'text-indigo-600 dark:text-indigo-400' 
                        : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {item.score}
                    </span>
                    <span className="text-[10px] text-slate-400"> /10đ</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
