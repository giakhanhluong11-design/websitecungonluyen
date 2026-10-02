import React, { useState, useEffect } from 'react';
import { ConnectPost, CommunityComment } from '../../types';
import { subscribeToConnectComments, addConnectComment } from '../../services/communityService';
import { getCurrentUserId } from '../../services/authService';
import { useProgressStore } from '../../store/useProgressStore';
import { useAppStore } from '../../store/useAppStore';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ArrowLeft, Users, Send } from 'lucide-react';

interface ConnectDetailViewProps {
  post: ConnectPost;
  onBack: () => void;
  onUserClick: (userId: string) => void;
}

export const ConnectDetailView: React.FC<ConnectDetailViewProps> = ({ post, onBack, onUserClick }) => {
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const currentUserId = getCurrentUserId() || '';
  const { progress } = useProgressStore();
  const { openAuthModal } = useAppStore();

  useEffect(() => {
    const unsubscribe = subscribeToConnectComments(post.id, (data) => {
      setComments(data);
    });
    return () => unsubscribe();
  }, [post.id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId) {
      openAuthModal('login');
      return;
    }
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    try {
      await addConnectComment(post.id, {
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

  return (
    <div className="max-w-4xl mx-auto pb-24 animate-in fade-in slide-in-from-bottom-4">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Quay lại danh sách
      </button>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 cursor-pointer hover:underline" onClick={() => onUserClick(post.userId)}>
            <img 
              src={post.userAvatar || `/avatars/default.svg`} 
              alt={post.userName} 
              className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100"
            />
            <div>
              <div className="font-bold text-slate-900 dark:text-white">{post.userName}</div>
              <div className="text-xs text-slate-500">
                {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: vi }) : ''}
              </div>
            </div>
          </div>
        </div>

        <h1 
          className="text-2xl sm:text-4xl font-black mb-6"
          style={{ color: post.titleColor || '#4f46e5' }}
        >
          {post.title}
        </h1>

        {post.content && (
          <div className="text-slate-800 dark:text-slate-200 text-base sm:text-lg whitespace-pre-line leading-relaxed pb-8 border-b border-slate-100 dark:border-slate-800">
            {post.content}
          </div>
        )}

        {/* Comments Section */}
        <div className="mt-8">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-indigo-500" />
            {comments.length} Phản hồi
          </h3>

          <div className="space-y-6 mb-8">
            {comments.map(c => (
              <div key={c.id} className="flex gap-3">
                <img 
                  src={c.userAvatar || `/avatars/default.svg`} 
                  alt={c.userName}
                  className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 cursor-pointer"
                  onClick={() => onUserClick(c.userId)}
                />
                <div className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-2xl p-4">
                  <div className="flex items-baseline justify-between mb-1">
                    <span 
                      className="font-bold text-sm text-slate-900 dark:text-white cursor-pointer hover:underline"
                      onClick={() => onUserClick(c.userId)}
                    >
                      {c.userName}
                    </span>
                    <span className="text-xs text-slate-500">
                      {c.createdAt ? formatDistanceToNow(new Date(c.createdAt), { addSuffix: true, locale: vi }) : ''}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-line">{c.content}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} className="flex gap-3 relative">
            <img 
              src={progress.profile.avatar || `/avatars/default.svg`} 
              alt="You"
              className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 hidden sm:block"
            />
            <div className="flex-1 flex gap-2">
              <input 
                type="text"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Viết phản hồi..."
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              />
              <button 
                type="submit"
                disabled={!newComment.trim() || isSubmitting}
                className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
