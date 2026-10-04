import { db, storage, auth } from '../config/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  setDoc,
  updateDoc,
  increment,
  deleteDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { ExamDocument } from '../types';

const COLLECTION_NAME = 'exam_documents';
const CHUNKS_SUBCOLLECTION = 'chunks';

/** Mỗi document Firestore tối đa 1 MiB -> mỗi mảnh 700 KB (base64 ~ 935 KB) */
const CHUNK_SIZE = 700 * 1024;
/** Giới hạn dung lượng file đề thi */
export const MAX_EXAM_FILE_SIZE = 25 * 1024 * 1024;

type UploadMetadata = Omit<
  ExamDocument,
  'id' | 'fileUrl' | 'fileName' | 'fileSize' | 'uploadedAt' | 'downloadsCount' | 'storageType' | 'chunkCount' | 'fileType' | 'ready'
>;

// ============================================================
// HELPERS
// ============================================================

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const step = 0x8000;
  for (let i = 0; i < bytes.length; i += step) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + step)));
  }
  return btoa(binary);
}

function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

/**
 * Cách 1: Upload lên Firebase Storage (cần Storage Rules cho phép).
 * Trả về null nếu Storage từ chối để chuyển sang cách 2.
 */
async function tryUploadToStorage(file: File): Promise<string | null> {
  if (!auth.currentUser) return null;
  try {
    const safeName = file.name.replace(/[^\w.\-]+/g, '_');
    const storageRef = ref(storage, `exams/${Date.now()}_${safeName}`);
    await uploadBytes(storageRef, file, { contentType: file.type || undefined });
    return await getDownloadURL(storageRef);
  } catch (err: any) {
    console.warn('Firebase Storage không cho phép upload, chuyển sang lưu trong Firestore:', err?.code || err);
    return null;
  }
}

/**
 * Cách 2: Lưu nội dung file trực tiếp trong Firestore, chia thành nhiều mảnh
 * tại exam_documents/{docId}/chunks/{index}. Không phụ thuộc Storage Rules.
 */
async function uploadToFirestoreChunks(file: File, docData: Record<string, unknown>): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const chunkCount = Math.max(1, Math.ceil(bytes.length / CHUNK_SIZE));

  // Tạo document chính trước (ready=false để thư viện chưa hiển thị khi đang tải)
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...docData,
    fileUrl: '',
    storageType: 'firestore',
    chunkCount,
    ready: false,
  });

  try {
    for (let i = 0; i < chunkCount; i++) {
      const part = bytes.subarray(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
      await setDoc(doc(db, COLLECTION_NAME, docRef.id, CHUNKS_SUBCOLLECTION, String(i)), {
        index: i,
        data: bytesToBase64(part),
      });
    }
    await updateDoc(docRef, { ready: true });
    return docRef.id;
  } catch (err) {
    // Dọn dẹp nếu upload dở dang
    await deleteChunks(docRef.id).catch(() => {});
    await deleteDoc(docRef).catch(() => {});
    throw err;
  }
}

async function deleteChunks(docId: string): Promise<void> {
  const snap = await getDocs(collection(db, COLLECTION_NAME, docId, CHUNKS_SUBCOLLECTION));
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
}

// ============================================================
// PUBLIC API
// ============================================================

/**
 * Tải file đề thi lên: ưu tiên Firebase Storage, nếu bị từ chối thì
 * tự động lưu trực tiếp trong Firestore.
 */
export async function uploadExamDocument(file: File, metadata: UploadMetadata): Promise<ExamDocument> {
  try {
    if (file.size > MAX_EXAM_FILE_SIZE) {
      const e: any = new Error(`File quá lớn. Dung lượng tối đa là ${MAX_EXAM_FILE_SIZE / 1024 / 1024} MB.`);
      e.code = 'app/file-too-large';
      throw e;
    }

    const baseData = {
      ...metadata,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type || 'application/octet-stream',
      uploadedAt: Date.now(),
      downloadsCount: 0,
    };

    // Cách 1: Firebase Storage
    const fileUrl = await tryUploadToStorage(file);
    if (fileUrl) {
      const docData = { ...baseData, fileUrl, storageType: 'storage' as const, ready: true };
      const docRef = await addDoc(collection(db, COLLECTION_NAME), docData);
      return { id: docRef.id, ...docData } as ExamDocument;
    }

    // Cách 2: Firestore (chia mảnh)
    const id = await uploadToFirestoreChunks(file, baseData);
    return {
      id,
      ...baseData,
      fileUrl: '',
      storageType: 'firestore',
      chunkCount: Math.max(1, Math.ceil(file.size / CHUNK_SIZE)),
      ready: true,
    } as ExamDocument;
  } catch (error) {
    console.error('Lỗi khi upload tài liệu:', error);
    throw error;
  }
}

/**
 * Lấy danh sách tài liệu đề thi từ Firestore
 */
export async function getExamDocuments(): Promise<ExamDocument[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('uploadedAt', 'desc'));
    const snapshot = await getDocs(q);

    return (snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as ExamDocument[]).filter((d) => d.ready !== false);
  } catch (error) {
    console.error('Lỗi khi tải danh sách tài liệu:', error);
    return [];
  }
}

/**
 * Tải nội dung file về trình duyệt (hỗ trợ cả Storage và Firestore)
 */
export async function downloadExamDocument(examDoc: ExamDocument): Promise<void> {
  if (examDoc.storageType !== 'firestore' && examDoc.fileUrl) {
    window.open(examDoc.fileUrl, '_blank');
    return;
  }

  const snap = await getDocs(collection(db, COLLECTION_NAME, examDoc.id, CHUNKS_SUBCOLLECTION));
  const parts = snap.docs
    .map((d) => d.data() as { index: number; data: string })
    .sort((a, b) => a.index - b.index)
    .map((c) => base64ToBytes(c.data));

  if (parts.length === 0) {
    throw new Error('Không tìm thấy nội dung file.');
  }

  const blob = new Blob(parts as BlobPart[], { type: examDoc.fileType || 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = examDoc.fileName || 'de-thi';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

/**
 * Tăng lượt tải của một tài liệu
 */
export async function incrementDownloadCount(docId: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, docId);
    await updateDoc(docRef, {
      downloadsCount: increment(1),
    });
  } catch (error) {
    console.error('Lỗi khi tăng lượt tải:', error);
  }
}

/**
 * Xoá một tài liệu
 */
export async function deleteExamDocument(docId: string, fileUrl: string): Promise<void> {
  try {
    // 1. Delete file content
    if (fileUrl) {
      const storageRef = ref(storage, fileUrl);
      await deleteObject(storageRef).catch((err) => console.warn('Lỗi xoá file storage:', err));
    } else {
      await deleteChunks(docId).catch((err) => console.warn('Lỗi xoá nội dung file:', err));
    }

    // 2. Delete from Firestore
    await deleteDoc(doc(db, COLLECTION_NAME, docId));
  } catch (error) {
    console.error('Lỗi khi xoá tài liệu:', error);
    throw error;
  }
}

/**
 * Cập nhật thông tin của một tài liệu đề thi
 */
export async function updateExamDocumentInfo(docId: string, data: Partial<ExamDocument>): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, docId);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error('Lỗi khi cập nhật tài liệu:', error);
    throw error;
  }
}
