/**
 * Cấu hình ngưỡng điểm và phân loại năng lực học sinh
 * Thang điểm 10 quy đổi, làm tròn 1 chữ số thập phân
 */

export type CompetencyLevelKey = 
  | 'xuat_sac'
  | 'gioi'
  | 'kha_gioi'
  | 'kha'
  | 'kha_yeu'
  | 'trung_binh'
  | 'yeu'
  | 'can_cai_thien';

export interface CompetencyThreshold {
  key: CompetencyLevelKey;
  label: string;
  minScore: number;
  maxScore: number;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
  gradientBg: string;
  summaryTitle: string;
  defaultFeedback: string;
}

/**
 * Bảng cấu hình các mức năng lực theo đúng yêu cầu đề bài:
 * 9.0–10.0: Xuất sắc
 * 8.0–8.9:  Giỏi
 * 7.5–7.9:  Khá–Giỏi
 * 6.5–7.4:  Khá
 * 6.0–6.4:  Khá–Yếu
 * 5.0–5.9:  Trung bình
 * 3.5–4.9:  Yếu
 * 0.0–3.4:  Cần cải thiện
 */
export const COMPETENCY_THRESHOLDS: CompetencyThreshold[] = [
  {
    key: 'xuat_sac',
    label: 'Xuất sắc',
    minScore: 9.0,
    maxScore: 10.0,
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    badgeBorder: 'border-emerald-200 dark:border-emerald-800',
    dotColor: 'bg-emerald-500',
    gradientBg: 'from-emerald-500/10 to-teal-500/10',
    summaryTitle: 'Năng lực xuất sắc',
    defaultFeedback: 'Kết quả rất xuất sắc! Bạn đã làm chủ kiến thức và xử lý chuẩn xác các câu hỏi khó. Tiếp tục duy trì phong độ này!'
  },
  {
    key: 'gioi',
    label: 'Giỏi',
    minScore: 8.0,
    maxScore: 8.9,
    badgeBg: 'bg-blue-50 dark:bg-blue-950/60',
    badgeText: 'text-blue-700 dark:text-blue-300',
    badgeBorder: 'border-blue-200 dark:border-blue-800',
    dotColor: 'bg-blue-500',
    gradientBg: 'from-blue-500/10 to-indigo-500/10',
    summaryTitle: 'Năng lực giỏi',
    defaultFeedback: 'Bài làm rất tốt, tư duy nhanh và chắc chắn. Chỉ cần rà soát kỹ một vài lỗi nhỏ ở các câu nâng cao là đạt điểm tuyệt đối.'
  },
  {
    key: 'kha_gioi',
    label: 'Khá–Giỏi',
    minScore: 7.5,
    maxScore: 7.9,
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/60',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    badgeBorder: 'border-indigo-200 dark:border-indigo-800',
    dotColor: 'bg-indigo-500',
    gradientBg: 'from-indigo-500/10 to-sky-500/10',
    summaryTitle: 'Năng lực khá–giỏi',
    defaultFeedback: 'Bạn đã nắm khá chắc phần kiến thức chính. Một số câu nâng cao vẫn còn sai, nên tiếp tục luyện thêm các dạng này.'
  },
  {
    key: 'kha',
    label: 'Khá',
    minScore: 6.5,
    maxScore: 7.4,
    badgeBg: 'bg-cyan-50 dark:bg-cyan-950/60',
    badgeText: 'text-cyan-700 dark:text-cyan-300',
    badgeBorder: 'border-cyan-200 dark:border-cyan-800',
    dotColor: 'bg-cyan-500',
    gradientBg: 'from-cyan-500/10 to-teal-500/10',
    summaryTitle: 'Năng lực khá',
    defaultFeedback: 'Nền tảng kiến thức tương đối vững vàng. Hãy tập trung luyện thêm các bài toán thực tế và câu phân loại để bứt phá lên mức Giỏi.'
  },
  {
    key: 'kha_yeu',
    label: 'Khá–Yếu',
    minScore: 6.0,
    maxScore: 6.4,
    badgeBg: 'bg-amber-50 dark:bg-amber-950/60',
    badgeText: 'text-amber-700 dark:text-amber-300',
    badgeBorder: 'border-amber-200 dark:border-amber-800',
    dotColor: 'bg-amber-500',
    gradientBg: 'from-amber-500/10 to-yellow-500/10',
    summaryTitle: 'Năng lực khá–yếu',
    defaultFeedback: 'Bạn đã nắm được phần kiến thức cơ bản nhưng độ chính xác chưa ổn định. Hãy ôn lại các câu sai trước khi chuyển sang dạng khó hơn.'
  },
  {
    key: 'trung_binh',
    label: 'Trung bình',
    minScore: 5.0,
    maxScore: 5.9,
    badgeBg: 'bg-orange-50 dark:bg-orange-950/60',
    badgeText: 'text-orange-700 dark:text-orange-300',
    badgeBorder: 'border-orange-200 dark:border-orange-800',
    dotColor: 'bg-orange-500',
    gradientBg: 'from-orange-500/10 to-amber-500/10',
    summaryTitle: 'Năng lực trung bình',
    defaultFeedback: 'Bạn đã đạt mức an toàn ở các câu cơ bản. Hãy dành thêm thời gian ôn lại lý thuyết trọng tâm và làm bài cẩn thận hơn để tránh mất điểm đáng tiếc.'
  },
  {
    key: 'yeu',
    label: 'Yếu',
    minScore: 3.5,
    maxScore: 4.9,
    badgeBg: 'bg-rose-50 dark:bg-rose-950/60',
    badgeText: 'text-rose-700 dark:text-rose-300',
    badgeBorder: 'border-rose-200 dark:border-rose-800',
    dotColor: 'bg-rose-500',
    gradientBg: 'from-rose-500/10 to-orange-500/10',
    summaryTitle: 'Năng lực yếu',
    defaultFeedback: 'Cần củng cố lại lý thuyết và công thức cốt lõi. Hãy bắt đầu ôn lại từng chuyên đề căn bản và luyện các bài tập ở mức độ dễ trước.'
  },
  {
    key: 'can_cai_thien',
    label: 'Cần cải thiện',
    minScore: 0.0,
    maxScore: 3.4,
    badgeBg: 'bg-red-50 dark:bg-red-950/60',
    badgeText: 'text-red-700 dark:text-red-300',
    badgeBorder: 'border-red-200 dark:border-red-800',
    dotColor: 'bg-red-500',
    gradientBg: 'from-red-500/10 to-rose-500/10',
    summaryTitle: 'Cần nỗ lực cải thiện',
    defaultFeedback: 'Hãy bình tĩnh xem lại các câu chưa đúng và ôn tập lại kiến thức trọng tâm. Luyện tập đều đặn mỗi ngày sẽ giúp bạn tiến bộ rõ rệt!'
  }
];

export type ProgressTrend = 'tien_bo' | 'on_dinh' | 'can_chu_y';

export interface TrendConfig {
  type: ProgressTrend;
  label: string;
  symbol: string;
  textColor: string;
  badgeBg: string;
  badgeBorder: string;
}

export const TREND_CONFIGS: Record<ProgressTrend, TrendConfig> = {
  tien_bo: {
    type: 'tien_bo',
    label: 'Đang tiến bộ',
    symbol: '↑',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/50',
    badgeBorder: 'border-emerald-200 dark:border-emerald-800'
  },
  on_dinh: {
    type: 'on_dinh',
    label: 'Ổn định',
    symbol: '→',
    textColor: 'text-blue-600 dark:text-blue-400',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/50',
    badgeBorder: 'border-blue-200 dark:border-blue-800'
  },
  can_chu_y: {
    type: 'can_chu_y',
    label: 'Cần chú ý',
    symbol: '↓',
    textColor: 'text-amber-600 dark:text-amber-400',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/50',
    badgeBorder: 'border-amber-200 dark:border-amber-800'
  }
};
