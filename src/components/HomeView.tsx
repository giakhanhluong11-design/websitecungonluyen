import React, { useState, useMemo } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  BookOpen, 
  Calculator, 
  Languages, 
  Flame, 
  Target, 
  Award,
  FileText,
  GraduationCap,
  Layers,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  History,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { UserProgress, Exam, Topic } from '../types';
import { InteractiveBooks } from './InteractiveBooks';
import { InteractiveGeometry } from './InteractiveGeometry';
import { HomeDashboardWidgets } from './HomeDashboardWidgets';

interface HomeViewProps {
  progress: UserProgress;
  exams: Exam[];
  topics: Topic[];
  onNavigate: (tab: string, subjectFilter?: string, topicId?: string) => void;
  onStartExam: (exam: Exam) => void;
  onPreviewExam: (exam: Exam) => void;
  onSelectTopic: (topic: Topic) => void;
  onToggleBookmark: (examId: string) => void;
  onReviewTopic?: (topicId: string) => void;
  onClearHistory?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  progress,
  exams,
  topics,
  onNavigate,
  onStartExam,
  onPreviewExam,
  onSelectTopic,
  onToggleBookmark,
  onReviewTopic,
  onClearHistory
}) => {
  // Collapsible toggle for deep progress details (history & weak topics) to keep home page ultra-compact
  const [showProgressDetails, setShowProgressDetails] = useState(false);

  // Subject topic counts & percentages
  const mathTopics = topics.filter(t => t.subjectId === 'toan');
  const mathDone = mathTopics.filter(t => progress.completedTopicIds.includes(t.id)).length;
  const mathPercent = Math.round((mathDone / Math.max(mathTopics.length, 1)) * 100);

  const vanTopics = topics.filter(t => t.subjectId === 'van');
  const vanDone = vanTopics.filter(t => progress.completedTopicIds.includes(t.id)).length;
  const vanPercent = Math.round((vanDone / Math.max(vanTopics.length, 1)) * 100);

  const anhTopics = topics.filter(t => t.subjectId === 'anh');
  const anhDone = anhTopics.filter(t => progress.completedTopicIds.includes(t.id)).length;
  const anhPercent = Math.round((anhDone / Math.max(anhTopics.length, 1)) * 100);

  const totalCompletedTopics = progress.completedTopicIds.length;
  const totalTopicsCount = topics.length;
  const overallPercent = Math.round((totalCompletedTopics / Math.max(totalTopicsCount, 1)) * 100);

  // Score metrics & attempts
  const allScores = useMemo(() => [
    ...progress.practiceAttempts.map(p => ({ ...p, type: 'practice' as const })),
    ...progress.examAttempts.map(e => ({ ...e, type: 'exam' as const, title: e.examTitle }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [progress]);

  const totalSessions = allScores.length;
  const avgScore = totalSessions > 0
    ? (allScores.reduce((acc, cur) => acc + cur.score, 0) / totalSessions).toFixed(1)
    : '0.0';
  const maxScore = totalSessions > 0
    ? Math.max(...allScores.map(s => s.score)).toFixed(1)
    : '0.0';
  const studyHours = (progress.studyTimeMinutes / 60).toFixed(1);

  // Consolidated Weak Topics
  const consolidatedWeakTopics = useMemo(() => {
    const map = new Map<string, { topicId: string; topicName: string; wrongCount: number }>();
    progress.practiceAttempts.forEach(p => {
      p.weakTopics.forEach(w => {
        const existing = map.get(w.topicId) || { topicId: w.topicId, topicName: w.topicName, wrongCount: 0 };
        existing.wrongCount += w.wrongCount;
        map.set(w.topicId, existing);
      });
    });
    progress.examAttempts.forEach(e => {
      e.weakTopics.forEach(w => {
        const existing = map.get(w.topicId) || { topicId: w.topicId, topicName: w.topicName, wrongCount: 0 };
        existing.wrongCount += w.wrongCount;
        map.set(w.topicId, existing);
      });
    });
    return Array.from(map.values()).sort((a, b) => b.wrongCount - a.wrongCount);
  }, [progress]);

  return (
    <div className="w-full max-w-[1180px] mx-auto px-3.5 sm:px-6 lg:px-8 py-3 sm:py-5 flex flex-col gap-5 sm:gap-7 pb-16">
      
      {/* ========================================================================= */}
      {/* HOME DASHBOARD WIDGETS (Theo đúng layout thiết kế minh hoạ):             */}
      {/* - Donut Chart tiến độ mục tiêu                                           */}
      {/* - Bar chart tiến độ tuần                                                 */}
      {/* - Bar chart tháng/môn                                                    */}
      {/* - Wave curve chart xu hướng                                              */}
      {/* - Recent activity list                                                   */}
      {/* ========================================================================= */}
      <HomeDashboardWidgets
        progress={progress}
        onNavigate={onNavigate}
        overallPercent={overallPercent}
        totalCompletedTopics={totalCompletedTopics}
        totalTopicsCount={totalTopicsCount}
        allScores={allScores}
      />


      {/* ========================================================================= */}
      {/* BANNER NGANG LỚN - "ÔN LUYỆN TUYỂN SINH" (HỌC KIẾN THỨC) */}
      <section
        id="banner-on-luyen-tuyen-sinh"
        className="order-1 sm:order-2 group relative w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 dark:from-blue-600 dark:via-indigo-600 dark:to-sky-700 p-6 sm:p-10 lg:p-12 text-white shadow-xl border border-blue-300/40 dark:border-blue-400/50 transition-colors"
      >
        {/* Organic Light Blue Curve Accent */}
        <svg 
          className="absolute bottom-0 right-0 w-full h-20 sm:h-28 pointer-events-none z-0" 
          viewBox="0 0 600 100" 
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path 
            d="M0,80 Q180,35 360,70 T600,30 L600,100 L0,100 Z" 
            fill="#93c5fd" 
            fillOpacity="0.18"
          />
        </svg>

        {/* Decorative Background Elements */}
        <div 
          aria-hidden="true" 
          className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl pointer-events-none"
        />
        <div 
          aria-hidden="true" 
          className="absolute right-1/3 -bottom-16 w-64 h-64 rounded-full bg-indigo-300/20 blur-2xl pointer-events-none" 
        />
        
        {/* Decorative Graduation Cap Graphic (Màu vàng đồng bộ - Golden Academic Mortarboard) */}
        <div 
          aria-hidden="true" 
          className="absolute right-4 sm:right-10 lg:right-48 bottom-2 sm:bottom-4 pointer-events-none select-none opacity-30 sm:opacity-50 lg:opacity-90 transition-transform duration-500 group-hover:scale-105 z-5"
        >
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-amber-400/25 blur-xl" />
            
            <svg 
              viewBox="0 0 200 200" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-lg"
            >
              <defs>
                <linearGradient id="goldCapBase" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
                <linearGradient id="goldBoardTop" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
                <linearGradient id="goldBoardShadow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>

              {/* Skull cap base - Màu vàng hổ phách đậm */}
              <path 
                d="M60 96 C60 136, 140 136, 140 96 L140 114 C140 148, 60 148, 60 114 Z" 
                fill="url(#goldCapBase)" 
                stroke="#d97706"
                strokeWidth="1"
              />
              
              {/* Mortarboard Diamond Top - Màu vàng kim óng ánh */}
              <polygon 
                points="100,46 182,82 100,118 18,82" 
                fill="url(#goldBoardTop)" 
                stroke="#fff" 
                strokeWidth="2"
              />
              <polygon 
                points="100,53 172,82 100,111 28,82" 
                fill="url(#goldBoardShadow)" 
                opacity="0.85"
              />
              
              {/* Center Golden Button */}
              <ellipse cx="100" cy="82" rx="6" ry="4.5" fill="#fef08a" stroke="#d97706" strokeWidth="1.2" />
              
              {/* Golden Tassel String - Cùng màu vàng kim */}
              <path 
                d="M100 82 Q 132 84 150 106 T 156 136" 
                stroke="#fef08a" 
                strokeWidth="3" 
                strokeLinecap="round" 
                fill="none"
              />
              <rect x="151.5" y="133" width="9" height="5" rx="2" fill="#d97706" />
              
              {/* Golden Tassel Brush - Tua nón màu vàng */}
              <path 
                d="M150.5 138 L148 166 C148 170, 164 170, 164 166 L161.5 138 Z" 
                fill="#fbbf24" 
                stroke="#f59e0b" 
                strokeWidth="1" 
              />
            </svg>
          </div>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
          {/* Left / Top Content */}
          <div className="max-w-2xl space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold text-white border border-white/30 backdrop-blur-xs">
              <Layers className="h-3.5 w-3.5 text-blue-200" />
              <span>Hệ thống kiến thức & Chuyên đề trọng tâm 3 môn</span>
            </div>

            {/* Title */}
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight drop-shadow-xs">
                Ôn Luyện Tuyển Sinh
              </h2>
              <span className="text-xs sm:text-sm font-medium text-blue-100 block">
                Bứt phá điểm số vào lớp 10 công lập
              </span>
            </div>

            <p className="text-sm sm:text-base text-blue-50/95 leading-relaxed max-w-xl font-normal">
              Hệ thống toàn bộ kiến thức cốt lõi, công thức Toán, kỹ năng làm văn nghị luận và ngữ pháp tiếng Anh bám sát chương trình thi vào 10 mới nhất.
            </p>

            {/* Quick badges */}
            <div className="pt-1 flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs font-medium text-white">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 border border-white/25">
                <BookOpen className="h-3.5 w-3.5 text-blue-200" />
                <span>Tổng hợp lý thuyết 3 môn Toán - Văn - Anh</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 border border-white/25">
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-200" />
                <span>Phương pháp giải & Ví dụ minh họa</span>
              </span>
            </div>
          </div>

          {/* Right / CTA Action Area */}
          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3">
            <button
              id="cta-hoc-ngay-btn"
              onClick={() => onNavigate('knowledge')}
              className="group/btn relative inline-flex items-center justify-center gap-2.5 rounded-full bg-white hover:bg-blue-50 active:scale-[0.98] text-blue-800 font-black px-7 py-3 sm:px-8 sm:py-3.5 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <span>Học Ngay</span>
              <ArrowRight className="h-4 w-4 text-blue-800 group-hover/btn:translate-x-1 transition-transform" />
            </button>
            <span className="text-xs text-blue-100 font-medium pl-1 sm:pl-0">
              Khám phá toàn bộ bài học lý thuyết
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2 CARD: "LUYỆN TẬP CHUYÊN ĐỀ" (XANH LÁ) & "KHO ĐỀ THI" (CAM NĂNG ĐỘNG)    */}
      {/* - Desktop: order-3                                                        */}
      {/* - Mobile: order-2 (nằm giữa banner và bảng tiến trình)                   */}
      {/* - Tô đầy đủ màu: Xanh lá (vàng accent) và Cam rực rỡ, nút pill trắng      */}
      {/* ========================================================================= */}
      <div className="order-2 sm:order-3 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-stretch">
        
        {/* CARD 1: "LUYỆN TẬP THEO CHUYÊN ĐỀ" */}
        <section
          id="card-luyen-tap-theo-mon"
          className="group relative w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-600 dark:from-emerald-600 dark:via-emerald-500 dark:to-teal-600 p-5 sm:p-7 lg:p-8 text-white shadow-lg border border-emerald-300/40 dark:border-emerald-400/50 transition-all flex flex-col justify-between"
        >
          {/* Bottom Golden Yellow Wave Accent */}
          <svg 
            className="absolute bottom-0 right-0 w-full h-24 sm:h-28 pointer-events-none z-0" 
            viewBox="0 0 400 120" 
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path 
              d="M0,90 Q120,45 240,75 T400,28 L400,120 L0,120 Z" 
              fill="#facc15" 
              fillOpacity="0.95"
            />
          </svg>

          {/* Card Content */}
          <div className="relative z-10 flex flex-col justify-between h-full space-y-3 sm:space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-xs px-3 py-1 text-xs font-bold text-white border border-white/30 mb-2 sm:mb-3">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                <span>Luyện tập theo chuyên đề</span>
              </div>
              
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white leading-snug sm:leading-tight drop-shadow-xs">
                Luyện tập theo kỹ năng
              </h2>
              
              <p className="text-xs sm:text-sm text-emerald-100/95 mt-1 sm:mt-1.5 leading-relaxed font-normal line-clamp-2">
                Rèn luyện chuẩn cấu trúc đề thi Tuyển sinh 10 ba môn Toán, Ngữ văn, Tiếng Anh với bài tập chọn lọc bám sát TP.HCM.
              </p>

              {/* Progress bar pill */}
              <div className="pt-2 sm:pt-3">
                <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-100 mb-1.5">
                  <span>Tiến độ luyện tập</span>
                  <span className="font-bold text-white">{mathDone + vanDone + anhDone}/{topics.length} chuyên đề</span>
                </div>
                <div className="w-full max-w-[280px] h-3 rounded-full bg-black/20 dark:bg-black/25 p-0.5 overflow-hidden backdrop-blur-xs">
                  <div 
                    className="h-full rounded-full bg-white transition-all duration-500 shadow-xs" 
                    style={{ width: `${overallPercent}%` }}
                  />
                </div>
              </div>

              {/* Các cuốn sách tương tác sinh động */}
              <div className="pt-2 sm:pt-3">
                <InteractiveBooks 
                  onSelectSubject={(subj) => onNavigate('practice', subj)} 
                  mathCount={mathDone} 
                  vanCount={vanDone} 
                  anhCount={anhDone} 
                />
              </div>

              {/* Quick Subject Pills on tablet/desktop */}
              <div className="pt-2 sm:pt-3 hidden sm:flex flex-wrap gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onNavigate('practice', 'toan'); }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xs px-3 py-1 text-xs font-bold text-white border border-white/30 transition-colors cursor-pointer"
                >
                  <Calculator className="h-3 w-3 text-amber-300" />
                  <span>Toán ({mathDone})</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onNavigate('practice', 'van'); }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xs px-3 py-1 text-xs font-bold text-white border border-white/30 transition-colors cursor-pointer"
                >
                  <BookOpen className="h-3 w-3 text-amber-300" />
                  <span>Văn ({vanDone})</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onNavigate('practice', 'anh'); }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xs px-3 py-1 text-xs font-bold text-white border border-white/30 transition-colors cursor-pointer"
                >
                  <Languages className="h-3 w-3 text-amber-300" />
                  <span>Anh ({anhDone})</span>
                </button>
              </div>
            </div>

            {/* Nút bấm dạng viên thuốc */}
            <div className="pt-3 sm:pt-4">
              <button
                id="cta-luyen-tap-theo-mon-btn"
                onClick={() => onNavigate('practice')}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-emerald-50 active:scale-[0.98] text-emerald-800 font-black px-6 py-3 sm:py-3.5 text-sm sm:text-base shadow-md hover:shadow-lg transition-all cursor-pointer group/btn"
              >
                <span>Luyện tập ngay</span>
                <ArrowRight className="h-4 w-4 text-emerald-800 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        {/* CARD 2: "KHO ĐỀ THI TUYỂN SINH" */}
        <section
          id="card-thu-vien-de-thi"
          className="group relative w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 dark:from-orange-500 dark:via-amber-500 dark:to-orange-600 p-5 sm:p-7 lg:p-8 text-white shadow-lg border border-orange-300/40 dark:border-orange-400/50 transition-all flex flex-col justify-between"
        >
          {/* Bottom Warm Peach Wave Accent */}
          <svg 
            className="absolute bottom-0 right-0 w-full h-24 sm:h-28 pointer-events-none z-0" 
            viewBox="0 0 400 120" 
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path 
              d="M0,85 Q130,110 250,65 T400,32 L400,120 L0,120 Z" 
              fill="#fed7aa" 
              fillOpacity="0.88"
            />
          </svg>

          {/* Card Content */}
          <div className="relative z-10 flex flex-col justify-between h-full space-y-3 sm:space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-xs px-3 py-1 text-xs font-bold text-white border border-white/30 mb-2 sm:mb-3">
                <FileText className="h-3.5 w-3.5 text-amber-200" />
                <span>Kho đề tuyển sinh</span>
              </div>
              
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white leading-snug sm:leading-tight drop-shadow-xs">
                Kho đề thi Tuyển sinh
              </h2>
              
              <p className="text-xs sm:text-sm text-orange-100/95 mt-1 sm:mt-1.5 leading-relaxed font-normal line-clamp-2">
                Tuyển tập trọn bộ {exams.length} đề thi chính thức Sở GD&ĐT TP.HCM và các trường trọng điểm, thi thử trực tuyến có bấm giờ.
              </p>

              {/* Progress bar pill */}
              <div className="pt-2 sm:pt-3">
                <div className="flex items-center justify-between text-[11px] font-semibold text-orange-100 mb-1.5">
                  <span>Tiến độ làm đề</span>
                  <span className="font-bold text-white">{exams.filter(e => e.userCompleted).length}/{exams.length} đề hoàn thành</span>
                </div>
                <div className="w-full max-w-[280px] h-3 rounded-full bg-black/20 dark:bg-black/25 p-0.5 overflow-hidden backdrop-blur-xs">
                  <div 
                    className="h-full rounded-full bg-white transition-all duration-500 shadow-xs" 
                    style={{ width: `${Math.round((exams.filter(e => e.userCompleted).length / Math.max(1, exams.length)) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Các hình học năng động tương tác */}
              <div className="pt-2 sm:pt-3">
                <InteractiveGeometry />
              </div>

              {/* Feature Badges on tablet/desktop */}
              <div className="pt-2 sm:pt-3 hidden sm:flex flex-wrap gap-1.5 sm:gap-2 text-xs font-bold text-white">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-xs px-3 py-1 border border-white/30">
                  <Clock className="h-3 w-3 text-amber-200" />
                  <span>Bấm giờ thi thật</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-xs px-3 py-1 border border-white/30">
                  <Award className="h-3 w-3 text-amber-200" />
                  <span>Thang điểm chuẩn</span>
                </span>
              </div>
            </div>

            {/* Nút bấm dạng viên thuốc */}
            <div className="pt-3 sm:pt-4">
              <button
                id="cta-thu-vien-de-thi-btn"
                onClick={() => onNavigate('exams')}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-orange-50 active:scale-[0.98] text-orange-700 font-black px-6 py-3 sm:py-3.5 text-sm sm:text-base shadow-md hover:shadow-lg transition-all cursor-pointer group/btn"
              >
                <span>Xem ngay</span>
                <ArrowRight className="h-4 w-4 text-orange-700 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
