/**
 * Firestore Service - Lưu trữ dữ liệu học tập trên cloud
 * Cấu trúc: users/{userId}/progress, practiceAttempts, examAttempts, minigameResults
 */
import { db } from '../config/firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { UserProgress, UserProfile, PracticeAttempt, ExamAttempt, MinigameResult } from '../types';

// ============================================================
// USER PROGRESS (main document)
// ============================================================

/**
 * Lưu toàn bộ tiến độ học tập lên Firestore
 */
export async function saveProgressToFirestore(userId: string, progress: UserProgress): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      profile: progress.profile,
      completedTopicIds: progress.completedTopicIds || [],
      bookmarkedExamIds: progress.bookmarkedExamIds || [],
      studyTimeMinutes: progress.studyTimeMinutes || 0,
      streakDays: progress.streakDays || 0,
      minigameBestScores: progress.minigameBestScores || {},
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.error('Lỗi lưu tiến độ lên Firestore:', err);
  }
}

/**
 * Tải tiến độ học tập từ Firestore
 */
export async function loadProgressFromFirestore(userId: string): Promise<UserProgress | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return null;

    const data = snap.data();

    // Load practice attempts
    const practiceAttempts = await loadPracticeAttemptsFromFirestore(userId);
    // Load exam attempts
    const examAttempts = await loadExamAttemptsFromFirestore(userId);
    // Load minigame results
    const minigameResults = await loadMinigameResultsFromFirestore(userId);

    return {
      profile: data.profile as UserProfile,
      completedTopicIds: data.completedTopicIds || [],
      bookmarkedExamIds: data.bookmarkedExamIds || [],
      practiceAttempts,
      examAttempts,
      studyTimeMinutes: data.studyTimeMinutes || 0,
      streakDays: data.streakDays || 0,
      minigameResults,
      minigameBestScores: data.minigameBestScores || {},
    };
  } catch (err) {
    console.error('Lỗi tải tiến độ từ Firestore:', err);
    return null;
  }
}

// ============================================================
// PROFILE
// ============================================================

export async function saveProfileToFirestore(userId: string, profile: UserProfile): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, { profile, updatedAt: serverTimestamp() }, { merge: true });
  } catch (err) {
    console.error('Lỗi lưu profile lên Firestore:', err);
  }
}

// ============================================================
// PRACTICE ATTEMPTS (subcollection)
// ============================================================

