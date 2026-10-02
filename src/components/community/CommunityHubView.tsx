import React, { useState, useEffect } from 'react';
import { Users, Hash, Image as ImageIcon } from 'lucide-react';
import { useProgressStore } from '../../store/useProgressStore';
import { getUserProfile } from '../../services/communityService';
import { getCurrentUserId } from '../../services/authService';
import { UserAvatar } from '../UserAvatar';

const POSTCARDS = [
  "https://firebasestorage.googleapis.com/v0/b/nckh9a3.firebasestorage.app/o/1.png?alt=media&token=2571ada3-1317-4f2c-be4c-464f810f99f8",
  "https://firebasestorage.googleapis.com/v0/b/nckh9a3.firebasestorage.app/o/2.png?alt=media&token=80f23676-f09b-440c-aa94-66a01709f014",
  "https://firebasestorage.googleapis.com/v0/b/nckh9a3.firebasestorage.app/o/3.png?alt=media&token=8a5bbc4c-9bb7-44f9-b8aa-24b0650c3162",
  "https://firebasestorage.googleapis.com/v0/b/nckh9a3.firebasestorage.app/o/4.png?alt=media&token=3bb57f2d-ac8b-410d-b2f7-b14588bf1393",
  "https://firebasestorage.googleapis.com/v0/b/nckh9a3.firebasestorage.app/o/5.png?alt=media&token=785e7b43-fc14-4926-bd1e-34dcf677f377",
  "https://firebasestorage.googleapis.com/v0/b/nckh9a3.firebasestorage.app/o/6.png?alt=media&token=991ac798-1919-4d41-82e7-e821e7b2e1c8",
  "https://firebasestorage.googleapis.com/v0/b/nckh9a3.firebasestorage.app/o/7.png?alt=media&token=f6ce31b9-82fc-465a-9177-d9f086583aaa",
  "https://firebasestorage.googleapis.com/v0/b/nckh9a3.firebasestorage.app/o/8.png?alt=media&token=a0c2392c-77ee-440c-be9d-848a0b130fe5",
  "https://firebasestorage.googleapis.com/v0/b/nckh9a3.firebasestorage.app/o/9.png?alt=media&token=8d1f79a6-5091-4b97-9837-6006e91e0aed",
  "https://firebasestorage.googleapis.com/v0/b/nckh9a3.firebasestorage.app/o/10.png?alt=media&token=4274e335-f137-46ea-adf4-446c0eeca446",
  "https://firebasestorage.googleapis.com/v0/b/nckh9a3.firebasestorage.app/o/11.png?alt=media&token=61a1736d-b969-4ab8-a34f-be27b368040c",
  "https://firebasestorage.googleapis.com/v0/b/nckh9a3.firebasestorage.app/o/12.png?alt=media&token=1d026d93-6539-4404-a436-5783839daffb",
  "https://firebasestorage.googleapis.com/v0/b/nckh9a3.firebasestorage.app/o/13.png?alt=media&token=e93c1638-9e8c-4c3f-9ff7-8bebca5105f8",
  "https://firebasestorage.googleapis.com/v0/b/nckh9a3.firebasestorage.app/o/14.png?alt=media&token=a2d39d94-38e5-4162-a72c-2d475fb6c1e3"
];

// Helper to get random postcard based on current date so it changes daily
const getDailyPostcard = () => {
  const day = new Date().getDate();
  return POSTCARDS[day % POSTCARDS.length];
};

interface CommunityHubViewProps {
  onNavigate: (view: 'hub' | 'chuyen_chung_minh' | 'ket_noi') => void;
  onUserClick: (userId: string) => void;
}

