import { db, storage } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  increment,
  deleteDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { ExamDocument } from '../types';

const COLLECTION_NAME = 'exam_documents';

/**
 * Tải file lên Firebase Storage và lưu metadata vào Firestore
 */
export async function uploadExamDocument(
  file: File,
  metadata: Omit<ExamDocument, 'id' | 'fileUrl' | 'fileName' | 'fileSize' | 'uploadedAt' | 'downloadsCount'>
): Promise<ExamDocument> {
  try {
    // 1. Upload file to Storage
    const storageRef = ref(storage, `exams/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const fileUrl = await getDownloadURL(storageRef);

    // 2. Save metadata to Firestore
    const docData = {
      ...metadata,
      fileUrl,
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: Date.now(),
      downloadsCount: 0,
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), docData);

    return {
      id: docRef.id,
      ...docData
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
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ExamDocument[];
  } catch (error) {
    console.error('Lỗi khi tải danh sách tài liệu:', error);
    return [];
  }
}

/**
 * Tăng lượt tải của một tài liệu
 */
export async function incrementDownloadCount(docId: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, docId);
    await updateDoc(docRef, {
      downloadsCount: increment(1)
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
    // 1. Delete from Storage
    const storageRef = ref(storage, fileUrl);
    await deleteObject(storageRef).catch(err => console.warn('Lỗi xoá file storage:', err));
    
    // 2. Delete from Firestore
    await deleteDoc(doc(db, COLLECTION_NAME, docId));
  } catch (error) {
    console.error('Lỗi khi xoá tài liệu:', error);
    throw error;
  }
}
