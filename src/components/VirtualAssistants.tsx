import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useProgressStore } from '../store/useProgressStore';
import { addMentalHealthLog } from '../services/communityService';

const ROBIN_LIO_GIF_URL = "https://firebasestorage.googleapis.com/v0/b/nckh9a3.firebasestorage.app/o/anh_dong%20(1)%20(1).gif?alt=media&token=0604228a-3c2e-4659-b13f-a2bd94986465";

export const VirtualAssistants: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState<'intro' | 'robin' | 'lio'>('intro');
  const [isCenteredMode, setIsCenteredMode] = useState(false);
  
  // Robin State
  const [feeling, setFeeling] = useState<'good' | 'bad' | null>(null);
  const [robinResponded, setRobinResponded] = useState(false);

  const { progress } = useProgressStore();
  const userName = progress.profile.name || 'bạn';

  // Check if user has answered Robin TODAY
  useEffect(() => {
    const today = new Date().toDateString();
    const lastAnswered = localStorage.getItem('last_robin_answered_date');
    
    if (lastAnswered !== today) {
      // Bắt buộc hiện ở giữa màn hình nếu hôm nay chưa trả lời
      const timer = setTimeout(() => {
        setIsOpen(true);
        setActiveSpeaker('robin');
        setIsCenteredMode(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setIsCenteredMode(false);
    }
  }, []);

  const resetChat = () => {
    setActiveSpeaker('intro');
    setFeeling(null);
    setRobinResponded(false);
  };

  const handleRobinResponse = async (type: 'good' | 'bad') => {
    setFeeling(type);
    
    // Đánh dấu đã trả lời trong hôm nay
    const today = new Date().toDateString();
    localStorage.setItem('last_robin_answered_date', today);
    
    // Sau khi trả lời, thoát khỏi chế độ centered (hoặc giữ nguyên cũng được, nhưng thoát sẽ mượt hơn)
    setTimeout(() => {
      setIsCenteredMode(false);
    }, 2000);

    // Log to Firebase
    try {
      const currentUserId = progress.profile.email ? progress.profile.email.split('@')[0] : 'guest';
      await addMentalHealthLog(currentUserId, userName, type);
    } catch (err) {
      console.warn("Could not save mental health log", err);
    }

    setTimeout(() => {
      setRobinResponded(true);
    }, 500);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Nếu cố tình đóng khi chưa trả lời, lần sau load lại trang nó vẫn sẽ hiện ra giữa màn hình
  };

  // Nút gọi trợ lý (khi đang đóng)
  if (!isOpen) {
    return (
      <div className="fixed bottom-0 right-6 z-50 flex items-end justify-center cursor-pointer group" onClick={() => setIsOpen(true)}>
        <div className="absolute -top-10 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm px-4 py-2 rounded-2xl rounded-br-none shadow-lg opacity-0 group-hover:opacity-100 transition-opacity border border-slate-200 dark:border-slate-700 whitespace-nowrap font-medium pointer-events-none">
          Trợ lý học tập đây! 👋
        </div>
        
        {/* GIF Nhân vật xuất hiện tự nhiên bên ngoài, không có viền/vòng tròn */}
        <div className="relative w-36 h-36 z-20 hover:scale-110 transition-transform duration-300 animate-[bounce_3s_infinite_ease-in-out] origin-bottom overflow-hidden">
          <svg style={{ position: 'absolute', width: 0, height: 0 }}>
            <filter id="remove-black-bg">
              {/* Loại bỏ nền đen: Nếu RGB tổng hợp nhỏ, Alpha = 0. Ngược lại Alpha = 1 */}
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  2 2 2 0 -0.1" />
            </filter>
          </svg>
          <img 
            src={ROBIN_LIO_GIF_URL} 
            alt="Assistants" 
            className="absolute w-[150%] h-[150%] max-w-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] object-cover pointer-events-none" 
            style={{ filter: 'url(#remove-black-bg)' }}
          />
        </div>
      </div>
    );
  }

  // Khung Chat (Có thể ở góc dưới phải hoặc giữa màn hình)
  const chatContainerClasses = isCenteredMode 
    ? "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300"
    : "fixed bottom-6 right-6 z-50 flex flex-col items-end animate-in slide-in-from-bottom-5 fade-in duration-300";

  return (
    <div className={chatContainerClasses}>
      
      <div className="flex flex-col items-end">
        {/* Khung Chat */}
        <div className={`bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700 w-[360px] max-w-full overflow-hidden flex flex-col ${isCenteredMode ? 'rounded-3xl' : 'rounded-3xl rounded-br-none mb-2'}`}>
          <div className="bg-gradient-to-r from-indigo-500 to-rose-400 p-4 flex justify-between items-center text-white">
            <div className="font-bold flex items-center gap-2">
              <SparklesIcon className="w-5 h-5" />
              Trợ lý ảo học tập
            </div>
            <button onClick={handleClose} className="hover:bg-white/20 p-1.5 rounded-xl transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 flex-1 max-h-[60vh] overflow-y-auto">
            {/* Lựa chọn trợ lý ban đầu */}
            {activeSpeaker === 'intro' && (
              <div className="space-y-4 animate-in fade-in duration-500">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 text-center">
                  Xin chào {userName}! Chúng mình là Robin và Lio. Hôm nay bạn cần hỗ trợ gì?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setActiveSpeaker('robin')}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl border-2 border-indigo-100 dark:border-indigo-900/50 bg-indigo-50 dark:bg-indigo-900/20 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-800 shadow-sm overflow-hidden relative bg-slate-800">
                       <img src={ROBIN_LIO_GIF_URL} alt="Robin" className="absolute w-[180%] h-[180%] max-w-none top-1/2 left-[20%] -translate-x-1/2 -translate-y-[40%] object-cover" />
                    </div>
                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400">Robin (Tâm sự)</span>
                  </button>
                  <button 
                    onClick={() => setActiveSpeaker('lio')}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl border-2 border-rose-100 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-900/20 hover:border-rose-300 dark:hover:border-rose-700 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-800 shadow-sm overflow-hidden relative bg-slate-800">
                       <img src={ROBIN_LIO_GIF_URL} alt="Lio" className="absolute w-[180%] h-[180%] max-w-none top-1/2 left-[80%] -translate-x-1/2 -translate-y-[40%] object-cover" />
                    </div>
                    <span className="text-xs font-bold text-rose-700 dark:text-rose-400">Lio (Hướng dẫn)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Chat của Robin */}
            {activeSpeaker === 'robin' && (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full border border-slate-200 shadow-xs shrink-0 overflow-hidden relative bg-slate-800">
                    <img src={ROBIN_LIO_GIF_URL} alt="Robin" className="absolute w-[180%] h-[180%] max-w-none top-1/2 left-[20%] -translate-x-1/2 -translate-y-[40%] object-cover" />
                  </div>
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
                    <div className="flex justify-end gap-3 animate-in slide-in-from-bottom-2 fade-in">
                      <div className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm p-3 rounded-2xl rounded-tr-none border border-slate-200 dark:border-slate-700">
                        {feeling === 'good' ? 'Hôm nay mọi thứ đều ổn 😊' : 'Hôm nay là một ngày khá tệ 😞'}
                      </div>
                    </div>

                    {robinResponded && (
                      <div className="flex gap-3 animate-in slide-in-from-bottom-2 fade-in duration-300">
                        <div className="w-10 h-10 rounded-full border border-slate-200 shadow-xs shrink-0 overflow-hidden relative bg-slate-800">
                          <img src={ROBIN_LIO_GIF_URL} alt="Robin" className="absolute w-[180%] h-[180%] max-w-none top-1/2 left-[20%] -translate-x-1/2 -translate-y-[40%] object-cover" />
                        </div>
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
                  <div className="w-10 h-10 rounded-full border border-slate-200 shadow-xs shrink-0 overflow-hidden relative bg-slate-800">
                    <img src={ROBIN_LIO_GIF_URL} alt="Lio" className="absolute w-[180%] h-[180%] max-w-none top-1/2 left-[80%] -translate-x-1/2 -translate-y-[40%] object-cover" />
                  </div>
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

          {/* Quay lại Intro */}
          {(activeSpeaker !== 'intro' && !isCenteredMode) && (
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

        {/* Avatar Below Chat (Chỉ hiện khi ở dạng góc màn hình) */}
        {!isCenteredMode && (
          <div className="flex items-end justify-end pr-4 pointer-events-none">
            <div className="relative w-28 h-28 z-20 overflow-hidden pointer-events-auto">
              <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <filter id="remove-black-bg-small">
                  <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  2 2 2 0 -0.1" />
                </filter>
              </svg>
              <img 
                src={ROBIN_LIO_GIF_URL} 
                alt="Assistants" 
                className="absolute w-[150%] h-[150%] max-w-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] object-cover pointer-events-none" 
                style={{ filter: 'url(#remove-black-bg-small)' }}
              />
            </div>
          </div>
        )}
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
