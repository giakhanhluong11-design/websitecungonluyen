export type RegionId = 'all' | 'hcm' | 'hanoi' | 'haiphong' | 'danang' | 'nghean' | 'thainguyen';
export type YearKey = '2023' | '2024' | '2025' | '2026';
export type AspirationKey = 'nv1' | 'nv2' | 'nv3';
export type ScoreMode = 'raw' | 'percentage';

export interface YearScoreData {
  scale: number;
  scaleDisplay: string;
  nv1: number | null;
  nv2?: number | null;
  nv3?: number | null;
  isUnspecifiedScale?: boolean;
  note?: string;
}

export interface BenchmarkSchool {
  id: string;
  school: string;
  shortName: string;
  district?: string;
  region: Exclude<RegionId, 'all'>;
  regionName: string;
  scores: Record<YearKey, YearScoreData>;
  note?: string;
}

export interface RegionMeta {
  id: Exclude<RegionId, 'all'>;
  name: string;
  shortName: string;
  defaultScale: number;
  scaleNote: string;
  formula: string;
  formulaNote?: string;
  availableAspirations: AspirationKey[];
  hasScaleChange?: boolean;
  scaleChangeNote?: string;
  schools: BenchmarkSchool[];
}

// -------------------------------------------------------------
// 1. THÀNH PHỐ HỒ CHÍ MINH (10 trường hàng đầu - Thang 30)
// Quy tắc NV2/NV3: Điểm chuẩn NV2 cao hơn NV1 ít nhất 1.0; NV3 cao hơn NV2 ít nhất 1.0
// -------------------------------------------------------------
const HCM_SCHOOLS: BenchmarkSchool[] = [
  {
    id: 'hcm-1',
    school: 'THPT Nguyễn Thượng Hiền',
    shortName: 'Nguyễn Thượng Hiền',
    district: 'Tân Bình',
    region: 'hcm',
    regionName: 'TP. Hồ Chí Minh',
    scores: {
      '2023': { scale: 30, scaleDisplay: '30', nv1: 25.50, nv2: 25.75, nv3: 26.00 },
      '2024': { scale: 30, scaleDisplay: '30', nv1: 24.25, nv2: 25.25, nv3: 25.50 },
      '2025': { scale: 30, scaleDisplay: '30', nv1: 24.50, nv2: 25.50, nv3: 26.00 },
      '2026': { scale: 30, scaleDisplay: '30', nv1: 24.25, nv2: 25.25, nv3: 25.75 }
    }
  },
  {
    id: 'hcm-2',
    school: 'THPT Gia Định',
    shortName: 'Gia Định',
    district: 'Bình Thạnh',
    region: 'hcm',
    regionName: 'TP. Hồ Chí Minh',
    scores: {
      '2023': { scale: 30, scaleDisplay: '30', nv1: 24.50, nv2: 24.75, nv3: 25.00 },
      '2024': { scale: 30, scaleDisplay: '30', nv1: 23.75, nv2: 24.75, nv3: 25.00 },
      '2025': { scale: 30, scaleDisplay: '30', nv1: 24.00, nv2: 25.00, nv3: 25.25 },
      '2026': { scale: 30, scaleDisplay: '30', nv1: 23.75, nv2: 24.75, nv3: 25.00 }
    }
  },
  {
    id: 'hcm-3',
    school: 'THPT Nguyễn Thị Minh Khai',
    shortName: 'Nguyễn Thị Minh Khai',
    district: 'Quận 3',
    region: 'hcm',
    regionName: 'TP. Hồ Chí Minh',
    scores: {
      '2023': { scale: 30, scaleDisplay: '30', nv1: 24.25, nv2: 24.50, nv3: 24.75 },
      '2024': { scale: 30, scaleDisplay: '30', nv1: 23.50, nv2: 24.50, nv3: 24.75 },
      '2025': { scale: 30, scaleDisplay: '30', nv1: 23.75, nv2: 24.75, nv3: 25.00 },
      '2026': { scale: 30, scaleDisplay: '30', nv1: 23.50, nv2: 24.50, nv3: 24.75 }
    }
  },
  {
    id: 'hcm-4',
    school: 'THPT Bùi Thị Xuân',
    shortName: 'Bùi Thị Xuân',
    district: 'Quận 1',
    region: 'hcm',
    regionName: 'TP. Hồ Chí Minh',
    scores: {
      '2023': { scale: 30, scaleDisplay: '30', nv1: 23.50, nv2: 24.50, nv3: 24.75 },
      '2024': { scale: 30, scaleDisplay: '30', nv1: 22.25, nv2: 22.50, nv3: 22.75 },
      '2025': { scale: 30, scaleDisplay: '30', nv1: 22.75, nv2: 23.75, nv3: 24.00 },
      '2026': { scale: 30, scaleDisplay: '30', nv1: 22.50, nv2: 23.50, nv3: 23.75 }
    }
  },
  {
    id: 'hcm-5',
    school: 'THPT Trần Phú',
    shortName: 'Trần Phú',
    district: 'Tân Phú',
    region: 'hcm',
    regionName: 'TP. Hồ Chí Minh',
    scores: {
      '2023': { scale: 30, scaleDisplay: '30', nv1: 23.50, nv2: 23.75, nv3: 24.00 },
      '2024': { scale: 30, scaleDisplay: '30', nv1: 22.50, nv2: 23.50, nv3: 23.75 },
      '2025': { scale: 30, scaleDisplay: '30', nv1: 22.75, nv2: 23.75, nv3: 24.00 },
      '2026': { scale: 30, scaleDisplay: '30', nv1: 22.50, nv2: 23.50, nv3: 23.75 }
    }
  },
  {
    id: 'hcm-6',
    school: 'THPT Mạc Đĩnh Chi',
    shortName: 'Mạc Đĩnh Chi',
    district: 'Quận 6',
    region: 'hcm',
    regionName: 'TP. Hồ Chí Minh',
    scores: {
      '2023': { scale: 30, scaleDisplay: '30', nv1: 23.25, nv2: 23.50, nv3: 23.75 },
      '2024': { scale: 30, scaleDisplay: '30', nv1: 22.00, nv2: 23.00, nv3: 23.25 },
      '2025': { scale: 30, scaleDisplay: '30', nv1: 22.25, nv2: 23.25, nv3: 23.50 },
      '2026': { scale: 30, scaleDisplay: '30', nv1: 22.00, nv2: 23.00, nv3: 23.25 }
    }
  },
  {
    id: 'hcm-7',
    school: 'THPT Lê Quý Đôn',
    shortName: 'Lê Quý Đôn',
    district: 'Quận 3',
    region: 'hcm',
    regionName: 'TP. Hồ Chí Minh',
    scores: {
      '2023': { scale: 30, scaleDisplay: '30', nv1: 23.25, nv2: 24.25, nv3: 25.00 },
      '2024': { scale: 30, scaleDisplay: '30', nv1: 22.50, nv2: 23.50, nv3: 23.75 },
      '2025': { scale: 30, scaleDisplay: '30', nv1: 22.75, nv2: 23.75, nv3: 24.00 },
      '2026': { scale: 30, scaleDisplay: '30', nv1: 22.50, nv2: 23.50, nv3: 23.75 }
    }
  },
  {
    id: 'hcm-8',
    school: 'THPT Phú Nhuận',
    shortName: 'Phú Nhuận',
    district: 'Phú Nhuận',
    region: 'hcm',
    regionName: 'TP. Hồ Chí Minh',
    scores: {
      '2023': { scale: 30, scaleDisplay: '30', nv1: 23.50, nv2: 23.75, nv3: 24.25 },
      '2024': { scale: 30, scaleDisplay: '30', nv1: 22.50, nv2: 23.50, nv3: 23.75 },
      '2025': { scale: 30, scaleDisplay: '30', nv1: 22.50, nv2: 23.50, nv3: 23.75 },
      '2026': { scale: 30, scaleDisplay: '30', nv1: 22.25, nv2: 23.25, nv3: 23.50 }
    }
  },
  {
    id: 'hcm-9',
    school: 'THPT Nguyễn Hữu Huân',
    shortName: 'Nguyễn Hữu Huân',
    district: 'TP. Thủ Đức',
    region: 'hcm',
    regionName: 'TP. Hồ Chí Minh',
    scores: {
      '2023': { scale: 30, scaleDisplay: '30', nv1: 23.75, nv2: 24.00, nv3: 24.25 },
      '2024': { scale: 30, scaleDisplay: '30', nv1: 22.00, nv2: 23.00, nv3: 23.25 },
      '2025': { scale: 30, scaleDisplay: '30', nv1: 22.25, nv2: 23.25, nv3: 23.50 },
      '2026': { scale: 30, scaleDisplay: '30', nv1: 22.00, nv2: 23.00, nv3: 23.25 }
    }
  },
  {
    id: 'hcm-10',
    school: 'Trung học Thực hành - ĐHSP',
    shortName: 'Thực hành - ĐHSP',
    district: 'Quận 5',
    region: 'hcm',
    regionName: 'TP. Hồ Chí Minh',
    scores: {
      '2023': { scale: 30, scaleDisplay: '30', nv1: 22.50, nv2: 23.00, nv3: 24.00 },
      '2024': { scale: 30, scaleDisplay: '30', nv1: 22.00, nv2: 23.00, nv3: 23.50 },
      '2025': { scale: 30, scaleDisplay: '30', nv1: 22.25, nv2: 23.25, nv3: 23.75 },
      '2026': { scale: 30, scaleDisplay: '30', nv1: 22.00, nv2: 23.00, nv3: 23.50 }
    }
  }
];

