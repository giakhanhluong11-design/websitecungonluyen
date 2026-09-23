// Dữ liệu điểm chuẩn tuyển sinh lớp 10 TP.HCM theo từng trường THPT
// Nguồn: Sở GD&ĐT TP.HCM, các năm học 2022 – 2025

export type HCMCluster =
  | 'all'
  | 'thuDuc'
  | 'trungTam'
  | 'ven'
  | 'ngoaiThanh';

export interface HCMSchool {
  id: string;
  name: string;
  shortName: string;
  district: string;
  cluster: Exclude<HCMCluster, 'all'>;
  clusterLabel: string;
  quota?: number; // Chỉ tiêu
  scores: {
    '2022': number;
    '2023': number;
    '2024': number;
    '2025': number;
  };
  trendNote?: string;
}

export const HCM_CLUSTERS: Record<Exclude<HCMCluster, 'all'>, string> = {
  thuDuc: 'TP. Thủ Đức',
  trungTam: 'Cụm Quận Trung tâm',
  ven: 'Cụm Quận Ven',
  ngoaiThanh: 'Huyện Ngoại thành',
};

export const HCM_DISTRICTS = [
  'Tất cả quận/huyện',
  'TP. Thủ Đức',
  'Quận 1',
  'Quận 3',
  'Quận 4',
  'Quận 5',
  'Quận 6',
  'Quận 7',
  'Quận 8',
  'Quận 10',
  'Quận 11',
  'Quận 12',
  'Bình Thạnh',
  'Tân Bình',
  'Tân Phú',
  'Phú Nhuận',
  'Gò Vấp',
  'Bình Tân',
  'Huyện Bình Chánh',
  'Huyện Củ Chi',
  'Huyện Hóc Môn',
  'Huyện Nhà Bè',
  'Huyện Cần Giờ',
];

