import { db } from '../config/firebase';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { CommunityPost, CommunityComment, UserProfile, ConnectPost } from '../types';

const POSTS_COLLECTION = 'community_posts';

export async function createPost(post: Omit<CommunityPost, 'id' | 'createdAt'>): Promise<string> {
  const postsRef = collection(db, POSTS_COLLECTION);
  const newPostRef = await addDoc(postsRef, {
    ...post,
    createdAt: serverTimestamp(),
  });
  return newPostRef.id;
}

export async function fetchRecentPosts(maxLimit: number = 50): Promise<CommunityPost[]> {
  const postsRef = collection(db, POSTS_COLLECTION);
  const q = query(postsRef, orderBy('createdAt', 'desc'), limit(maxLimit));
  
  const snap = await getDocs(q);
  return snap.docs.map(docSnap => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate().toISOString() : new Date().toISOString(),
    } as CommunityPost;
  });
}

// Lắng nghe realtime để tự cập nhật UI
export function subscribeToPosts(callback: (posts: CommunityPost[]) => void, maxLimit: number = 50) {
  const postsRef = collection(db, POSTS_COLLECTION);
  const q = query(postsRef, orderBy('createdAt', 'desc'), limit(maxLimit));
  
  return onSnapshot(q, (snap) => {
    const posts = snap.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate().toISOString() : new Date().toISOString(),
      } as CommunityPost;
    });
    callback(posts);
  });
}

export async function toggleLikePost(postId: string, userId: string, isLiking: boolean): Promise<void> {
  const postRef = doc(db, POSTS_COLLECTION, postId);
  await updateDoc(postRef, {
    likesCount: increment(isLiking ? 1 : -1),
    likedBy: isLiking ? arrayUnion(userId) : arrayRemove(userId),
  });
}

export async function addComment(postId: string, comment: Omit<CommunityComment, 'id' | 'postId' | 'createdAt'>): Promise<string> {
  const commentsRef = collection(db, POSTS_COLLECTION, postId, 'comments');
  const newCommentRef = await addDoc(commentsRef, {
    ...comment,
    createdAt: serverTimestamp(),
  });
  
  const postRef = doc(db, POSTS_COLLECTION, postId);
  await updateDoc(postRef, {
    commentsCount: increment(1)
  });
  
  return newCommentRef.id;
}

export async function fetchComments(postId: string): Promise<CommunityComment[]> {
  const commentsRef = collection(db, POSTS_COLLECTION, postId, 'comments');
  const q = query(commentsRef, orderBy('createdAt', 'asc'));
  const snap = await getDocs(q);
  
  return snap.docs.map(docSnap => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      postId,
      ...data,
      createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate().toISOString() : new Date().toISOString(),
    } as CommunityComment;
  });
}

export function subscribeToComments(postId: string, callback: (comments: CommunityComment[]) => void) {
  const commentsRef = collection(db, POSTS_COLLECTION, postId, 'comments');
  const q = query(commentsRef, orderBy('createdAt', 'asc'));
  
  return onSnapshot(q, (snap) => {
    const comments = snap.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        postId,
        ...data,
        createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate().toISOString() : new Date().toISOString(),
      } as CommunityComment;
    });
    callback(comments);
  });
}

export async function deletePost(postId: string): Promise<void> {
  const postRef = doc(db, POSTS_COLLECTION, postId);
  await deleteDoc(postRef);
}

export async function deleteComment(postId: string, commentId: string): Promise<void> {
  const commentRef = doc(db, POSTS_COLLECTION, postId, 'comments', commentId);
  await deleteDoc(commentRef);
  const postRef = doc(db, POSTS_COLLECTION, postId);
  await updateDoc(postRef, {
    commentsCount: increment(-1)
  });
}

// ==============================
// MENTAL HEALTH (Robin feature)
// ==============================
export interface MentalHealthLog {
  id?: string;
  userId: string;
  userName: string;
  feeling: 'good' | 'bad';
  createdAt: any;
}

export async function addMentalHealthLog(userId: string, userName: string, feeling: 'good' | 'bad'): Promise<void> {
  const logsRef = collection(db, 'mental_health_logs');
  await addDoc(logsRef, {
    userId,
    userName,
    feeling,
    createdAt: serverTimestamp()
  });
}

export function subscribeToMentalHealthLogs(callback: (logs: MentalHealthLog[]) => void) {
  const logsRef = collection(db, 'mental_health_logs');
  const q = query(logsRef, orderBy('createdAt', 'desc'), limit(100));
  return onSnapshot(q, (snap) => {
    const logs = snap.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate().toISOString() : new Date().toISOString(),
      } as MentalHealthLog;
    });
    callback(logs);
  });
}