// -------------------------------------------------------------
// 2. THÀNH PHỐ HÀ NỘI (10 trường hàng đầu)
// 2023 - 2024: Thang 50 [(Toán + Văn) × 2 + NN]
// 2025 - 2026: Thang 30 (bỏ hệ số 2)
// Quy tắc NV2/NV3: NV2 ≥ NV1 + 1.0; NV3 ≥ NV1 + 2.0
// -------------------------------------------------------------
const HANOI_SCHOOLS: BenchmarkSchool[] = [
  {
    id: 'hn-1',
    school: 'THPT Chu Văn An',
    shortName: 'Chu Văn An',
    region: 'hanoi',
    regionName: 'Hà Nội',
    scores: {
      '2023': { scale: 50, scaleDisplay: '50', nv1: 44.50, nv2: 45.50, nv3: 46.50 },
      '2024': { scale: 50, scaleDisplay: '50', nv1: 42.50, nv2: 43.50, nv3: 44.50 },
      '2025': { scale: 30, scaleDisplay: '30', nv1: 25.25, nv2: 26.25, nv3: 27.25 },
      '2026': { scale: 30, scaleDisplay: '30', nv1: 25.25, nv2: 26.25, nv3: 27.25 }
    }
  },
  {
    id: 'hn-2',
    school: 'THPT Kim Liên',
    shortName: 'Kim Liên',
    region: 'hanoi',
    regionName: 'Hà Nội',
    scores: {
      '2023': { scale: 50, scaleDisplay: '50', nv1: 43.25, nv2: 44.25, nv3: 45.25 },
      '2024': { scale: 50, scaleDisplay: '50', nv1: 41.75, nv2: 42.75, nv3: 43.75 },
      '2025': { scale: 30, scaleDisplay: '30', nv1: 25.50, nv2: 26.50, nv3: 27.50 },
      '2026': { scale: 30, scaleDisplay: '30', nv1: 25.25, nv2: 26.25, nv3: 27.25 }
    }
  },
  {
    id: 'hn-3',
    school: 'THPT Lê Quý Đôn - Hà Đông',
    shortName: 'Lê Quý Đôn (HĐ)',
    region: 'hanoi',
    regionName: 'Hà Nội',
    scores: {
      '2023': { scale: 50, scaleDisplay: '50', nv1: 42.25, nv2: 43.25, nv3: 44.25 },
      '2024': { scale: 50, scaleDisplay: '50', nv1: 42.50, nv2: 43.50, nv3: 44.50 },
      '2025': { scale: 30, scaleDisplay: '30', nv1: 25.50, nv2: 26.50, nv3: 27.50 },
      '2026': { scale: 30, scaleDisplay: '30', nv1: 25.25, nv2: 26.25, nv3: 27.25 }
    }
  },
  {
    id: 'hn-4',
    school: 'THPT Yên Hòa',
    shortName: 'Yên Hòa',
    region: 'hanoi',
    regionName: 'Hà Nội',
    scores: {
      '2023': { scale: 50, scaleDisplay: '50', nv1: 42.25, nv2: 43.25, nv3: 44.25 },
      '2024': { scale: 50, scaleDisplay: '50', nv1: 42.50, nv2: 43.50, nv3: 44.50 },
      '2025': { scale: 30, scaleDisplay: '30', nv1: 25.00, nv2: 26.00, nv3: 27.00 },
      '2026': { scale: 30, scaleDisplay: '30', nv1: 25.00, nv2: 26.00, nv3: 27.00 }
    }
  },
  {
    id: 'hn-5',
    school: 'THPT Việt Đức',
    shortName: 'Việt Đức',
    region: 'hanoi',
    regionName: 'Hà Nội',
    scores: {
      '2023': { scale: 50, scaleDisplay: '50', nv1: 43.00, nv2: 44.00, nv3: 45.00 },
      '2024': { scale: 50, scaleDisplay: '50', nv1: 41.25, nv2: 42.25, nv3: 43.25 },
      '2025': { scale: 30, scaleDisplay: '30', nv1: 25.25, nv2: 26.25, nv3: 27.25 },
      '2026': { scale: 30, scaleDisplay: '30', nv1: 25.00, nv2: 26.00, nv3: 27.00 }
    }
  },
  {
    id: 'hn-6',
    school: 'THPT Phan Đình Phùng',
    shortName: 'Phan Đình Phùng',
    region: 'hanoi',
    regionName: 'Hà Nội',
    scores: {
      '2023': { scale: 50, scaleDisplay: '50', nv1: 42.75, nv2: 43.75, nv3: 44.75 },
      '2024': { scale: 50, scaleDisplay: '50', nv1: 41.75, nv2: 42.75, nv3: 43.75 },
      '2025': { scale: 30, scaleDisplay: '30', nv1: 25.25, nv2: 26.25, nv3: 27.25 },
      '2026': { scale: 30, scaleDisplay: '30', nv1: 25.00, nv2: 26.00, nv3: 27.00 }
    }
  },
  {
    id: 'hn-7',
    school: 'THPT Nguyễn Gia Thiều',
    shortName: 'Nguyễn Gia Thiều',
    region: 'hanoi',
    regionName: 'Hà Nội',
    scores: {
      '2023': { scale: 50, scaleDisplay: '50', nv1: 41.75, nv2: 42.75, nv3: 43.75 },
      '2024': { scale: 50, scaleDisplay: '50', nv1: 41.75, nv2: 42.75, nv3: 43.75 },
      '2025': { scale: 30, scaleDisplay: '30', nv1: 25.00, nv2: 26.00, nv3: 27.00 },
      '2026': { scale: 30, scaleDisplay: '30', nv1: 24.75, nv2: 25.75, nv3: 26.75 }
    }
  },
  {
    id: 'hn-8',
    school: 'THPT Thăng Long',
    shortName: 'Thăng Long',
    region: 'hanoi',
    regionName: 'Hà Nội',
    scores: {
      '2023': { scale: 50, scaleDisplay: '50', nv1: 41.00, nv2: 42.00, nv3: 43.00 },
      '2024': { scale: 50, scaleDisplay: '50', nv1: 42.25, nv2: 43.25, nv3: 44.25 },
      '2025': { scale: 30, scaleDisplay: '30', nv1: 24.25, nv2: 25.25, nv3: 26.25 },
      '2026': { scale: 30, scaleDisplay: '30', nv1: 24.25, nv2: 25.25, nv3: 26.25 }
    }
  },
  {
    id: 'hn-9',
    school: 'THPT Nguyễn Thị Minh Khai',
    shortName: 'Nguyễn Thị Minh Khai (HN)',
    region: 'hanoi',
    regionName: 'Hà Nội',
    scores: {
      '2023': { scale: 50, scaleDisplay: '50', nv1: 41.00, nv2: 42.00, nv3: 43.00 },
      '2024': { scale: 50, scaleDisplay: '50', nv1: 41.25, nv2: 42.25, nv3: 43.25 },
      '2025': { scale: 30, scaleDisplay: '30', nv1: 24.75, nv2: 25.75, nv3: 26.75 },
      '2026': { scale: 30, scaleDisplay: '30', nv1: 24.50, nv2: 25.50, nv3: 26.50 }
    }
  },
  {
    id: 'hn-10',
    school: 'THPT Nhân Chính',
    shortName: 'Nhân Chính',
    region: 'hanoi',
    regionName: 'Hà Nội',
    scores: {
      '2023': { scale: 50, scaleDisplay: '50', nv1: 40.75, nv2: 41.75, nv3: 42.75 },
      '2024': { scale: 50, scaleDisplay: '50', nv1: 41.25, nv2: 42.25, nv3: 43.25 },
      '2025': { scale: 30, scaleDisplay: '30', nv1: 24.00, nv2: 25.00, nv3: 26.00 },
      '2026': { scale: 30, scaleDisplay: '30', nv1: 24.00, nv2: 25.00, nv3: 26.00 }
    }
  }
];

