/**
 * Auth Service - Firebase Authentication
 * Thay thế hệ thống auth file JSON cũ bằng Firebase Auth SDK
 */
import { auth } from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth';

// ============================================================
// TYPES
// ============================================================

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar: string;
  authProvider: 'email' | 'google' | 'guest';
  photoURL?: string;
  birthYear?: number;
  currentSchool?: string;
  currentClass?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: AuthUser;
  error?: string;
  field?: string;
  message?: string;
}

// ============================================================
// LOCAL STORAGE CACHE (for offline fallback)
// ============================================================

const AUTH_TOKEN_KEY = 'cung_on_luyen_auth_token';
const AUTH_USER_KEY = 'cung_on_luyen_auth_user';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string): void {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch (err) {
    console.error('Không thể lưu auth token:', err);
  }
}

export function removeStoredToken(): void {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  } catch (err) {
    console.error('Không thể xóa auth token:', err);
  }
}

export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser): void {
  try {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Không thể lưu auth user:', err);
  }
}

// ============================================================
// HELPER: Convert Firebase User to AuthUser
// ============================================================

function firebaseUserToAuthUser(user: User, provider: 'email' | 'google' = 'email'): AuthUser {
  return {
    id: user.uid,
    email: user.email || '',
    name: user.displayName || user.email?.split('@')[0] || 'Học sinh',
    avatar: '🎓',
    authProvider: provider,
    photoURL: user.photoURL || undefined,
  };
}

// ============================================================
// EMAIL VALIDATION (giữ nguyên logic cũ)
// ============================================================

export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email || !email.trim()) {
    return { isValid: false, error: 'Email không được để trống.' };
  }

  const trimmed = email.trim();

  if (trimmed.includes(' ') || trimmed.includes('\t')) {
    return { isValid: false, error: 'Email không được chứa khoảng trắng.' };
  }

  if (trimmed.includes('..')) {
    return { isValid: false, error: 'Email không đúng định dạng.' };
  }

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: 'Email không đúng định dạng.' };
  }

  const parts = trimmed.split('@');
  if (parts.length !== 2) return { isValid: false, error: 'Email không đúng định dạng.' };

  const [local, domain] = parts;
  if (!local || !domain) return { isValid: false, error: 'Email không đúng định dạng.' };
  if (local.startsWith('.') || local.endsWith('.')) return { isValid: false, error: 'Email không đúng định dạng.' };

  const domainSubparts = domain.split('.');
  if (domainSubparts.length < 2) {
    return { isValid: false, error: 'Email không đúng định dạng.' };
  }

  const tld = domainSubparts[domainSubparts.length - 1];
  if (tld.length < 2) {
    return { isValid: false, error: 'Email không đúng định dạng.' };
  }

  return { isValid: true };
}

// ============================================================
// FIREBASE AUTH FUNCTIONS
// ============================================================

/**
 * Đăng nhập bằng Email & Mật khẩu (Firebase Auth)
 */
export async function loginWithEmail(email: string, password: string): Promise<AuthResponse> {
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    return { success: false, field: 'email', error: emailValidation.error || 'Email không đúng định dạng.' };
  }

  if (!password || !password.trim()) {
    return { success: false, field: 'password', error: 'Mật khẩu không được để trống.' };
  }

  try {
    const result = await signInWithEmailAndPassword(auth, email.trim(), password);
    const user = firebaseUserToAuthUser(result.user, 'email');
    const token = await result.user.getIdToken();

    setStoredToken(token);
    setStoredUser(user);

    return { success: true, token, user };
  } catch (err: any) {
    const code = err?.code || '';
    if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
      return { success: false, error: 'Email hoặc mật khẩu không chính xác.' };
    }
    if (code === 'auth/too-many-requests') {
      return { success: false, error: 'Đã bị tạm khóa do đăng nhập sai quá nhiều lần. Vui lòng thử lại sau.' };
    }
    if (code === 'auth/user-disabled') {
      return { success: false, error: 'Tài khoản này đã bị vô hiệu hóa.' };
    }
    console.error('Lỗi đăng nhập Firebase:', err);
    return { success: false, error: 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.' };
  }
}

/**
 * Đăng ký tài khoản mới (Firebase Auth)
 */
