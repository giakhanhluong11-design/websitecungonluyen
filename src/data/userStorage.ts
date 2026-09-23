import { UserProgress, PracticeAttempt, ExamAttempt, UserProfile, MinigameResult } from '../types';
import { getCompetencyByScore, roundToOneDecimal } from '../services/competencyService';
import {
  saveProgressToFirestore,
  savePracticeAttemptToFirestore,
  saveExamAttemptToFirestore,
  saveMinigameResultToFirestore,
  syncProgressWithFirestore,
  saveProfileToFirestore,
} from '../services/firestoreService';
import { getCurrentUserId } from '../services/authService';

const STORAGE_KEY = 'cung_on_luyen_progress_v3';
const ACCOUNT_VAULT_PREFIX = 'cung_on_luyen_acc_vault_';
export const REMEMBER_LOGIN_KEY = 'cung_on_luyen_remember_login';

export function isRememberLoginEnabled(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(REMEMBER_LOGIN_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setRememberLoginEnabled(enabled: boolean): void {
  try {
    if (typeof window === 'undefined') return;
    if (enabled) {
      localStorage.setItem(REMEMBER_LOGIN_KEY, 'true');
    } else {
      localStorage.removeItem(REMEMBER_LOGIN_KEY);
    }
  } catch (err) {
    console.error('Failed to set remember login:', err);
  }
}

// Không còn INITIAL_USER_PROFILE riêng — mọi user mới đều bắt đầu với BLANK_GUEST_PROFILE
export const INITIAL_USER_PROGRESS: UserProgress = {
  profile: {
    name: '',
    avatar: '🎓',
    email: '',
    isGoogleLinked: false,
    targetSchool: '',
    targetScore: 21.0,
    targetScores: {
      toan: 7.0,
      van: 7.0,
      anh: 7.0
    },
    nv2School: '',
    nv3School: '',
    currentSchool: '',
    currentClass: '',
    city: 'TP. Hồ Chí Minh'
  },
  completedTopicIds: [],
  bookmarkedExamIds: [],
  practiceAttempts: [],
  examAttempts: [],
  studyTimeMinutes: 0,
  streakDays: 0,
  minigameResults: [],
  minigameBestScores: {}
};

export const BLANK_GUEST_PROFILE: UserProfile = {
  name: 'Khách (Chưa đăng nhập)',
  avatar: '👤',
  email: '',
  isGoogleLinked: false,
  googleAccountId: undefined,
  googleDisplayName: undefined,
  targetSchool: 'Chưa chọn trường mục tiêu',
  targetScore: 21.0,
  targetScores: {
    toan: 7.0,
    van: 7.0,
    anh: 7.0
  },
  nv2School: '',
  nv3School: '',
  currentSchool: 'THCS tại TP.HCM',
  currentClass: '9A',
  city: 'TP. Hồ Chí Minh'
};

export const BLANK_GUEST_PROGRESS: UserProgress = {
  profile: BLANK_GUEST_PROFILE,
  completedTopicIds: [],
  bookmarkedExamIds: [],
  practiceAttempts: [],
  examAttempts: [],
  studyTimeMinutes: 0,
  streakDays: 0,
  minigameResults: [],
  minigameBestScores: {}
};

export function getAccountKey(email: string): string {
  return `${ACCOUNT_VAULT_PREFIX}${email.trim().toLowerCase()}`;
}

export function saveToAccountVault(email: string, progress: UserProgress): void {
  try {
    if (!email || !email.trim()) return;
    localStorage.setItem(getAccountKey(email), JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save to account vault', err);
  }
}

export function loadFromAccountVault(email: string): UserProgress | null {
  try {
    if (!email || !email.trim()) return null;
    const raw = localStorage.getItem(getAccountKey(email));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load from account vault', err);
    return null;
  }
}

export function loadUserProgress(): UserProgress {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cung_on_luyen_progress_v1');
      localStorage.removeItem('cung_on_luyen_progress_v2');
    }

    const rememberLogin = isRememberLoginEnabled();
    const sessionActive = typeof window !== 'undefined' && sessionStorage.getItem('cung_on_luyen_session_active') === 'true';

    // Khi vào web, mặc định tài khoản là Khách trừ khi người dùng đã nhấn Lưu đăng nhập
    if (!rememberLogin && !sessionActive) {
      return { ...BLANK_GUEST_PROGRESS };
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...BLANK_GUEST_PROGRESS };
    }

    const parsed = JSON.parse(raw);
    return {
      ...parsed,
      minigameResults: parsed.minigameResults || [],
      minigameBestScores: parsed.minigameBestScores || {},
      profile: {
        ...(parsed.profile || {})
      }
    };
  } catch {
    return { ...BLANK_GUEST_PROGRESS };
  }
}

