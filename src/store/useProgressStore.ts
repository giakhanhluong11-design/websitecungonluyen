/**
 * useProgressStore — quản lý toàn bộ tiến độ học tập của người dùng.
 * Thay thế tất cả useState liên quan đến `progress` trong App.tsx.
 */
import { create } from "zustand";
import {
  getUserProgress,
  syncWithCloud,
  toggleTopicCompleted,
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

  // Auth
  handleLoginEmail: (
    email: string,
    name?: string,
    extraProfile?: { birthYear?: number; currentSchool?: string; currentClass?: string },
    rememberLogin?: boolean
  ) => void;
  handleSyncCloud: (userId: string) => Promise<void>;
  handleLogout: () => void;
  handleLoginGoogle: (email: string, displayName?: string, rememberLogin?: boolean) => void;

  // Progress mutations
  handleToggleTopicComplete: (topicId: string) => void;
  handleSavePractice: (attempt: PracticeAttempt) => void;
  handleSaveExam: (attempt: ExamAttempt) => void;
  handleToggleBookmark: (examId: string) => void;
  handleUpdateProfile: (newProfile: UserProfile) => void;
  handleResetProgress: () => void;
  handleUpdateTargetSchool: (schoolName: string, score: number) => void;
}

export const useProgressStore = create<ProgressStore>((set, get) => ({
  progress: getUserProgress(),

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
}));
