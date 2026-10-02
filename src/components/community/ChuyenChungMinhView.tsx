import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Heart, Share2, Send, Image as ImageIcon, 
  MoreHorizontal, Users, Hash, Flame, Sparkles, Trash2 
} from 'lucide-react';
import { useProgressStore } from '../../store/useProgressStore';
import { useAppStore } from '../../store/useAppStore';
import { CommunityPost, CommunityComment } from '../../types';
import { 
  createPost, 
  subscribeToPosts, 
  toggleLikePost, 
  addComment, 
  subscribeToComments,
  deletePost,
  deleteComment
} from '../../services/communityService';
import { getCurrentUserId } from '../../services/authService';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface PostItemProps {
  post: CommunityPost;
  currentUserId: string;
  onUserClick: (userId: string) => void;
}

const PostItem: React.FC<PostItemProps> = ({ post, currentUserId, onUserClick }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { progress } = useProgressStore();
  const { openAuthModal } = useAppStore();

  const isLiked = post.likedBy.includes(currentUserId);

  useEffect(() => {
    if (showComments) {
      const unsubscribe = subscribeToComments(post.id, (data) => {
        setComments(data);
      });
      return () => unsubscribe();
    }
  }, [showComments, post.id]);

  const handleToggleLike = async () => {
    if (!currentUserId) {
      openAuthModal('login');
      return;
    }
    if (isLiking) return;
    setIsLiking(true);
    try {
      await toggleLikePost(post.id, currentUserId, !isLiked);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId) {
      openAuthModal('login');
      return;
    }
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    try {
      await addComment(post.id, {
        userId: currentUserId,
        userName: progress.profile.name || 'Người dùng ẩn danh',
        userAvatar: progress.profile.avatar || `/avatars/default.svg`,
        content: newComment.trim()
      });
      setNewComment('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      try {
        await deletePost(post.id);
      } catch (err) {
        console.error("Lỗi khi xoá bài:", err);
      }
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bình luận này?")) {
      try {
        await deleteComment(post.id, commentId);
      } catch (err) {
        console.error("Lỗi khi xoá bình luận:", err);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 mb-6 shadow-sm relative group">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img 
            src={post.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.userId}`} 
            alt={post.userName} 
            className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all"
            onClick={() => onUserClick(post.userId)}
          />
          <div>
            <h4 
              className="font-bold text-slate-900 dark:text-white text-sm sm:text-base cursor-pointer hover:underline"
              onClick={() => onUserClick(post.userId)}
            >
              {post.userName}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: vi }) : 'Vừa xong'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {progress.profile.isAdmin && (
            <button onClick={handleDeletePost} className="text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors" title="Xoá bài viết (Quyền Admin)">
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-slate-800 dark:text-slate-200 text-sm sm:text-base whitespace-pre-line leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
        <span>{post.likesCount} lượt thích</span>
        <span>{post.commentsCount} bình luận</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-6">
        <button 
          onClick={handleToggleLike}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-bold transition-all ${
            isLiked 
              ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400' 
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          <span>Thích</span>
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all"
        >
          <MessageSquare className="w-5 h-5" />
          <span>Bình luận</span>
        </button>
        <button className="hidden sm:flex flex-1 sm:flex-none items-center justify-center gap-2 py-2 px-4 rounded-xl font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all">
          <Share2 className="w-5 h-5" />
          <span>Chia sẻ</span>
        </button>
      </div>

      {/* Comment Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-2">
            {comments.map(c => (
              <div key={c.id} className="flex gap-3">
                <img 
                  src={c.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.userId}`} 
                  alt={c.userName} 
                  className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 shrink-0"
                />
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{c.userName}</span>
                    <span className="text-[10px] text-slate-500">
                      {c.createdAt ? formatDistanceToNow(new Date(c.createdAt), { addSuffix: true, locale: vi }) : ''}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">{c.content}</p>
                    {progress.profile.isAdmin && (
                      <button onClick={() => handleDeleteComment(c.id)} className="text-rose-400 hover:text-rose-600 p-1 shrink-0" title="Xoá bình luận">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-4">
                Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
              </p>
            )}
          </div>
          
          <form onSubmit={handleAddComment} className="flex gap-3 items-end">
            <img 
              src={progress.profile.avatar || `/avatars/default.svg`} 
              alt="You" 
              className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 shrink-0 mb-1"
            />
            <div className="flex-1 relative">
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Viết bình luận..."
                className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 pr-12 text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                rows={1}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = target.scrollHeight + 'px';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment(e);
                  }
                }}
              />
              <button 
                type="submit" 
                disabled={!newComment.trim() || isSubmitting}
                className="absolute right-2 bottom-2 p-1.5 rounded-xl bg-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export const ChuyenChungMinhView: React.FC<{ onBack: () => void; onUserClick: (userId: string) => void }> = ({ onBack, onUserClick }) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { progress } = useProgressStore();
  const { openAuthModal, showToast } = useAppStore();
  
  const [attachedImage, setAttachedImage] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  
  // A crude way to get current userId. In a real app, this should come from authService directly.
  // Using email as an identifier if logged in, otherwise empty string.
  const currentUserId = getCurrentUserId() || '';
  const isAuthenticated = Boolean(currentUserId);

  useEffect(() => {
    const unsubscribe = subscribeToPosts((data) => {
      setPosts(data);
    });
    return () => unsubscribe();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    if (!newPostContent.trim()) return;

    setIsSubmitting(true);
    try {
      await createPost({
        userId: currentUserId,
        userName: progress.profile.name || 'Người dùng',
        userAvatar: progress.profile.avatar || `/avatars/default.svg`,
        content: newPostContent.trim(),
        likesCount: 0,
        commentsCount: 0,
        likedBy: []
      });
      setNewPostContent('');
      setAttachedImage(false);
      setActiveTag(null);
      showToast('Đăng bài thành công!', 'success');
    } catch (err: any) {
      console.error(err);
      if (err?.message?.includes('permission') || err?.message?.includes('Missing')) {
        showToast('Lỗi: Cơ sở dữ liệu chưa mở quyền đăng bài (Firebase Permission Denied). Hãy báo cho Quản trị viên để cấu hình lại rules.', 'info');
      } else {
        showToast('Có lỗi xảy ra khi đăng bài. Vui lòng thử lại sau.', 'info');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTag = () => {
    if (activeTag) {
      setActiveTag(null);
    } else {
      setActiveTag('#HocTap');
      setNewPostContent(prev => prev + (prev.length > 0 && !prev.endsWith(' ') ? ' ' : '') + '#HocTap ');
    }
  };

  const handleToggleImage = () => {
    if (attachedImage) {
      setAttachedImage(false);
    } else {
      setAttachedImage(true);
      showToast('Đã đính kèm ảnh mẫu (tính năng upload ảnh thực tế đang được xây dựng)', 'info');
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium mb-4 transition-colors">
          &larr; Quay lại Trung tâm cộng đồng
        </button>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <Users className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          Chuyện chúng mình
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Cộng đồng học sinh ôn luyện, nơi chia sẻ kiến thức, tâm sự và hỏi đáp.
        </p>
      </div>

      {/* Composer */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 mb-8 shadow-sm">
        <div className="flex gap-3 sm:gap-4">
          <img 
            src={progress.profile.avatar || `/avatars/default.svg`} 
            alt="You" 
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 shrink-0"
          />
          <div className="flex-1">
            <textarea
              value={newPostContent}
              onChange={e => setNewPostContent(e.target.value)}
              placeholder="Hôm nay bạn học thế nào? Có bài toán nào khó không?"
              className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 py-3 sm:py-4 text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none min-h-[80px]"
              rows={2}
            />
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <button 
                  type="button"
                  onClick={handleToggleImage}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs sm:text-sm transition-colors ${attachedImage ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
                >
                  <ImageIcon className={`w-4 h-4 ${attachedImage ? 'text-emerald-600' : 'text-emerald-500'}`} />
                  <span className="hidden sm:inline">Ảnh/Video</span>
                </button>
                <button 
                  type="button"
                  onClick={handleToggleTag}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs sm:text-sm transition-colors ${activeTag ? 'bg-amber-50 dark:bg-amber-900/40 text-amber-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
                >
                  <Hash className={`w-4 h-4 ${activeTag ? 'text-amber-600' : 'text-amber-500'}`} />
                  <span className="hidden sm:inline">Chủ đề</span>
                </button>
              </div>
              <button 
                onClick={handleCreatePost}
                disabled={!newPostContent.trim() || isSubmitting}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-md"
              >
                <span>Đăng bài</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map(post => (
          <PostItem key={post.id} post={post} currentUserId={currentUserId} onUserClick={onUserClick} />
        ))}
        {posts.length === 0 && (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <Sparkles className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Chưa có bài viết nào</h3>
            <p className="text-slate-500 mt-1">Hãy là người đầu tiên chia sẻ trạng thái của bạn nhé!</p>
          </div>
        )}
      </div>
    </div>
  );
};
