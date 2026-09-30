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
    id: 'ai-la-nha-van',
    title: 'Ai là nhà văn? - Đấu Trí Văn Học',
    shortTitle: 'Ai là nhà văn?',
    subject: 'van',
    gameType: 'quiz',
    status: 'active',
    badge: 'Mới ra mắt',
    difficulty: 'Trung bình',
    description: 'Chinh phục các câu đố văn học, tác phẩm, tác giả, ca dao tục ngữ bằng trí tuệ nhân tạo Gemini. 10 câu hỏi ngẫu nhiên mỗi lần chơi!',
    tags: ['Ngữ văn 9', 'Tác giả', 'Ca dao', 'AI Sinh đề'],
    features: ['10 câu hỏi trắc nghiệm', '15 giây/câu', 'Nội dung vô hạn từ AI Gemini'],
    bannerGradient: 'from-purple-500 via-pink-500 to-rose-400'
  },
  {
    id: 'english-fruit-ninja',
    title: 'British Fruit Ninja',
    shortTitle: 'Fruit Ninja',
    subject: 'anh',
    gameType: 'arcade',
    status: 'active',
    badge: 'Đình đám',
    difficulty: 'Thử thách',
    description: 'Slash your way to English mastery! Ôn tập từ vựng, ngữ pháp Tiếng Anh 9-10 qua trò chơi chém hoa quả cực cuốn.',
    tags: ['Tiếng Anh 9', 'Ngữ pháp', 'Phản xạ', 'Từ vựng'],
    features: ['Chém trái cây mang đáp án đúng', 'Chế độ Classic (Chém sai là thua)', 'Chế độ Practice (Xem lại đáp án sai)'],
    bannerGradient: 'from-red-500 via-orange-500 to-rose-500'
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

export const INITIAL_PEER_LEADERBOARD: LeaderboardItem[] = [];