export const getUserProgress = loadUserProgress;

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    if (progress.profile?.isGoogleLinked && progress.profile?.email) {
      saveToAccountVault(progress.profile.email, progress);
    }
  } catch (err) {
    console.error('Failed to save progress to localStorage', err);
  }

  const uid = getCurrentUserId();
  if (uid) {
    saveProgressToFirestore(uid, progress).catch((err) => {
      console.warn('Background sync progress to Firestore failed:', err);
    });
  }
}

export async function syncWithCloud(userId: string): Promise<UserProgress> {
  try {
    const local = loadUserProgress();
    const synced = await syncProgressWithFirestore(userId, local);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(synced));
      if (synced.profile?.email) {
        saveToAccountVault(synced.profile.email, synced);
      }
    } catch {}
    return synced;
  } catch (err) {
    console.error('Lỗi đồng bộ đám mây:', err);
    return loadUserProgress();
  }
}

export function logoutGoogleAccount(): UserProgress {
  const current = loadUserProgress();
  if (current.profile?.email && current.profile?.isGoogleLinked) {
    saveToAccountVault(current.profile.email, current);
  }

  setRememberLoginEnabled(false);
  try {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('cung_on_luyen_session_active');
    }
  } catch {}
  
  const blankState: UserProgress = {
    ...BLANK_GUEST_PROGRESS,
    completedTopicIds: [],
    bookmarkedExamIds: [],
    practiceAttempts: [],
    examAttempts: [],
    studyTimeMinutes: 0,
    streakDays: 0,
    profile: {
      ...BLANK_GUEST_PROFILE
    }
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blankState));
  } catch {}

  return blankState;
}

export function loginGoogleAccount(email: string, displayName?: string, rememberLogin?: boolean): UserProgress {
  if (rememberLogin !== undefined) {
    setRememberLoginEnabled(rememberLogin);
  }
  try {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('cung_on_luyen_session_active', 'true');
    }
  } catch {}

  const normalizedEmail = email.trim().toLowerCase();
  const existingVault = loadFromAccountVault(normalizedEmail);

  let restored: UserProgress;

  if (existingVault) {
    // User đã có dữ liệu trước đó — khôi phục và cập nhật thông tin Google
    restored = {
      ...existingVault,
      profile: {
        ...existingVault.profile,
        email: email.trim(),
        name: displayName?.trim() || existingVault.profile.name || email.split('@')[0],
        isAuthenticated: true,
        authProvider: 'google',
        isGoogleLinked: true,
        googleAccountId: email.trim(),
        googleDisplayName: displayName?.trim() || existingVault.profile.googleDisplayName || existingVault.profile.name,
        linkedAt: existingVault.profile.linkedAt || new Date().toLocaleDateString('vi-VN')
      }
    };
  } else {
    // User mới đăng nhập Google lần đầu — profile trắng
    const profile: UserProfile = {
      name: displayName?.trim() || email.split('@')[0],
      avatar: '🎓',
      email: email.trim(),
      isAuthenticated: true,
      authProvider: 'google',
      isGoogleLinked: true,
      googleAccountId: email.trim(),
      googleDisplayName: displayName?.trim() || email.split('@')[0],
      linkedAt: new Date().toLocaleDateString('vi-VN'),
      targetSchool: '',
      targetScore: 21.0,
      targetScores: {
        toan: 7.0,
        van: 7.0,
        anh: 7.0
      },
      nv2School: '',
      nv3School: '',
      currentSchool: '',
      currentClass: '',
      city: 'TP. Hồ Chí Minh'
    };

    restored = {
      profile,
      completedTopicIds: [],
      bookmarkedExamIds: [],
      practiceAttempts: [],
      examAttempts: [],
      studyTimeMinutes: 0,
      streakDays: 0,
      minigameResults: [],
      minigameBestScores: {}
    };
  }

  saveUserProgress(restored);
  return restored;
}

