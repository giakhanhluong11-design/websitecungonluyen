import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Sparkles, 
  AlertTriangle, 
  ArrowRight,
  BarChart2,
  LineChart,
  HelpCircle
} from 'lucide-react';
import { SingleAssessmentResult, AggregatedCompetencyResult } from '../services/competencyService';

interface CompetencyAssessmentBlockProps {
  assessment: SingleAssessmentResult;
  historySummary?: AggregatedCompetencyResult | null;
  examTitle?: string;
  durationText?: string;
  onReviewTopic?: (topicId: string) => void;
}

export const CompetencyAssessmentBlock: React.FC<CompetencyAssessmentBlockProps> = ({
  assessment,
  historySummary,
  examTitle,
  durationText,
  onReviewTopic
}) => {
  const { score, accuracy, correctCount, wrongCount, totalQuestions, competency, feedback, weaknesses } = assessment;

  // Render SVG mini progression chart if history has >= 3 tests
  const renderProgressChart = () => {
    if (!historySummary || historySummary.scoreSeries.length < 3) return null;

    const series = historySummary.scoreSeries;
    const chartWidth = 320;
    const chartHeight = 80;
    const paddingX = 24;
    const paddingY = 16;

    const minScore = Math.min(...series.map(s => s.score), 5);
    const maxScore = Math.max(...series.map(s => s.score), 10);
    const scoreRange = Math.max(maxScore - minScore, 1);

    const points = series.map((item, index) => {
      const x = paddingX + (index / (series.length - 1)) * (chartWidth - 2 * paddingX);
      const y = chartHeight - paddingY - ((item.score - minScore) / scoreRange) * (chartHeight - 2 * paddingY);
      return { x, y, score: item.score, date: item.date, title: item.title };
    });

    const pathD = points.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
    }, '');

    const areaD = `${pathD} L ${points[points.length - 1].x},${chartHeight} L ${points[0].x},${chartHeight} Z`;

    return (
      <div className="mt-4 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 p-4 border border-slate-200/80 dark:border-slate-800/80 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
            <LineChart className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Biểu đồ tiến bộ qua các bài làm ({series.length} bài gần nhất)</span>
          </div>

          {/* Sequence representation: 6.5 → 7.0 → 7.4 → 8.1 → 8.4 */}
          <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300 overflow-x-auto max-w-full">
            {series.map((item, idx) => (
              <React.Fragment key={idx}>
                <span className={`px-1.5 py-0.5 rounded ${
                  idx === series.length - 1 
                    ? 'bg-indigo-600 text-white font-black shadow-2xs' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}>
                  {item.score.toFixed(1)}
                </span>
                {idx < series.length - 1 && <span className="text-slate-400">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="w-full flex justify-center overflow-hidden">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full max-w-md h-20 overflow-visible">
            <defs>
              <linearGradient id="chartGradientBlock" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Reference baseline grid lines */}
            <line 
              x1={paddingX} 
              y1={chartHeight - paddingY} 
              x2={chartWidth - paddingX} 
              y2={chartHeight - paddingY} 
              stroke="currentColor" 
              className="text-slate-200 dark:text-slate-800" 
              strokeDasharray="2 2" 
            />
            <line 
              x1={paddingX} 
              y1={paddingY} 
              x2={chartWidth - paddingX} 
              y2={paddingY} 
              stroke="currentColor" 
              className="text-slate-200 dark:text-slate-800" 
              strokeDasharray="2 2" 
            />

            {/* Shaded Area */}
            <path d={areaD} fill="url(#chartGradientBlock)" />

            {/* Progression Line */}
            <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Points */}
            {points.map((pt, idx) => (
              <g key={idx}>
                <circle 
                  cx={pt.x} 
                  cy={pt.y} 
                  r={idx === points.length - 1 ? 4.5 : 3} 
                  className={idx === points.length - 1 ? 'fill-indigo-600 stroke-white dark:stroke-slate-900 stroke-2' : 'fill-white stroke-indigo-600 dark:fill-slate-900 stroke-2'} 
                />
                <text 
                  x={pt.x} 
                  y={pt.y - 7} 
                  textAnchor="middle" 
                  className={`text-[9px] font-mono font-bold ${
                    idx === points.length - 1 ? 'fill-indigo-600 dark:fill-indigo-400 font-extrabold' : 'fill-slate-500 dark:fill-slate-400'
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
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Primary Result & Competency Header Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-5 sm:p-7 shadow-xs relative overflow-hidden">
        {/* Subtle accent glow matching level */}
        <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${competency.gradientBg} rounded-full blur-3xl -z-0 pointer-events-none opacity-60`} />

        <div className="relative z-10">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-900/60">
              <Award className="h-3.5 w-3.5" />
              <span>Đánh giá kết quả & năng lực bài làm</span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {examTitle ? `Đã hoàn thành: ${examTitle}` : 'Kết Quả Bài Làm'}
            </h2>

            {durationText && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Thời gian làm bài: {durationText}
              </p>
            )}
          </div>

          {/* Core Metrics: Điểm số - Mức năng lực - Kết quả - Độ chính xác */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* 1. Điểm số thang 10 */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center flex flex-col justify-center">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Điểm số
              </span>
              <div className="mt-1 flex items-baseline justify-center gap-1">
                <span className={`text-3xl sm:text-4xl font-black ${
                  score >= 8.0 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : score >= 6.5 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : score >= 5.0
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {score.toFixed(1)}
                </span>
                <span className="text-xs font-bold text-slate-400">/ 10</span>
              </div>
            </div>

            {/* 2. Mức năng lực */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center flex flex-col justify-center items-center">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Năng lực
              </span>
              <div className="mt-1.5">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold border ${competency.badgeBg} ${competency.badgeText} ${competency.badgeBorder} shadow-2xs`}>
                  <span className={`h-2 w-2 rounded-full ${competency.dotColor}`} />
                  {competency.label}
                </span>
              </div>
            </div>

            {/* 3. Kết quả câu đúng */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center flex flex-col justify-center">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Kết quả
              </span>
              <div className="mt-1 flex items-baseline justify-center gap-1 text-slate-800 dark:text-slate-200 font-extrabold">
                <span className="text-2xl sm:text-3xl text-emerald-600 dark:text-emerald-400 font-black">
                  {correctCount}
                </span>
                <span className="text-sm text-slate-400">/ {totalQuestions} câu</span>
              </div>
              <p className="text-[10px] text-rose-500 mt-0.5">
                {wrongCount > 0 ? `${wrongCount} câu chưa đúng` : 'Đúng 100%'}
              </p>
            </div>

            {/* 4. Độ chính xác */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center flex flex-col justify-center">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Độ chính xác
              </span>
              <div className="mt-1 flex items-baseline justify-center gap-0.5">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {accuracy}
                </span>
                <span className="text-sm font-bold text-slate-400">%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    accuracy >= 80 ? 'bg-emerald-500' : accuracy >= 60 ? 'bg-indigo-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${accuracy}%` }}
                />
              </div>
            </div>
          </div>

          {/* Nhận xét tự động (Yêu cầu 6: Ngắn gọn, cụ thể, không phán xét tiêu cực) */}
          <div className="mt-4 p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-indigo-600 text-white shrink-0 mt-0.5">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-200 uppercase tracking-wider">
                Nhận xét từ hệ thống:
              </h4>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 mt-0.5 leading-relaxed">
                "{feedback}"
              </p>
            </div>
          </div>

          {/* Lịch sử & Tiến trình học tập (Yêu cầu 3 & 7) */}
          {historySummary && historySummary.hasData && historySummary.totalTests >= 2 && (
            <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  Tiến trình học tập tích lũy
                </span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${historySummary.trendConfig.badgeBg} ${historySummary.trendConfig.textColor} ${historySummary.trendConfig.badgeBorder}`}>
                  <span>{historySummary.trendConfig.symbol}</span>
                  <span>{historySummary.trendConfig.label}</span>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/70">
                  <span className="text-[10px] text-slate-500">Điểm trung bình</span>
                  <p className="text-sm font-black text-slate-800 dark:text-slate-200 mt-0.5">
                    {historySummary.avgScoreDisplay}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/70">
                  <span className="text-[10px] text-slate-500">Điểm cao nhất</span>
                  <p className="text-sm font-black text-amber-600 dark:text-amber-400 mt-0.5">
                    {historySummary.highestScoreDisplay}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/70">
                  <span className="text-[10px] text-slate-500">Tổng số bài đã làm</span>
                  <p className="text-sm font-black text-slate-800 dark:text-slate-200 mt-0.5">
                    {historySummary.totalTests} bài
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/70">
                  <span className="text-[10px] text-slate-500">Năng lực tổng hợp</span>
                  <p className="text-sm font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {historySummary.competency.label}
                  </p>
                </div>
              </div>

              {/* Biểu đồ tiến bộ (Yêu cầu 8: nếu có >= 3 bài) */}
              {renderProgressChart()}
            </div>
          )}

          {/* Phân tích Điểm mạnh & Điểm cần cải thiện (Yêu cầu 5) */}
          {weaknesses && weaknesses.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span>Điểm cần cải thiện từ bài làm này ({weaknesses.length} chuyên đề)</span>
                </div>
                <p className="text-xs text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                  Các chuyên đề dưới đây có câu trả lời chưa đúng. Ôn tập kỹ các dạng này sẽ giúp nâng cao đáng kể mức năng lực:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {weaknesses.map((w, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-amber-900/60 flex items-center justify-between gap-2"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                          {w.topicName}
                        </p>
                        <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">
                          Chưa đúng {w.wrongCount} câu • Độ chính xác: {w.accuracy}%
                        </span>
                      </div>
                      {onReviewTopic && (
                        <button
                          onClick={() => onReviewTopic(w.topicName)}
                          className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200 transition-colors shrink-0 cursor-pointer"
                        >
                          Ôn lại
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