// -------------------------------------------------------------
// 3. THÀNH PHỐ HẢI PHÒNG (Thang 50 - 3 trường theo file)
// -------------------------------------------------------------
const HAIPHONG_SCHOOLS: BenchmarkSchool[] = [
  {
    id: 'hp-1',
    school: 'THPT Thái Phiên',
    shortName: 'Thái Phiên',
    region: 'haiphong',
    regionName: 'Hải Phòng',
    scores: {
      '2023': { scale: 50, scaleDisplay: '50', nv1: 41.50 },
      '2024': { scale: 50, scaleDisplay: '50', nv1: 41.25 },
      '2025': { scale: 50, scaleDisplay: '50', nv1: 41.50 },
      '2026': { scale: 50, scaleDisplay: '50', nv1: 41.25 }
    }
  },
  {
    id: 'hp-2',
    school: 'THPT Ngô Quyền',
    shortName: 'Ngô Quyền',
    region: 'haiphong',
    regionName: 'Hải Phòng',
    scores: {
      '2023': { scale: 50, scaleDisplay: '50', nv1: 40.75 },
      '2024': { scale: 50, scaleDisplay: '50', nv1: 40.50 },
      '2025': { scale: 50, scaleDisplay: '50', nv1: 40.75 },
      '2026': { scale: 50, scaleDisplay: '50', nv1: 40.50 }
    }
  },
  {
    id: 'hp-3',
    school: 'THPT Trần Phú',
    shortName: 'Trần Phú (HP)',
    region: 'haiphong',
    regionName: 'Hải Phòng',
    scores: {
      '2023': { scale: 50, scaleDisplay: '50', nv1: 39.50 },
      '2024': { scale: 50, scaleDisplay: '50', nv1: 39.25 },
      '2025': { scale: 50, scaleDisplay: '50', nv1: 39.50 },
      '2026': { scale: 50, scaleDisplay: '50', nv1: 39.25 }
    }
  }
];