export function loginEmailAccount(
  email: string,
  displayName?: string,
  extraProfile?: { birthYear?: number; currentSchool?: string; currentClass?: string },
  rememberLogin?: boolean
): UserProgress {
  if (rememberLogin !== undefined) {
    setRememberLoginEnabled(rememberLogin);
  }
  try {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('cung_on_luyen_session_active', 'true');
    }
  } catch {}

  const normalizedEmail = email.trim().toLowerCase();
  const existingVault = loadFromAccountVault(normalizedEmail);

  let restored: UserProgress;

  if (existingVault) {
    // User đã có dữ liệu — khôi phục và cập nhật tên/thông tin mới nhất
    restored = {
      ...existingVault,
      profile: {
        ...existingVault.profile,
        email: email.trim(),
        name: displayName?.trim() || existingVault.profile.name || email.split('@')[0],
        isAuthenticated: true,
        authProvider: 'email',
        loginAt: new Date().toISOString()
      }
    };
  } else {
    // User mới — tạo profile trắng với thông tin từ đăng ký
    const profile: UserProfile = {
      name: displayName?.trim() || email.split('@')[0],
      avatar: '🎓',
      email: email.trim(),
      isAuthenticated: true,
      authProvider: 'email',
      loginAt: new Date().toISOString(),
      isGoogleLinked: false,
      birthYear: extraProfile?.birthYear,
      currentSchool: extraProfile?.currentSchool || '',
      currentClass: extraProfile?.currentClass || '',
      targetSchool: '',
      targetScore: 21.0,
      targetScores: {
        toan: 7.0,
        van: 7.0,
        anh: 7.0
      },
      nv2School: '',
      nv3School: '',
      city: 'TP. Hồ Chí Minh'
    };

    restored = {
      profile,
      completedTopicIds: [],
      bookmarkedExamIds: [],
      practiceAttempts: [],
      examAttempts: [],
      studyTimeMinutes: 0,
      streakDays: 0,
      minigameResults: [],
      minigameBestScores: {}
    };
  }

  saveUserProgress(restored);
  return restored;
}

export function logoutAuthAccount(): UserProgress {
  const current = loadUserProgress();
  if (current.profile?.email) {
    saveToAccountVault(current.profile.email, current);
  }

  setRememberLoginEnabled(false);
  try {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('cung_on_luyen_session_active');
    }
  } catch {}

  const blankState: UserProgress = {
    ...BLANK_GUEST_PROGRESS,
    completedTopicIds: [],
    bookmarkedExamIds: [],
    practiceAttempts: [],
    examAttempts: [],
    studyTimeMinutes: 0,
    streakDays: 0,
    profile: {
      ...BLANK_GUEST_PROFILE,
      isAuthenticated: false,
      authProvider: 'guest'
    }
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blankState));
  } catch {}

  return blankState;
}

export function linkGoogleAccount(email: string, displayName?: string): UserProgress {
  return loginGoogleAccount(email, displayName);
}

export function unlinkGoogleAccount(): UserProgress {
  return logoutGoogleAccount();
}

export function toggleTopicCompleted(topicId: string): UserProgress {
  const current = loadUserProgress();
  const exists = current.completedTopicIds.includes(topicId);
  const updatedIds = exists
    ? current.completedTopicIds.filter(id => id !== topicId)
    : [...current.completedTopicIds, topicId];

  const updated: UserProgress = {
    ...current,
    completedTopicIds: updatedIds
  };
  saveUserProgress(updated);
  return updated;
}

export function savePracticeAttempt(attempt: PracticeAttempt): UserProgress {
  const current = loadUserProgress();
  const studyMins = Math.max(1, Math.round(attempt.durationSpentSeconds / 60));
  const cleanScore = roundToOneDecimal(attempt.score);
  const accuracy = typeof attempt.accuracy === 'number'
    ? attempt.accuracy
    : Math.round((attempt.correctCount / Math.max(1, attempt.totalQuestions)) * 100);
  const competency = getCompetencyByScore(cleanScore);

  const enriched: PracticeAttempt = {
    ...attempt,
    score: cleanScore,
    accuracy,
    competencyLevel: attempt.competencyLevel || competency.label,
    completedAt: attempt.completedAt || new Date().toISOString(),
    userId: attempt.userId || current.profile?.email || 'student'
  };

  const updated: UserProgress = {
    ...current,
    studyTimeMinutes: (current.studyTimeMinutes || 0) + studyMins,
    practiceAttempts: [enriched, ...current.practiceAttempts]
  };
  saveUserProgress(updated);

  const uid = getCurrentUserId();
  if (uid) {
    savePracticeAttemptToFirestore(uid, enriched).catch((err) => {
      console.warn('Save practice attempt to Firestore error:', err);
    });
  }

  return updated;
}