export const HCM_SCHOOLS_DATA: HCMSchool[] = [
  // ── CỤM TRUNG TÂM & TOP ĐẦU ──────────────────────────────────────────────
  {
    id: 'lhp',
    name: 'THPT Chuyên Lê Hồng Phong',
    shortName: 'Lê Hồng Phong',
    district: 'Quận 5',
    cluster: 'trungTam',
    clusterLabel: 'Cụm Quận Trung tâm',
    quota: 740,
    scores: { '2022': 27.00, '2023': 26.75, '2024': 27.25, '2025': 27.50 },
    trendNote: 'Top 1 TP.HCM, điểm chuẩn duy trì ổn định ở mức rất cao (>= 27.00). Cạnh tranh gay gắt.',
  },
  {
    id: 'nch',
    name: 'THPT Nguyễn Thượng Hiền',
    shortName: 'Nguyễn Thượng Hiền',
    district: 'Tân Bình',
    cluster: 'trungTam',
    clusterLabel: 'Cụm Quận Trung tâm',
    quota: 775,
    scores: { '2022': 25.00, '2023': 25.50, '2024': 24.25, '2025': 24.75 },
    trendNote: 'Top đầu khối không chuyên, điểm chuẩn luôn thuộc nhóm cao nhất thành phố.',
  },
  {
    id: 'gd',
    name: 'THPT Gia Định',
    shortName: 'Gia Định',
    district: 'Bình Thạnh',
    cluster: 'trungTam',
    clusterLabel: 'Cụm Quận Trung tâm',
    quota: 900,
    scores: { '2022': 24.00, '2023': 24.50, '2024': 23.75, '2025': 24.00 },
    trendNote: 'Điểm ổn định dao động quanh 24.00 điểm. Lượng hồ sơ NV1 luôn rất đông.',
  },
  {
    id: 'ntmk',
    name: 'THPT Nguyễn Thị Minh Khai',
    shortName: 'Minh Khai',
    district: 'Quận 3',
    cluster: 'trungTam',
    clusterLabel: 'Cụm Quận Trung tâm',
    quota: 690,
    scores: { '2022': 23.75, '2023': 24.25, '2024': 23.50, '2025': 23.75 },
    trendNote: 'Thuộc top 5 trường có chất lượng đào tạo và điểm đầu vào cao nhất trung tâm.',
  },
  {
    id: 'btx',
    name: 'THPT Bùi Thị Xuân',
    shortName: 'Bùi Thị Xuân',
    district: 'Quận 1',
    cluster: 'trungTam',
    clusterLabel: 'Cụm Quận Trung tâm',
    quota: 675,
    scores: { '2022': 23.00, '2023': 23.50, '2024': 22.25, '2025': 22.75 },
    trendNote: 'Điểm chuẩn giữ mức trên 22.5. Cơ sở vật chất và môi trường học tập hiện đại.',
  },
  {
    id: 'lqd',
    name: 'THPT Lê Quý Đôn',
    shortName: 'Lê Quý Đôn',
    district: 'Quận 3',
    cluster: 'trungTam',
    clusterLabel: 'Cụm Quận Trung tâm',
    quota: 560,
    scores: { '2022': 23.00, '2023': 23.25, '2024': 22.50, '2025': 22.75 },
    trendNote: 'Trường tiên tiến hội nhập quốc tế, điểm số tăng đều và tỉ lệ cạnh tranh ổn định.',
  },
  {
    id: 'tv',
    name: 'THPT Trưng Vương',
    shortName: 'Trưng Vương',
    district: 'Quận 1',
    cluster: 'trungTam',
    clusterLabel: 'Cụm Quận Trung tâm',
    quota: 700,
    scores: { '2022': 21.00, '2023': 21.50, '2024': 24.50, '2025': 24.50 },
    trendNote: 'Trường danh tiếng lâu đời tại trung tâm Quận 1, điểm chuẩn ổn định và môi trường năng động.',
  },
  {
    id: 'tb',
    name: 'THPT Tân Bình',
    shortName: 'Tân Bình',
    district: 'Tân Bình',
    cluster: 'ven',
    clusterLabel: 'Cụm Quận Ven',
    quota: 750,
    scores: { '2022': 20.00, '2023': 20.25, '2024': 23.75, '2025': 23.75 },
    trendNote: 'Điểm chuẩn ổn định, môi trường học tập thân thiện và cơ sở vật chất khang trang.',
  },
  {
    id: 'pn',
    name: 'THPT Phú Nhuận',
    shortName: 'Phú Nhuận',
    district: 'Phú Nhuận',
    cluster: 'trungTam',
    clusterLabel: 'Cụm Quận Trung tâm',
    quota: 800,
    scores: { '2022': 22.75, '2023': 23.50, '2024': 22.50, '2025': 22.75 },
    trendNote: 'Ngôi trường top 1 quận Phú Nhuận, chất lượng đồng đều và điểm chuẩn vững chắc.',
  },
  {
    id: 'tq',
    name: 'THPT Trần Khai Nguyên',
    shortName: 'Trần Khai Nguyên',
    district: 'Quận 10',
    cluster: 'trungTam',
    clusterLabel: 'Cụm Quận Trung tâm',
    quota: 720,
    scores: { '2022': 21.00, '2023': 21.50, '2024': 20.75, '2025': 21.25 },
    trendNote: 'Lựa chọn tiêu biểu ở mức 21 điểm thuộc khu vực Quận 10, Quận 5.',
  },
  {
    id: 'nhg',
    name: 'THPT Nguyễn Hữu Cảnh',
    shortName: 'Nguyễn Hữu Cảnh',
    district: 'Bình Tân',
    cluster: 'ven',
    clusterLabel: 'Cụm Quận Ven',
    quota: 630,
    scores: { '2022': 18.00, '2023': 18.25, '2024': 17.75, '2025': 18.00 },
    trendNote: 'Phù hợp mức điểm khá (17 - 18.5 điểm) khu vực Tây thành phố.',
  },
  // ── TP. THỦ ĐỨC ──────────────────────────────────────────────────────────
  {
    id: 'nhh',
    name: 'THPT Nguyễn Hữu Huân',
    shortName: 'Nguyễn Hữu Huân',
    district: 'TP. Thủ Đức',
    cluster: 'thuDuc',
    clusterLabel: 'TP. Thủ Đức',
    quota: 750,
    scores: { '2022': 23.25, '2023': 23.75, '2024': 22.00, '2025': 22.50 },
    trendNote: 'Trường top 1 tại khu vực TP. Thủ Đức, có các lớp chuyên và điểm chuẩn cao vượt trội.',
  },
  {
    id: 'td',
    name: 'THPT Thủ Đức',
    shortName: 'Thủ Đức',
    district: 'TP. Thủ Đức',
    cluster: 'thuDuc',
    clusterLabel: 'TP. Thủ Đức',
    quota: 810,
    scores: { '2022': 20.50, '2023': 21.25, '2024': 20.25, '2025': 20.75 },
    trendNote: 'Điểm ổn định trên 20 điểm, cơ sở vật chất khang trang, bề dày thành tích.',
  },
  {
    id: 'hb',
    name: 'THPT Hiệp Bình',
    shortName: 'Hiệp Bình',
    district: 'TP. Thủ Đức',
    cluster: 'thuDuc',
    clusterLabel: 'TP. Thủ Đức',
    quota: 720,
    scores: { '2022': 17.00, '2023': 17.25, '2024': 16.75, '2025': 17.25 },
    trendNote: 'Điểm chuẩn mức trung bình khá (16.5 - 17.5), phù hợp đa số học sinh khu vực ven sông.',
  },
  {
    id: 'pt',
    name: 'THPT Phước Long',
    shortName: 'Phước Long',
    district: 'TP. Thủ Đức',
    cluster: 'thuDuc',
    clusterLabel: 'TP. Thủ Đức',
    quota: 675,
    scores: { '2022': 16.00, '2023': 16.50, '2024': 15.75, '2025': 16.25 },
    trendNote: 'Mức điểm vừa sức, chỉ tiêu tuyển sinh lớn.',
  },
  // ── CỤM QUẬN VEN ────────────────────────────────────────────────────────
  {
    id: 'tp',
    name: 'THPT Trần Phú',
    shortName: 'Trần Phú',
    district: 'Tân Phú',
    cluster: 'ven',
    clusterLabel: 'Cụm Quận Ven',
    quota: 945,
    scores: { '2022': 22.25, '2023': 23.50, '2024': 22.50, '2025': 22.75 },
    trendNote: 'Trường top 1 quận Tân Phú, điểm chuẩn tiệm cận nhóm trường trung tâm.',
  },
  {
    id: 'mdc',
    name: 'THPT Mạc Đĩnh Chi',
    shortName: 'Mạc Đĩnh Chi',
    district: 'Quận 6',
    cluster: 'ven',
    clusterLabel: 'Cụm Quận Ven',
    quota: 1020,
    scores: { '2022': 22.00, '2023': 23.25, '2024': 22.00, '2025': 22.50 },
    trendNote: 'Ngôi trường danh tiếng bậc nhất khu vực Tây Sài Gòn với lượng chỉ tiêu lớn.',
  },
  {
    id: 'gv',
    name: 'THPT Gò Vấp',
    shortName: 'Gò Vấp',
    district: 'Gò Vấp',
    cluster: 'ven',
    clusterLabel: 'Cụm Quận Ven',
    quota: 780,
    scores: { '2022': 19.50, '2023': 20.00, '2024': 19.25, '2025': 19.75 },
    trendNote: 'Mức điểm khoảng 19.5, tỉ lệ chọi vừa phải, môi trường năng động.',
  },
  {
    id: 'ngc',
    name: 'THPT Nguyễn Công Trứ',
    shortName: 'Nguyễn Công Trứ',
    district: 'Gò Vấp',
    cluster: 'ven',
    clusterLabel: 'Cụm Quận Ven',
    quota: 850,
    scores: { '2022': 21.50, '2023': 22.00, '2024': 21.00, '2025': 21.50 },
    trendNote: 'Trường top đầu tại Gò Vấp, truyền thống học tập xuất sắc.',
  },
  {
    id: 'vts',
    name: 'THPT Võ Trường Toản',
    shortName: 'Võ Trường Toản',
    district: 'Quận 12',
    cluster: 'ven',
    clusterLabel: 'Cụm Quận Ven',
    quota: 765,
    scores: { '2022': 18.50, '2023': 19.00, '2024': 18.25, '2025': 18.50 },
    trendNote: 'Trường có điểm chuẩn cao nhất khu vực Quận 12, uy tín lâu năm.',
  },
  {
    id: 'bc',
    name: 'THPT Bình Chánh',
    shortName: 'Bình Chánh',
    district: 'Huyện Bình Chánh',
    cluster: 'ven',
    clusterLabel: 'Cụm Quận Ven',
    quota: 650,
    scores: { '2022': 16.50, '2023': 16.75, '2024': 16.25, '2025': 16.50 },
    trendNote: 'Điểm chuẩn ổn định, là đích đến của phần lớn học sinh khu vực Nam Bình Chánh.',
  },
  // ── HUYỆN NGOẠI THÀNH ────────────────────────────────────────────────────
  {
    id: 'cl',
    name: 'THPT Củ Chi',
    shortName: 'Củ Chi',
    district: 'Huyện Củ Chi',
    cluster: 'ngoaiThanh',
    clusterLabel: 'Huyện Ngoại thành',
    quota: 720,
    scores: { '2022': 15.50, '2023': 15.75, '2024': 15.00, '2025': 15.25 },
    trendNote: 'Trường trung tâm của huyện Củ Chi, điểm chuẩn cao nhất trong cụm ngoại thành Tây Bắc.',
  },
  {
    id: 'bth',
    name: 'THPT Bà Điểm',
    shortName: 'Bà Điểm',
    district: 'Huyện Hóc Môn',
    cluster: 'ngoaiThanh',
    clusterLabel: 'Huyện Ngoại thành',
    quota: 675,
    scores: { '2022': 17.50, '2023': 18.00, '2024': 17.25, '2025': 17.75 },
    trendNote: 'Điểm chuẩn khá cao trong các trường ngoại thành, gần khu dân cư đông đúc.',
  },
  {
    id: 'nb',
    name: 'THPT Nhà Bè',
    shortName: 'Nhà Bè',
    district: 'Huyện Nhà Bè',
    cluster: 'ngoaiThanh',
    clusterLabel: 'Huyện Ngoại thành',
    quota: 585,
    scores: { '2022': 13.75, '2023': 14.00, '2024': 13.50, '2025': 13.75 },
    trendNote: 'Điểm chuẩn mức vừa phải (13.5 - 14 điểm), chỉ tiêu ổn định.',
  },
  {
    id: 'cg',
    name: 'THPT Cần Giờ',
    shortName: 'Cần Giờ',
    district: 'Huyện Cần Giờ',
    cluster: 'ngoaiThanh',
    clusterLabel: 'Huyện Ngoại thành',
    quota: 360,
    scores: { '2022': 10.50, '2023': 10.75, '2024': 10.25, '2025': 10.50 },
    trendNote: 'Điểm chuẩn tạo điều kiện tối đa cho học sinh huyện đảo Cần Giờ.',
  },
  {
    id: 'am',
    name: 'THPT An Nghĩa',
    shortName: 'An Nghĩa',
    district: 'Huyện Cần Giờ',
    cluster: 'ngoaiThanh',
    clusterLabel: 'Huyện Ngoại thành',
    quota: 315,
    scores: { '2022': 10.50, '2023': 10.50, '2024': 10.25, '2025': 10.50 },
    trendNote: 'Trường học vùng duyên hải Cần Giờ, hỗ trợ học sinh học gần nhà.',
  },
];