// -------------------------------------------------------------
// 4. THÀNH PHỐ ĐÀ NẴNG (3 trường theo file)
// File ghi "Đà Nẵng (Thang 50): THPT Phan Châu Trinh [2023: 58.13 | 2024: 58.38 | 2025: 58.25 | 2026: 58.00]..."
// Lưu ý mục 9: File ghi nhận ở mức 50–60 điểm. Không tự suy đoán hoặc sửa thang điểm.
// Nếu không đủ thông tin thang điểm, giữ trạng thái "Chưa xác định trong dữ liệu".
// -------------------------------------------------------------
const DANANG_SCHOOLS: BenchmarkSchool[] = [
  {
    id: 'dn-1',
    school: 'THPT Phan Châu Trinh',
    shortName: 'Phan Châu Trinh',
    region: 'danang',
    regionName: 'Đà Nẵng',
    scores: {
      '2023': { scale: 50, scaleDisplay: 'Chưa xác định trong dữ liệu', isUnspecifiedScale: true, nv1: 58.13 },
      '2024': { scale: 50, scaleDisplay: 'Chưa xác định trong dữ liệu', isUnspecifiedScale: true, nv1: 58.38 },
      '2025': { scale: 50, scaleDisplay: 'Chưa xác định trong dữ liệu', isUnspecifiedScale: true, nv1: 58.25 },
      '2026': { scale: 50, scaleDisplay: 'Chưa xác định trong dữ liệu', isUnspecifiedScale: true, nv1: 58.00 }
    },
    note: 'Điểm chuẩn ghi nhận từ 50-60 điểm. Tiêu đề file ghi Thang 50. Chưa xác định công thức thang điểm chuẩn hóa trong dữ liệu nguồn.'
  },
  {
    id: 'dn-2',
    school: 'THPT Hoàng Hoa Thám',
    shortName: 'Hoàng Hoa Thám',
    region: 'danang',
    regionName: 'Đà Nẵng',
    scores: {
      '2023': { scale: 50, scaleDisplay: 'Chưa xác định trong dữ liệu', isUnspecifiedScale: true, nv1: 53.88 },
      '2024': { scale: 50, scaleDisplay: 'Chưa xác định trong dữ liệu', isUnspecifiedScale: true, nv1: 54.13 },
      '2025': { scale: 50, scaleDisplay: 'Chưa xác định trong dữ liệu', isUnspecifiedScale: true, nv1: 54.00 },
      '2026': { scale: 50, scaleDisplay: 'Chưa xác định trong dữ liệu', isUnspecifiedScale: true, nv1: 53.75 }
    },
    note: 'Điểm chuẩn ghi nhận từ 50-60 điểm. Tiêu đề file ghi Thang 50. Chưa xác định công thức thang điểm chuẩn hóa trong dữ liệu nguồn.'
  },
  {
    id: 'dn-3',
    school: 'THPT Hòa Vang',
    shortName: 'Hòa Vang',
    region: 'danang',
    regionName: 'Đà Nẵng',
    scores: {
      '2023': { scale: 50, scaleDisplay: 'Chưa xác định trong dữ liệu', isUnspecifiedScale: true, nv1: 52.25 },
      '2024': { scale: 50, scaleDisplay: 'Chưa xác định trong dữ liệu', isUnspecifiedScale: true, nv1: 52.50 },
      '2025': { scale: 50, scaleDisplay: 'Chưa xác định trong dữ liệu', isUnspecifiedScale: true, nv1: 52.25 },
      '2026': { scale: 50, scaleDisplay: 'Chưa xác định trong dữ liệu', isUnspecifiedScale: true, nv1: 52.00 }
    },
    note: 'Điểm chuẩn ghi nhận từ 50-60 điểm. Tiêu đề file ghi Thang 50. Chưa xác định công thức thang điểm chuẩn hóa trong dữ liệu nguồn.'
  }
];