export function saveExamAttempt(attempt: ExamAttempt): UserProgress {
  const current = loadUserProgress();
  const studyMins = Math.max(1, Math.round(attempt.durationSpentSeconds / 60));
  const cleanScore = roundToOneDecimal(attempt.score);
  const accuracy = typeof attempt.accuracy === 'number'
    ? attempt.accuracy
    : Math.round((attempt.correctCount / Math.max(1, attempt.totalQuestions)) * 100);
  const competency = getCompetencyByScore(cleanScore);

  const enriched: ExamAttempt = {
    ...attempt,
    score: cleanScore,
    accuracy,
    competencyLevel: attempt.competencyLevel || competency.label,
    completedAt: attempt.completedAt || new Date().toISOString(),
    userId: attempt.userId || current.profile?.email || 'student'
  };

  const updated: UserProgress = {
    ...current,
    studyTimeMinutes: (current.studyTimeMinutes || 0) + studyMins,
    examAttempts: [enriched, ...current.examAttempts]
  };
  saveUserProgress(updated);

  const uid = getCurrentUserId();
  if (uid) {
    saveExamAttemptToFirestore(uid, enriched).catch((err) => {
      console.warn('Save exam attempt to Firestore error:', err);
    });
  }

  return updated;
}

export function toggleBookmarkExam(examId: string): UserProgress {
  const current = loadUserProgress();
  const exists = current.bookmarkedExamIds.includes(examId);
  const updatedIds = exists
    ? current.bookmarkedExamIds.filter(id => id !== examId)
    : [...current.bookmarkedExamIds, examId];

  const updated: UserProgress = {
    ...current,
    bookmarkedExamIds: updatedIds
  };
  saveUserProgress(updated);
  return updated;
}

export function saveUserProfile(profile: UserProfile): UserProgress {
  const current = loadUserProgress();
  const updated: UserProgress = {
    ...current,
    profile
  };
  saveUserProgress(updated);

  const uid = getCurrentUserId();
  if (uid) {
    saveProfileToFirestore(uid, profile).catch((err) => {
      console.warn('Save profile to Firestore error:', err);
    });
  }

  return updated;
}

export function resetUserProgress(): UserProgress {
  const current = loadUserProgress();
  const emptyProgress: UserProgress = {
    ...current,
    completedTopicIds: [],
    bookmarkedExamIds: [],
    practiceAttempts: [],
    examAttempts: [],
    studyTimeMinutes: 0,
    streakDays: 0,
    minigameResults: [],
    minigameBestScores: {}
  };
  saveUserProgress(emptyProgress);
  return emptyProgress;
}

export function saveMinigameResult(result: MinigameResult): { progress: UserProgress; isNewBest: boolean } {
  const current = loadUserProgress();
  const previousBest = current.minigameBestScores?.[result.gameId] || 0;
  const isNewBest = result.score > previousBest;
  
  const updatedBestScores = {
    ...(current.minigameBestScores || {}),
    [result.gameId]: Math.max(previousBest, result.score)
  };

  const updatedResults = [result, ...(current.minigameResults || [])];

  const updated: UserProgress = {
    ...current,
    studyTimeMinutes: (current.studyTimeMinutes || 0) + Math.max(1, Math.round(result.timeSeconds / 60)),
    minigameResults: updatedResults,
    minigameBestScores: updatedBestScores
  };

  saveUserProgress(updated);

  const uid = getCurrentUserId();
  if (uid) {
    saveMinigameResultToFirestore(uid, result).catch((err) => {
      console.warn('Save minigame result to Firestore error:', err);
    });
  }

  return { progress: updated, isNewBest };
}

export function getMinigameBestScore(gameId: string): number {
  const current = loadUserProgress();
  return current.minigameBestScores?.[gameId] || 0;
}