export async function registerWithEmail(
  name: string,
  email: string,
  password: string,
  extraProfile?: { birthYear?: number; currentSchool?: string; currentClass?: string }
): Promise<AuthResponse> {
  if (!name || !name.trim()) {
    return { success: false, field: 'name', error: 'Vui lòng nhập họ và tên.' };
  }

  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    return { success: false, field: 'email', error: emailValidation.error || 'Email không đúng định dạng.' };
  }

  if (!password || !password.trim()) {
    return { success: false, field: 'password', error: 'Mật khẩu không được để trống.' };
  }

  if (password.length < 6) {
    return { success: false, field: 'password', error: 'Mật khẩu phải có ít nhất 6 ký tự.' };
  }

  try {
    const result = await createUserWithEmailAndPassword(auth, email.trim(), password);

    // Cập nhật displayName
    await updateProfile(result.user, { displayName: name.trim() });

    const user = firebaseUserToAuthUser(result.user, 'email');
    user.name = name.trim(); // updateProfile chưa reflect ngay
    // Gắn thêm thông tin tuỳ chọn
    if (extraProfile?.birthYear) user.birthYear = extraProfile.birthYear;
    if (extraProfile?.currentSchool) user.currentSchool = extraProfile.currentSchool;
    if (extraProfile?.currentClass) user.currentClass = extraProfile.currentClass;

    const token = await result.user.getIdToken();

    setStoredToken(token);
    setStoredUser(user);

    return { success: true, token, user };
  } catch (err: any) {
    const code = err?.code || '';
    if (code === 'auth/email-already-in-use') {
      return { success: false, field: 'email', error: 'Tài khoản với email này đã tồn tại.' };
    }
    if (code === 'auth/weak-password') {
      return { success: false, field: 'password', error: 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn.' };
    }
    if (code === 'auth/invalid-email') {
      return { success: false, field: 'email', error: 'Email không hợp lệ.' };
    }
    console.error('Lỗi đăng ký Firebase:', err);
    return { success: false, error: 'Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.' };
  }
}

/**
 * Đăng nhập bằng Google
 */
export async function loginWithGoogle(): Promise<AuthResponse> {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = firebaseUserToAuthUser(result.user, 'google');
    const token = await result.user.getIdToken();

    setStoredToken(token);
    setStoredUser(user);

    return { success: true, token, user };
  } catch (err: any) {
    const code = err?.code || '';
    if (code === 'auth/popup-closed-by-user') {
      return { success: false, error: 'Đăng nhập Google đã bị hủy.' };
    }
    if (code === 'auth/popup-blocked') {
      return { success: false, error: 'Popup bị chặn. Vui lòng cho phép popup và thử lại.' };
    }
    console.error('Lỗi đăng nhập Google:', err);
    return { success: false, error: 'Không thể đăng nhập bằng Google. Vui lòng thử lại.' };
  }
}

/**
 * Kiểm tra phiên đăng nhập hiện tại
 */
export async function checkAuthSession(): Promise<{ isAuthenticated: boolean; user?: AuthUser }> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      unsubscribe();
      if (firebaseUser) {
        const provider = firebaseUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'email';
        const user = firebaseUserToAuthUser(firebaseUser, provider as 'email' | 'google');
        setStoredUser(user);
        resolve({ isAuthenticated: true, user });
      } else {
        // Check cached user as fallback
        const cachedUser = getStoredUser();
        if (cachedUser) {
          resolve({ isAuthenticated: true, user: cachedUser });
        } else {
          resolve({ isAuthenticated: false });
        }
      }
    });
  });
}

/**
 * Đăng xuất
 */
export async function logoutAuth(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Lỗi đăng xuất Firebase:', err);
  }
  removeStoredToken();
}

/**
 * Quên mật khẩu - Firebase gửi email đặt lại mật khẩu thật
 */
export async function requestForgotPassword(email: string): Promise<AuthResponse> {
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    return { success: false, field: 'email', error: emailValidation.error || 'Email không đúng định dạng.' };
  }

  try {
    await sendPasswordResetEmail(auth, email.trim());
    return {
      success: true,
      message: `Đã gửi email đặt lại mật khẩu đến ${email.trim()}. Vui lòng kiểm tra hộp thư (cả thư mục Spam).`
    };
  } catch (err: any) {
    const code = err?.code || '';
    if (code === 'auth/user-not-found') {
      // Trả về thành công để tránh brute-force thăm dò email
      return {
        success: true,
        message: `Nếu tài khoản tồn tại, email đặt lại mật khẩu đã được gửi đến ${email.trim()}.`
      };
    }
    if (code === 'auth/too-many-requests') {
      return { success: false, error: 'Đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.' };
    }
    console.error('Lỗi gửi email quên mật khẩu:', err);
    return { success: false, error: 'Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại sau.' };
  }
}

/**
 * Đặt lại mật khẩu - Không cần nữa vì Firebase gửi email với link đặt lại
 * Giữ lại stub để không break code cũ
 */
export async function resetPasswordWithCode(
  _email: string,
  _resetCode: string,
  _newPassword: string
): Promise<AuthResponse> {
  return {
    success: true,
    message: 'Vui lòng sử dụng liên kết trong email để đặt lại mật khẩu.'
  };
}

/**
 * Lắng nghe thay đổi trạng thái auth (dùng trong App.tsx)
 */
export function onAuthChange(callback: (user: AuthUser | null) => void): () => void {
  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      const provider = firebaseUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'email';
      const user = firebaseUserToAuthUser(firebaseUser, provider as 'email' | 'google');
      setStoredUser(user);
      callback(user);
    } else {
      removeStoredToken();
      callback(null);
    }
  });
}

/**
 * Lấy Firebase UID của user hiện tại
 */
export function getCurrentUserId(): string | null {
  return auth.currentUser?.uid || null;
}
