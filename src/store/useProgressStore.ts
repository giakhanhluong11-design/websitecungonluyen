/**
 * useProgressStore — quản lý toàn bộ tiến độ học tập của người dùng.
 * Thay thế tất cả useState liên quan đến `progress` trong App.tsx.
 */
import { create } from "zustand";
import {
  getUserProgress,
  syncWithCloud,
  syncWithCloudAfterLogin,
  toggleTopicCompleted,
  completeTopic,
  TopicCompletionResult,
  updateTopicProgress,
  savePracticeAttempt,
  saveExamAttempt,
  toggleBookmarkExam,
  saveUserProfile,
  resetUserProgress,
  loginGoogleAccount,
  loginEmailAccount,
  logoutAuthAccount,
} from "../data/userStorage";
import { UserProgress, UserProfile, PracticeAttempt, ExamAttempt } from "../types";

interface ProgressStore {
  progress: UserProgress;
  streakCelebration: { show: boolean; streakDays: number } | null;
  setStreakCelebration: (data: { show: boolean; streakDays: number } | null) => void;

  // Auth
  handleLoginEmail: (
    email: string,
    name?: string,
    extraProfile?: { birthYear?: number; currentSchool?: string; currentClass?: string },
    rememberLogin?: boolean
  ) => void;
  handleSyncCloud: (userId: string) => Promise<void>;
  handleSyncCloudAfterLogin: (userId: string, email: string) => Promise<void>;
  handleLogout: () => void;
  handleLoginGoogle: (email: string, displayName?: string, rememberLogin?: boolean) => void;

  // Progress mutations
  handleToggleTopicComplete: (topicId: string) => void;
  handleCompleteTopic: (topicId: string) => TopicCompletionResult;
  handleSavePractice: (attempt: PracticeAttempt) => void;
  handleSaveExam: (attempt: ExamAttempt) => void;
  handleToggleBookmark: (examId: string) => void;
  handleUpdateProfile: (newProfile: UserProfile) => void;
  handleResetProgress: () => void;
  handleUpdateTargetSchool: (schoolName: string, score: number) => void;
  handleUpdateProgress: (newProgress: UserProgress) => void;
  handleUpdateTopicProgress: (topicId: string, percent: number) => void;
}

export const useProgressStore = create<ProgressStore>((set, get) => ({
  progress: getUserProgress(),
  streakCelebration: null,

  setStreakCelebration: (data) => {
    set({ streakCelebration: data });
  },

  handleLoginEmail: (email, name, extraProfile, rememberLogin) => {
    const updated = loginEmailAccount(email, name, extraProfile, rememberLogin);
    set({ progress: updated });
  },

  handleSyncCloud: async (userId) => {
    try {
      const synced = await syncWithCloud(userId);
      set({ progress: synced });
    } catch (e) {
      console.warn("Sync cloud error:", e);
    }
  },

  handleSyncCloudAfterLogin: async (userId, email) => {
    try {
      const synced = await syncWithCloudAfterLogin(userId, email);
      set({ progress: synced });
    } catch (e) {
      console.warn("Sync cloud after login error:", e);
    }
  },

  handleLogout: () => {
    const blank = logoutAuthAccount();
    set({ progress: blank });
  },

  handleLoginGoogle: (email, displayName, rememberLogin) => {
    const updated = loginGoogleAccount(email, displayName, rememberLogin);
    set({ progress: updated });
  },

  handleToggleTopicComplete: (topicId) => {
    const updated = toggleTopicCompleted(topicId);
    set({ progress: updated });
  },

  handleCompleteTopic: (topicId) => {
    const result = completeTopic(topicId);
    set({ progress: result.updatedProgress });
    if (result.streakIncreased) {
      set({ streakCelebration: { show: true, streakDays: result.newStreak } });
    }
    return result;
  },

  handleSavePractice: (attempt) => {
    const updated = savePracticeAttempt(attempt);
    set({ progress: updated });
  },

  handleSaveExam: (attempt) => {
    const updated = saveExamAttempt(attempt);
    set({ progress: updated });
  },

  handleToggleBookmark: (examId) => {
    const updated = toggleBookmarkExam(examId);
    set({ progress: updated });
  },

  handleUpdateProfile: (newProfile) => {
    const updated = saveUserProfile(newProfile);
    set({ progress: updated });
  },

  handleResetProgress: () => {
    const fresh = resetUserProgress();
    set({ progress: fresh });
  },

  handleUpdateTargetSchool: (schoolName, score) => {
    const { progress } = get();
    const updated = saveUserProfile({
      ...progress.profile,
      targetSchool: schoolName,
      targetScore: score,
    });
    set({ progress: updated });
  },

  handleUpdateProgress: (newProgress) => {
    set({ progress: newProgress });
  },

  handleUpdateTopicProgress: (topicId, percent) => {
    const updated = updateTopicProgress(topicId, percent);
    set({ progress: updated });
    // Nếu đạt 100% thì trigger animation hoàn thành
    if (percent === 100 && !get().progress.completedTopicIds.includes(topicId)) {
      const result = completeTopic(topicId);
      set({ progress: result.updatedProgress });
      if (result.streakIncreased) {
        set({ streakCelebration: { show: true, streakDays: result.newStreak } });
      }
    }
  },
}));