export const CommunityHubView: React.FC<CommunityHubViewProps> = ({ onNavigate, onUserClick }) => {
  const { progress } = useProgressStore();
  const [followingProfiles, setFollowingProfiles] = useState<any[]>([]);
  const currentUserId = getCurrentUserId() || '';
  const [postcard] = useState(getDailyPostcard());

  useEffect(() => {
    // Load following profiles
    const loadFollowing = async () => {
      if (!currentUserId) return;
      try {
        const myProfile = await getUserProfile(currentUserId);
        if (myProfile?.following && myProfile.following.length > 0) {
          const profiles = await Promise.all(
            myProfile.following.map(async (uid) => {
              const p = await getUserProfile(uid);
              return p ? { id: uid, ...p } : null;
            })
          );
          setFollowingProfiles(profiles.filter(p => p !== null));
        }
      } catch (err) {
        console.error('Error loading following profiles:', err);
      }
    };
    loadFollowing();
  }, [currentUserId]);

  return (
    <div className="max-w-6xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          Trung tâm cộng đồng
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-base sm:text-lg">
          Nơi kết nối yêu thương, chia sẻ góc nhìn và thảo luận sôi nổi.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* ROW 1: Chuyện chúng mình (2/3) + Danh mục theo dõi (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Chuyện chúng mình */}
          <div 
            onClick={() => onNavigate('chuyen_chung_minh')}
            className="lg:col-span-2 relative group overflow-hidden rounded-[2rem] shadow-sm hover:shadow-xl transition-all cursor-pointer aspect-video sm:aspect-auto sm:h-[400px] border border-slate-200 dark:border-slate-800"
          >
          {/* Background image for community */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop')` }}
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h2 className="text-3xl sm:text-5xl font-black text-white flex items-center gap-3">
              Chuyện chúng mình
            </h2>
            <p className="text-white/80 mt-2 text-sm sm:text-base font-medium max-w-lg">
              Viết lên những dòng tâm sự, nhật ký học tập hoặc chia sẻ thành quả của bạn với mọi người.
            </p>
          </div>
        </div>

        {/* Card 2: Danh mục theo dõi */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 flex flex-col shadow-sm aspect-square sm:aspect-auto sm:h-[400px]">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-6 h-6 text-indigo-500" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Danh mục theo dõi</h3>
          </div>
          
          {currentUserId ? (
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {followingProfiles.length === 0 ? (
                <div className="text-center text-slate-500 dark:text-slate-400 mt-10">
                  Bạn chưa theo dõi ai cả.<br />Hãy ghé Chuyện chúng mình để tìm bạn nhé!
                </div>
              ) : (
                followingProfiles.map((user) => (
                  <div 
                    key={user.id} 
                    onClick={() => onUserClick(user.id)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <UserAvatar avatar={user.avatar} className="w-10 h-10 rounded-full shadow-sm" />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{user.name || user.googleDisplayName}</p>
                        <p className="text-xs text-slate-500 line-clamp-1">{user.bio || 'Không có mô tả'}</p>
                      </div>
                    </div>
                    {/* Fake new posts badge for UI demonstration */}
                    <span className="w-6 h-6 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm">
                      {Math.floor(Math.random() * 3) + 1}
                    </span>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500">
              <p>Vui lòng đăng nhập để xem danh sách theo dõi.</p>
            </div>
          )}
        </div>
        </div>

        {/* ROW 2: Kết nối (1/2) + Postcard (1/2) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 3: Kết nối */}
          <div 
            onClick={() => onNavigate('ket_noi')}
            className="relative group overflow-hidden rounded-[2rem] shadow-sm hover:shadow-xl transition-all cursor-pointer aspect-square sm:aspect-video lg:aspect-auto lg:h-[350px] border border-slate-200 dark:border-slate-800"
          >
          {/* Background image: two students discussing, yellow tint */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=2070&auto=format&fit=crop')`, // Two people discussing
            }}
          />
          {/* Yellow tint overlay */}
          <div className="absolute inset-0 bg-amber-500/30 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <h2 className="text-3xl sm:text-5xl font-black text-amber-300 flex items-center gap-3">
              Kết nối
            </h2>
            <p className="text-white/90 mt-2 text-sm sm:text-base font-medium max-w-md drop-shadow-md">
              Kênh thảo luận đa sắc màu. Nơi những ý tưởng lớn gặp nhau và các thắc mắc được giải đáp.
            </p>
          </div>
        </div>

        {/* Card 4: Postcard */}
        <div className="bg-slate-100 dark:bg-slate-800 overflow-hidden rounded-[2rem] border border-slate-200 dark:border-slate-700 relative aspect-square sm:aspect-video lg:aspect-auto lg:h-[350px] flex items-center justify-center shadow-sm">
          <img 
            src={postcard} 
            alt="Truyền cảm hứng" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        </div>

      </div>
    </div>
  );
};