export const SCORE_RANGES = [
  { id: 'all', label: 'Tất cả mức điểm', min: 0, max: 30 },
  { id: 'under15', label: 'Dưới 15 điểm', min: 0, max: 14.99 },
  { id: '15to19', label: '15 – 19 điểm', min: 15, max: 19.99 },
  { id: '20to22', label: '20 – 22 điểm', min: 20, max: 22.0 },
  { id: 'above22', label: 'Trên 22 điểm', min: 22.01, max: 30 },
];

export const YEARS = ['2022', '2023', '2024', '2025'] as const;
export type HCMYear = (typeof YEARS)[number];

// Helper tính toán biến động điểm 2025 so với 2024
export function getScoreDiff(school: HCMSchool): { diff: number; diffPercent: number } {
  const score2024 = school.scores['2024'];
  const score2025 = school.scores['2025'];
  const diff = Number((score2025 - score2024).toFixed(2));
  const diffPercent = score2024 > 0 ? Number(((diff / score2024) * 100).toFixed(1)) : 0;
  return { diff, diffPercent };
}

// Bảng màu đẹp mắt phân biệt các trường khi vẽ biểu đồ đa đường
export const CHART_COLORS = [
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#14b8a6', // Teal
  '#ef4444', // Red
  '#06b6d4', // Cyan
  '#f97316', // Orange
];
