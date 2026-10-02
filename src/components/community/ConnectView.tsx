import React, { useState, useEffect } from 'react';
import { Users, Hash, Plus, Send } from 'lucide-react';
import { ConnectPost } from '../../types';
import { subscribeToConnectPosts, createConnectPost } from '../../services/communityService';
import { getCurrentUserId } from '../../services/authService';
import { useProgressStore } from '../../store/useProgressStore';
import { useAppStore } from '../../store/useAppStore';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ConnectViewProps {
  onBack: () => void;
  onUserClick: (userId: string) => void;
}

const TITLE_COLORS = [
  '#4f46e5', // indigo-600
  '#e11d48', // rose-600
  '#059669', // emerald-600
  '#d97706', // amber-600
  '#2563eb', // blue-600
  '#9333ea', // purple-600
  '#0f766e', // teal-600
  '#be185d', // pink-700
];

export const ConnectView: React.FC<ConnectViewProps> = ({ onBack, onUserClick }) => {
  const [posts, setPosts] = useState<ConnectPost[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState(TITLE_COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  const { progress } = useProgressStore();
  const { showToast, openAuthModal } = useAppStore();
  const currentUserId = getCurrentUserId() || '';
  const isAuthenticated = Boolean(currentUserId);

  useEffect(() => {
    const unsubscribe = subscribeToConnectPosts((data) => {
      setPosts(data);
    });
    return () => unsubscribe();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await createConnectPost({
        userId: currentUserId,
        userName: progress.profile.name || 'Người dùng',
        userAvatar: progress.profile.avatar || `/avatars/default.svg`,
        title: title.trim(),
        content: content.trim(),
        titleColor: selectedColor,
        commentsCount: 0,
      });
      setTitle('');
      setContent('');
      setShowCreate(false);
      showToast('Đã tạo kênh thảo luận!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Có lỗi xảy ra, không thể tạo', 'info');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium mb-4 transition-colors">
            &larr; Quay lại Trung tâm cộng đồng
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Hash className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            Kết nối (Thảo luận)
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Tạo các chủ đề bàn luận sôi nổi.
          </p>
        </div>
        <button 
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-md shrink-0"
        >
          {showCreate ? <Users className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showCreate ? 'Hủy tạo' : 'Tạo chủ đề mới'}
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 mb-8 border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-top-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Tiêu đề (Bắt buộc)</label>
              <input 
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề thật kêu..."
                className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 dark:text-white border-2 border-transparent focus:border-indigo-500 focus:outline-none transition-colors"
                style={{ color: selectedColor }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Màu tiêu đề</label>
              <div className="flex gap-2 flex-wrap">
                {TITLE_COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color ? 'border-slate-800 dark:border-slate-200 scale-110 shadow-md' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Nội dung (Tùy chọn)</label>
              <textarea 
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Mô tả thêm về chủ đề này..."
                className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white border-2 border-transparent focus:border-indigo-500 focus:outline-none min-h-[100px] resize-none"
              />
            </div>
            
            <div className="flex justify-end pt-2">
              <button 
                type="submit"
                disabled={isSubmitting || !title.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-md disabled:opacity-50"
              >
                Tạo chủ đề <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Feed */}
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 cursor-pointer hover:underline" onClick={() => onUserClick(post.userId)}>
                <img 
                  src={post.userAvatar || `/avatars/default.svg`} 
                  alt={post.userName} 
                  className="w-6 h-6 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100"
                />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{post.userName}</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: vi }) : ''}
              </span>
            </div>
            
            <h3 
              className="text-xl sm:text-2xl font-black cursor-pointer hover:opacity-80 transition-opacity flex items-start gap-2"
              style={{ color: post.titleColor || '#4f46e5' }}
              onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)}
            >
              <Hash className="w-6 h-6 shrink-0 mt-1 opacity-50" />
              {post.title}
            </h3>
            
            {expandedPostId === post.id && post.content && (
              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-slate-800 dark:text-slate-200 text-sm whitespace-pre-line animate-in fade-in slide-in-from-top-2">
                {post.content}
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5 cursor-pointer hover:text-indigo-600 transition-colors">
                <Users className="w-4 h-4" />
                <span>{post.commentsCount} phản hồi (Tính năng đang xây dựng)</span>
              </div>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500">
            Chưa có chủ đề nào. Hãy là người đầu tiên tạo nhé!
          </div>
        )}
      </div>
    </div>
  );
};