// -------------------------------------------------------------
// 5. NGHỆ AN (Thang 30 - 1 trường theo file)
// -------------------------------------------------------------
const NGHEAN_SCHOOLS: BenchmarkSchool[] = [
  {
    id: 'na-1',
    school: 'THPT Huỳnh Thúc Kháng',
    shortName: 'Huỳnh Thúc Kháng',
    district: 'TP. Vinh',
    region: 'nghean',
    regionName: 'Nghệ An',
    scores: {
      '2023': { scale: 30, scaleDisplay: '30', nv1: 25.35 },
      '2024': { scale: 30, scaleDisplay: '30', nv1: 25.50 },
      '2025': { scale: 30, scaleDisplay: '30', nv1: 25.40 },
      '2026': { scale: 30, scaleDisplay: '30', nv1: 25.25 }
    }
  }
];

// -------------------------------------------------------------
// 6. THÁI NGUYÊN (Thang 50 - 1 trường theo file)
// -------------------------------------------------------------
const THAINGUYEN_SCHOOLS: BenchmarkSchool[] = [
  {
    id: 'tn-1',
    school: 'THPT Lương Ngọc Quyến',
    shortName: 'Lương Ngọc Quyến',
    region: 'thainguyen',
    regionName: 'Thái Nguyên',
    scores: {
      '2023': { scale: 50, scaleDisplay: '50', nv1: 38.50 },
      '2024': { scale: 50, scaleDisplay: '50', nv1: 38.75 },
      '2025': { scale: 50, scaleDisplay: '50', nv1: 38.50 },
      '2026': { scale: 50, scaleDisplay: '50', nv1: 38.25 }
    }
  }
];

