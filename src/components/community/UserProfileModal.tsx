import React, { useEffect, useState } from 'react';
import { UserProfile, CommunityPost, ConnectPost } from '../../types';
import { getUserProfile, fetchUserPosts, fetchUserConnectPosts, toggleFollowUser, toggleBlockUser } from '../../services/communityService';
import { getCurrentUserId } from '../../services/authService';
import { useProgressStore } from '../../store/useProgressStore';
import { useAppStore } from '../../store/useAppStore';
import { X, Users, MessageSquare, ShieldBan, Sparkles, Check } from 'lucide-react';
import { UserAvatar } from '../UserAvatar';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface UserProfileModalProps {
  userId: string;
  onClose: () => void;
  onConnectClick?: (post: ConnectPost) => void;
  onCommunityPostClick?: (post: CommunityPost) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ 
  userId, 
  onClose,
  onConnectClick,
  onCommunityPostClick
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [connects, setConnects] = useState<ConnectPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  
  const { progress } = useProgressStore();
  const { showToast, openAuthModal } = useAppStore();
  const currentUserId = getCurrentUserId() || '';
  
  const isMyProfile = currentUserId === userId;

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const p = await getUserProfile(userId);
        if (p) {
          setProfile(p);
          setIsFollowing(p.followers?.includes(currentUserId) || false);
        }
        
        const [ps, cs] = await Promise.all([
          fetchUserPosts(userId),
          fetchUserConnectPosts(userId)
        ]);
        setPosts(ps);
        setConnects(cs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [userId, currentUserId]);

  const handleFollow = async () => {
    if (!currentUserId) {
      openAuthModal('login');
      return;
    }
    try {
      const nextFollowState = !isFollowing;
      setIsFollowing(nextFollowState);
      // Update local profile object optimistically
      setProfile(prev => {
        if (!prev) return prev;
        const followers = prev.followers || [];
        return {
          ...prev,
          followers: nextFollowState ? [...followers, currentUserId] : followers.filter(id => id !== currentUserId)
        };
      });
      await toggleFollowUser(currentUserId, userId, nextFollowState);
      showToast(nextFollowState ? 'Đã theo dõi' : 'Đã bỏ theo dõi', 'success');
    } catch (err) {
      console.error(err);
      setIsFollowing(!isFollowing); // revert
      showToast('Có lỗi xảy ra', 'info');
    }
  };

  const handleBlockUser = async (targetUserId: string) => {
    if (!isMyProfile) return;
    try {
      await toggleBlockUser(currentUserId, targetUserId, true);
      // Remove from UI
      setProfile(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          followers: (prev.followers || []).filter(id => id !== targetUserId)
        };
      });
      showToast('Đã chặn người dùng này', 'success');
    } catch (err) {
      console.error(err);
      showToast('Không thể chặn, vui lòng thử lại', 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Hồ sơ người dùng
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {loading ? (
            <div className="py-20 text-center text-slate-500">Đang tải hồ sơ...</div>
          ) : profile ? (
            <div className="space-y-8">
              {/* Profile Info */}
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                <UserAvatar avatar={profile.avatar} className="w-24 h-24 sm:w-32 sm:h-32 shadow-md border-4 border-white dark:border-slate-800 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                        {profile.name || profile.googleDisplayName || 'Người dùng'}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400">
                        {profile.birthYear ? `${new Date().getFullYear() - profile.birthYear} tuổi` : 'Chưa rõ tuổi'}
                        {profile.city && ` • ${profile.city}`}
                      </p>
                    </div>
                    {!isMyProfile && (
                      <button 
                        onClick={handleFollow}
                        className={`cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all shadow-sm ${
                          isFollowing 
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md'
                        }`}
                      >
                        {isFollowing ? (
                          <>
                            <Check className="w-5 h-5" />
                            <span>Đang theo dõi</span>
                          </>
                        ) : (
                          <>
                            <span className="text-lg leading-none">+</span>
                            <span>Theo dõi</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-md">
                      {profile.bio || 'Chưa có thông tin giới thiệu.'}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center sm:justify-start gap-4 pt-3 text-sm">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                      <span className="text-lg">{(profile.followers || []).length}</span>
                      <span className="text-slate-500 font-normal">Người theo dõi</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                      <span className="text-lg">{(profile.following || []).length}</span>
                      <span className="text-slate-500 font-normal">Đang theo dõi</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* If it's my profile, I can manage my followers (Block) */}
              {isMyProfile && (profile.followers || []).length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-3">Người theo dõi bạn</h4>
                  <div className="flex gap-2 flex-wrap">
                    {(profile.followers || []).map(followerId => (
                      <div key={followerId} className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-sm">
                        <span className="font-medium">{followerId}</span>
                        <button 
                          onClick={() => handleBlockUser(followerId)}
                          className="text-rose-500 hover:text-rose-600 p-0.5 cursor-pointer"
                          title="Chặn người này"
                        >
                          <ShieldBan className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activity History */}
              <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-500" />
                  Hoạt động gần đây
                </h4>
                
                {posts.length === 0 && connects.length === 0 ? (
                  <div className="text-center py-10 text-slate-500">Người dùng này chưa có hoạt động nào.</div>
                ) : (
                  <div className="space-y-4">
                    {posts.map(p => (
                      <div 
                        key={p.id} 
                        onClick={() => onCommunityPostClick && onCommunityPostClick(p)}
                        className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm ${onCommunityPostClick ? 'cursor-pointer hover:shadow-md transition-shadow hover:border-indigo-200 dark:hover:border-indigo-900' : ''}`}
                      >
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                          <MessageSquare className="w-3 h-3" />
                          <span>Chuyện chúng mình</span>
                          <span>•</span>
                          <span>{formatDistanceToNow(new Date(p.createdAt), { addSuffix: true, locale: vi })}</span>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200 text-sm line-clamp-3">{p.content}</p>
                      </div>
                    ))}
                    {connects.map(c => (
                      <div 
                        key={c.id} 
                        onClick={() => onConnectClick && onConnectClick(c)}
                        className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm ${onConnectClick ? 'cursor-pointer hover:shadow-md transition-shadow hover:border-indigo-200 dark:hover:border-indigo-900' : ''}`}
                      >
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                          <Users className="w-3 h-3" />
                          <span>Kết nối</span>
                          <span>•</span>
                          <span>{formatDistanceToNow(new Date(c.createdAt), { addSuffix: true, locale: vi })}</span>
                        </div>
                        <h5 className="font-bold text-base" style={{ color: c.titleColor || 'inherit' }}>{c.title}</h5>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-500">Không tìm thấy thông tin người dùng.</div>
          )}
        </div>
      </div>
    </div>
  );
};