export async function savePracticeAttemptToFirestore(userId: string, attempt: PracticeAttempt): Promise<void> {
  try {
    const attemptsRef = collection(db, 'users', userId, 'practiceAttempts');
    await addDoc(attemptsRef, {
      ...attempt,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('Lỗi lưu practice attempt lên Firestore:', err);
  }
}

async function loadPracticeAttemptsFromFirestore(userId: string): Promise<PracticeAttempt[]> {
  try {
    const attemptsRef = collection(db, 'users', userId, 'practiceAttempts');
    const q = query(attemptsRef, orderBy('createdAt', 'desc'), limit(100));
    const snap = await getDocs(q);
    return snap.docs.map(d => {
      const data = d.data();
      // Convert Timestamp to string if needed
      if (data.createdAt instanceof Timestamp) {
        data.createdAt = data.createdAt.toDate().toISOString();
      }
      return data as PracticeAttempt;
    });
  } catch (err) {
    console.error('Lỗi tải practice attempts từ Firestore:', err);
    return [];
  }
}

// ============================================================
// EXAM ATTEMPTS (subcollection)
// ============================================================

export async function saveExamAttemptToFirestore(userId: string, attempt: ExamAttempt): Promise<void> {
  try {
    const attemptsRef = collection(db, 'users', userId, 'examAttempts');
    await addDoc(attemptsRef, {
      ...attempt,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('Lỗi lưu exam attempt lên Firestore:', err);
  }
}

async function loadExamAttemptsFromFirestore(userId: string): Promise<ExamAttempt[]> {
  try {
    const attemptsRef = collection(db, 'users', userId, 'examAttempts');
    const q = query(attemptsRef, orderBy('createdAt', 'desc'), limit(100));
    const snap = await getDocs(q);
    return snap.docs.map(d => {
      const data = d.data();
      if (data.createdAt instanceof Timestamp) {
        data.createdAt = data.createdAt.toDate().toISOString();
      }
      return data as ExamAttempt;
    });
  } catch (err) {
    console.error('Lỗi tải exam attempts từ Firestore:', err);
    return [];
  }
}

// ============================================================
// MINIGAME RESULTS (subcollection)
// ============================================================

export async function saveMinigameResultToFirestore(userId: string, result: MinigameResult): Promise<void> {
  try {
    const resultsRef = collection(db, 'users', userId, 'minigameResults');
    await addDoc(resultsRef, {
      ...result,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('Lỗi lưu minigame result lên Firestore:', err);
  }
}

async function loadMinigameResultsFromFirestore(userId: string): Promise<MinigameResult[]> {
  try {
    const resultsRef = collection(db, 'users', userId, 'minigameResults');
    const q = query(resultsRef, orderBy('createdAt', 'desc'), limit(50));
    const snap = await getDocs(q);
    return snap.docs.map(d => {
      const data = d.data();
      if (data.createdAt instanceof Timestamp) {
        data.createdAt = data.createdAt.toDate().toISOString();
      }
      return data as MinigameResult;
    });
  } catch (err) {
    console.error('Lỗi tải minigame results từ Firestore:', err);
    return [];
  }
}

// ============================================================
// SYNC HELPERS
// ============================================================

/**
 * Đồng bộ dữ liệu: merge localStorage với Firestore
 * Ưu tiên Firestore nếu có dữ liệu
 */
export async function syncProgressWithFirestore(
  userId: string,
  localProgress: UserProgress
): Promise<UserProgress> {
  try {
    const cloudProgress = await loadProgressFromFirestore(userId);

    if (!cloudProgress) {
      // Lần đầu đăng nhập: đẩy dữ liệu local lên cloud
      await saveProgressToFirestore(userId, localProgress);
      return localProgress;
    }

    // Merge: ưu tiên cloud, nhưng giữ lại dữ liệu local nếu cloud rỗng
    const merged: UserProgress = {
      profile: cloudProgress.profile || localProgress.profile,
      completedTopicIds: cloudProgress.completedTopicIds.length > 0
        ? cloudProgress.completedTopicIds
        : localProgress.completedTopicIds,
      bookmarkedExamIds: cloudProgress.bookmarkedExamIds.length > 0
        ? cloudProgress.bookmarkedExamIds
        : localProgress.bookmarkedExamIds,
      practiceAttempts: cloudProgress.practiceAttempts.length > 0
        ? cloudProgress.practiceAttempts
        : localProgress.practiceAttempts,
      examAttempts: cloudProgress.examAttempts.length > 0
        ? cloudProgress.examAttempts
        : localProgress.examAttempts,
      studyTimeMinutes: Math.max(cloudProgress.studyTimeMinutes, localProgress.studyTimeMinutes),
      streakDays: Math.max(cloudProgress.streakDays, localProgress.streakDays),
      minigameResults: cloudProgress.minigameResults && cloudProgress.minigameResults.length > 0
        ? cloudProgress.minigameResults
        : localProgress.minigameResults,
      minigameBestScores: {
        ...(localProgress.minigameBestScores || {}),
        ...(cloudProgress.minigameBestScores || {}),
      },
    };

    return merged;
  } catch (err) {
    console.error('Lỗi đồng bộ dữ liệu:', err);
    return localProgress;
  }
}

/**
 * Cập nhật một field cụ thể trên Firestore
 */
export async function updateFieldOnFirestore(
  userId: string,
  field: string,
  value: unknown
): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { [field]: value, updatedAt: serverTimestamp() });
  } catch (err) {
    console.error(`Lỗi cập nhật ${field} trên Firestore:`, err);
  }
}