// -------------------------------------------------------------
// DANH SÁCH KHU VỰC VÀ TẤT CẢ CÁC TRƯỜNG
// -------------------------------------------------------------
export const REGIONS_MAP: Record<Exclude<RegionId, 'all'>, RegionMeta> = {
  hcm: {
    id: 'hcm',
    name: 'TP. Hồ Chí Minh',
    shortName: 'TP.HCM',
    defaultScale: 30,
    scaleNote: 'Thang 30 (cả 3 môn Toán, Văn, Ngoại ngữ hệ số 1)',
    formula: 'Toán + Ngữ văn + Ngoại ngữ (hệ số 1) + Điểm ưu tiên',
    formulaNote: 'Thí sinh trúng tuyển NV1 không xét NV2, NV3. Điểm chuẩn NV2 cao hơn NV1 ít nhất 1.0; NV3 cao hơn NV2 ít nhất 1.0 điểm.',
    availableAspirations: ['nv1', 'nv2', 'nv3'],
    schools: HCM_SCHOOLS
  },
  hanoi: {
    id: 'hanoi',
    name: 'Hà Nội',
    shortName: 'Hà Nội',
    defaultScale: 30,
    scaleNote: '2023–2024: Thang 50 | 2025–2026: Thang 30',
    formula: '2023-2024: (Toán + Văn) × 2 + NN. Từ 2025: Toán + Văn + NN (hệ số 1)',
    formulaNote: 'Quy tắc xét tuyển: Điểm NV2 ≥ Điểm chuẩn NV1 + 1.0 điểm; Điểm NV3 ≥ Điểm chuẩn NV1 + 2.0 điểm.',
    availableAspirations: ['nv1', 'nv2', 'nv3'],
    hasScaleChange: true,
    scaleChangeNote: 'Hà Nội áp dụng Thang 50 cho các năm 2023 - 2024, sau đó chuyển sang Thang 30 (bỏ nhân đôi Văn, Toán) từ năm 2025 trở đi. Để so sánh xu hướng liên tục, hãy sử dụng chế độ "Điểm theo tỷ lệ thang điểm (%)".',
    schools: HANOI_SCHOOLS
  },
  haiphong: {
    id: 'haiphong',
    name: 'Hải Phòng',
    shortName: 'Hải Phòng',
    defaultScale: 50,
    scaleNote: 'Thang 50',
    formula: '(Toán + Ngữ văn) × 2 + Ngoại ngữ + Điểm ưu tiên',
    availableAspirations: ['nv1'],
    schools: HAIPHONG_SCHOOLS
  },
  danang: {
    id: 'danang',
    name: 'Đà Nẵng',
    shortName: 'Đà Nẵng',
    defaultScale: 50,
    scaleNote: 'Chưa xác định trong dữ liệu (File nguồn ghi nhận mức 50–60 điểm, tiêu đề Thang 50)',
    formula: 'Điểm trúng tuyển theo thông báo Sở GD&ĐT Đà Nẵng',
    formulaNote: 'Lưu ý: Dữ liệu điểm chuẩn các trường tại Đà Nẵng dao động từ 52.00 - 58.38 điểm. Do file nguồn ghi Thang 50 nhưng điểm thực tế vượt 50, hệ thống giữ trạng thái "Chưa xác định trong dữ liệu" cho tỷ lệ phần trăm theo yêu cầu.',
    availableAspirations: ['nv1'],
    schools: DANANG_SCHOOLS
  },
  nghean: {
    id: 'nghean',
    name: 'Nghệ An',
    shortName: 'Nghệ An',
    defaultScale: 30,
    scaleNote: 'Thang 30',
    formula: 'Toán + Ngữ văn + Ngoại ngữ (hệ số 1) + Điểm ưu tiên',
    availableAspirations: ['nv1'],
    schools: NGHEAN_SCHOOLS
  },
  thainguyen: {
    id: 'thainguyen',
    name: 'Thái Nguyên',
    shortName: 'Thái Nguyên',
    defaultScale: 50,
    scaleNote: 'Thang 50',
    formula: '(Toán + Ngữ văn) × 2 + Ngoại ngữ + Điểm ưu tiên',
    availableAspirations: ['nv1'],
    schools: THAINGUYEN_SCHOOLS
  }
};

