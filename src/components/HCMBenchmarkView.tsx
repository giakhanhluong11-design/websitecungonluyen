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

type SortField = 'name' | 'district' | 'score2025' | 'diff';
type SortOrder = 'asc' | 'desc';

export const HCMBenchmarkView: React.FC<HCMBenchmarkViewProps> = ({
  targetSchool,
  targetScore,
  onUpdateTargetSchool,
}) => {
  // ── FILTER STATE ────────────────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<HCMCluster>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Tất cả quận/huyện');
  const [selectedScoreRange, setSelectedScoreRange] = useState<string>('all');
  const [userScoreInput, setUserScoreInput] = useState<string>('');
  const [onlyShowMatchingScore, setOnlyShowMatchingScore] = useState<boolean>(false);

  // ── VIEW & CHART STATE ──────────────────────────────────────────────────
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [sortField, setSortField] = useState<SortField>('score2025');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // ── SELECTION & MODALS ──────────────────────────────────────────────────
  const [selectedSchoolForModal, setSelectedSchoolForModal] = useState<HCMSchool | null>(null);
  const [compareSchoolIds, setCompareSchoolIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);
  const [expandedSchoolId, setExpandedSchoolId] = useState<string | null>(null);

  // ── SMART SUGGESTION COMPUTATION ────────────────────────────────────────
  const parsedUserScore = useMemo(() => {
    const val = parseFloat(userScoreInput);
    return isNaN(val) ? null : val;
  }, [userScoreInput]);

  // Phân loại cơ hội trúng tuyển dựa trên điểm thi thử
  const getScoreSuitability = (school: HCMSchool, score: number) => {
    const s2025 = school.scores['2025'];
    const gap = score - s2025; // dương = điểm mình cao hơn điểm chuẩn

    if (gap >= 1.0) {
      return {
        level: 'safe',
        label: 'Vùng an toàn',
        color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
        badge: '🟢 An toàn cao',
        desc: 'Điểm của bạn cao hơn điểm chuẩn từ 1.0 điểm trở lên. Khả năng đỗ NV1 rất cao.',
      };
    } else if (gap >= -0.75 && gap < 1.0) {
      return {
        level: 'match',
        label: 'Vừa sức / Mục tiêu',
        color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
        badge: '🎯 Rất vừa sức',
        desc: 'Điểm của bạn dao động sát điểm chuẩn (chênh lệch dưới 1 điểm). Rất phù hợp đăng ký.',
      };
    } else {
      return {
        level: 'reach',
        label: 'Thử thách / Cần bứt phá',
        color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800',
        badge: '⚡ Cần nỗ lực',
        desc: `Cần tăng thêm ${(Math.abs(gap)).toFixed(2)} điểm để chạm mốc điểm chuẩn năm ngoái.`,
      };
    }
  };

  // ── FILTERED DATA ───────────────────────────────────────────────────────
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

      // 2. Cluster
      if (selectedCluster !== 'all' && school.cluster !== selectedCluster) {
        return false;
      }

      // 3. District
      if (selectedDistrict !== 'Tất cả quận/huyện' && school.district !== selectedDistrict) {
        return false;
      }

      // 4. Score range
      if (selectedScoreRange !== 'all') {
        const range = SCORE_RANGES.find((r) => r.id === selectedScoreRange);
        if (range) {
          const score2025 = school.scores['2025'];
          if (score2025 < range.min || score2025 > range.max) return false;
        }
      }

      // 5. Smart score filter
      if (onlyShowMatchingScore && parsedUserScore !== null) {
        const s2025 = school.scores['2025'];
        const gap = parsedUserScore - s2025;
        // Hiển thị các trường trong khoảng từ -1.5 đến +3.0 điểm
        if (gap < -1.5 || gap > 4.0) return false;
      }

      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name, 'vi');
      } else if (sortField === 'district') {
        comparison = a.district.localeCompare(b.district, 'vi');
      } else if (sortField === 'score2025') {
        comparison = a.scores['2025'] - b.scores['2025'];
      } else if (sortField === 'diff') {
        comparison = getScoreDiff(a).diff - getScoreDiff(b).diff;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }, [
    searchTerm,
    selectedCluster,
    selectedDistrict,
    selectedScoreRange,
    onlyShowMatchingScore,
    parsedUserScore,
    sortField,
    sortOrder,
  ]);

  // ── DATA CHO BIỂU ĐỒ TỔNG QUAN ──────────────────────────────────────────
  const chartSchools = useMemo(() => {
    // Lấy tối đa 7 trường từ danh sách đã lọc để đồ thị không bị quá tải mắt
    return filteredSchools.slice(0, 7);
  }, [filteredSchools]);

  // Biến đổi dữ liệu sang format của Recharts cho Line Chart: [{ year: '2022', [schoolId]: score, ... }]
  const lineChartData = useMemo(() => {
    return YEARS.map((year) => {
      const point: Record<string, any> = { year: `Năm ${year}` };
      chartSchools.forEach((school) => {
        point[school.id] = school.scores[year];
      });
      return point;
    });
  }, [chartSchools]);

  // Dữ liệu cho Bar Chart (So sánh 2024 vs 2025 của các trường đang lọc)
  const barChartData = useMemo(() => {
    return chartSchools.map((s) => ({
      name: s.shortName,
      fullName: s.name,
      'Điểm 2024': s.scores['2024'],
      'Điểm 2025': s.scores['2025'],
      district: s.district,
    }));
  }, [chartSchools]);

  // ── SO SÁNH NHIỀU TRƯỜNG ────────────────────────────────────────────────
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

  // Handler sắp xếp
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* ── HEADER BANNER ──────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white p-6 sm:p-10 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-60 h-60 bg-purple-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide text-indigo-100 border border-white/20">
            <School className="w-3.5 h-3.5" />
            Tra cứu Tuyển sinh Lớp 10 TP.HCM
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Điểm Chuẩn Tuyển Sinh THPT TP.HCM
          </h1>
          <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
            Hệ thống thống kê, tra cứu xu hướng điểm chuẩn qua các năm 2022 – 2025, phân tích cơ hội trúng tuyển và hỗ trợ so sánh nguyện vọng chính xác nhất.
          </p>
        </div>

        {/* Quick stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/15">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/15">
            <div className="text-xs text-indigo-200">Tổng số trường cập nhật</div>
            <div className="text-xl sm:text-2xl font-bold mt-1">{HCM_SCHOOLS_DATA.length} trường</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/15">
            <div className="text-xs text-indigo-200">Điểm cao nhất 2025</div>
            <div className="text-xl sm:text-2xl font-bold mt-1 text-emerald-300">27.50 đ</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/15">
            <div className="text-xs text-indigo-200">Mức phổ biến nhất</div>
            <div className="text-xl sm:text-2xl font-bold mt-1 text-amber-200">18 – 22 đ</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/15">
            <div className="text-xs text-indigo-200">Số năm đối chiếu</div>
            <div className="text-xl sm:text-2xl font-bold mt-1">4 năm (2022–25)</div>
          </div>
        </div>
      </div>

      {/* ── BỘ LỌC & ĐIỀU KHIỂN (FILTER & SEARCH BAR) ──────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Thanh tìm kiếm */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên trường THPT hoặc quận huyện..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100 transition-all placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Cụm bộ lọc Dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Lọc Cụm Khu Vực */}
            <div className="relative">
              <select
                value={selectedCluster}
                onChange={(e) => {
                  setSelectedCluster(e.target.value as HCMCluster);
                  setSelectedDistrict('Tất cả quận/huyện');
                }}
                className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 pr-8 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="all">🌐 Toàn Thành phố</option>
                <option value="thuDuc">🏙️ TP. Thủ Đức</option>
                <option value="trungTam">🏛️ Cụm Quận Trung tâm</option>
                <option value="ven">🌳 Cụm Quận Ven</option>
                <option value="ngoaiThanh">🌾 Huyện Ngoại thành</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Lọc Chi tiết Quận/Huyện */}
            <div className="relative">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 pr-8 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {HCM_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    📍 {d}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Lọc Theo Phổ Điểm */}
            <div className="relative">
              <select
                value={selectedScoreRange}
                onChange={(e) => setSelectedScoreRange(e.target.value)}
                className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 pr-8 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {SCORE_RANGES.map((r) => (
                  <option key={r.id} value={r.id}>
                    📊 {r.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ── GỢI Ý THÔNG MINH (SMART SCORE INPUT) ──────────────────────── */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-slate-900 p-4 rounded-xl border border-indigo-100/80 dark:border-indigo-900/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  Gợi ý trường theo điểm dự kiến / thi thử
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                    Thông minh
                  </span>
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Nhập tổng điểm 3 môn (Toán + Văn + Anh) để phân tích cơ hội trúng tuyển
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-44">
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  max="30"
                  value={userScoreInput}
                  onChange={(e) => setUserScoreInput(e.target.value)}
                  placeholder="Ví dụ: 21.75"
                  className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 rounded-lg text-sm font-semibold text-indigo-700 dark:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  / 30đ
                </span>
              </div>

              {parsedUserScore !== null && (
                <button
                  onClick={() => setOnlyShowMatchingScore(!onlyShowMatchingScore)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    onlyShowMatchingScore
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <Check className={`w-3.5 h-3.5 ${onlyShowMatchingScore ? 'opacity-100' : 'opacity-0'}`} />
                  Chỉ hiện trường vừa sức
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Nút reset & tổng kết số lượng */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
          <div>
            Tìm thấy <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{filteredSchools.length}</strong> trường phù hợp với tiêu chí lọc.
          </div>
          {(searchTerm ||
            selectedCluster !== 'all' ||
            selectedDistrict !== 'Tất cả quận/huyện' ||
            selectedScoreRange !== 'all' ||
            userScoreInput) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCluster('all');
                setSelectedDistrict('Tất cả quận/huyện');
                setSelectedScoreRange('all');
                setUserScoreInput('');
                setOnlyShowMatchingScore(false);
              }}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
            >
              Đặt lại toàn bộ bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* ── SO SÁNH BAR (KHI ĐÃ CHỌN TRƯỜNG) ──────────────────────────── */}
      {compareSchoolIds.length > 0 && (
        <div className="sticky top-20 z-30 bg-indigo-900 text-white p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-top-4 duration-300">
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
              className="px-4 py-1.5 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Xem biểu đồ so sánh chi tiết
            </button>
          </div>
        </div>
      )}

      {/* ── ĐỒ THỊ SO SÁNH TỔNG QUAN (MAIN DASHBOARD CHART) ─────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                Xu hướng Điểm chuẩn qua các năm
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Đang hiển thị biểu đồ của{' '}
              <strong className="text-slate-800 dark:text-slate-200">
                {chartSchools.length} trường tiêu biểu
              </strong>{' '}
              {selectedCluster !== 'all' ? `thuộc ${HCM_CLUSTERS[selectedCluster as Exclude<HCMCluster, 'all'>]}` : 'trong bộ lọc'}
            </p>
          </div>

          {/* Toggle Loại đồ thị */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setChartType('line')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                chartType === 'line'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LineChartIcon className="w-3.5 h-3.5" />
              Biểu đồ đường (2022–25)
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                chartType === 'bar'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Biểu đồ cột (2024 vs 2025)
            </button>
          </div>
        </div>

        {/* Khung vẽ Recharts */}
        <div className="w-full h-80 sm:h-96 pt-2">
          {chartSchools.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
              <School className="w-12 h-12 stroke-1 mb-2" />
              <p className="text-sm">Không có dữ liệu trường học nào theo bộ lọc hiện tại.</p>
            </div>
          ) : chartType === 'line' ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData} margin={{ top: 10, right: 30, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis
                  dataKey="year"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                  domain={[8, 30]}
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickFormatter={(val) => `${val}đ`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
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
                    name={school.id}
                    stroke={CHART_COLORS[idx % CHART_COLORS.length]}
                    strokeWidth={2.5}
                    dot={{ r: 4, strokeWidth: 2, fill: '#ffffff' }}
                    activeDot={{ r: 7 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 20, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={11}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  tickLine={false}
                />
                <YAxis
                  domain={[8, 30]}
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(val) => `${val}đ`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }} />
                <Bar dataKey="Điểm 2024" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Điểm 2025" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── BẢNG DỮ LIỆU CHI TIẾT (DETAILED DATA TABLE) ──────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden space-y-0">
        {/* Table Header Controls */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Bảng tra cứu chi tiết các trường THPT
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Nhấp vào bất kỳ dòng nào để mở phân tích chuyên sâu của trường đó
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Ghi chú biến động:</span>
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <TrendingUp className="w-3 h-3" /> Tăng
            </span>
            <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold ml-2">
              <TrendingDown className="w-3 h-3" /> Giảm
            </span>
          </div>
        </div>

        {/* Scrollable Container with Sticky Header */}
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-20 bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur-md text-[11px] sm:text-xs uppercase font-bold text-slate-600 dark:text-slate-300 tracking-wider shadow-sm">
              <tr>
                <th className="py-3.5 px-3 sm:px-4 text-center w-12">So sánh</th>
                <th className="py-3.5 px-3 text-center w-12">STT</th>
                <th
                  onClick={() => handleSort('name')}
                  className="py-3.5 px-4 cursor-pointer hover:text-indigo-600 select-none"
                >
                  <div className="flex items-center gap-1">
                    Tên trường THPT
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('district')}
                  className="py-3.5 px-3 cursor-pointer hover:text-indigo-600 select-none hidden md:table-cell"
                >
                  <div className="flex items-center gap-1">
                    Quận / Huyện
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-3 text-center">2022</th>
                <th className="py-3.5 px-3 text-center">2023</th>
                <th className="py-3.5 px-3 text-center">2024</th>
                <th
                  onClick={() => handleSort('score2025')}
                  className="py-3.5 px-4 text-center cursor-pointer hover:text-indigo-600 select-none bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300"
                >
                  <div className="flex items-center justify-center gap-1">
                    2025 (Mới nhất)
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('diff')}
                  className="py-3.5 px-4 text-center cursor-pointer hover:text-indigo-600 select-none"
                >
                  <div className="flex items-center justify-center gap-1">
                    Biến động (24-25)
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center w-24">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
              {filteredSchools.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    Không tìm thấy trường nào phù hợp với điều kiện tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredSchools.map((school, index) => {
                  const { diff, diffPercent } = getScoreDiff(school);
                  const isCompared = compareSchoolIds.includes(school.id);
                  const isTarget = targetSchool === school.name;
                  const suitability =
                    parsedUserScore !== null ? getScoreSuitability(school, parsedUserScore) : null;

                  return (
                    <React.Fragment key={school.id}>
                      <tr
                        onClick={() => setSelectedSchoolForModal(school)}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer ${
                          isCompared ? 'bg-indigo-50/60 dark:bg-indigo-950/30' : ''
                        } ${
                          suitability?.level === 'match'
                            ? 'border-l-4 border-l-indigo-500'
                            : suitability?.level === 'safe'
                            ? 'border-l-4 border-l-emerald-500'
                            : ''
                        }`}
                      >
                        {/* Checkbox So sánh */}
                        <td
                          className="py-3.5 px-3 text-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCompareSchool(school.id);
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isCompared}
                            onChange={() => {}}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                          />
                        </td>

                        {/* STT */}
                        <td className="py-3.5 px-3 text-center text-slate-400 font-mono text-xs">
                          {index + 1}
                        </td>

                        {/* Tên trường & Badge */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 flex-wrap">
                            {school.name}
                            {isTarget && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-[10px] font-bold border border-amber-300">
                                <Target className="w-3 h-3" /> Mục tiêu của bạn
                              </span>
                            )}
                            {suitability && (
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${suitability.color}`}
                              >
                                {suitability.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 md:hidden mt-0.5">
                            {school.district} • {school.clusterLabel}
                          </div>
                        </td>

                        {/* Quận / Huyện */}
                        <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300 hidden md:table-cell text-xs">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {school.district}
                          </span>
                        </td>

                        {/* Điểm 2022 */}
                        <td className="py-3.5 px-3 text-center font-mono text-slate-600 dark:text-slate-400">
                          {school.scores['2022'].toFixed(2)}
                        </td>

                        {/* Điểm 2023 */}
                        <td className="py-3.5 px-3 text-center font-mono text-slate-600 dark:text-slate-400">
                          {school.scores['2023'].toFixed(2)}
                        </td>

                        {/* Điểm 2024 */}
                        <td className="py-3.5 px-3 text-center font-mono text-slate-600 dark:text-slate-400">
                          {school.scores['2024'].toFixed(2)}
                        </td>

                        {/* Điểm 2025 (Mới nhất) */}
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-sm text-indigo-700 dark:text-indigo-300 bg-indigo-50/40 dark:bg-indigo-950/10">
                          {school.scores['2025'].toFixed(2)}
                        </td>

                        {/* Biến động */}
                        <td className="py-3.5 px-4 text-center font-mono text-xs">
                          {diff > 0 ? (
                            <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                              <TrendingUp className="w-3 h-3" /> +{diff.toFixed(2)} ({diffPercent}%)
                            </span>
                          ) : diff < 0 ? (
                            <span className="inline-flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full">
                              <TrendingDown className="w-3 h-3" /> {diff.toFixed(2)} ({diffPercent}%)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                              <Minus className="w-3 h-3" /> 0.00
                            </span>
                          )}
                        </td>

                        {/* Action Chi tiết */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSchoolForModal(school);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                            title="Xem đồ thị & nhận xét chi tiết"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL CHI TIẾT 1 TRƯỜNG (SINGLE SCHOOL MODAL) ────────────────── */}
      {selectedSchoolForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-indigo-100">
                  {selectedSchoolForModal.clusterLabel} • {selectedSchoolForModal.district}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold mt-2">
                  {selectedSchoolForModal.name}
                </h3>
                {selectedSchoolForModal.quota && (
                  <p className="text-xs text-indigo-100 mt-1">
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
                    <div className="text-base sm:text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">
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
                <div className="h-48 w-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-2 border border-slate-100 dark:border-slate-800">
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
                        stroke="#6366f1"
                        strokeWidth={3}
                        dot={{ r: 5, fill: '#6366f1' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Nhận xét xu hướng */}
              {selectedSchoolForModal.trendNote && (
                <div className="bg-indigo-50/70 dark:bg-indigo-950/30 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-3">
                  <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-indigo-900 dark:text-indigo-300">
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
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
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
                <BarChart3 className="w-6 h-6 text-indigo-400" />
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
                    <tr className="bg-indigo-50/50 dark:bg-indigo-950/20 font-bold">
                      <td className="p-3 text-indigo-700 dark:text-indigo-300">Điểm 2025 (Mới)</td>
                      {comparedSchools.map((sc) => (
                        <td key={sc.id} className="p-3 text-center font-mono text-indigo-700 dark:text-indigo-300 text-sm border-l border-slate-200 dark:border-slate-700">
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