// ==============================
// USER PROFILES & FOLLOW SYSTEM
// ==============================

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const userRef = doc(db, 'users', userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return null;
  return snap.data().profile as UserProfile;
}

export async function toggleFollowUser(currentUserId: string, targetUserId: string, isFollowing: boolean): Promise<void> {
  // Update currentUser's following list
  const currentUserRef = doc(db, 'users', currentUserId);
  await updateDoc(currentUserRef, {
    'profile.following': isFollowing ? arrayUnion(targetUserId) : arrayRemove(targetUserId)
  });

  // Update targetUser's followers list
  const targetUserRef = doc(db, 'users', targetUserId);
  await updateDoc(targetUserRef, {
    'profile.followers': isFollowing ? arrayUnion(currentUserId) : arrayRemove(currentUserId)
  });
}

export async function toggleBlockUser(currentUserId: string, targetUserId: string, isBlocking: boolean): Promise<void> {
  const currentUserRef = doc(db, 'users', currentUserId);
  await updateDoc(currentUserRef, {
    'profile.blockedUsers': isBlocking ? arrayUnion(targetUserId) : arrayRemove(targetUserId)
  });
  
  if (isBlocking) {
    // Also unfollow if blocked
    await toggleFollowUser(currentUserId, targetUserId, false);
    // And remove target from following current
    await toggleFollowUser(targetUserId, currentUserId, false);
  }
}

// ==============================
// CONNECT POSTS (Kết nối)
// ==============================
const CONNECT_COLLECTION = 'connect_posts';

export async function createConnectPost(post: Omit<ConnectPost, 'id' | 'createdAt'>): Promise<string> {
  const postsRef = collection(db, CONNECT_COLLECTION);
  const newPostRef = await addDoc(postsRef, {
    ...post,
    createdAt: serverTimestamp(),
  });
  return newPostRef.id;
}

export function subscribeToConnectPosts(callback: (posts: ConnectPost[]) => void, maxLimit: number = 50) {
  const postsRef = collection(db, CONNECT_COLLECTION);
  const q = query(postsRef, orderBy('createdAt', 'desc'), limit(maxLimit));
  
  return onSnapshot(q, (snap) => {
    const posts = snap.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate().toISOString() : new Date().toISOString(),
      } as ConnectPost;
    });
    callback(posts);
  });
}

export async function fetchUserPosts(userId: string): Promise<CommunityPost[]> {
  const postsRef = collection(db, POSTS_COLLECTION);
  // Need an index for this query, but without one we can just fetch and filter client-side if limit is low, 
  // or rely on Firebase creating an index.
  // We will query where userId == userId, ordered by createdAt
  const q = query(postsRef, orderBy('createdAt', 'desc'), limit(50)); 
  // Note: doing client side filter for simplicity if index fails, but standard is where('userId', '==', userId)
  const snap = await getDocs(q);
  return snap.docs
    .map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate().toISOString() : new Date().toISOString(),
      } as CommunityPost;
    })
    .filter(p => p.userId === userId);
}

export async function fetchUserConnectPosts(userId: string): Promise<ConnectPost[]> {
  const postsRef = collection(db, CONNECT_COLLECTION);
  const q = query(postsRef, orderBy('createdAt', 'desc'), limit(50));
  const snap = await getDocs(q);
  return snap.docs
    .map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate().toISOString() : new Date().toISOString(),
      } as ConnectPost;
    })
    .filter(p => p.userId === userId);
}

export async function addConnectComment(postId: string, comment: Omit<CommunityComment, 'id' | 'postId' | 'createdAt'>): Promise<string> {
  const commentsRef = collection(db, CONNECT_COLLECTION, postId, 'comments');
  const newCommentRef = await addDoc(commentsRef, {
    ...comment,
    createdAt: serverTimestamp(),
  });
  
  const postRef = doc(db, CONNECT_COLLECTION, postId);
  await updateDoc(postRef, {
    commentsCount: increment(1)
  });
  
  return newCommentRef.id;
}

export function subscribeToConnectComments(postId: string, callback: (comments: CommunityComment[]) => void) {
  const commentsRef = collection(db, CONNECT_COLLECTION, postId, 'comments');
  const q = query(commentsRef, orderBy('createdAt', 'asc'));
  
  return onSnapshot(q, (snap) => {
    const comments = snap.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        postId,
        ...data,
        createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate().toISOString() : new Date().toISOString(),
      } as CommunityComment;
    });
    callback(comments);
  });
}