export const REGIONS_LIST: RegionMeta[] = [
  REGIONS_MAP.hcm,
  REGIONS_MAP.hanoi,
  REGIONS_MAP.haiphong,
  REGIONS_MAP.danang,
  REGIONS_MAP.nghean,
  REGIONS_MAP.thainguyen
];

export const ALL_BENCHMARK_SCHOOLS: BenchmarkSchool[] = [
  ...HCM_SCHOOLS,
  ...HANOI_SCHOOLS,
  ...HAIPHONG_SCHOOLS,
  ...DANANG_SCHOOLS,
  ...NGHEAN_SCHOOLS,
  ...THAINGUYEN_SCHOOLS
];

// Helper to get school score for a specific year and aspiration
export function getSchoolScore(
  school: BenchmarkSchool,
  year: YearKey,
  aspiration: AspirationKey = 'nv1'
): { 
  score: number | null; 
  scale: number; 
  scaleDisplay: string;
  isUnspecifiedScale?: boolean;
} {
  const yrData = school.scores[year];
  if (!yrData) {
    return { score: null, scale: 30, scaleDisplay: 'Chưa có dữ liệu' };
  }

  let sc: number | null = null;
  if (aspiration === 'nv1') sc = yrData.nv1;
  else if (aspiration === 'nv2') sc = yrData.nv2 ?? null;
  else if (aspiration === 'nv3') sc = yrData.nv3 ?? null;

  return {
    score: sc,
    scale: yrData.scale,
    scaleDisplay: yrData.scaleDisplay,
    isUnspecifiedScale: yrData.isUnspecifiedScale
  };
}

// Calculate relative percentage: Score / Scale * 100
export function calculateRelativePercentage(
  score: number | null, 
  scale: number,
  isUnspecifiedScale?: boolean
): number | null {
  if (score === null || typeof score !== 'number' || isUnspecifiedScale || scale <= 0) {
    return null;
  }
  return Math.round((score / scale) * 10000) / 100;
}

// Data sources attribution
export const DATA_SOURCES = [
  {
    name: 'Cổng thông tin điện tử Chính phủ & Báo Điện tử Chính phủ',
    url: 'https://chinhphu.vn',
    description: 'Dữ liệu trích xuất chính thức từ chinhphu.vn, baochinhphu.vn, xaydungchinhsach.chinhphu.vn.'
  },
  {
    name: 'Cơ sở dữ liệu ngành Giáo dục & Đào tạo các tỉnh/thành phố',
    url: 'https://moet.gov.vn',
    description: 'Thông báo điểm chuẩn trúng tuyển vào lớp 10 THPT công lập của Sở GD&ĐT TP.HCM, Hà Nội, Hải Phòng, Đà Nẵng, Nghệ An, Thái Nguyên giai đoạn 2023 - 2026.'
  }
];
