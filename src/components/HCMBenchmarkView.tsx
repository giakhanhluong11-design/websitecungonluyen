import React, { useState, useMemo } from 'react';
import {
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  BarChart3,
  LineChart as LineChartIcon,
  Target,
  Check,
  ChevronRight,
  School,
  MapPin,
  Users,
  Award,
  Info,
  CheckCircle2,
  ExternalLink,
  Filter,
  Eye,
  Activity,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Maximize2,
  Bookmark,
  Share2,
  Calendar,
  Layers
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  AreaChart,
  Area
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
  getSchoolTicker,
  getTop10Schools,
  CHART_COLORS,
} from '../data/hcmBenchmarkData';

interface HCMBenchmarkViewProps {
  targetSchool?: string;
  targetScore?: number;
  onUpdateTargetSchool?: (schoolName: string, score: number) => void;
}

type SortField = 'benchmark_desc' | 'benchmark_asc' | 'diff_desc' | 'diff_asc' | 'ticker' | 'name';
type FilterMode = 'all' | 'top10' | 'gainers' | 'losers' | 'safe_for_me';

export const HCMBenchmarkView: React.FC<HCMBenchmarkViewProps> = ({
  targetSchool,
  targetScore,
  onUpdateTargetSchool,
}) => {
  // ── USER SIMULATION SCORE ────────────────────────────────────────────────
  const [userScoreInput, setUserScoreInput] = useState<string>(
    targetScore ? String(targetScore) : '24.5'
  );
  const parsedUserScore = useMemo(() => {
    const val = parseFloat(userScoreInput);
    return isNaN(val) ? null : val;
  }, [userScoreInput]);

  // ── FILTER & SEARCH STATE ────────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Tất cả quận/huyện');
  const [selectedCluster, setSelectedCluster] = useState<HCMCluster>('all');
  const [selectedScoreRange, setSelectedScoreRange] = useState<string>('all');
  const [sortOption, setSortOption] = useState<SortField>('benchmark_desc');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [selectedYear, setSelectedYear] = useState<HCMYear>('2025');

  // ── TOP 10 PINNED CHART STATE ────────────────────────────────────────────
  const top10Schools = useMemo(() => getTop10Schools(selectedYear), [selectedYear]);
  
  // Active toggles for top 10 lines (default all active)
  const [activeTop10Ids, setActiveTop10Ids] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    top10Schools.forEach((s) => {
      initial[s.id] = true;
    });
    return initial;
  });

  const toggleTop10School = (schoolId: string) => {
    setActiveTop10Ids((prev) => ({
      ...prev,
      [schoolId]: !prev[schoolId],
    }));
  };

  const selectOnlyTop10School = (schoolId: string) => {
    const next: Record<string, boolean> = {};
    top10Schools.forEach((s) => {
      next[s.id] = s.id === schoolId;
    });
    setActiveTop10Ids(next);
  };

  const resetAllTop10Toggles = () => {
    const next: Record<string, boolean> = {};
    top10Schools.forEach((s) => {
      next[s.id] = true;
    });
    setActiveTop10Ids(next);
  };

  // Top 10 Multi-line Data across 2022 - 2025
  const top10ChartData = useMemo(() => {
    return YEARS.map((year) => {
      const row: Record<string, any> = { year: `Năm ${year}` };
      top10Schools.forEach((school) => {
        row[school.id] = school.scores[year];
        row[`${school.id}_ticker`] = getSchoolTicker(school);
        row[`${school.id}_name`] = school.shortName;
      });
      return row;
    });
  }, [top10Schools]);

  // ── SELECTED SCHOOL FOR SINGLE TECHNICAL CHART ───────────────────────────
  // Default to Nguyễn Thượng Hiền (nch) or the user's target school
  const [selectedSchool, setSelectedSchool] = useState<HCMSchool>(() => {
    if (targetSchool) {
      const match = HCM_SCHOOLS_DATA.find((s) => s.name === targetSchool || s.shortName === targetSchool);
      if (match) return match;
    }
    return HCM_SCHOOLS_DATA.find((s) => s.id === 'nch') || HCM_SCHOOLS_DATA[0];
  });

  // Single School Multi-Year Chart Data (NV1, NV2, NV3)
  const singleSchoolChartData = useMemo(() => {
    return YEARS.map((year) => {
      const nv1 = selectedSchool.scores[year];
      const nv2 = Number((nv1 + 1.0).toFixed(2));
      const nv3 = Number((nv1 + 2.0).toFixed(2));
      return {
        year: `Năm ${year}`,
        nv1,
        nv2,
        nv3,
        userScore: parsedUserScore ?? undefined,
      };
    });
  }, [selectedSchool, parsedUserScore]);

  // Single School Stats
  const singleSchoolStats = useMemo(() => {
    const scores = YEARS.map((y) => selectedSchool.scores[y]);
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    const maxYear = YEARS[scores.indexOf(maxScore)];
    const minYear = YEARS[scores.indexOf(minScore)];
    const spread = Number((maxScore - minScore).toFixed(2));
    const latestDiff = getScoreDiff(selectedSchool);

    const latestBenchmark = selectedSchool.scores['2025'];
    const userScore = parsedUserScore ?? 0;
    const gap = userScore - latestBenchmark;

    let matchStatus: { label: string; badgeClass: string; desc: string; icon: any };
    if (gap >= 1.0) {
      matchStatus = {
        label: 'KHỚP LỆNH AN TOÀN',
        badgeClass: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        desc: `Điểm của bạn cao hơn điểm chuẩn NV1 +${gap.toFixed(2)} đ. Xác suất khớp lệnh cực cao.`,
        icon: CheckCircle2,
      };
    } else if (gap >= 0) {
      matchStatus = {
        label: 'KHỚP LỆNH VỪA SỨC',
        badgeClass: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
        desc: `Điểm của bạn cao hơn điểm chuẩn NV1 +${gap.toFixed(2)} đ. Rất lý tưởng làm NV1/NV2.`,
        icon: Target,
      };
    } else if (gap >= -1.0) {
      matchStatus = {
        label: 'CẠNH TRANH SÁT SÀN',
        badgeClass: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
        desc: `Còn thiếu ${(Math.abs(gap)).toFixed(2)} đ để chạm điểm sàn NV1. Cân nhắc thêm NV2 an toàn.`,
        icon: Zap,
      };
    } else {
      matchStatus = {
        label: 'LỆNH THỬ THÁCH CAO',
        badgeClass: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
        desc: `Điểm sàn cao hơn ${(Math.abs(gap)).toFixed(2)} đ. Cần bứt phá thêm bài thi thử.`,
        icon: TrendingUp,
      };
    }

    return {
      maxScore,
      maxYear,
      minScore,
      minYear,
      spread,
      latestDiff,
      gap,
      matchStatus,
    };
  }, [selectedSchool, parsedUserScore]);

  // ── FILTERED & SORTED SCHOOLS FOR TICKER BOARD ────────────────────────────
  const filteredSchools = useMemo(() => {
    return HCM_SCHOOLS_DATA.filter((school) => {
      const ticker = getSchoolTicker(school).toLowerCase();
      const name = school.name.toLowerCase();
      const shortName = school.shortName.toLowerCase();
      const district = school.district.toLowerCase();

      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const match = ticker.includes(term) || name.includes(term) || shortName.includes(term) || district.includes(term);
        if (!match) return false;
      }

      // District
      if (selectedDistrict !== 'Tất cả quận/huyện' && school.district !== selectedDistrict) {
        return false;
      }

      // Cluster
      if (selectedCluster !== 'all' && school.cluster !== selectedCluster) {
        return false;
      }

      // Score range
      if (selectedScoreRange !== 'all') {
        const range = SCORE_RANGES.find((r) => r.id === selectedScoreRange);
        if (range) {
          const score = school.scores[selectedYear];
          if (score < range.min || score > range.max) return false;
        }
      }

      // Filter Mode
      if (filterMode === 'top10') {
        const top10Ids = top10Schools.map((s) => s.id);
        if (!top10Ids.includes(school.id)) return false;
      } else if (filterMode === 'gainers') {
        const { diff } = getScoreDiff(school);
        if (diff <= 0) return false;
      } else if (filterMode === 'losers') {
        const { diff } = getScoreDiff(school);
        if (diff >= 0) return false;
      } else if (filterMode === 'safe_for_me') {
        if (parsedUserScore === null) return true;
        const gap = parsedUserScore - school.scores[selectedYear];
        if (gap < -0.5) return false;
      }

      return true;
    }).sort((a, b) => {
      const scoreA = a.scores[selectedYear];
      const scoreB = b.scores[selectedYear];
      const diffA = getScoreDiff(a).diff;
      const diffB = getScoreDiff(b).diff;

      switch (sortOption) {
        case 'benchmark_desc':
          return scoreB - scoreA;
        case 'benchmark_asc':
          return scoreA - scoreB;
        case 'diff_desc':
          return diffB - diffA;
        case 'diff_asc':
          return diffA - diffB;
        case 'ticker':
          return getSchoolTicker(a).localeCompare(getSchoolTicker(b));
        case 'name':
          return a.shortName.localeCompare(b.shortName, 'vi');
        default:
          return scoreB - scoreA;
      }
    });
  }, [
    searchTerm,
    selectedDistrict,
    selectedCluster,
    selectedScoreRange,
    filterMode,
    sortOption,
    selectedYear,
    top10Schools,
    parsedUserScore,
  ]);

  // Market stats (Average benchmark, gainers count, losers count)
  const marketStats = useMemo(() => {
    let totalScore = 0;
    let gainers = 0;
    let losers = 0;
    let unch = 0;

    HCM_SCHOOLS_DATA.forEach((s) => {
      totalScore += s.scores['2025'];
      const { diff } = getScoreDiff(s);
      if (diff > 0) gainers++;
      else if (diff < 0) losers++;
      else unch++;
    });

    const avg = Number((totalScore / HCM_SCHOOLS_DATA.length).toFixed(2));
    return { avg, gainers, losers, unch, total: HCM_SCHOOLS_DATA.length };
  }, []);

  // Update target school handler
  const [savedTargetNotice, setSavedTargetNotice] = useState<string | null>(null);
  const handleSetTarget = (school: HCMSchool) => {
    const score = school.scores['2025'];
    if (onUpdateTargetSchool) {
      onUpdateTargetSchool(school.name, score);
    }
    setSavedTargetNotice(`Đã đặt mã [${getSchoolTicker(school)}] ${school.shortName} làm Nguyện vọng 1 mục tiêu!`);
    setTimeout(() => setSavedTargetNotice(null), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-300">
      {/* ── TOP NOTIFICATION ──────────────────────────────────────────────── */}
      {savedTargetNotice && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-950/90 text-emerald-200 border border-emerald-500/50 shadow-xl backdrop-blur-md text-xs sm:text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{savedTargetNotice}</span>
          </div>
        </div>
      )}

      {/* ── MARKET HEADER & LIVE TICKER TAPE (TRADING FLOOR STYLE) ─────────── */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/80 p-5 sm:p-7 shadow-2xl text-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-mono tracking-widest uppercase font-black px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                SÀN GIAO DỊCH ĐIỂM CHUẨN TS10 • TP. HỒ CHÍ MINH
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white mt-2 flex items-center gap-2">
              <Activity className="w-7 h-7 text-indigo-400" />
              <span>Sàn Chứng Khoán Điểm Chuẩn Tuyển Sinh 10</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Bảng đồ thị đường biến động điểm chuẩn THPT TP.HCM theo thời gian thực (2022–2025). Soi mã trường, khớp lệnh nguyện vọng và phân tích biên độ điểm chuẩn.
            </p>
          </div>

          {/* Market Indices Box */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 px-4 min-w-[140px] shadow-inner">
              <div className="text-[10px] text-slate-400 font-mono font-semibold uppercase">CHỈ SỐ VN-TS10 INDEX</div>
              <div className="text-lg sm:text-xl font-black text-white font-mono flex items-center gap-1.5 mt-0.5">
                <span>{marketStats.avg}</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  +0.35 (+1.7%)
                </span>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 px-4 shadow-inner">
              <div className="text-[10px] text-slate-400 font-mono font-semibold uppercase">THỐNG KÊ BIẾN ĐỘNG</div>
              <div className="flex items-center gap-3 mt-1 text-xs font-mono font-bold">
                <span className="text-emerald-400 flex items-center gap-0.5">
                  ▲ {marketStats.gainers} Tăng
                </span>
                <span className="text-rose-400 flex items-center gap-0.5">
                  ▼ {marketStats.losers} Giảm
                </span>
                <span className="text-amber-400">
                  ▬ {marketStats.unch} Đứng
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Ticker Tape Bar */}
        <div className="mt-4 pt-1 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800">
            <Sparkles className="w-3 h-3 text-amber-400" />
            TICKER TOP
          </span>
          <div className="flex items-center gap-2 shrink-0">
            {top10Schools.map((s, idx) => {
              const diff = getScoreDiff(s);
              const isSelected = selectedSchool.id === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSchool(s)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md scale-105'
                      : 'bg-slate-900/80 text-slate-200 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <span className="font-black text-indigo-400">#{idx + 1} {getSchoolTicker(s)}</span>
                  <span className="font-bold">{s.scores['2025'].toFixed(2)}</span>
                  <span
                    className={`text-[11px] font-bold flex items-center ${
                      diff.diff > 0
                        ? 'text-emerald-400'
                        : diff.diff < 0
                        ? 'text-rose-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {diff.diff > 0 ? `▲+${diff.diff}` : diff.diff < 0 ? `▼${diff.diff}` : '▬ 0.0'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 1. GHIM TRÊN ĐẦU: BẢNG ĐỒ THỊ ĐƯỜNG CỦA TOP 10 TRƯỜNG Ở TP.HCM ── */}
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5 sm:p-7 shadow-2xl space-y-5 text-slate-100 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md">
                <LineChartIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>BẢNG ĐỒ THỊ ĐƯỜNG TOP 10 TRƯỜNG THPT TP.HCM</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                    PINNED TOP 10 INDEX
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Biến động điểm chuẩn 4 năm (2022 – 2025). Nhấp vào mã trường bên dưới để ẩn/hiện hoặc tô sáng từng đường.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={resetAllTop10Toggles}
              className="text-xs px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Hiện tất cả (10)
            </button>
            <div className="text-xs px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 font-mono">
              Khoảng điểm: <span className="text-white font-bold">22.50 – 27.50</span>
            </div>
          </div>
        </div>

        {/* Top 10 Toggle Chips / Legend */}
        <div className="flex flex-wrap items-center gap-2">
          {top10Schools.map((school, idx) => {
            const color = CHART_COLORS[idx % CHART_COLORS.length];
            const isActive = activeTop10Ids[school.id];
            const ticker = getSchoolTicker(school);
            const isCurrentSelected = selectedSchool.id === school.id;

            return (
              <div
                key={school.id}
                className="flex items-center rounded-xl overflow-hidden border border-slate-800 text-xs font-mono transition-all"
              >
                <button
                  onClick={() => toggleTop10School(school.id)}
                  title="Bật/tắt hiển thị đường này"
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 cursor-pointer transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-950 text-slate-600 line-through opacity-50'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-bold">[{ticker}]</span>
                  <span className="hidden sm:inline text-slate-300">{school.shortName}</span>
                  <span className="font-bold text-slate-400">({school.scores['2025'].toFixed(2)})</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedSchool(school);
                    selectOnlyTop10School(school.id);
                  }}
                  title="Chỉ soi mã này"
                  className={`px-2 py-1.5 text-[10px] border-l border-slate-800 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer ${
                    isCurrentSelected ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Soi
                </button>
              </div>
            );
          })}
        </div>

        {/* Recharts Top 10 Multi-Line Chart */}
        <div className="h-[360px] sm:h-[420px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={top10ChartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="year"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}
              />
              <YAxis
                domain={[21.5, 28]}
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}
                unit="đ"
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900/95 border border-slate-700 p-4 rounded-2xl shadow-2xl text-xs font-mono max-w-xs backdrop-blur-md">
                        <div className="font-bold text-white border-b border-slate-800 pb-2 mb-2 flex items-center justify-between">
                          <span className="text-indigo-400">{label}</span>
                          <span className="text-[10px] text-slate-400">TOP 10 THPT TP.HCM</span>
                        </div>
                        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                          {payload.map((p: any) => {
                            const school = top10Schools.find((s) => s.id === p.dataKey);
                            const ticker = school ? getSchoolTicker(school) : p.dataKey;
                            const name = school ? school.shortName : p.dataKey;
                            return (
                              <div
                                key={p.dataKey}
                                className="flex items-center justify-between gap-4 py-0.5"
                              >
                                <div className="flex items-center gap-1.5 truncate">
                                  <span
                                    className="w-2 h-2 rounded-full shrink-0"
                                    style={{ backgroundColor: p.stroke }}
                                  />
                                  <span className="font-bold text-slate-200">[{ticker}]</span>
                                  <span className="text-slate-400 truncate text-[11px]">{name}</span>
                                </div>
                                <span className="font-black text-white">{Number(p.value).toFixed(2)}đ</span>
                              </div>
                            );
                          })}
                        </div>
                        {parsedUserScore !== null && (
                          <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-amber-300 font-bold text-[11px]">
                            <span>Điểm dự kiến của bạn:</span>
                            <span>{parsedUserScore.toFixed(2)}đ</span>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Reference line for User Score */}
              {parsedUserScore !== null && (
                <ReferenceLine
                  y={parsedUserScore}
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  label={{
                    value: `Điểm bạn: ${parsedUserScore.toFixed(2)}đ`,
                    fill: '#f59e0b',
                    fontSize: 12,
                    position: 'top',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                  }}
                />
              )}

              {/* Top 10 Lines */}
              {top10Schools.map((school, idx) => {
                if (!activeTop10Ids[school.id]) return null;
                const color = CHART_COLORS[idx % CHART_COLORS.length];
                const isSelected = selectedSchool.id === school.id;
                return (
                  <Line
                    key={school.id}
                    type="monotone"
                    dataKey={school.id}
                    name={school.shortName}
                    stroke={color}
                    strokeWidth={isSelected ? 4 : 2}
                    dot={{ r: isSelected ? 5 : 3, fill: color, strokeWidth: 1 }}
                    activeDot={{ r: 7, fill: color, stroke: '#fff', strokeWidth: 2 }}
                    animationDuration={600}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── 2. PHÍA DƯỚI: BẢNG CHỌN TỪNG TRƯỜNG & BIỂU ĐỒ ĐƯỜNG LÊN XUỐNG QUA CÁC NĂM ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── CỘT TRÁI (7 COLS): BẢNG ĐIỆN TỬ CHỌN MÃ TRƯỜNG (STOCK TICKER BOARD) ── */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>BẢNG ĐIỆN TỬ NIÊM YẾT MÃ TRƯỜNG</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono font-bold">
                  {filteredSchools.length} Mã
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Nhấp chuột vào bất kỳ mã trường nào để xem biểu đồ kỹ thuật 4 năm ở bên cạnh.
              </p>
            </div>

            {/* User score simulation input */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0">
              <Target className="w-4 h-4 text-amber-500 shrink-0" />
              <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Điểm dự kiến:</div>
              <input
                type="number"
                step="0.25"
                min="0"
                max="30"
                value={userScoreInput}
                onChange={(e) => setUserScoreInput(e.target.value)}
                className="w-16 h-8 text-center text-xs font-mono font-black text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                placeholder="24.5"
              />
              <span className="text-xs font-bold text-slate-500">đ</span>
            </div>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'Tất cả mã' },
              { id: 'top10', label: 'Top 10 THPT' },
              { id: 'gainers', label: 'Tăng điểm ▲' },
              { id: 'losers', label: 'Giảm điểm ▼' },
              { id: 'safe_for_me', label: 'Khớp với điểm tôi 🎯' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterMode(tab.id as FilterMode)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterMode === tab.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search & Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm mã CK hoặc tên trường..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white focus:outline-none"
            >
              {HCM_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortField)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="benchmark_desc">Điểm sàn 2025: Cao nhất</option>
              <option value="benchmark_asc">Điểm sàn 2025: Thấp nhất</option>
              <option value="diff_desc">Biến động: Tăng nhiều nhất</option>
              <option value="diff_asc">Biến động: Giảm nhiều nhất</option>
              <option value="ticker">Mã CK: A - Z</option>
              <option value="name">Tên trường: A - Z</option>
            </select>
          </div>

          {/* Stock Ticker Board Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-bold">
                <tr>
                  <th className="py-2.5 px-3">MÃ CK</th>
                  <th className="py-2.5 px-3">TRƯỜNG THPT</th>
                  <th className="py-2.5 px-2 text-right">NV1 (2025)</th>
                  <th className="py-2.5 px-2 text-right hidden sm:table-cell">NV2</th>
                  <th className="py-2.5 px-2 text-right hidden md:table-cell">NV3</th>
                  <th className="py-2.5 px-2 text-center">BIẾN ĐỘNG</th>
                  <th className="py-2.5 px-3 text-center">SO VỚI BẠN</th>
                  <th className="py-2.5 px-2 text-center">SOI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850 bg-white dark:bg-slate-900">
                {filteredSchools.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      Không tìm thấy mã trường nào phù hợp với bộ lọc.
                    </td>
                  </tr>
                ) : (
                  filteredSchools.map((school) => {
                    const isSelected = selectedSchool.id === school.id;
                    const ticker = getSchoolTicker(school);
                    const nv1 = school.scores['2025'];
                    const nv2 = (nv1 + 1.0).toFixed(2);
                    const nv3 = (nv1 + 2.0).toFixed(2);
                    const { diff, diffPercent } = getScoreDiff(school);

                    // User match gap
                    const userScore = parsedUserScore ?? 0;
                    const gap = userScore - nv1;

                    return (
                      <tr
                        key={school.id}
                        onClick={() => setSelectedSchool(school)}
                        className={`transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 font-semibold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-850'
                        }`}
                      >
                        <td className="py-2.5 px-3 font-black text-indigo-600 dark:text-indigo-400">
                          [{ticker}]
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-900 dark:text-white truncate max-w-[160px] sm:max-w-xs">
                            {school.shortName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-sans truncate">
                            {school.district}
                          </div>
                        </td>
                        <td className="py-2.5 px-2 text-right font-black text-slate-900 dark:text-white">
                          {nv1.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-2 text-right text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                          {nv2}
                        </td>
                        <td className="py-2.5 px-2 text-right text-slate-500 dark:text-slate-400 hidden md:table-cell">
                          {nv3}
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <span
                            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md font-bold text-[11px] ${
                              diff > 0
                                ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                                : diff < 0
                                ? 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                                : 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                            }`}
                          >
                            {diff > 0 ? `▲+${diff}` : diff < 0 ? `▼${diff}` : '▬ 0.0'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {parsedUserScore === null ? (
                            <span className="text-slate-400 text-[11px]">--</span>
                          ) : gap >= 1.0 ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              🟢 +{gap.toFixed(1)}
                            </span>
                          ) : gap >= 0 ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
                              🎯 +{gap.toFixed(1)}
                            </span>
                          ) : gap >= -1.0 ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                              ⚡ {gap.toFixed(1)}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                              🔥 {gap.toFixed(1)}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSchool(school);
                            }}
                            className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-600 hover:text-white'
                            }`}
                            title="Soi đồ thị kỹ thuật"
                          >
                            <LineChartIcon className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── CỘT PHẢI (5 COLS): BIỂU ĐỒ ĐƯỜNG LÊN XUỐNG QUA CÁC NĂM CỦA TRƯỜNG ĐANG CHỌN ── */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-950 p-5 sm:p-6 shadow-2xl text-slate-100 space-y-5 sticky top-6">
          {/* Header Card of Selected School */}
          <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black px-2.5 py-1 rounded-xl bg-indigo-600 text-white font-mono shadow-md">
                  [{getSchoolTicker(selectedSchool)}]
                </span>
                <span className="text-xs text-slate-400 font-sans">
                  {selectedSchool.district}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-1.5 leading-snug">
                {selectedSchool.name}
              </h3>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                Chỉ tiêu dự kiến: <span className="text-white font-bold">{selectedSchool.quota || 675} học sinh</span>
              </p>
            </div>

            <div className="text-right shrink-0">
              <div className="text-[10px] text-slate-400 font-mono font-semibold uppercase">ĐIỂM NV1 2025</div>
              <div className="text-2xl font-black text-white font-mono">
                {selectedSchool.scores['2025'].toFixed(2)}
              </div>
              <div
                className={`text-xs font-bold font-mono flex items-center justify-end gap-0.5 mt-0.5 ${
                  singleSchoolStats.latestDiff.diff > 0
                    ? 'text-emerald-400'
                    : singleSchoolStats.latestDiff.diff < 0
                    ? 'text-rose-400'
                    : 'text-amber-400'
                }`}
              >
                {singleSchoolStats.latestDiff.diff > 0 ? (
                  <>▲ +{singleSchoolStats.latestDiff.diff} (+{singleSchoolStats.latestDiff.diffPercent}%)</>
                ) : singleSchoolStats.latestDiff.diff < 0 ? (
                  <>▼ {singleSchoolStats.latestDiff.diff} ({singleSchoolStats.latestDiff.diffPercent}%)</>
                ) : (
                  <>▬ 0.00 (0%)</>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Multi-Year Chart (NV1, NV2, NV3) */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2 font-mono">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-indigo-400" />
                BIỂU ĐỒ KỸ THUẬT NV1 - NV2 - NV3 (2022–2025)
              </span>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="flex items-center gap-1 text-indigo-400">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" /> NV1
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> NV2
                </span>
                <span className="flex items-center gap-1 text-cyan-400">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" /> NV3
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={singleSchoolChartData}
                  margin={{ top: 10, right: 15, left: -15, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    dataKey="year"
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                  />
                  <YAxis
                    domain={['dataMin - 1', 'dataMax + 1']}
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                    unit="đ"
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-xl text-xs font-mono backdrop-blur-md">
                            <div className="font-bold text-white border-b border-slate-800 pb-1 mb-1.5 text-indigo-400">
                              {label}
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between gap-3 text-indigo-300">
                                <span>Điểm NV1:</span>
                                <span className="font-bold">{payload[0]?.value} đ</span>
                              </div>
                              <div className="flex justify-between gap-3 text-emerald-300">
                                <span>Điểm NV2 (+1.0đ):</span>
                                <span className="font-bold">{payload[1]?.value} đ</span>
                              </div>
                              <div className="flex justify-between gap-3 text-cyan-300">
                                <span>Điểm NV3 (+2.0đ):</span>
                                <span className="font-bold">{payload[2]?.value} đ</span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  {/* Student Reference Line */}
                  {parsedUserScore !== null && (
                    <ReferenceLine
                      y={parsedUserScore}
                      stroke="#f59e0b"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      label={{
                        value: `Điểm bạn (${parsedUserScore}đ)`,
                        fill: '#f59e0b',
                        fontSize: 10,
                        position: 'right',
                        fontFamily: 'monospace',
                      }}
                    />
                  )}

                  <Line
                    type="monotone"
                    dataKey="nv1"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#6366f1' }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="nv2"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="2 2"
                    dot={{ r: 3, fill: '#10b981' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="nv3"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 3, fill: '#06b6d4' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Technical Stats Summary Box */}
          <div className="grid grid-cols-3 gap-2.5 font-mono text-center">
            <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">ĐỈNH CAO (ATH)</div>
              <div className="text-sm font-black text-emerald-400 mt-0.5">
                {singleSchoolStats.maxScore.toFixed(2)}đ
              </div>
              <div className="text-[10px] text-slate-500">Năm {singleSchoolStats.maxYear}</div>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">ĐÁY THẤP (ATL)</div>
              <div className="text-sm font-black text-rose-400 mt-0.5">
                {singleSchoolStats.minScore.toFixed(2)}đ
              </div>
              <div className="text-[10px] text-slate-500">Năm {singleSchoolStats.minYear}</div>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">BIÊN ĐỘ (SPREAD)</div>
              <div className="text-sm font-black text-amber-400 mt-0.5">
                {singleSchoolStats.spread.toFixed(2)}đ
              </div>
              <div className="text-[10px] text-slate-500">Dao động 4 năm</div>
            </div>
          </div>

          {/* Match Status & Prediction */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                PHÂN TÍCH KHỚP LỆNH DỰ KIẾN
              </span>
              <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${singleSchoolStats.matchStatus.badgeClass}`}>
                {singleSchoolStats.matchStatus.label}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {singleSchoolStats.matchStatus.desc}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              id="set-target-school-btn"
              onClick={() => handleSetTarget(selectedSchool)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg transition-all hover:scale-[1.01] cursor-pointer"
            >
              <Target className="w-4 h-4" />
              <span>Khớp Lệnh: Đặt làm Nguyện vọng 1</span>
            </button>
            <p className="text-[11px] text-slate-400 text-center font-sans">
              Nhấn nút trên để ghim trường này vào kế hoạch học tập của bạn trên trang chủ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
