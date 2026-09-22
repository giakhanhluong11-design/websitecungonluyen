/**
 * useAppStore — quản lý UI state toàn cục: navigation, modals, toast.
 * Thay thế tất cả useState liên quan đến điều hướng và modal trong App.tsx.
 */
import { create } from "zustand";
import { SubjectId, Topic } from "../types";
import { ALL_TOPICS } from "../data/topicsData";
import { AuthModalMode } from "../components/AuthModal";

interface Toast {
  message: string;
  type: "success" | "info";
}

interface AppStore {
  // Navigation
  currentTab: string;
  activeSubject: SubjectId;
  selectedPracticeSubject: SubjectId;
  selectedPracticeTopicId: string;
  selectedKnowledgeTopic: Topic | null;

  // Modals
  showGoogleLoginModal: boolean;
  showAuthModal: boolean;
  authModalMode: AuthModalMode;
  showGeminiConfigModal: boolean;

  // Toast
  toast: Toast | null;

  // Navigation actions
  setCurrentTab: (tab: string) => void;
  setActiveSubject: (subject: SubjectId) => void;
  handleNavigate: (tab: string, subjectFilter?: string, topicId?: string) => void;
  handleReviewTopic: (topicId: string) => void;

  // Modal actions
  openAuthModal: (mode?: AuthModalMode) => void;
  closeAuthModal: () => void;
  openGoogleLoginModal: () => void;
  closeGoogleLoginModal: () => void;
  openGeminiConfig: () => void;
  closeGeminiConfig: () => void;

  // Toast actions
  showToast: (message: string, type: "success" | "info") => void;
  clearToast: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  currentTab: "home",
  activeSubject: "toan",
  selectedPracticeSubject: "toan",
  selectedPracticeTopicId: "",
  selectedKnowledgeTopic: null,

  showGoogleLoginModal: false,
  showAuthModal: false,
  authModalMode: "login",
  showGeminiConfigModal: false,

  toast: null,

  setCurrentTab: (tab) => {
    set({ currentTab: tab });
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  setActiveSubject: (subject) => set({ activeSubject: subject }),

  handleNavigate: (tab, subjectFilter, topicId) => {
    set((state) => {
      const next: Partial<AppStore> = { currentTab: tab };
      if (subjectFilter) {
        next.activeSubject = subjectFilter as SubjectId;
        next.selectedPracticeSubject = subjectFilter as SubjectId;
      }
      if (topicId) {
        next.selectedPracticeTopicId = topicId;
        const matched = ALL_TOPICS.find((t) => t.id === topicId);
        if (matched) next.selectedKnowledgeTopic = matched;
      }
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  handleReviewTopic: (topicId) => {
    const topic = ALL_TOPICS.find((t) => t.id === topicId);
    if (topic) {
      set({
        activeSubject: topic.subjectId,
        selectedKnowledgeTopic: topic,
        currentTab: "knowledge",
      });
    } else {
      set({ currentTab: "knowledge" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  openAuthModal: (mode = "login") =>
    set({ authModalMode: mode, showAuthModal: true }),
  closeAuthModal: () => set({ showAuthModal: false }),

  openGoogleLoginModal: () => set({ showGoogleLoginModal: true }),
  closeGoogleLoginModal: () => set({ showGoogleLoginModal: false }),

  openGeminiConfig: () => set({ showGeminiConfigModal: true }),
  closeGeminiConfig: () => set({ showGeminiConfigModal: false }),

  showToast: (message, type) => set({ toast: { message, type } }),
  clearToast: () => set({ toast: null }),
}));
