import React, { useState } from 'react';
import { 
  Award, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  LineChart, 
  BookOpen, 
  Calculator, 
  Languages, 
  ChevronDown, 
  ChevronUp, 
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { UserProgress, Topic, SubjectId } from '../types';
import { 
  calculateAggregatedCompetency, 
  calculateSubjectSummaries, 
  extractStrengthsAndWeaknessesFromProgress,
  AggregatedCompetencyResult
} from '../services/competencyService';
import { COMPETENCY_THRESHOLDS } from '../config/competencyConfig';

interface StudentCompetencyDashboardProps {
  progress: UserProgress;
  topics: Topic[];
  onReviewTopic?: (topicId: string) => void;
  onNavigateToPractice?: (subjectId: SubjectId) => void;
}

export const StudentCompetencyDashboard: React.FC<StudentCompetencyDashboardProps> = ({
  progress,
  topics,
  onReviewTopic,
  onNavigateToPractice
}) => {
  const [showThresholdTable, setShowThresholdTable] = useState<boolean>(false);
  const [activeSubjectTab, setActiveSubjectTab] = useState<'all' | SubjectId>('all');

  // Tổng hợp tất cả các bài kiểm tra / đề thi / bài luyện tập
  const allAttempts = React.useMemo(() => {
    return [
      ...progress.practiceAttempts.map(p => ({
        id: p.id,
        title: p.title,
        score: p.score,
        date: p.date,
        subjectId: p.subjectId,
        correctCount: p.correctCount,
        totalQuestions: p.totalQuestions
      })),
      ...progress.examAttempts.map(e => ({
        id: e.id,
        title: e.examTitle,
        score: e.score,
        date: e.date,
        subjectId: e.subjectId,
        correctCount: e.correctCount,
        totalQuestions: e.totalQuestions
      }))
    ];
  }, [progress]);

  const overall = React.useMemo(() => calculateAggregatedCompetency(allAttempts), [allAttempts]);
  const subjectSummaries = React.useMemo(() => calculateSubjectSummaries(allAttempts), [allAttempts]);

  // Gom các weak topics từ các lần làm bài
  const allWeakTopics = React.useMemo(() => {
    const list: Array<{ topicId: string; topicName: string; wrongCount: number }> = [];
    progress.practiceAttempts.forEach(p => {
      p.weakTopics?.forEach(w => list.push(w));
    });
    progress.examAttempts.forEach(e => {
      e.weakTopics?.forEach(w => list.push(w));
    });
    return list;
  }, [progress]);

  const strengthsAndWeaknesses = React.useMemo(() => {
    return extractStrengthsAndWeaknessesFromProgress(
      allWeakTopics,
      topics,
      progress.completedTopicIds
    );
  }, [allWeakTopics, topics, progress.completedTopicIds]);

  // Render SVG Chart for overall or subject series
  const renderLineChart = (series: Array<{ date: string; score: number; title: string }>) => {
    if (!series || series.length < 3) {
      return (
        <div className="py-5 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Cần hoàn thành tối thiểu <strong>3 bài làm</strong> để kích hoạt biểu đồ đường xu hướng tiến bộ.
            (Hiện có: {series.length} bài)
          </p>
        </div>
      );
    }

    const chartWidth = 460;
    const chartHeight = 110;
    const padX = 28;
    const padY = 20;

    const minScore = Math.min(...series.map(s => s.score), 4);
    const maxScore = Math.max(...series.map(s => s.score), 10);
    const scoreRange = Math.max(maxScore - minScore, 1);

    const points = series.map((item, idx) => {
      const x = padX + (idx / (series.length - 1)) * (chartWidth - 2 * padX);
      const y = chartHeight - padY - ((item.score - minScore) / scoreRange) * (chartHeight - 2 * padY);
      return { x, y, score: item.score, date: item.date, title: item.title };
    });

    const pathD = points.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
    }, '');

    const areaD = `${pathD} L ${points[points.length - 1].x},${chartHeight - padY} L ${points[0].x},${chartHeight - padY} Z`;

    return (
      <div className="space-y-3 pt-2">
        {/* Điểm theo thời gian sequence */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 shrink-0">
            Chuỗi điểm:
          </span>
          <div className="flex items-center gap-1 font-mono font-bold">
            {series.map((item, idx) => (
              <React.Fragment key={idx}>
                <span className={`px-2 py-0.5 rounded text-[11px] ${
                  idx === series.length - 1
                    ? 'bg-indigo-600 text-white font-extrabold shadow-2xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}>
                  {item.score.toFixed(1)}
                </span>
                {idx < series.length - 1 && <span className="text-slate-400">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* SVG Graphic */}
        <div className="w-full flex justify-center overflow-x-auto">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full max-w-xl h-28 overflow-visible">
            <defs>
              <linearGradient id="dashboardChartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Baseline Grid lines */}
            <line x1={padX} y1={padY} x2={chartWidth - padX} y2={padY} stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
            <line x1={padX} y1={chartHeight / 2} x2={chartWidth - padX} y2={chartHeight / 2} stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
            <line x1={padX} y1={chartHeight - padY} x2={chartWidth - padX} y2={chartHeight - padY} stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />

            <text x={padX - 6} y={padY + 3} textAnchor="end" className="text-[9px] font-mono fill-slate-400">10đ</text>
            <text x={padX - 6} y={chartHeight - padY + 3} textAnchor="end" className="text-[9px] font-mono fill-slate-400">5đ</text>

            {/* Gradient fill */}
            <path d={areaD} fill="url(#dashboardChartGrad)" />

            {/* Line */}
            <path d={pathD} fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Points with score labels */}
            {points.map((pt, idx) => (
              <g key={idx}>
                <circle 
                  cx={pt.x} 
                  cy={pt.y} 
                  r={idx === points.length - 1 ? 5 : 3.5} 
                  className={idx === points.length - 1 ? 'fill-indigo-600 stroke-white dark:stroke-slate-900 stroke-2' : 'fill-white stroke-indigo-600 dark:fill-slate-900 stroke-2'}
                />
                <text 
                  x={pt.x} 
                  y={pt.y - 7} 
                  textAnchor="middle" 
                  className={`text-[9px] font-mono font-bold ${
                    idx === points.length - 1 ? 'fill-indigo-600 dark:fill-indigo-400 font-black' : 'fill-slate-600 dark:fill-slate-300'
                  }`}
                >
                  {pt.score.toFixed(1)}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Main Overall Competency Evaluation Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-7 dark:border-slate-800 dark:bg-slate-900 shadow-2xs relative overflow-hidden">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Đánh Giá Năng Lực Học Sinh
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  Chuẩn đề thi tuyển sinh 10
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Tự động phân tích điểm số, độ chính xác và xu hướng học tập tích lũy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setShowThresholdTable(!showThresholdTable)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Info className="h-3.5 w-3.5" />
              <span>Bảng thang điểm & năng lực</span>
              {showThresholdTable ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Collapsible Reference Threshold Table */}
        {showThresholdTable && (
          <div className="my-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 animate-in fade-in duration-150">
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Bảng Quy Định Ngưỡng Năng Lực (Thang Điểm 10 Chuẩn)
              </h4>
              <span className="text-[10px] text-slate-400">Làm tròn 1 chữ số thập phân</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {COMPETENCY_THRESHOLDS.map(t => (
                <div key={t.key} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${t.dotColor}`} />
                    <span className="font-bold text-slate-800 dark:text-slate-200">{t.label}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    {t.minScore === 0 ? '< 3.5' : `${t.minScore} – ${t.maxScore}`}đ
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Overall Competency Main Metrics */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Mức năng lực hiện tại */}
          <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 flex flex-col justify-between">
            <span className="text-xs font-semibold text-indigo-900/80 dark:text-indigo-300">
              Năng lực hiện tại
            </span>
            <div className="my-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-sm sm:text-base font-black border ${overall.competency.badgeBg} ${overall.competency.badgeText} ${overall.competency.badgeBorder}`}>
                <span className={`h-2 w-2 rounded-full ${overall.competency.dotColor}`} />
                {overall.hasData ? overall.competency.label : 'Chưa có dữ liệu'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {overall.isOutlierDampened ? 'Đã làm mịn bài bất thường' : 'Đánh giá tổng hợp'}
            </p>
          </div>

          {/* Điểm bài gần nhất & Điểm TB */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Bài gần nhất
              </span>
              <span className="text-xs text-slate-400">/ TB</span>
            </div>
            <div className="my-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {overall.latestScoreDisplay}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                (TB: {overall.avgScoreDisplay})
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Cao nhất: <strong className="text-amber-600 dark:text-amber-400">{overall.highestScoreDisplay}</strong>
            </p>
          </div>

          {/* Xu hướng học tập */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Xu hướng kết quả
            </span>
            <div className="my-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs sm:text-sm font-bold border ${overall.trendConfig.badgeBg} ${overall.trendConfig.textColor} ${overall.trendConfig.badgeBorder}`}>
                <span>{overall.trendConfig.symbol}</span>
                <span>{overall.trendConfig.label}</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Độ chính xác: <strong>{overall.overallAccuracy}%</strong>
            </p>
          </div>

          {/* Tổng số bài đã làm */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Tổng số bài đã làm
            </span>
            <div className="my-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
                {overall.totalTests}
              </span>
              <span className="text-xs text-slate-400">bài kiểm tra</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Đề thi & chuyên đề
            </p>
          </div>
        </div>

        {/* Nhận xét tự động tổng thể */}
        <div className="mt-4 p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-indigo-600 text-white shrink-0 mt-0.5">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-200 uppercase tracking-wider">
              Nhận xét tự động từ hệ thống:
            </h4>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 mt-1 leading-relaxed">
              "{overall.feedback}"
            </p>
          </div>
        </div>

        {/* Biểu đồ tiến bộ tổng hợp (Yêu cầu 8: Khi có từ 3 bài trở lên) */}
        <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LineChart className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Biểu Đồ Diễn Biến Điểm Số Theo Thời Gian
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">
              Theo dõi chuỗi phong độ các bài kiểm tra
            </span>
          </div>

          {renderLineChart(overall.scoreSeries)}
        </div>
      </div>

      {/* 2. Đánh giá theo từng môn (Yêu cầu 4: Toán, Ngữ văn, Tiếng Anh) */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Đánh Giá Năng Lực Từng Môn Học
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Phân loại năng lực độc lập cho 3 môn thi vào 10 tại TP.HCM
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Thẻ Môn Toán */}
          <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/40 dark:border-blue-950 dark:bg-blue-950/20 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Calculator className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs sm:text-sm font-extrabold text-blue-950 dark:text-blue-200">
                    Môn Toán
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${subjectSummaries.toan.competency.badgeBg} ${subjectSummaries.toan.competency.badgeText} ${subjectSummaries.toan.competency.badgeBorder}`}>
                  {subjectSummaries.toan.totalTests > 0 ? subjectSummaries.toan.competency.label : 'Chưa thi'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-blue-100/80 dark:border-blue-900/60">
                  <span className="text-[10px] text-slate-500">Điểm TB</span>
                  <p className="text-base font-black text-blue-700 dark:text-blue-400">
                    {subjectSummaries.toan.totalTests > 0 ? `${subjectSummaries.toan.avgScore.toFixed(1)}đ` : '—'}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-blue-100/80 dark:border-blue-900/60">
                  <span className="text-[10px] text-slate-500">Bài gần nhất</span>
                  <p className="text-base font-black text-slate-800 dark:text-slate-200">
                    {subjectSummaries.toan.latestScore !== null ? `${subjectSummaries.toan.latestScore.toFixed(1)}đ` : '—'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-blue-200/50 dark:border-blue-900/40 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">
                Đã làm: <strong>{subjectSummaries.toan.totalTests}</strong> bài
              </span>
              {onNavigateToPractice && (
                <button
                  onClick={() => onNavigateToPractice('toan')}
                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Luyện Toán <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Thẻ Môn Ngữ văn */}
          <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 dark:border-emerald-950 dark:bg-emerald-950/20 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs sm:text-sm font-extrabold text-emerald-950 dark:text-emerald-200">
                    Môn Ngữ văn
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${subjectSummaries.van.competency.badgeBg} ${subjectSummaries.van.competency.badgeText} ${subjectSummaries.van.competency.badgeBorder}`}>
                  {subjectSummaries.van.totalTests > 0 ? subjectSummaries.van.competency.label : 'Chưa thi'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-emerald-100/80 dark:border-emerald-900/60">
                  <span className="text-[10px] text-slate-500">Điểm TB</span>
                  <p className="text-base font-black text-emerald-700 dark:text-emerald-400">
                    {subjectSummaries.van.totalTests > 0 ? `${subjectSummaries.van.avgScore.toFixed(1)}đ` : '—'}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-emerald-100/80 dark:border-emerald-900/60">
                  <span className="text-[10px] text-slate-500">Bài gần nhất</span>
                  <p className="text-base font-black text-slate-800 dark:text-slate-200">
                    {subjectSummaries.van.latestScore !== null ? `${subjectSummaries.van.latestScore.toFixed(1)}đ` : '—'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-200/50 dark:border-emerald-900/40 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">
                Đã làm: <strong>{subjectSummaries.van.totalTests}</strong> bài
              </span>
              {onNavigateToPractice && (
                <button
                  onClick={() => onNavigateToPractice('van')}
                  className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Luyện Văn <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Thẻ Môn Tiếng Anh */}
          <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/40 dark:border-amber-950 dark:bg-amber-950/20 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Languages className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs sm:text-sm font-extrabold text-amber-950 dark:text-amber-200">
                    Môn Tiếng Anh
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${subjectSummaries.anh.competency.badgeBg} ${subjectSummaries.anh.competency.badgeText} ${subjectSummaries.anh.competency.badgeBorder}`}>
                  {subjectSummaries.anh.totalTests > 0 ? subjectSummaries.anh.competency.label : 'Chưa thi'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-amber-100/80 dark:border-amber-900/60">
                  <span className="text-[10px] text-slate-500">Điểm TB</span>
                  <p className="text-base font-black text-amber-700 dark:text-amber-400">
                    {subjectSummaries.anh.totalTests > 0 ? `${subjectSummaries.anh.avgScore.toFixed(1)}đ` : '—'}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-amber-100/80 dark:border-amber-900/60">
                  <span className="text-[10px] text-slate-500">Bài gần nhất</span>
                  <p className="text-base font-black text-slate-800 dark:text-slate-200">
                    {subjectSummaries.anh.latestScore !== null ? `${subjectSummaries.anh.latestScore.toFixed(1)}đ` : '—'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-amber-200/50 dark:border-amber-900/40 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">
                Đã làm: <strong>{subjectSummaries.anh.totalTests}</strong> bài
              </span>
              {onNavigateToPractice && (
                <button
                  onClick={() => onNavigateToPractice('anh')}
                  className="text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Luyện Anh <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Phân tích Điểm mạnh và Điểm cần cải thiện (Yêu cầu 5: dựa trên chuyên đề) */}
      {strengthsAndWeaknesses.hasSufficientData && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Phân Tích Điểm Mạnh & Điểm Cần Cải Thiện
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Trích xuất từ kết quả trả lời thực tế của các bài luyện tập và đề thi
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cột Điểm Mạnh */}
            <div className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/30 dark:border-emerald-950 dark:bg-emerald-950/20 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <h3 className="text-xs sm:text-sm font-bold">
                  Điểm mạnh kiến thức ({strengthsAndWeaknesses.strengths.length} phần)
                </h3>
              </div>

              {strengthsAndWeaknesses.strengths.length === 0 ? (
                <p className="text-xs text-slate-500">
                  Hãy hoàn thành thêm các chuyên đề để xác định điểm mạnh vượt trội của bạn.
                </p>
              ) : (
                <div className="space-y-2">
                  {strengthsAndWeaknesses.strengths.map((st, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/60 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {st.name}
                      </span>
                      <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
                        Đạt {st.percent}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cột Cần Cải Thiện */}
            <div className="p-4 rounded-xl border border-rose-200/80 bg-rose-50/30 dark:border-rose-950 dark:bg-rose-950/20 space-y-3">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                <h3 className="text-xs sm:text-sm font-bold">
                  Điểm cần cải thiện ({strengthsAndWeaknesses.weaknesses.length} phần)
                </h3>
              </div>

              {strengthsAndWeaknesses.weaknesses.length === 0 ? (
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  Rất tốt! Chưa phát hiện chuyên đề nào có tỉ lệ sai vượt mức cảnh báo.
                </p>
              ) : (
                <div className="space-y-2">
                  {strengthsAndWeaknesses.weaknesses.map((wk, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/60 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                          {wk.name}
                        </span>
                        <span className="text-[10px] text-rose-600 font-medium">
                          {wk.note}
                        </span>
                      </div>
                      {onReviewTopic && (
                        <button
                          onClick={() => onReviewTopic(wk.name)}
                          className="px-2.5 py-1 rounded text-[11px] font-bold bg-rose-100 hover:bg-rose-200 text-rose-800 dark:bg-rose-950 dark:hover:bg-rose-900 dark:text-rose-200 transition-colors shrink-0 cursor-pointer"
                        >
                          Ôn lại
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
