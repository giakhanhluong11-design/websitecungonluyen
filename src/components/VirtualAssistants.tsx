import React, { useState, useEffect } from 'react';
import { X, Check, CheckCircle2, AlertCircle, Info, HelpCircle } from 'lucide-react';
import { useProgressStore } from '../store/useProgressStore';

export const VirtualAssistants: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState<'robin' | 'lio' | 'intro'>('intro');
  
  // Robin State
  const [feeling, setFeeling] = useState<'good' | 'bad' | null>(null);
  const [robinResponded, setRobinResponded] = useState(false);

  const { progress } = useProgressStore();
  const userName = progress.profile.name || 'bạn';

  // Chuyển động lơ lửng
  const floatingAnimation = "animate-[bounce_3s_infinite_ease-in-out]";

  const resetChat = () => {
    setActiveSpeaker('intro');
    setFeeling(null);
    setRobinResponded(false);
  };

  const handleRobinResponse = (type: 'good' | 'bad') => {
    setFeeling(type);
    setTimeout(() => {
      setRobinResponded(true);
    }, 500);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex items-end gap-2 group cursor-pointer" onClick={() => setIsOpen(true)}>
        <div className="absolute -top-12 right-0 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm px-4 py-2 rounded-2xl rounded-br-none shadow-lg opacity-0 group-hover:opacity-100 transition-opacity border border-slate-200 dark:border-slate-700 whitespace-nowrap font-medium pointer-events-none">
          Trợ lý học tập đây! 👋
        </div>
        
        {/* Lio Avatar (Nữ) */}
        <div className={`relative w-14 h-14 rounded-full border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden bg-rose-100 z-10 hover:scale-110 transition-transform duration-300 animate-[bounce_3.5s_infinite_ease-in-out]`}>
          <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Liliana&backgroundColor=ffe4e6&hair=long42" alt="Lio" className="w-full h-full object-cover" />
        </div>
        
        {/* Robin Avatar (Nam) */}
        <div className={`relative w-16 h-16 rounded-full border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden bg-indigo-100 -ml-4 z-20 hover:scale-110 transition-transform duration-300 animate-[bounce_3s_infinite_ease-in-out] delay-150`}>
          <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=e0e7ff&hair=short16" alt="Robin" className="w-full h-full object-cover" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end animate-in slide-in-from-bottom-5 fade-in duration-300">
      {/* Khung Chat */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl rounded-br-none shadow-2xl border border-slate-200 dark:border-slate-700 w-[340px] mb-4 overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-indigo-500 to-rose-400 p-4 flex justify-between items-center text-white">
          <div className="font-bold flex items-center gap-2">
            <SparklesIcon className="w-5 h-5" />
            Trợ lý ảo học tập
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex-1 max-h-[400px] overflow-y-auto">
          {activeSpeaker === 'intro' && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <p className="text-sm text-slate-600 dark:text-slate-300 text-center">
                Xin chào {userName}! Chúng mình là Robin và Lio. Hôm nay bạn cần hỗ trợ gì?
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setActiveSpeaker('robin')}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl border-2 border-indigo-100 dark:border-indigo-900/50 bg-indigo-50 dark:bg-indigo-900/20 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                >
                  <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=e0e7ff&hair=short16" className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" alt="Robin" />
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400">Robin (Tâm sự)</span>
                </button>
                <button 
                  onClick={() => setActiveSpeaker('lio')}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl border-2 border-rose-100 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-900/20 hover:border-rose-300 dark:hover:border-rose-700 transition-colors"
                >
                  <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Liliana&backgroundColor=ffe4e6&hair=long42" className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" alt="Lio" />
                  <span className="text-xs font-bold text-rose-700 dark:text-rose-400">Lio (Hướng dẫn)</span>
                </button>
              </div>
            </div>
          )}

          {/* Chat của Robin */}
          {activeSpeaker === 'robin' && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <div className="flex gap-3">
                <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=e0e7ff&hair=short16" className="w-10 h-10 rounded-full border border-slate-200 shadow-xs shrink-0" alt="Robin" />
                <div className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-900 dark:text-indigo-100 text-sm p-3 rounded-2xl rounded-tl-none">
                  Chào {userName}! Hôm nay bạn cảm thấy như thế nào?
                </div>
              </div>

              {!feeling && (
                <div className="flex flex-col gap-2 pl-13">
                  <button onClick={() => handleRobinResponse('good')} className="flex items-center gap-2 text-left bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 p-2.5 rounded-xl text-sm font-medium transition-colors group">
                    <div className="w-5 h-5 rounded border border-slate-300 group-hover:border-indigo-500 flex items-center justify-center"></div>
                    Hôm nay mọi thứ đều ổn 😊
                  </button>
                  <button onClick={() => handleRobinResponse('bad')} className="flex items-center gap-2 text-left bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/40 p-2.5 rounded-xl text-sm font-medium transition-colors group">
                    <div className="w-5 h-5 rounded border border-slate-300 group-hover:border-rose-500 flex items-center justify-center"></div>
                    Hôm nay là một ngày khá tệ 😞
                  </button>
                </div>
              )}

              {feeling && (
                <div className="flex flex-col gap-4">
                  {/* Tin nhắn trả lời của người dùng */}
                  <div className="flex justify-end gap-3 animate-in slide-in-from-bottom-2 fade-in">
                    <div className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm p-3 rounded-2xl rounded-tr-none border border-slate-200 dark:border-slate-700">
                      {feeling === 'good' ? 'Hôm nay mọi thứ đều ổn 😊' : 'Hôm nay là một ngày khá tệ 😞'}
                    </div>
                  </div>

                  {/* Phản hồi của Robin */}
                  {robinResponded && (
                    <div className="flex gap-3 animate-in slide-in-from-bottom-2 fade-in duration-300">
                      <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=e0e7ff&hair=short16" className="w-10 h-10 rounded-full border border-slate-200 shadow-xs shrink-0" alt="Robin" />
                      <div className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-900 dark:text-indigo-100 text-sm p-3 rounded-2xl rounded-tl-none leading-relaxed">
                        {feeling === 'good' 
                          ? `Thật tuyệt vời! Mình rất vui vì bạn đang có một ngày tốt lành. Hãy giữ vững tinh thần năng lượng này để chinh phục các bài học hôm nay nhé. Cùng Ôn Luyện luôn đồng hành cùng ${userName}!` 
                          : `Ôm ${userName} một cái nhé! Có những ngày mọi thứ không như ý, nhưng không sao cả. Bạn đã rất cố gắng rồi. Hãy nghỉ ngơi một chút, hít thở sâu, mọi khó khăn rồi sẽ qua thôi.`}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Chat của Lio */}
          {activeSpeaker === 'lio' && (
            <div className="space-y-4 animate-in slide-in-from-left-4 duration-300">
              <div className="flex gap-3">
                <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Liliana&backgroundColor=ffe4e6&hair=long42" className="w-10 h-10 rounded-full border border-slate-200 shadow-xs shrink-0" alt="Lio" />
                <div className="bg-rose-100 dark:bg-rose-900/40 text-rose-900 dark:text-rose-100 text-sm p-3 rounded-2xl rounded-tl-none leading-relaxed space-y-2">
                  <p>Chào bạn, mình là <strong>Lio</strong>! Để mình hướng dẫn bạn cách sử dụng hệ thống Cùng Ôn Luyện nhé:</p>
                  <ul className="list-disc pl-4 space-y-1 mt-2 font-medium">
                    <li><strong>Trang chủ:</strong> Xem tổng quan tiến độ học tập và chuỗi ngày streak của bạn.</li>
                    <li><strong>Kiến thức:</strong> Ôn tập lý thuyết dưới dạng Flashcard tương tác.</li>
                    <li><strong>Luyện tập:</strong> Làm bài tập theo từng chuyên đề cụ thể để nắm vững kiến thức.</li>
                    <li><strong>Đề thi:</strong> Thử sức với đề thi thật của các tỉnh/thành phố với tính giờ tự động.</li>
                  </ul>
                  <p className="pt-2 italic text-xs text-rose-700/80 dark:text-rose-300/80">Bạn có thể truy cập các mục này ở thanh Menu bên trái màn hình nhé!</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {activeSpeaker !== 'intro' && (
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700 flex justify-center">
            <button 
              onClick={resetChat}
              className="text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors underline underline-offset-2"
            >
              Quay lại từ đầu
            </button>
          </div>
        )}
      </div>

      {/* Avatars Below Chat */}
      <div className="flex items-end justify-end gap-2 pr-2">
        {/* Lio */}
        <div className={`relative w-12 h-12 rounded-full border-2 border-white dark:border-slate-700 shadow-md overflow-hidden bg-rose-100 z-10 transition-transform duration-300 ${activeSpeaker === 'lio' ? 'scale-125 ring-4 ring-rose-400' : 'opacity-70 scale-95'}`}>
          <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Liliana&backgroundColor=ffe4e6&hair=long42" alt="Lio" className="w-full h-full object-cover" />
        </div>
        {/* Robin */}
        <div className={`relative w-12 h-12 rounded-full border-2 border-white dark:border-slate-700 shadow-md overflow-hidden bg-indigo-100 -ml-3 z-20 transition-transform duration-300 ${activeSpeaker === 'robin' ? 'scale-125 ring-4 ring-indigo-400' : 'opacity-70 scale-95'}`}>
          <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=e0e7ff&hair=short16" alt="Robin" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

function SparklesIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
