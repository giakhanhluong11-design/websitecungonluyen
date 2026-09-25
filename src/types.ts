export type SubjectId = 'toan' | 'van' | 'anh';

export interface TopicExercise {
  id: string;
  level: 'de' | 'trung-binh' | 'kho';
  levelLabel: string;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
}

export interface TopicExample {
  title: string;
  problem: string;
  solution: string;
  tip?: string;
  examSubmission?: string;
}

export interface Topic {
  id: string;
  subjectId: SubjectId;
  category: string;
  categoryLabel: string;
  title: string;
  description: string;
  weightInExam: string; // e.g. "Chiếm 1.5 - 2.0 điểm (Bài 1, 2)"
  theorySummary: string;
  keyFormulas: string[];
  examples: TopicExample[];
  exercises: TopicExercise[];
  isTrending?: boolean;
  hcmFocus?: boolean; // TP.HCM specific focus
}

export interface ExamQuestion {
  id: string;
  number: number;
  text: string;
  points?: number;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  topicId: string;
  topicName: string;
  passage?: string; // for English or Literature reading passages
}

export type ExamType = 
  | 'tuyen-sinh-10' 
  | 'thi-thu' 
  | 'khao-sat' 
  | 'kiem-tra-hk' 
  | 'chuyen' 
  | 'chuyen-de';

export interface Exam {
  id: string;
  title: string;
  subjectId: SubjectId | 'tong-hop';
  year: number;
  province: string;
  schoolOrDept: string;
  examType: ExamType;
  examTypeLabel: string;
  difficulty: 'de' | 'trung-binh' | 'kho';
  durationMinutes: number;
  questionsCount: number;
  questions: ExamQuestion[];
  tags: string[];
  takesCount: number;
  hcmSpecific?: boolean;
}

export interface PracticeAttempt {
  id: string;
  title: string;
  subjectId: SubjectId;
  date: string;
  score: number; // out of 10
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  durationSpentSeconds: number;
  weakTopics: { topicId: string; topicName: string; wrongCount: number }[];
  answers: Record<string, string>;
  accuracy?: number; // % độ chính xác (e.g. 84)
  competencyLevel?: string; // Mức năng lực (e.g. "Khá–Giỏi")
  completedAt?: string;
  userId?: string;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  examTitle: string;
  subjectId: SubjectId | 'tong-hop';
  date: string;
  score: number; // out of 10
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  durationSpentSeconds: number;
  weakTopics: { topicId: string; topicName: string; wrongCount: number }[];
  answers: Record<string, string>;
  userNotes?: string;
  accuracy?: number; // % độ chính xác (e.g. 84)
  competencyLevel?: string; // Mức năng lực (e.g. "Khá–Giỏi")
  completedAt?: string;
  userId?: string;
}

export interface TargetSchool {
  id: string;
  name: string;
  district: string;
  cutoffScore2024: number;
  cutoffScore2023: number;
  tier: 'Top 1' | 'Top 2' | 'Top 3' | 'Chuyên';
}

export interface UserProfile {
  name: string;
  avatar: string;
  email: string;
  isAuthenticated?: boolean;
  authProvider?: 'email' | 'google' | 'guest';
  loginAt?: string;
  isGoogleLinked: boolean;
  googleAccountId?: string;
  googleDisplayName?: string;
  googlePhotoUrl?: string;
  linkedAt?: string;
  birthYear?: number;
  targetSchool: string;
  targetScore: number;
  targetScores: {
    toan: number;
    van: number;
    anh: number;
  };
  nv2School: string;
  nv3School: string;
  currentSchool: string;
  currentClass?: string;
  city: string;
}

export interface MinigameResult {
  id: string;
  player: string;
  subject: SubjectId;
  gameType: 'flashcard' | 'matching' | 'mathy-bird' | 'arcade';
  gameId: string;
  gameTitle: string;
  score: number;
  correct: number;
  total: number;
  bestCombo: number;
  timeSeconds: number;
  createdAt: string;
}

export interface UserProgress {
  profile: UserProfile;
  completedTopicIds: string[];
  bookmarkedExamIds: string[];
  practiceAttempts: PracticeAttempt[];
  examAttempts: ExamAttempt[];
  studyTimeMinutes: number;
  streakDays: number;
  minigameResults?: MinigameResult[];
  minigameBestScores?: Record<string, number>;
}
