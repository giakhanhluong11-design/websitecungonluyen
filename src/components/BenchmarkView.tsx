import React, { useState, useMemo } from 'react';
import { 
  RegionId, 
  YearKey,
  AspirationKey, 
  ScoreMode,
  BenchmarkSchool, 
  RegionMeta,
  REGIONS_LIST, 
  REGIONS_MAP, 
  ALL_BENCHMARK_SCHOOLS, 
  getSchoolScore,
  calculateRelativePercentage,
  DATA_SOURCES 
} from '../data/benchmarkData';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  ExternalLink, 
  Info, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2,
  X,
  FileSpreadsheet,
  BarChart3,
  Layers,
  Percent,
  Search,
  School,
  AlertCircle,
  Calendar,
  Sparkles,
  Minus,
  ChevronRight,
  ArrowLeft,
  Filter,
  Check,
  Award
} from 'lucide-react';

// Tooltip data
interface TooltipInfo {
  school: string;
  regionName: string;
  year: YearKey;
  aspiration: string;
  score: number | null;
  scale: number;
  scaleDisplay: string;
  isUnspecifiedScale?: boolean;
  relativePct: number | null;
  x: number;
  y: number;
}

type ChartViewType = 'line_trend' | 'bar_year';
type SortField = 'school' | 'region' | 'scale' | '2023' | '2024' | '2025' | '2026' | 'pct';
type SortOrder = 'asc' | 'desc';

// Distinct, eye-friendly color palette for multi-school lines
const SCHOOL_COLORS = [
  '#4f46e5', // indigo-600
  '#059669', // emerald-600
  '#d97706', // amber-600
  '#dc2626', // red-600
  '#2563eb', // blue-600
  '#7c3aed', // violet-600
  '#0891b2', // cyan-600
  '#db2777', // pink-600
  '#475569', // slate-600
  '#ea580c'  // orange-600
];

const ALL_YEARS: YearKey[] = ['2023', '2024', '2025', '2026'];

