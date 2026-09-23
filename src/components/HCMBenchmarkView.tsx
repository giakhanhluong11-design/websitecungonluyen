import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  BarChart3,
  LineChart as LineChartIcon,
  Layers,
  HelpCircle,
  X,
  Target,
  Check,
  ChevronRight,
  ChevronDown,
  ArrowUpDown,
  School,
  MapPin,
  Users,
  Award,
  BookOpen,
  Info,
  CheckCircle2,
  ExternalLink,
  Lightbulb,
  Trophy,
  Filter,
  Eye,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  HCMSchool,
  HCMCluster,
  HCM_CLUSTERS,
  HCM_DISTRICTS,
  HCM_SCHOOLS_DATA,
  SCORE_RANGES,
  YEARS,
  HCMYear,
  getScoreDiff,
  CHART_COLORS,
} from '../data/hcmBenchmarkData';

interface HCMBenchmarkViewProps {
  targetSchool?: string;
  targetScore?: number;
  onUpdateTargetSchool?: (schoolName: string, score: number) => void;
}

type SortField = 'benchmark_desc' | 'benchmark_asc' | 'gap_desc' | 'gap_asc' | 'name';

export const HCMBenchmarkView: React.FC<HCMBenchmarkViewProps> = ({
  targetSchool,
  targetScore,
  onUpdateTargetSchool,
}) => {
  // ── FORM & LOOKUP STATE (Match layout in reference image) ─────────────────
  const [selectedCity, setSelectedCity] = useState<string>('TP. Hồ Chí Minh');
  const [selectedGrade, setSelectedGrade] = useState<string>('10');
  const [selectedYear, setSelectedYear] = useState<HCMYear>('2024');
  const [userScoreInput, setUserScoreInput] = useState<string>(
    targetScore ? String(targetScore) : '24.5'
  );
  const [isSearched, setIsSearched] = useState<boolean>(true);

  // ── FILTER & SORT STATE ──────────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Tất cả quận/huyện');
  const [selectedCluster, setSelectedCluster] = useState<HCMCluster>('all');
  const [selectedScoreRange, setSelectedScoreRange] = useState<string>('all');
  const [sortOption, setSortOption] = useState<SortField>('benchmark_desc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'lookup' | 'history'>('lookup');

  // ── SELECTION & MODALS ────────────────────────────────────────────────────
  const [selectedSchoolForModal, setSelectedSchoolForModal] = useState<HCMSchool | null>(null);
  const [compareSchoolIds, setCompareSchoolIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);

  // ── PARSED SCORE ──────────────────────────────────────────────────────────
  const parsedUserScore = useMemo(() => {
    const val = parseFloat(userScoreInput);
    return isNaN(val) ? null : val;
  }, [userScoreInput]);

  // Phân loại cơ hội trúng tuyển
  const getScoreSuitability = (school: HCMSchool, score: number, year: HCMYear) => {
    const benchmark = school.scores[year];
    const gap = score - benchmark; // gap > 0: điểm bạn cao hơn điểm chuẩn

    if (gap >= 1.0) {
      return {
        level: 'safe',
        label: 'Vùng an toàn',
        badge: '🟢 An toàn',
        gapText: `+${gap.toFixed(2)}`,
        gapClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
        desc: 'Điểm của bạn cao hơn điểm chuẩn từ 1.0 trở lên. Cơ hội trúng tuyển rất cao.',
      };
    } else if (gap >= 0) {
      return {
        level: 'match',
        label: 'Vừa sức',
        badge: '🎯 Vừa sức',
        gapText: gap === 0 ? '0.00' : `+${gap.toFixed(2)}`,
        gapClass: 'bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300',
        desc: 'Điểm của bạn bằng hoặc cao hơn điểm chuẩn một chút. Rất phù hợp đăng ký NV1/NV2.',
      };
    } else if (gap >= -1.0) {
      return {
        level: 'close',
        label: 'Sát điểm chuẩn',
        badge: '⚡ Cạnh tranh',
        gapText: gap.toFixed(2),
        gapClass: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
        desc: `Chỉ thiếu ${(Math.abs(gap)).toFixed(2)} điểm. Cần nỗ lực thêm để chắc chắn đỗ.`,
      };
    } else {
      return {
        level: 'reach',
        label: 'Thử thách',
        badge: '🔥 Cần bứt phá',
        gapText: gap.toFixed(2),
        gapClass: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
        desc: `Điểm chuẩn cao hơn điểm của bạn ${(Math.abs(gap)).toFixed(2)} điểm.`,
      };
    }
  };

  // ── FILTERED & SORTED SCHOOLS ─────────────────────────────────────────────
  const filteredSchools = useMemo(() => {
    return HCM_SCHOOLS_DATA.filter((school) => {
      // 1. Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchName = school.name.toLowerCase().includes(term);
        const matchShort = school.shortName.toLowerCase().includes(term);
        const matchDistrict = school.district.toLowerCase().includes(term);
        if (!matchName && !matchShort && !matchDistrict) return false;
      }

      // 2. District
      if (selectedDistrict !== 'Tất cả quận/huyện' && school.district !== selectedDistrict) {
        return false;
      }

      // 3. Cluster
      if (selectedCluster !== 'all' && school.cluster !== selectedCluster) {
        return false;
      }

      // 4. Score range
      if (selectedScoreRange !== 'all') {
        const range = SCORE_RANGES.find((r) => r.id === selectedScoreRange);
        if (range) {
          const score = school.scores[selectedYear];
          if (score < range.min || score > range.max) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      const scoreA = a.scores[selectedYear];
      const scoreB = b.scores[selectedYear];
      const userScore = parsedUserScore ?? 0;
      const gapA = userScore - scoreA;
      const gapB = userScore - scoreB;

      switch (sortOption) {
        case 'benchmark_desc':
          return scoreB - scoreA;
        case 'benchmark_asc':
          return scoreA - scoreB;
        case 'gap_desc':
          return gapB - gapA;
        case 'gap_asc':
          return gapA - gapB;
        case 'name':
          return a.name.localeCompare(b.name, 'vi');
        default:
          return scoreB - scoreA;
      }
    });
  }, [
    searchTerm,
    selectedDistrict,
    selectedCluster,
    selectedScoreRange,
    selectedYear,
    sortOption,
    parsedUserScore,
  ]);

  // Số lượng trường học sinh có thể xét tuyển an toàn / vừa sức (gap >= -0.5)
  const eligibleSchoolsCount = useMemo(() => {
    if (parsedUserScore === null) return 0;
    return HCM_SCHOOLS_DATA.filter(
      (s) => parsedUserScore - s.scores[selectedYear] >= -0.5
    ).length;
  }, [parsedUserScore, selectedYear]);

  // ── DATA CHO BIỂU ĐỒ SO SÁNH (TOP 8 TRƯỜNG NHƯ TRONG ẢNH) ─────────────────
  const chartSchools = useMemo(() => {
    return filteredSchools.slice(0, 8);
  }, [filteredSchools]);

  const comparisonChartData = useMemo(() => {
    return chartSchools.map((s) => ({
      name: s.shortName,
      fullName: s.name,
      benchmarkScore: s.scores[selectedYear],
      userScore: parsedUserScore ?? 0,
    }));
  }, [chartSchools, selectedYear, parsedUserScore]);

  // ── SO SÁNH NHIỀU TRƯỜNG ──────────────────────────────────────────────────
  const toggleCompareSchool = (id: string) => {
    if (compareSchoolIds.includes(id)) {
      setCompareSchoolIds(compareSchoolIds.filter((item) => item !== id));
    } else {
      if (compareSchoolIds.length >= 4) {
        alert('Bạn chỉ có thể chọn tối đa 4 trường để so sánh cùng lúc.');
        return;
      }
      setCompareSchoolIds([...compareSchoolIds, id]);
    }
  };

  const comparedSchools = useMemo(() => {
    return HCM_SCHOOLS_DATA.filter((s) => compareSchoolIds.includes(s.id));
  }, [compareSchoolIds]);

  const compareLineData = useMemo(() => {
    return YEARS.map((year) => {
      const point: Record<string, any> = { year: `Năm ${year}` };
      comparedSchools.forEach((school) => {
        point[school.id] = school.scores[year];
      });
      return point;
    });
  }, [comparedSchools]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-300">
      {/* ── TOP NAV / TAB SELECTION ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <School className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Tra Cứu & So Sánh Điểm Chuẩn Tuyển Sinh Lớp 10
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Nhập điểm dự kiến để tìm trường phù hợp, đối chiếu khoảng cách điểm và xu hướng xét tuyển THPT.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('lookup')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'lookup'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Tra cứu & So sánh điểm
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LineChartIcon className="w-3.5 h-3.5" />
            Lịch sử 4 năm & Biến động
          </button>
        </div>
      </div>

      {/* ── FLOATING BAR: MULTI-SCHOOL COMPARISON ───────────────────────────── */}
      {compareSchoolIds.length > 0 && (
        <div className="sticky top-20 z-30 bg-blue-900 text-white p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-sm">
              {compareSchoolIds.length}/4
            </div>
            <div className="text-sm font-medium">
              Đang chọn <strong>{compareSchoolIds.length} trường</strong> để so sánh điểm chuẩn
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCompareSchoolIds([])}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold cursor-pointer transition-all"
            >
              Bỏ chọn tất cả
            </button>
            <button
              onClick={() => setShowCompareModal(true)}
              className="px-4 py-1.5 rounded-xl bg-white text-blue-900 hover:bg-blue-50 text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Xem biểu đồ so sánh chi tiết
            </button>
          </div>
        </div>
      )}

      {/* ── MAIN LAYOUT: LEFT SIDEBAR + RIGHT CONTENT ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── LEFT PANEL: "NHẬP THÔNG TIN CỦA BẠN" (MATCHES REFERENCE IMAGE) ── */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-5">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Nhập thông tin của bạn
            </h2>

            {/* Tỉnh / Thành phố */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Tỉnh/Thành phố
              </label>
              <div className="relative">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 pr-8 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Hà Nội">Hà Nội (Tham khảo)</option>
                  <option value="Đà Nẵng">Đà Nẵng (Tham khảo)</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Khối xét tuyển */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Khối xét tuyển
              </label>
              <div className="relative">
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 pr-8 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Năm điểm chuẩn tham chiếu */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Năm điểm chuẩn
              </label>
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value as HCMYear)}
                  className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 pr-8 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="2025">2025 (Mới nhất)</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Tổng điểm (không nhân hệ số) */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Tổng điểm (không nhân hệ số)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  max="30"
                  value={userScoreInput}
                  onChange={(e) => setUserScoreInput(e.target.value)}
                  placeholder="24.5"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                />
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                (VD: 24.5, 27.0, ...)
              </p>
            </div>

            {/* Nút Tra cứu & So sánh */}
            <button
              onClick={() => setIsSearched(true)}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <Search className="w-4 h-4" />
              Tra cứu & So sánh
            </button>

            {/* Toggle bộ lọc phụ */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 pt-1 cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-1.5 font-medium">
                <Filter className="w-3.5 h-3.5" />
                Bộ lọc nâng cao (Quận / Cụm)
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Bộ lọc mở rộng nếu người dùng muốn lọc thêm theo quận hoặc cụm */}
            {showAdvancedFilters && (
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-500">Quận / Huyện</label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    {HCM_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-500">Tìm kiếm tên trường</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Gia Định, Lê Hồng Phong..."
                      className="w-full text-xs pl-7 pr-7 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Gợi ý nhanh (Tags: Khối 10, Khối 11, Khối 12) */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Gợi ý nhanh
              </span>
              <div className="flex flex-wrap gap-2">
                {['Khối 10', 'Khối 11', 'Khối 12'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      const grade = tag.replace('Khối ', '');
                      setSelectedGrade(grade);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                      selectedGrade === tag.replace('Khối ', '')
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Mức điểm nhanh */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['20.0', '22.5', '24.5', '26.5'].map((scorePreset) => (
                  <button
                    key={scorePreset}
                    onClick={() => setUserScoreInput(scorePreset)}
                    className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 cursor-pointer"
                  >
                    {scorePreset}đ
                  </button>
                ))}
              </div>
            </div>

            {/* Info disclaimer */}
            <div className="pt-3 flex items-start gap-2.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px]">
                Điểm chuẩn có thể thay đổi mỗi năm. Kết quả dưới đây chỉ mang tính chất tham khảo.
              </p>
            </div>
          </div>
        </div>

        {/* ── RIGHT MAIN CONTENT ────────────────────────────────────────────── */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* ── TOP NOTIFICATION / BANNER (MATCHES REFERENCE IMAGE) ──────────── */}
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-3xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm sm:text-base font-bold text-emerald-900 dark:text-emerald-200">
                {parsedUserScore !== null ? (
                  <>
                    Với tổng điểm <span className="underline font-extrabold">{parsedUserScore}</span> (khối {selectedGrade}) tại {selectedCity}, bạn có thể xét tuyển vào <span className="font-extrabold">{eligibleSchoolsCount} trường</span> THPT.
                  </>
                ) : (
                  <>
                    Tra cứu và so sánh điểm chuẩn tại {selectedCity} (Khối {selectedGrade}).
                  </>
                )}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-300/90 leading-relaxed">
                Dưới đây là bảng so sánh điểm chuẩn của một số trường năm {selectedYear} và khoảng cách điểm của bạn so với điểm chuẩn.
              </p>
            </div>
          </div>

          {activeTab === 'lookup' ? (
            /* ── VIEW 1: GIAO DIỆN TRA CỨU & SO SÁNH (MATCHES REFERENCE IMAGE) ── */
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              {/* ── BẢNG DANH SÁCH TRƯỜNG PHÙ HỢP ──────────────────────────── */}
              <div className="xl:col-span-7 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
                {/* Table Header Controls */}
                <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Danh sách trường phù hợp
                  </h3>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 whitespace-nowrap">
                      Sắp xếp theo:
                    </span>
                    <div className="relative">
                      <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value as SortField)}
                        className="appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 pr-7 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="benchmark_desc">Điểm chuẩn (giảm dần)</option>
                        <option value="benchmark_asc">Điểm chuẩn (tăng dần)</option>
                        <option value="gap_desc">Khoảng cách (từ an toàn đến thử thách)</option>
                        <option value="gap_asc">Khoảng cách (từ thử thách đến an toàn)</option>
                        <option value="name">Tên trường (A - Z)</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/80 dark:bg-slate-800/80 text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                      <tr>
                        <th className="py-3 px-3 text-center w-10">STT</th>
                        <th className="py-3 px-3">Trường THPT</th>
                        <th className="py-3 px-3 text-center whitespace-nowrap">
                          Điểm chuẩn {selectedYear}
                        </th>
                        <th className="py-3 px-3 text-center whitespace-nowrap">
                          Tổng điểm của bạn
                        </th>
                        <th className="py-3 px-3 text-center whitespace-nowrap">
                          Khoảng cách
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
                      {filteredSchools.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-400">
                            Không tìm thấy trường nào phù hợp với điều kiện tìm kiếm.
                          </td>
                        </tr>
                      ) : (
                        filteredSchools.map((school, index) => {
                          const benchmark = school.scores[selectedYear];
                          const userScore = parsedUserScore ?? 0;
                          const gap = userScore - benchmark;
                          const isTarget = targetSchool === school.name;
                          const isCompared = compareSchoolIds.includes(school.id);

                          return (
                            <tr
                              key={school.id}
                              onClick={() => setSelectedSchoolForModal(school)}
                              className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors cursor-pointer ${
                                isCompared ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                              }`}
                            >
                              {/* STT */}
                              <td className="py-3 px-3 text-center text-slate-400 font-mono text-xs">
                                {index + 1}
                              </td>

                              {/* Tên trường THPT */}
                              <td className="py-3 px-3">
                                <div className="font-medium text-slate-900 dark:text-slate-100 flex items-center gap-1.5 flex-wrap">
                                  {school.name}
                                  {isTarget && (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-[10px] font-bold border border-amber-300">
                                      <Target className="w-2.5 h-2.5" /> NV1
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                                  {school.district} • {school.clusterLabel}
                                </div>
                              </td>

                              {/* Điểm chuẩn năm chọn */}
                              <td className="py-3 px-3 text-center font-mono font-semibold text-slate-800 dark:text-slate-200">
                                {benchmark.toFixed(2)}
                              </td>

                              {/* Tổng điểm của bạn */}
                              <td className="py-3 px-3 text-center font-mono text-slate-600 dark:text-slate-400">
                                {parsedUserScore !== null ? parsedUserScore.toFixed(2) : '-'}
                              </td>

                              {/* Khoảng cách (Pill đỏ / xám / xanh như trong ảnh) */}
                              <td className="py-3 px-3 text-center">
                                {parsedUserScore !== null ? (
                                  <span
                                    className={`inline-block min-w-[54px] px-2 py-0.5 rounded-md font-mono text-xs font-semibold ${
                                      gap < 0
                                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300'
                                        : gap === 0
                                        ? 'bg-teal-100 text-teal-700 dark:bg-teal-950/70 dark:text-teal-300'
                                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                                    }`}
                                  >
                                    {gap > 0 ? `+${gap.toFixed(2)}` : gap === 0 ? '0.00' : gap.toFixed(2)}
                                  </span>
                                ) : (
                                  <span className="text-slate-400 text-xs">-</span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 text-xs text-slate-400 text-center border-t border-slate-100 dark:border-slate-800">
                  Nhấp vào từng trường để xem chi tiết lịch sử 4 năm & đặt làm trường mục tiêu NV1
                </div>
              </div>

              {/* ── BIỂU ĐỒ SO SÁNH & HỘP LƯU Ý (MATCHES REFERENCE IMAGE) ───── */}
              <div className="xl:col-span-5 space-y-6">
                {/* Card Biểu đồ cột so sánh */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      So sánh điểm của bạn với điểm chuẩn
                    </h3>
                    <div className="flex items-center gap-4 text-xs mt-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                        <span className="text-slate-600 dark:text-slate-300">
                          Điểm chuẩn {selectedYear}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
                        <span className="text-slate-600 dark:text-slate-300">
                          Điểm của bạn
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recharts Grouped Bar Chart */}
                  <div className="w-full h-72 pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={comparisonChartData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 45 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                        <XAxis
                          dataKey="name"
                          stroke="#94a3b8"
                          fontSize={11}
                          interval={0}
                          angle={-40}
                          textAnchor="end"
                          tickLine={false}
                        />
                        <YAxis
                          domain={[0, 30]}
                          ticks={[0, 10, 20, 30]}
                          stroke="#94a3b8"
                          fontSize={11}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.95)',
                            borderColor: '#334155',
                            borderRadius: '0.75rem',
                            color: '#f8fafc',
                            fontSize: '12px',
                          }}
                          formatter={(value: any, name: any) => [
                            `${value} điểm`,
                            name === 'benchmarkScore'
                              ? `Điểm chuẩn ${selectedYear}`
                              : 'Điểm của bạn',
                          ]}
                          labelFormatter={(label) => {
                            const item = chartSchools.find((s) => s.shortName === label);
                            return item ? item.name : label;
                          }}
                        />
                        <Bar
                          dataKey="benchmarkScore"
                          fill="#3b82f6"
                          radius={[3, 3, 0, 0]}
                          maxBarSize={16}
                        />
                        <Bar
                          dataKey="userScore"
                          fill="#a855f7"
                          radius={[3, 3, 0, 0]}
                          maxBarSize={16}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Hộp Lưu ý (Soft purple / indigo card như trong ảnh) */}
                <div className="bg-purple-50/70 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 rounded-3xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-purple-900 dark:text-purple-300 font-bold text-sm">
                    <Lightbulb className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    Lưu ý
                  </div>
                  <ul className="space-y-2 text-xs text-purple-950/80 dark:text-purple-200/80 leading-relaxed list-disc list-inside">
                    <li>
                      Điểm chuẩn là điểm của năm {selectedYear}, có thể thay đổi theo từng kỳ thi tuyển sinh.
                    </li>
                    <li>
                      Bạn nên cân nhắc thêm các yếu tố như: nguyện vọng cá nhân, khoảng cách địa lý, chương trình đào tạo, cơ sở vật chất...
                    </li>
                    <li>
                      Kết quả tính toán chỉ mang tính chất tham khảo cho quá trình đăng ký nguyện vọng.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            /* ── VIEW 2: LỊCH SỬ 4 NĂM & ĐỒ THỊ ĐA ĐƯỜNG (FULL ADVANCED VIEW) ── */
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Full multi-school Line Chart */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Xu hướng điểm chuẩn các năm (2022 – 2025)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Đối chiếu diễn biến điểm số qua 4 mùa tuyển sinh
                    </p>
                  </div>
                </div>

                <div className="w-full h-80 pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={YEARS.map((yr) => {
                        const point: Record<string, any> = { year: `Năm ${yr}` };
                        chartSchools.forEach((school) => {
                          point[school.id] = school.scores[yr];
                        });
                        return point;
                      })}
                      margin={{ top: 10, right: 30, left: -10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
                      <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} />
                      <YAxis domain={[8, 30]} stroke="#94a3b8" fontSize={12} tickLine={false} tickFormatter={(val) => `${val}đ`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          borderColor: '#334155',
                          borderRadius: '0.75rem',
                          color: '#f8fafc',
                          fontSize: '12px',
                        }}
                        formatter={(value: any, name: any) => {
                          const school = HCM_SCHOOLS_DATA.find((s) => s.id === name);
                          return [`${value} điểm`, school ? school.shortName : name];
                        }}
                      />
                      <Legend
                        wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                        formatter={(value) => {
                          const school = HCM_SCHOOLS_DATA.find((s) => s.id === value);
                          return <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{school?.shortName || value}</span>;
                        }}
                      />
                      {parsedUserScore !== null && (
                        <ReferenceLine
                          y={parsedUserScore}
                          stroke="#ec4899"
                          strokeDasharray="4 4"
                          strokeWidth={2}
                          label={{
                            value: `Điểm của bạn (${parsedUserScore}đ)`,
                            fill: '#ec4899',
                            fontSize: 11,
                            position: 'top',
                          }}
                        />
                      )}
                      {chartSchools.map((school, idx) => (
                        <Line
                          key={school.id}
                          type="monotone"
                          dataKey={school.id}
                          stroke={CHART_COLORS[idx % CHART_COLORS.length]}
                          strokeWidth={2.5}
                          dot={{ r: 4, strokeWidth: 2, fill: '#ffffff' }}
                          activeDot={{ r: 7 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Full Detailed Historical Table */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-blue-600" />
                    Bảng tra cứu chi tiết 4 năm
                  </h3>
                  <div className="text-xs text-slate-500">
                    Hiển thị {filteredSchools.length} trường THPT
                  </div>
                </div>

                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur-md text-[11px] sm:text-xs uppercase font-bold text-slate-600 dark:text-slate-300 tracking-wider shadow-sm">
                      <tr>
                        <th className="py-3 px-3 text-center w-12">So sánh</th>
                        <th className="py-3 px-3 text-center w-10">STT</th>
                        <th className="py-3 px-4">Tên trường THPT</th>
                        <th className="py-3 px-3">Quận / Huyện</th>
                        <th className="py-3 px-3 text-center">2022</th>
                        <th className="py-3 px-3 text-center">2023</th>
                        <th className="py-3 px-3 text-center">2024</th>
                        <th className="py-3 px-3 text-center bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300">
                          2025 (Mới)
                        </th>
                        <th className="py-3 px-4 text-center">Biến động (24-25)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
                      {filteredSchools.map((school, index) => {
                        const { diff, diffPercent } = getScoreDiff(school);
                        const isCompared = compareSchoolIds.includes(school.id);
                        const isTarget = targetSchool === school.name;

                        return (
                          <tr
                            key={school.id}
                            onClick={() => setSelectedSchoolForModal(school)}
                            className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                          >
                            <td
                              className="py-3 px-3 text-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCompareSchool(school.id);
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isCompared}
                                onChange={() => {}}
                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                              />
                            </td>
                            <td className="py-3 px-3 text-center text-slate-400 font-mono text-xs">
                              {index + 1}
                            </td>
                            <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {school.name}
                                {isTarget && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                                    <Target className="w-2.5 h-2.5" /> NV1
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-3 text-slate-600 dark:text-slate-400 text-xs">
                              {school.district}
                            </td>
                            <td className="py-3 px-3 text-center font-mono text-slate-500">
                              {school.scores['2022'].toFixed(2)}
                            </td>
                            <td className="py-3 px-3 text-center font-mono text-slate-500">
                              {school.scores['2023'].toFixed(2)}
                            </td>
                            <td className="py-3 px-3 text-center font-mono text-slate-500">
                              {school.scores['2024'].toFixed(2)}
                            </td>
                            <td className="py-3 px-3 text-center font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50/30 dark:bg-blue-950/10">
                              {school.scores['2025'].toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-center font-mono text-xs">
                              {diff > 0 ? (
                                <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                                  <TrendingUp className="w-3 h-3" /> +{diff.toFixed(2)} ({diffPercent}%)
                                </span>
                              ) : diff < 0 ? (
                                <span className="inline-flex items-center gap-1 font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full">
                                  <TrendingDown className="w-3 h-3" /> {diff.toFixed(2)} ({diffPercent}%)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                  <Minus className="w-3 h-3" /> 0.00
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── MODAL CHI TIẾT 1 TRƯỜNG (SINGLE SCHOOL MODAL) ────────────────── */}
      {selectedSchoolForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-blue-100">
                  {selectedSchoolForModal.clusterLabel} • {selectedSchoolForModal.district}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold mt-2">
                  {selectedSchoolForModal.name}
                </h3>
                {selectedSchoolForModal.quota && (
                  <p className="text-xs text-blue-100 mt-1">
                    Chỉ tiêu tuyển sinh: <strong>{selectedSchoolForModal.quota} học sinh</strong>
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedSchoolForModal(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Thống kê 4 năm */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
                {YEARS.map((yr) => (
                  <div key={yr} className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-3 border border-slate-100 dark:border-slate-700/60">
                    <div className="text-[11px] text-slate-500 font-medium">Năm {yr}</div>
                    <div className="text-base sm:text-lg font-bold font-mono text-blue-600 dark:text-blue-400 mt-0.5">
                      {selectedSchoolForModal.scores[yr].toFixed(2)}đ
                    </div>
                  </div>
                ))}
              </div>

              {/* Biểu đồ đường riêng của trường */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Đồ thị xu hướng điểm (2022 – 2025)
                </h4>
                <div className="h-44 w-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-2 border border-slate-100 dark:border-slate-800">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={YEARS.map((yr) => ({
                        year: `Năm ${yr}`,
                        score: selectedSchoolForModal.scores[yr],
                      }))}
                      margin={{ top: 15, right: 20, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                      <XAxis dataKey="year" fontSize={11} stroke="#94a3b8" />
                      <YAxis domain={['auto', 'auto']} fontSize={11} stroke="#94a3b8" tickFormatter={(v) => `${v}đ`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          color: '#fff',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                        formatter={(val) => [`${val} điểm`, 'Điểm chuẩn']}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={{ r: 5, fill: '#2563eb' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Nhận xét xu hướng */}
              {selectedSchoolForModal.trendNote && (
                <div className="bg-blue-50/70 dark:bg-blue-950/30 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/50 flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-blue-900 dark:text-blue-300">
                      Nhận xét xu hướng tuyển sinh:
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                      {selectedSchoolForModal.trendNote}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => {
                    toggleCompareSchool(selectedSchoolForModal.id);
                    setSelectedSchoolForModal(null);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {compareSchoolIds.includes(selectedSchoolForModal.id)
                    ? '✓ Đang trong danh sách so sánh'
                    : '+ Thêm vào bảng so sánh'}
                </button>

                {onUpdateTargetSchool && (
                  <button
                    onClick={() => {
                      onUpdateTargetSchool(
                        selectedSchoolForModal.name,
                        selectedSchoolForModal.scores['2025']
                      );
                      setSelectedSchoolForModal(null);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
                  >
                    <Target className="w-4 h-4" />
                    Đặt làm Trường mục tiêu NV1
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL SO SÁNH ĐA TRƯỜNG (COMPARE MODAL) ────────────────────── */}
      {showCompareModal && comparedSchools.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-blue-400" />
                <div>
                  <h3 className="text-xl font-bold">So sánh điểm chuẩn đa chiều</h3>
                  <p className="text-xs text-slate-400">
                    Đối chiếu {comparedSchools.length} trường bạn đã chọn
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Đồ thị so sánh chung */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Biểu đồ đường so sánh tương quan qua các năm
                </h4>
                <div className="h-64 sm:h-72 w-full bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-3 border border-slate-200 dark:border-slate-800">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={compareLineData} margin={{ top: 10, right: 30, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                      <XAxis dataKey="year" fontSize={11} stroke="#94a3b8" />
                      <YAxis domain={['auto', 'auto']} fontSize={11} stroke="#94a3b8" tickFormatter={(v) => `${v}đ`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          color: '#fff',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                      <Legend
                        formatter={(val) => {
                          const sc = HCM_SCHOOLS_DATA.find((s) => s.id === val);
                          return <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{sc?.shortName || val}</span>;
                        }}
                      />
                      {comparedSchools.map((sc, idx) => (
                        <Line
                          key={sc.id}
                          type="monotone"
                          dataKey={sc.id}
                          stroke={CHART_COLORS[idx % CHART_COLORS.length]}
                          strokeWidth={3}
                          dot={{ r: 5 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bảng so sánh song song */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-bold">
                    <tr>
                      <th className="p-3">Tiêu chí</th>
                      {comparedSchools.map((sc) => (
                        <th key={sc.id} className="p-3 text-center border-l border-slate-200 dark:border-slate-700">
                          {sc.shortName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr>
                      <td className="p-3 font-semibold text-slate-500">Quận / Cụm</td>
                      {comparedSchools.map((sc) => (
                        <td key={sc.id} className="p-3 text-center border-l border-slate-200 dark:border-slate-700">
                          {sc.district} ({sc.clusterLabel})
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-500">Điểm 2022</td>
                      {comparedSchools.map((sc) => (
                        <td key={sc.id} className="p-3 text-center font-mono border-l border-slate-200 dark:border-slate-700">
                          {sc.scores['2022'].toFixed(2)}đ
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-500">Điểm 2023</td>
                      {comparedSchools.map((sc) => (
                        <td key={sc.id} className="p-3 text-center font-mono border-l border-slate-200 dark:border-slate-700">
                          {sc.scores['2023'].toFixed(2)}đ
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-500">Điểm 2024</td>
                      {comparedSchools.map((sc) => (
                        <td key={sc.id} className="p-3 text-center font-mono border-l border-slate-200 dark:border-slate-700">
                          {sc.scores['2024'].toFixed(2)}đ
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-blue-50/50 dark:bg-blue-950/20 font-bold">
                      <td className="p-3 text-blue-700 dark:text-blue-300">Điểm 2025 (Mới)</td>
                      {comparedSchools.map((sc) => (
                        <td key={sc.id} className="p-3 text-center font-mono text-blue-700 dark:text-blue-300 text-sm border-l border-slate-200 dark:border-slate-700">
                          {sc.scores['2025'].toFixed(2)}đ
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-500">Biến động (24-25)</td>
                      {comparedSchools.map((sc) => {
                        const { diff } = getScoreDiff(sc);
                        return (
                          <td key={sc.id} className="p-3 text-center border-l border-slate-200 dark:border-slate-700">
                            {diff > 0 ? (
                              <span className="text-emerald-600 font-bold">+{diff.toFixed(2)}đ</span>
                            ) : diff < 0 ? (
                              <span className="text-rose-600 font-bold">{diff.toFixed(2)}đ</span>
                            ) : (
                              <span className="text-slate-500">0.00đ</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-500">Chỉ tiêu</td>
                      {comparedSchools.map((sc) => (
                        <td key={sc.id} className="p-3 text-center border-l border-slate-200 dark:border-slate-700">
                          {sc.quota ? `${sc.quota} HS` : 'Đang cập nhật'}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setShowCompareModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
