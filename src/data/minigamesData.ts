import { SubjectId } from '../types';

export interface MinigameDefinition {
  id: string;
  title: string;
  shortTitle: string;
  subject: SubjectId;
  gameType: 'mathy-bird' | 'arcade' | 'quiz';
  description: string;
  status: 'active' | 'coming_soon';
  badge?: string;
  difficulty?: 'Dễ' | 'Trung bình' | 'Thử thách';
  tags?: string[];
  features?: string[];
  bannerGradient?: string;
}

export const ALL_MINIGAMES: MinigameDefinition[] = [
  {
    id: 'mathy-bird',
    title: 'Mathy Bird – Chim Bay Giải Toán',
    shortTitle: 'Mathy Bird',
    subject: 'toan',
    gameType: 'mathy-bird',
    status: 'active',
    badge: 'Tựa game hot nhất',
    difficulty: 'Thử thách',
    description: 'Kết hợp phản xạ Flappy Bird và giải toán siêu tốc! Điều khiển chú chim bay qua cánh cổng mang đáp án chính xác để ghi điểm.',
    tags: ['Toán 9', 'Phản xạ nhanh', 'Tính nhẩm', 'Flappy Bird'],
    features: [
      'Phép cộng, trừ không âm trong phạm vi 100',
      'Bảng nhân 1 chữ số & nhân bội 10/15/25',
      'Độ khó và tốc độ bay tăng dần theo điểm số',
      'Hiệu ứng âm thanh và đồ họa vector Canvas sắc nét'
    ],
    bannerGradient: 'from-amber-500 via-orange-500 to-rose-500'
  },
  {
    id: 'van-arena-10',
    title: 'Đấu Trường Văn Học Lớp 10',
    shortTitle: 'Đấu Trường Văn Học',
    subject: 'van',
    gameType: 'arcade',
    status: 'coming_soon',
    badge: 'Sắp ra mắt',
    difficulty: 'Trung bình',
    description: 'Chinh phục các câu đố văn học, tác phẩm trọng tâm, biện pháp nghệ thuật và câu thơ kinh điển bằng cơ chế chém chữ siêu tốc.',
    tags: ['Ngữ văn 9', 'Tác phẩm', 'Nghệ thuật'],
    features: ['Bộ câu hỏi theo chương trình GDPT mới', 'Cơ chế vượt ải phong cách arcade'],
    bannerGradient: 'from-purple-500 via-pink-500 to-rose-400'
  },
  {
    id: 'english-ninja-word',
    title: 'Ninja Từ Vựng Tiếng Anh 9',
    shortTitle: 'Ninja Từ Vựng',
    subject: 'anh',
    gameType: 'arcade',
    status: 'coming_soon',
    badge: 'Sắp ra mắt',
    difficulty: 'Trung bình',
    description: 'Né bẫy ngữ pháp, chém trúng từ đồng nghĩa, trái nghĩa và giới từ đi kèm để đạt combo điểm kỷ lục.',
    tags: ['Tiếng Anh 9', 'Từ vựng', 'Collocations'],
    features: ['Hơn 500 từ vựng cốt lõi thi vào 10', 'Âm thanh chuẩn quốc tế'],
    bannerGradient: 'from-emerald-500 via-teal-500 to-cyan-500'
  }
];

export interface LeaderboardItem {
  id: string;
  rank: number;
  playerName: string;
  subject: SubjectId;
  subjectLabel: string;
  gameTitle: string;
  score: number;
  isCurrentUser?: boolean;
}

export const INITIAL_PEER_LEADERBOARD: LeaderboardItem[] = [
  { id: 'lb-1', rank: 1, playerName: 'Lê Minh Khôi (9A2)', subject: 'toan', subjectLabel: 'Toán', gameTitle: 'Mathy Bird', score: 32 },
  { id: 'lb-2', rank: 2, playerName: 'Trần Thảo Vy (9B)', subject: 'toan', subjectLabel: 'Toán', gameTitle: 'Mathy Bird', score: 28 },
  { id: 'lb-3', rank: 3, playerName: 'Phạm Đức Anh (9C)', subject: 'toan', subjectLabel: 'Toán', gameTitle: 'Mathy Bird', score: 25 },
  { id: 'lb-4', rank: 4, playerName: 'Đỗ Quỳnh Anh (9A1)', subject: 'toan', subjectLabel: 'Toán', gameTitle: 'Mathy Bird', score: 21 },
  { id: 'lb-5', rank: 5, playerName: 'Vũ Gia Bảo (9A4)', subject: 'toan', subjectLabel: 'Toán', gameTitle: 'Mathy Bird', score: 18 },
  { id: 'lb-6', rank: 6, playerName: 'Nguyễn Bích Ngọc (9E)', subject: 'toan', subjectLabel: 'Toán', gameTitle: 'Mathy Bird', score: 15 },
  { id: 'lb-7', rank: 7, playerName: 'Hoàng Quốc Việt (9B3)', subject: 'toan', subjectLabel: 'Toán', gameTitle: 'Mathy Bird', score: 12 },
  { id: 'lb-8', rank: 8, playerName: 'Mai Phương Chi (9A1)', subject: 'toan', subjectLabel: 'Toán', gameTitle: 'Mathy Bird', score: 9 }
];
