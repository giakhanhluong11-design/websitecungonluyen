/**
 * Firebase Storage Service - Upload/download avatar và file
 */
import { storage } from '../config/firebase';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

/**
 * Upload ảnh đại diện cho người dùng
 */
export async function uploadAvatar(userId: string, file: File): Promise<string> {
  try {
    const avatarRef = ref(storage, `avatars/${userId}/${file.name}`);
    const snapshot = await uploadBytes(avatarRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (err) {
    console.error('Lỗi upload avatar:', err);
    throw err;
  }
}

/**
 * Lấy URL ảnh đại diện
 */
export async function getAvatarUrl(userId: string, fileName: string): Promise<string | null> {
  try {
    const avatarRef = ref(storage, `avatars/${userId}/${fileName}`);
    return await getDownloadURL(avatarRef);
  } catch {
    return null;
  }
}

/**
 * Xóa ảnh đại diện
 */
export async function deleteAvatar(userId: string, fileName: string): Promise<void> {
  try {
    const avatarRef = ref(storage, `avatars/${userId}/${fileName}`);
    await deleteObject(avatarRef);
  } catch (err) {
    console.error('Lỗi xóa avatar:', err);
  }
}

/**
 * Upload file đính kèm chung
 */
export async function uploadFile(
  userId: string,
  path: string,
  file: File
): Promise<string> {
  try {
    const fileRef = ref(storage, `users/${userId}/${path}/${file.name}`);
    const snapshot = await uploadBytes(fileRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (err) {
    console.error('Lỗi upload file:', err);
    throw err;
  }
}