export const BenchmarkView: React.FC = () => {
  // Primary Filter State
  const [selectedRegion, setSelectedRegion] = useState<RegionId>('hcm');
  const [selectedYear, setSelectedYear] = useState<YearKey>('2026');
  const [selectedAspiration, setSelectedAspiration] = useState<AspirationKey>('nv1');
  const [chartView, setChartView] = useState<ChartViewType>('line_trend');
  const [scoreMode, setScoreMode] = useState<ScoreMode>('raw');
  
  // Selected School (Single School History View)
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);

  // Search & Sorting for Data Table
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<SortField | null>('2026');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Modals & Tooltips
  const [showSourceModal, setShowSourceModal] = useState<boolean>(false);
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);
  const [highlightedSchoolId, setHighlightedSchoolId] = useState<string | null>(null);

  const isAllRegions = selectedRegion === 'all';
  const activeRegionMeta: RegionMeta | undefined = !isAllRegions ? REGIONS_MAP[selectedRegion] : undefined;

  // Available aspirations for current selection
  const availableAspirations: AspirationKey[] = useMemo(() => {
    if (isAllRegions) return ['nv1', 'nv2', 'nv3'];
    return activeRegionMeta?.availableAspirations || ['nv1'];
  }, [isAllRegions, activeRegionMeta]);

  // Handle region switch
  const handleSelectRegion = (region: RegionId) => {
    setSelectedRegion(region);
    setTooltip(null);
    // If current school is not in the new region, clear it
    if (selectedSchoolId) {
      const currentSchool = ALL_BENCHMARK_SCHOOLS.find(s => s.id === selectedSchoolId);
      if (currentSchool && region !== 'all' && currentSchool.region !== region) {
        setSelectedSchoolId(null);
      }
    }
    // Check if current aspiration is valid for this region
    if (region !== 'all') {
      const meta = REGIONS_MAP[region];
      if (meta && !meta.availableAspirations.includes(selectedAspiration)) {
        setSelectedAspiration('nv1');
      }
      // If switching to all regions, percentage mode is recommended because scales vary
    } else {
      setScoreMode('percentage');
    }
  };

  // Filtered schools for current region
  const regionSchools = useMemo(() => {
    if (isAllRegions) return ALL_BENCHMARK_SCHOOLS;
    return activeRegionMeta?.schools || [];
  }, [isAllRegions, activeRegionMeta]);

  // Selected school object if viewing single school
  const activeSchool = useMemo(() => {
    if (!selectedSchoolId) return null;
    return ALL_BENCHMARK_SCHOOLS.find(s => s.id === selectedSchoolId) || null;
  }, [selectedSchoolId]);

  // Automatic Quick Statistics
  const quickStats = useMemo(() => {
    const list = regionSchools;
    if (list.length === 0) return null;

    const items: { school: BenchmarkSchool; val: number; scaleDisplay: string }[] = [];

    list.forEach(s => {
      const { score, scale, isUnspecifiedScale, scaleDisplay } = getSchoolScore(s, selectedYear, selectedAspiration);
      if (score !== null) {
        if (scoreMode === 'percentage') {
          const pct = calculateRelativePercentage(score, scale, isUnspecifiedScale);
          if (pct !== null) {
            items.push({ school: s, val: pct, scaleDisplay: '100%' });
          }
        } else {
          items.push({ school: s, val: score, scaleDisplay });
        }
      }
    });

    if (items.length === 0) return null;

    items.sort((a, b) => b.val - a.val);
    const maxItem = items[0];
    const minItem = items[items.length - 1];
    const sum = items.reduce((acc, curr) => acc + curr.val, 0);
    const avg = Math.round((sum / items.length) * 100) / 100;
    const delta = Math.round((maxItem.val - minItem.val) * 100) / 100;

    return {
      count: items.length,
      max: maxItem.val,
      maxSchool: maxItem.school,
      min: minItem.val,
      minSchool: minItem.school,
      avg,
      delta,
      isPercentage: scoreMode === 'percentage'
    };
  }, [regionSchools, selectedYear, selectedAspiration, scoreMode]);

  // Filtered & Sorted Table Schools
  const tableSchools = useMemo(() => {
    let list = [...regionSchools];

    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      list = list.filter(s => 
        s.school.toLowerCase().includes(q) || 
        s.regionName.toLowerCase().includes(q) ||
        s.shortName.toLowerCase().includes(q) ||
        (s.district && s.district.toLowerCase().includes(q))
      );
    }

    if (!sortField) return list;

    return list.sort((a, b) => {
      let valA: number | string | null = null;
      let valB: number | string | null = null;

      if (sortField === 'school') {
        return sortOrder === 'asc' 
          ? a.school.localeCompare(b.school, 'vi')
          : b.school.localeCompare(a.school, 'vi');
      }
      if (sortField === 'region') {
        return sortOrder === 'asc'
          ? a.regionName.localeCompare(b.regionName, 'vi')
          : b.regionName.localeCompare(a.regionName, 'vi');
      }

      if (ALL_YEARS.includes(sortField as YearKey)) {
        const y = sortField as YearKey;
        valA = a.scores[y]?.nv1 ?? -1;
        valB = b.scores[y]?.nv1 ?? -1;
      } else if (sortField === 'pct') {
        const scoreA = a.scores['2026']?.nv1 ?? null;
        const scoreB = b.scores['2026']?.nv1 ?? null;
        valA = calculateRelativePercentage(scoreA, a.scores['2026']?.scale, a.scores['2026']?.isUnspecifiedScale) ?? -1;
        valB = calculateRelativePercentage(scoreB, b.scores['2026']?.scale, b.scores['2026']?.isUnspecifiedScale) ?? -1;
      }

      if (valA === null || valA === -1) return 1;
      if (valB === null || valB === -1) return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      return 0;
    });
  }, [regionSchools, searchTerm, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Y-axis ticks for charts
  const yTicks = useMemo(() => {
    if (scoreMode === 'percentage' || isAllRegions) {
      return [0, 20, 40, 60, 80, 100];
    }
    if (selectedRegion === 'hcm' || selectedRegion === 'nghean') {
      return [0, 5, 10, 15, 20, 25, 30];
    }
    if (selectedRegion === 'danang') {
      return [0, 10, 20, 30, 40, 50, 60];
    }
    // Hanoi, Haiphong, Thainguyen (Thang 50 or mix)
    return [0, 10, 20, 30, 40, 50];
  }, [scoreMode, isAllRegions, selectedRegion]);

  const maxY = yTicks[yTicks.length - 1];

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header & Quick Intro */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-linear-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/80 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800">
                <BarChart3 className="h-3.5 w-3.5" />
                Tổng hợp Điểm Chuẩn Tuyển Sinh Lớp 10 (2023 - 2026)
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                • 6 Tỉnh / Thành phố trọng điểm
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Biểu Đồ So Sánh Điểm Chuẩn THPT
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              Theo dõi biến động và so sánh điểm chuẩn các trường THPT công lập hàng đầu tại TP.HCM, Hà Nội, Hải Phòng, Đà Nẵng, Nghệ An và Thái Nguyên giai đoạn 2023 – 2026. Dữ liệu trích xuất chính thức từ Cổng thông tin Chính phủ và Sở GD&ĐT các địa phương.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              id="open-source-modal-btn"
              onClick={() => setShowSourceModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-xs cursor-pointer"
            >
              <Info className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Nguồn Dữ Liệu Chính Thống
            </button>
          </div>
        </div>

        {/* Region Tabs Navigation */}
        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Chọn Tỉnh / Thành phố:
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {REGIONS_LIST.map((r) => {
              const isActive = selectedRegion === r.id;
              return (
                <button
                  key={r.id}
                  id={`region-tab-${r.id}`}
                  onClick={() => handleSelectRegion(r.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs font-semibold ring-2 ring-indigo-500/20'
                      : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                  }`}
                >
                  <School className="h-3.5 w-3.5 shrink-0 opacity-80" />
                  <span>{r.name}</span>
                  <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-mono ${
                    isActive ? 'bg-indigo-700/60 text-indigo-100' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}>
                    {r.schools.length} trường
                  </span>
                </button>
              );
            })}

            {/* All Regions Tab */}
            <button
              id="region-tab-all"
              onClick={() => handleSelectRegion('all')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer border ${
                selectedRegion === 'all'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs font-semibold ring-2 ring-indigo-500/20'
                  : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              <Percent className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
              <span>Toàn bộ 6 khu vực (Tỷ lệ %)</span>
              <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-mono ${
                selectedRegion === 'all' ? 'bg-indigo-700/60 text-indigo-100' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              }`}>
                {ALL_BENCHMARK_SCHOOLS.length} trường
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Special Notification Banners */}
      {/* Hanoi Special Scale Change Banner */}
      {selectedRegion === 'hanoi' && (
        <div className="rounded-xl border border-amber-300 dark:border-amber-700/60 bg-amber-50/90 dark:bg-amber-950/40 p-4 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-amber-950 dark:text-amber-200">
                  Xử lý đặc biệt quy chế tính điểm tại Hà Nội (2023–2024 vs 2025–2026):
                </span>
                <span className="bg-amber-200/80 dark:bg-amber-900/60 text-amber-950 dark:text-amber-200 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                  Thang 50 → Thang 30
                </span>
              </div>
              <p className="text-amber-900 dark:text-amber-300 leading-relaxed">
                • <strong>Năm 2023 - 2024 (Thang 50):</strong> Điểm XT = (Toán + Văn) × 2 + Ngoại ngữ + Ưu tiên.<br />
                • <strong>Năm 2025 - 2026 (Thang 30):</strong> Điểm XT = Toán + Văn + Ngoại ngữ (đều hệ số 1) + Ưu tiên.<br />
                • <strong>Khuyến nghị:</strong> Điểm thô giữa 2024 và 2025 không cùng hệ quy chiếu (ví dụ Chu Văn An: 42.50/50 so với 25.25/30). Hãy bật chế độ <strong>"Điểm theo tỷ lệ thang điểm (%)"</strong> để theo dõi xu hướng liên tục và chuẩn xác.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Danang Special Scale Note */}
      {selectedRegion === 'danang' && (
        <div className="rounded-xl border border-sky-300 dark:border-sky-800 bg-sky-50/80 dark:bg-sky-950/30 p-4 shadow-xs">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs sm:text-sm">
              <span className="font-bold text-sky-950 dark:text-sky-200">
                Ghi chú về thang điểm Đà Nẵng:
              </span>
              <p className="text-sky-900 dark:text-sky-300 leading-relaxed">
                Dữ liệu trong file nguồn ghi nhận điểm chuẩn các trường tại Đà Nẵng ở mức 52.00 – 58.38 điểm (tiêu đề ghi Thang 50). Do điểm thực tế vượt 50, theo đúng nguyên tắc bảo toàn dữ liệu nguồn, hệ thống hiển thị điểm chuẩn nguyên gốc và giữ trạng thái <strong>"Chưa xác định trong dữ liệu"</strong> cho tỷ lệ chuẩn hóa, không tự ý sửa thang điểm.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Filter & Controls Bar */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 space-y-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Controls Group 1: Chart View Mode */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              Kiểu biểu đồ:
            </span>
            <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-0.5">
              <button
                id="view-mode-line-trend"
                onClick={() => {
                  setChartView('line_trend');
                  setSelectedSchoolId(null);
                  setTooltip(null);
                }}
                className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                  chartView === 'line_trend' && !selectedSchoolId
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Xu hướng theo năm (2023 - 2026)</span>
              </button>

              <button
                id="view-mode-bar-year"
                onClick={() => {
                  setChartView('bar_year');
                  setSelectedSchoolId(null);
                  setTooltip(null);
                }}
                className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                  chartView === 'bar_year' && !selectedSchoolId
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <BarChart3 className="h-3.5 w-3.5" />
                <span>So sánh các trường trong một năm</span>
              </button>
            </div>
          </div>

          {/* Controls Group 2: Score Mode (Raw vs Percentage) */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <Percent className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              Chế độ điểm:
            </span>
            <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-0.5">
              <button
                id="score-mode-raw"
                disabled={isAllRegions}
                onClick={() => {
                  setScoreMode('raw');
                  setTooltip(null);
                }}
                className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                  scoreMode === 'raw'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-bold shadow-xs cursor-pointer'
                    : isAllRegions
                    ? 'text-slate-400 dark:text-slate-600 cursor-not-allowed'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer'
                }`}
                title={isAllRegions ? 'Toàn quốc gồm nhiều thang điểm khác nhau nên bắt buộc quy đổi theo %' : 'Xem điểm chuẩn nguyên bản'}
              >
                Điểm chuẩn thô
              </button>

              <button
                id="score-mode-percentage"
                onClick={() => {
                  setScoreMode('percentage');
                  setTooltip(null);
                }}
                className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                  scoreMode === 'percentage'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="Quy đổi về Tỷ lệ % = Điểm chuẩn / Thang điểm × 100"
              >
                <Percent className="h-3 w-3" />
                Điểm theo tỷ lệ thang điểm (%)
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Controls: Year (when in Bar mode), Aspiration, and School Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Year Selector (Active in Bar Chart mode) */}
            {chartView === 'bar_year' && (
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Năm:
                </span>
                <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-0.5">
                  {ALL_YEARS.map(yr => (
                    <button
                      key={yr}
                      id={`year-selector-${yr}`}
                      onClick={() => {
                        setSelectedYear(yr);
                        setTooltip(null);
                      }}
                      className={`px-2.5 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                        selectedYear === yr
                          ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-bold shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Aspiration Selector (NV1, NV2, NV3) */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-500 dark:text-slate-400">
                Nguyện vọng:
              </span>
              <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-0.5">
                {(['nv1', 'nv2', 'nv3'] as AspirationKey[]).map(nv => {
                  const isAvailable = availableAspirations.includes(nv);
                  return (
                    <button
                      key={nv}
                      id={`aspiration-btn-${nv}`}
                      disabled={!isAvailable}
                      onClick={() => {
                        setSelectedAspiration(nv);
                        setTooltip(null);
                      }}
                      className={`px-2.5 py-1 font-medium rounded-md transition-colors uppercase ${
                        selectedAspiration === nv
                          ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-bold shadow-xs cursor-pointer'
                          : isAvailable
                          ? 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer'
                          : 'text-slate-300 dark:text-slate-600 cursor-not-allowed line-through'
                      }`}
                      title={!isAvailable ? 'Khu vực này trong file dữ liệu chỉ công bố NV1' : undefined}
                    >
                      {nv}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* School Selector (Dropdown to view a specific school's history) */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500 dark:text-slate-400 shrink-0">
              Trường:
            </span>
            <select
              id="school-history-select"
              value={selectedSchoolId || ''}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedSchoolId(val || null);
                setTooltip(null);
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium cursor-pointer shadow-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden max-w-[240px] truncate"
            >
              <option value="">Tất cả trường ({regionSchools.length})</option>
              {regionSchools.map(s => (
                <option key={s.id} value={s.id}>
                  {s.school} {isAllRegions ? `(${s.regionName})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4. Quick Metrics Summary (Auto-calculated from filtered dataset) */}
      {!selectedSchoolId && quickStats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Metric 1: Highest Score */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Điểm cao nhất
              </span>
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            <div className="mt-1.5 flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {quickStats.isPercentage ? `${quickStats.max.toFixed(1)}%` : quickStats.max.toFixed(2)}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400 truncate font-medium" title={quickStats.maxSchool.school}>
              {quickStats.maxSchool.shortName}
            </p>
          </div>

          {/* Metric 2: Lowest Score */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Điểm thấp nhất (Top)
              </span>
              <TrendingDown className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <div className="mt-1.5 flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {quickStats.isPercentage ? `${quickStats.min.toFixed(1)}%` : quickStats.min.toFixed(2)}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400 truncate font-medium" title={quickStats.minSchool.school}>
              {quickStats.minSchool.shortName}
            </p>
          </div>

          {/* Metric 3: Average Score */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Điểm trung bình
              </span>
              <BarChart3 className="h-3.5 w-3.5 text-indigo-500" />
            </div>
            <div className="mt-1.5 flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {quickStats.isPercentage ? `${quickStats.avg.toFixed(1)}%` : quickStats.avg.toFixed(2)}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Trung bình {quickStats.count} trường
            </p>
          </div>

          {/* Metric 4: Spread (Max - Min) */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Biên độ chênh lệch
              </span>
              <Layers className="h-3.5 w-3.5 text-purple-500" />
            </div>
            <div className="mt-1.5 flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {quickStats.isPercentage ? `${quickStats.delta.toFixed(1)}%` : quickStats.delta.toFixed(2)}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Khoảng cách Max - Min
            </p>
          </div>

          {/* Metric 5: Total Schools */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-xs col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Số trường có dữ liệu
              </span>
              <Award className="h-3.5 w-3.5 text-blue-500" />
            </div>
            <div className="mt-1.5 flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {quickStats.count}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">trường</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {isAllRegions ? 'Toàn bộ 6 khu vực' : activeRegionMeta?.name}
            </p>
          </div>
        </div>
      )}

      {/* 5. MAIN VISUALIZATION STAGE */}
      {selectedSchoolId && activeSchool ? (
        /* ------------------------------------------------------------- */
        /* SCENARIO A: SINGLE SCHOOL HISTORY VIEW (Yêu cầu 6)           */
        /* ------------------------------------------------------------- */
        <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-white dark:bg-slate-900 p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <button
                  id="back-to-all-schools-btn"
                  onClick={() => setSelectedSchoolId(null)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Quay lại biểu đồ so sánh tất cả trường
                </button>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <School className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                {activeSchool.school}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Khu vực: <strong>{activeSchool.regionName}</strong> {activeSchool.district ? `(${activeSchool.district})` : ''} • Lịch sử tuyển sinh 4 năm (2023 - 2026)
              </p>
            </div>

            <button
              onClick={() => setSelectedSchoolId(null)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer self-start sm:self-auto"
            >
              Đóng chi tiết trường
            </button>
          </div>

          {/* School History Table with Year-over-Year Delta Detection (Yêu cầu 15) */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Bảng điểm chuẩn chi tiết theo từng năm & nguyện vọng:
            </h3>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                    <th className="py-3 px-4 font-semibold">Năm</th>
                    <th className="py-3 px-4 font-semibold">Thang điểm</th>
                    <th className="py-3 px-4 font-semibold text-right">NV1</th>
                    <th className="py-3 px-4 font-semibold text-right">NV2</th>
                    <th className="py-3 px-4 font-semibold text-right">NV3</th>
                    <th className="py-3 px-4 font-semibold text-right">Tỷ lệ NV1 (%)</th>
                    <th className="py-3 px-4 font-semibold">Biến động so với năm trước</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                  {ALL_YEARS.map((yr, idx) => {
                    const yrData = activeSchool.scores[yr];
                    const prevYr = idx > 0 ? ALL_YEARS[idx - 1] : null;
                    const prevData = prevYr ? activeSchool.scores[prevYr] : null;

                    // Calculate delta only if both years have valid data
                    let deltaNote = <span className="text-slate-400">--</span>;

                    if (yrData && prevData && yrData.nv1 !== null && prevData.nv1 !== null) {
                      // Check if same scale
                      if (yrData.scale === prevData.scale && !yrData.isUnspecifiedScale && !prevData.isUnspecifiedScale) {
                        const diff = Math.round((yrData.nv1 - prevData.nv1) * 100) / 100;
                        if (diff > 0) {
                          deltaNote = (
                            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold font-sans">
                              <ArrowUp className="h-3 w-3" />
                              Tăng {diff.toFixed(2)} điểm
                            </span>
                          );
                        } else if (diff < 0) {
                          deltaNote = (
                            <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold font-sans">
                              <ArrowDown className="h-3 w-3" />
                              Giảm {Math.abs(diff).toFixed(2)} điểm
                            </span>
                          );
                        } else {
                          deltaNote = (
                            <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 font-sans">
                              <Minus className="h-3 w-3" />
                              Không đổi
                            </span>
                          );
                        }
                      } else if (activeSchool.region === 'hanoi' && yr === '2025') {
                        // Special Hanoi 2024 -> 2025 scale change (Yêu cầu 15)
                        const pctCurrent = calculateRelativePercentage(yrData.nv1, yrData.scale);
                        const pctPrev = calculateRelativePercentage(prevData.nv1, prevData.scale);
                        const diffPct = pctCurrent && pctPrev ? Math.round((pctCurrent - pctPrev) * 100) / 100 : null;

                        deltaNote = (
                          <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-sans font-medium text-[11px]">
                            Đổi thang 50 → 30 ({diffPct !== null ? (diffPct >= 0 ? `+${diffPct.toFixed(2)}%` : `${diffPct.toFixed(2)}%`) : 'Khác thang'})
                          </span>
                        );
                      }
                    }

                    const pct = calculateRelativePercentage(yrData?.nv1 ?? null, yrData?.scale, yrData?.isUnspecifiedScale);

                    return (
                      <tr key={yr} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-bold font-sans text-slate-900 dark:text-white">
                          {yr}
                        </td>
                        <td className="py-3 px-4 font-sans text-slate-600 dark:text-slate-400">
                          {yrData?.scaleDisplay || '--'}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-indigo-600 dark:text-indigo-400">
                          {yrData?.nv1 !== null ? yrData?.nv1.toFixed(2) : '--'}
                        </td>
                        <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400 font-medium">
                          {yrData?.nv2 !== null && yrData?.nv2 !== undefined ? yrData.nv2.toFixed(2) : '--'}
                        </td>
                        <td className="py-3 px-4 text-right text-amber-600 dark:text-amber-400 font-medium">
                          {yrData?.nv3 !== null && yrData?.nv3 !== undefined ? yrData.nv3.toFixed(2) : '--'}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-slate-700 dark:text-slate-300">
                          {pct !== null ? `${pct.toFixed(2)}%` : (yrData?.isUnspecifiedScale ? 'Chưa xác định' : '--')}
                        </td>
                        <td className="py-3 px-4">
                          {deltaNote}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* School Historical Line Trend Chart */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                Biểu đồ xu hướng điểm chuẩn qua các năm:
              </h3>
              <div className="flex items-center gap-3 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                  NV1
                </span>
                {activeSchool.scores['2026']?.nv2 !== undefined && (
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    NV2
                  </span>
                )}
                {activeSchool.scores['2026']?.nv3 !== undefined && (
                  <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    NV3
                  </span>
                )}
              </div>
            </div>

            {/* Visual SVG Line Chart for Single School */}
            <div className="relative border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/60 dark:bg-slate-950/40 p-4 sm:p-6 overflow-x-auto">
              <div className="min-w-[500px] h-[240px] relative">
                {/* SVG Canvas for lines */}
                <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  {[0, 50, 100, 150].map((yVal, i) => (
                    <line 
                      key={i} 
                      x1="40" 
                      y1={yVal + 20} 
                      x2="480" 
                      y2={yVal + 20} 
                      stroke="currentColor" 
                      strokeDasharray="4 4" 
                      className="text-slate-200 dark:text-slate-800" 
                    />
                  ))}

                  {/* Draw NV1 Line */}
                  {(() => {
                    const points: { x: number; y: number; yr: YearKey; score: number }[] = [];
                    ALL_YEARS.forEach((yr, idx) => {
                      const yrData = activeSchool.scores[yr];
                      if (yrData && yrData.nv1 !== null) {
                        const x = 70 + idx * 125;
                        // Use relative percentage for smooth continuous representation, or raw normalized
                        const pct = calculateRelativePercentage(yrData.nv1, yrData.scale, yrData.isUnspecifiedScale);
                        const displayPct = pct ?? ((yrData.nv1 / 60) * 100);
                        const y = 170 - (displayPct / 100) * 140;
                        points.push({ x, y, yr, score: yrData.nv1 });
                      }
                    });

                    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

                    return (
                      <g>
                        <path 
                          d={pathD} 
                          fill="none" 
                          stroke="#4f46e5" 
                          strokeWidth="3" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                        />
                        {points.map((p, i) => (
                          <g key={i}>
                            <circle 
                              cx={p.x} 
                              cy={p.y} 
                              r="5" 
                              fill="#4f46e5" 
                              stroke="#ffffff" 
                              strokeWidth="2" 
                            />
                            <text 
                              x={p.x} 
                              y={p.y - 10} 
                              textAnchor="middle" 
                              className="text-[11px] font-mono font-bold fill-indigo-600 dark:fill-indigo-300"
                            >
                              {p.score.toFixed(2)}
                            </text>
                          </g>
                        ))}
                      </g>
                    );
                  })()}
                </svg>

                {/* X-axis Year Labels */}
                <div className="flex justify-between pl-14 pr-6 pt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {ALL_YEARS.map((yr) => (
                    <span key={yr}>Năm {yr} ({activeSchool.scores[yr]?.scaleDisplay}đ)</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ------------------------------------------------------------- */
        /* SCENARIO B: MULTI-SCHOOL OVERVIEW (Line Trend or Bar Year)    */
        /* ------------------------------------------------------------- */
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {chartView === 'line_trend' ? (
                  <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                )}
                {scoreMode === 'percentage'
                  ? 'So sánh điểm chuẩn theo tỷ lệ thang điểm'
                  : chartView === 'line_trend'
                  ? `Xu hướng điểm chuẩn ${selectedAspiration.toUpperCase()} qua các năm (2023 - 2026)`
                  : `Điểm chuẩn ${selectedAspiration.toUpperCase()} năm ${selectedYear} (${isAllRegions ? 'Toàn bộ' : activeRegionMeta?.name})`}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {scoreMode === 'percentage'
                  ? 'Tỷ lệ % = (Điểm chuẩn / Thang điểm tối đa của địa phương) × 100%'
                  : chartView === 'line_trend'
                  ? 'Biểu đồ đường (Line chart) thể hiện sự thay đổi điểm của từng trường qua 4 năm. Nhấp vào điểm để xem lịch sử.'
                  : `So sánh các trường năm ${selectedYear} sắp xếp từ cao xuống thấp. Nhấp vào cột để xem chi tiết.`}
              </p>
            </div>

            {/* School Legend Chips */}
            <div className="flex flex-wrap items-center gap-1.5 max-w-lg">
              {regionSchools.map((school, i) => {
                const color = SCHOOL_COLORS[i % SCHOOL_COLORS.length];
                const isHovered = highlightedSchoolId === school.id;
                return (
                  <button
                    key={school.id}
                    onMouseEnter={() => setHighlightedSchoolId(school.id)}
                    onMouseLeave={() => setHighlightedSchoolId(null)}
                    onClick={() => setSelectedSchoolId(school.id)}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border transition-all cursor-pointer ${
                      isHovered
                        ? 'ring-2 ring-indigo-500/40 font-bold bg-slate-100 dark:bg-slate-800'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className="truncate max-w-[90px]">{school.shortName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* VISUAL CHART AREA */}
          <div className="relative border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/30 p-3 sm:p-5 overflow-x-auto">
            
            {/* SUB-VIEW 1: LINE TREND CHART (Yêu cầu 4) */}
            {chartView === 'line_trend' && (
              <div className="min-w-[640px] h-[380px] relative flex flex-col justify-between select-none">
                
                {/* Horizontal Grid lines & Y-axis labels */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-10 pt-4">
                  {yTicks.slice().reverse().map((tick) => (
                    <div key={tick} className="flex items-center w-full">
                      <span className="w-12 text-right pr-2 text-[11px] font-mono text-slate-400 dark:text-slate-500">
                        {tick}{scoreMode === 'percentage' || isAllRegions ? '%' : ''}
                      </span>
                      <div className="flex-1 border-b border-dashed border-slate-200 dark:border-slate-800/80" />
                    </div>
                  ))}
                </div>

                {/* SVG Layer for lines */}
                <div className="absolute inset-0 pl-14 pr-6 pb-10 pt-4 z-10">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    {regionSchools.map((school, sIdx) => {
                      const color = SCHOOL_COLORS[sIdx % SCHOOL_COLORS.length];
                      const isHighlighted = highlightedSchoolId === school.id;
                      const hasHighlight = highlightedSchoolId !== null;
                      const opacity = hasHighlight ? (isHighlighted ? 1 : 0.15) : 0.85;
                      const strokeWidth = isHighlighted ? 3.5 : 2;

                      // Points for 4 years
                      const points: { xPct: number; yPct: number; yr: YearKey; score: number; scale: number; isUnspecified?: boolean; scaleDisplay: string; pct: number | null }[] = [];

                      ALL_YEARS.forEach((yr, yIdx) => {
                        const { score, scale, isUnspecifiedScale, scaleDisplay } = getSchoolScore(school, yr, selectedAspiration);
                        if (score !== null) {
                          const xPct = (yIdx / (ALL_YEARS.length - 1)) * 100;
                          
                          let normalizedVal = 0;
                          if (scoreMode === 'percentage') {
                            const pct = calculateRelativePercentage(score, scale, isUnspecifiedScale);
                            normalizedVal = pct ?? 0;
                          } else {
                            // Raw score mode:
                            normalizedVal = (score / maxY) * maxY;
                          }

                          const yPct = 100 - Math.min(100, Math.max(0, (normalizedVal / maxY) * 100));
                          const relativePct = calculateRelativePercentage(score, scale, isUnspecifiedScale);

                          points.push({
                            xPct,
                            yPct,
                            yr,
                            score,
                            scale,
                            isUnspecified: isUnspecifiedScale,
                            scaleDisplay,
                            pct: relativePct
                          });
                        }
                      });

                      if (points.length < 2) return null;

                      // For Hanoi in raw score mode: the scale changed between 2024 and 2025 (50 -> 30)
                      // We must NOT draw a misleading continuous line across the scale change without notice!
                      const isHanoiRaw = school.region === 'hanoi' && scoreMode === 'raw';

                      return (
                        <g key={school.id}>
                          {isHanoiRaw ? (
                            // Split line into 2 segments: Segment 1 (2023-2024 Thang 50) and Segment 2 (2025-2026 Thang 30)
                            // with a dashed bridge between 2024 and 2025 to explicitly warn of scale transition
                            <>
                              {/* Segment 1: 2023 -> 2024 */}
                              {points[0] && points[1] && (
                                <line
                                  x1={`${points[0].xPct}%`}
                                  y1={`${points[0].yPct}%`}
                                  x2={`${points[1].xPct}%`}
                                  y2={`${points[1].yPct}%`}
                                  stroke={color}
                                  strokeWidth={strokeWidth}
                                  strokeOpacity={opacity}
                                  strokeLinecap="round"
                                />
                              )}
                              {/* Bridge: 2024 -> 2025 (Dashed to signify scale change) */}
                              {points[1] && points[2] && (
                                <line
                                  x1={`${points[1].xPct}%`}
                                  y1={`${points[1].yPct}%`}
                                  x2={`${points[2].xPct}%`}
                                  y2={`${points[2].yPct}%`}
                                  stroke={color}
                                  strokeWidth={1.5}
                                  strokeDasharray="4 4"
                                  strokeOpacity={opacity * 0.6}
                                />
                              )}
                              {/* Segment 2: 2025 -> 2026 */}
                              {points[2] && points[3] && (
                                <line
                                  x1={`${points[2].xPct}%`}
                                  y1={`${points[2].yPct}%`}
                                  x2={`${points[3].xPct}%`}
                                  y2={`${points[3].yPct}%`}
                                  stroke={color}
                                  strokeWidth={strokeWidth}
                                  strokeOpacity={opacity}
                                  strokeLinecap="round"
                                />
                              )}
                            </>
                          ) : (
                            // Continuous standard line
                            <path
                              d={points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.xPct}% ${p.yPct}%`).join(' ')}
                              fill="none"
                              stroke={color}
                              strokeWidth={strokeWidth}
                              strokeOpacity={opacity}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          )}

                          {/* Data points (dots) */}
                          {points.map((p, idx) => (
                            <circle
                              key={idx}
                              cx={`${p.xPct}%`}
                              cy={`${p.yPct}%`}
                              r={isHighlighted ? 6 : 4.5}
                              fill={color}
                              stroke="#ffffff"
                              strokeWidth={2}
                              opacity={opacity}
                              className="cursor-pointer transition-all hover:scale-150"
                              onMouseEnter={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setTooltip({
                                  school: school.school,
                                  regionName: school.regionName,
                                  year: p.yr,
                                  aspiration: selectedAspiration.toUpperCase(),
                                  score: p.score,
                                  scale: p.scale,
                                  scaleDisplay: p.scaleDisplay,
                                  isUnspecifiedScale: p.isUnspecified,
                                  relativePct: p.pct,
                                  x: rect.left + rect.width / 2,
                                  y: rect.top - 10
                                });
                                setHighlightedSchoolId(school.id);
                              }}
                              onMouseLeave={() => {
                                setTooltip(null);
                                setHighlightedSchoolId(null);
                              }}
                              onClick={() => setSelectedSchoolId(school.id)}
                            />
                          ))}
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* X-axis Year Labels */}
                <div className="relative z-20 flex justify-between pl-14 pr-6 pt-3 mt-auto border-t border-slate-200 dark:border-slate-800">
                  {ALL_YEARS.map((yr) => (
                    <div key={yr} className="flex flex-col items-center">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Năm {yr}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {selectedRegion === 'hanoi' 
                          ? (yr === '2023' || yr === '2024' ? 'Thang 50' : 'Thang 30')
                          : activeRegionMeta 
                          ? activeRegionMeta.scaleNote 
                          : 'Đa thang điểm'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-VIEW 2: BAR CHART (Single Year Comparison) (Yêu cầu 5) */}
            {chartView === 'bar_year' && (
              <div className="min-w-[640px] h-[360px] relative flex flex-col justify-between select-none">
                {/* Horizontal Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-12 pt-3">
                  {yTicks.slice().reverse().map((tick) => (
                    <div key={tick} className="flex items-center w-full">
                      <span className="w-12 text-right pr-2 text-[11px] font-mono text-slate-400 dark:text-slate-500">
                        {tick}{scoreMode === 'percentage' || isAllRegions ? '%' : ''}
                      </span>
                      <div className="flex-1 border-b border-dashed border-slate-200 dark:border-slate-800/80" />
                    </div>
                  ))}
                </div>

                {/* Bars Container */}
                <div className="relative flex-1 flex items-end pl-14 pr-4 pb-12 pt-3 gap-2 sm:gap-3 z-10">
                  {regionSchools
                    .map(school => {
                      const { score, scale, isUnspecifiedScale, scaleDisplay } = getSchoolScore(school, selectedYear, selectedAspiration);
                      const pct = calculateRelativePercentage(score, scale, isUnspecifiedScale);
                      return { school, score, scale, isUnspecifiedScale, scaleDisplay, pct };
                    })
                    .filter(item => item.score !== null)
                    .sort((a, b) => {
                      if (scoreMode === 'percentage') {
                        return (b.pct || 0) - (a.pct || 0);
                      }
                      return (b.score || 0) - (a.score || 0);
                    })
                    .map((item, idx) => {
                      const isPct = scoreMode === 'percentage';
                      const barVal = isPct ? (item.pct || 0) : (item.score || 0);
                      const barHeight = `${Math.min(100, Math.max(0, (barVal / maxY) * 100))}%`;
                      const color = SCHOOL_COLORS[idx % SCHOOL_COLORS.length];

                      return (
                        <div
                          key={item.school.id}
                          onClick={() => setSelectedSchoolId(item.school.id)}
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltip({
                              school: item.school.school,
                              regionName: item.school.regionName,
                              year: selectedYear,
                              aspiration: selectedAspiration.toUpperCase(),
                              score: item.score,
                              scale: item.scale,
                              scaleDisplay: item.scaleDisplay,
                              isUnspecifiedScale: item.isUnspecifiedScale,
                              relativePct: item.pct,
                              x: rect.left + rect.width / 2,
                              y: rect.top - 10
                            });
                          }}
                          onMouseLeave={() => setTooltip(null)}
                          className="flex-1 h-full flex flex-col items-center justify-end group cursor-pointer"
                        >
                          {/* Value tag on hover */}
                          <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                            {isPct ? `${item.pct?.toFixed(1)}%` : item.score?.toFixed(2)}
                          </span>

                          {/* Bar */}
                          <div
                            style={{ height: barHeight, backgroundColor: color }}
                            className="w-full max-w-[34px] rounded-t-md transition-all duration-200 group-hover:brightness-110 shadow-xs"
                          />

                          {/* School Short Name */}
                          <span className="mt-2 text-[11px] font-medium text-slate-600 dark:text-slate-400 truncate w-full text-center group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:font-bold transition-colors">
                            {item.school.shortName}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Floating Tooltip (Yêu cầu 16 - Đầy đủ Tên trường, Khu vực, Năm, NV, Điểm, Thang điểm) */}
          {tooltip && (
            <div
              style={{
                position: 'fixed',
                left: `${tooltip.x}px`,
                top: `${tooltip.y}px`,
                transform: 'translate(-50%, -100%)',
                pointerEvents: 'none',
                zIndex: 9999
              }}
              className="bg-slate-900/95 dark:bg-slate-800/95 text-white backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-700/80 text-xs min-w-[200px] animate-in fade-in zoom-in-95 duration-100"
            >
              <div className="font-bold text-sm text-white flex items-center justify-between gap-2">
                <span>{tooltip.school}</span>
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5 flex items-center gap-1.5">
                <span>{tooltip.regionName}</span>
                <span>•</span>
                <span className="font-semibold text-indigo-300">Năm {tooltip.year}</span>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-700/60 flex flex-col gap-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-400">{tooltip.aspiration}:</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    {tooltip.score !== null ? tooltip.score.toFixed(2) : '--'}
                    <span className="text-slate-400 text-xs font-normal"> / {tooltip.scaleDisplay}đ</span>
                  </span>
                </div>

                {tooltip.relativePct !== null && (
                  <div className="flex items-center justify-between gap-3 text-[11px]">
                    <span className="text-slate-400">Tỷ lệ thang điểm:</span>
                    <span className="font-mono font-semibold text-indigo-300">
                      {tooltip.relativePct.toFixed(2)}%
                    </span>
                  </div>
                )}

                {tooltip.isUnspecifiedScale && (
                  <div className="text-[10px] text-amber-300/90 italic pt-1">
                    * Thang điểm chưa xác định quy chuẩn trong file nguồn
                  </div>
                )}
              </div>

              <div className="mt-1.5 pt-1 border-t border-slate-700/40 text-[10px] text-slate-400 text-center">
                Nhấp để xem lịch sử trọn bộ 4 năm
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. DATA TABLE OF ALL BENCHMARKS (Tra cứu chi tiết & sắp xếp linh hoạt) */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Bảng Số Liệu Điểm Chuẩn Chi Tiết (2023 - 2026)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tra cứu nhanh điểm chuẩn theo từng năm. Nhấp vào tên trường hoặc hàng để mở biểu đồ lịch sử chi tiết.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên trường, quận..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 select-none">
                <th 
                  onClick={() => handleSort('school')}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Tên trường THPT</span>
                    <ArrowUpDown className="h-3 w-3 opacity-60" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('region')}
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Khu vực</span>
                    <ArrowUpDown className="h-3 w-3 opacity-60" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('2023')}
                  className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>2023</span>
                    <ArrowUpDown className="h-3 w-3 opacity-60" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('2024')}
                  className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>2024</span>
                    <ArrowUpDown className="h-3 w-3 opacity-60" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('2025')}
                  className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>2025</span>
                    <ArrowUpDown className="h-3 w-3 opacity-60" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('2026')}
                  className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>2026 (Mới)</span>
                    <ArrowUpDown className="h-3 w-3 opacity-60" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('pct')}
                  className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-indigo-600 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Tỷ lệ 2026</span>
                    <ArrowUpDown className="h-3 w-3 opacity-60" />
                  </div>
                </th>
                <th className="py-3 px-3 text-center font-semibold">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {tableSchools.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-sans">
                    Không tìm thấy trường nào phù hợp với từ khóa "{searchTerm}".
                  </td>
                </tr>
              ) : (
                tableSchools.map((s) => {
                  const s23 = s.scores['2023'];
                  const s24 = s.scores['2024'];
                  const s25 = s.scores['2025'];
                  const s26 = s.scores['2026'];
                  const pct26 = calculateRelativePercentage(s26?.nv1, s26?.scale, s26?.isUnspecifiedScale);

                  return (
                    <tr 
                      key={s.id}
                      onClick={() => setSelectedSchoolId(s.id)}
                      className="hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4 font-sans">
                        <div className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {s.school}
                        </div>
                        {s.district && (
                          <div className="text-[10px] text-slate-400 font-normal">
                            {s.district}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 font-sans text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {s.regionName}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-300 font-semibold">
                        {s23?.nv1 !== null ? s23?.nv1.toFixed(2) : '--'}
                        <span className="text-[10px] text-slate-400 ml-0.5">/{s23?.scaleDisplay}</span>
                      </td>
                      <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-300 font-semibold">
                        {s24?.nv1 !== null ? s24?.nv1.toFixed(2) : '--'}
                        <span className="text-[10px] text-slate-400 ml-0.5">/{s24?.scaleDisplay}</span>
                      </td>
                      <td className="py-3 px-3 text-right text-slate-700 dark:text-slate-200 font-bold">
                        {s25?.nv1 !== null ? s25?.nv1.toFixed(2) : '--'}
                        <span className="text-[10px] text-slate-400 ml-0.5">/{s25?.scaleDisplay}</span>
                      </td>
                      <td className="py-3 px-3 text-right text-indigo-600 dark:text-indigo-400 font-black">
                        {s26?.nv1 !== null ? s26?.nv1.toFixed(2) : '--'}
                        <span className="text-[10px] text-slate-400 ml-0.5">/{s26?.scaleDisplay}</span>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                        {pct26 !== null ? `${pct26.toFixed(2)}%` : (s26?.isUnspecifiedScale ? 'Chưa xác định' : '--')}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center gap-1 text-[11px] font-sans font-medium text-indigo-600 dark:text-indigo-400 group-hover:underline">
                          Xem <ChevronRight className="h-3 w-3" />
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. MODAL: NGUỒN DỮ LIỆU & QUY CHẾ TUYỂN SINH CHÍNH THỐNG */}
      {showSourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Info className="h-5 w-5" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Nguồn Dữ Liệu & Quy Chế Tuyển Sinh (2023 - 2026)
                </h3>
              </div>
              <button
                onClick={() => setShowSourceModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                Dữ liệu trong hệ thống được trích xuất và đối soát chính thức từ:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-800 dark:text-slate-200 font-medium">
                <li>Cổng thông tin điện tử Chính phủ (chinhphu.vn) & Báo Điện tử Chính phủ (baochinhphu.vn, xaydungchinhsach.chinhphu.vn).</li>
                <li>Cổng thông tin Cơ sở dữ liệu ngành Giáo dục & Đào tạo các tỉnh/thành phố (Hà Nội, TP.HCM, Hải Phòng, Đà Nẵng, Nghệ An, Thái Nguyên).</li>
              </ul>

              <div className="pt-2">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">
                  Quy chế và thang điểm từng địa phương:
                </h4>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <strong className="text-slate-900 dark:text-white">TP. Hồ Chí Minh (Thang 30):</strong> 3 môn Toán, Ngữ văn, Ngoại ngữ đều hệ số 1. Thí sinh trúng tuyển NV1 không xét NV2, NV3. Điểm chuẩn NV2 cao hơn NV1 ít nhất 1.0; NV3 cao hơn NV2 ít nhất 1.0 điểm.
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <strong className="text-slate-900 dark:text-white">Hà Nội:</strong> Năm 2023 - 2024 tính Thang 50 [(Toán + Văn) × 2 + NN]. Từ năm 2025 trở đi áp dụng Thang 30 (bỏ hệ số 2). Điểm NV2 ≥ NV1 + 1.0 điểm; Điểm NV3 ≥ NV1 + 2.0 điểm.
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <strong className="text-slate-900 dark:text-white">Hải Phòng & Thái Nguyên (Thang 50):</strong> Áp dụng thang điểm 50 theo quy chế tuyển sinh địa phương.
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <strong className="text-slate-900 dark:text-white">Nghệ An (Thang 30):</strong> THPT Huỳnh Thúc Kháng (TP. Vinh) xét tuyển theo thang 30.
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <strong className="text-slate-900 dark:text-white">Đà Nẵng:</strong> File ghi dữ liệu điểm chuẩn ở mức khoảng 50–60 điểm (tiêu đề ghi Thang 50). Hệ thống bảo toàn số liệu gốc và giữ trạng thái chưa xác định trong dữ liệu cho tỷ lệ chuẩn hóa.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setShowSourceModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 cursor-pointer shadow-xs"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
