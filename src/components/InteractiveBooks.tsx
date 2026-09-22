import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Sparkles, Check } from 'lucide-react';

interface InteractiveBooksProps {
  onSelectSubject?: (subjectId: string) => void;
  mathCount: number;
  vanCount: number;
  anhCount: number;
}

interface BookConfig {
  id: string;
  title: string;
  subtitle: string;
  count: number;
  spineColor: string;
  coverColor: string;
  textColor: string;
  accentColor: string;
  baseRotate: number;
  icon: string;
}

export const InteractiveBooks: React.FC<InteractiveBooksProps> = ({
  onSelectSubject,
  mathCount,
  vanCount,
  anhCount
}) => {
  const [activeBook, setActiveBook] = useState<string | null>(null);
  const [openedBook, setOpenedBook] = useState<string | null>(null);

  const books: BookConfig[] = [
    {
      id: 'toan',
      title: 'Toán 9',
      subtitle: 'Hình học & Đại số',
      count: mathCount,
      spineColor: 'from-emerald-600 to-emerald-700',
      coverColor: 'from-emerald-500 via-emerald-600 to-teal-700',
      textColor: 'text-emerald-950',
      accentColor: '#10b981',
      baseRotate: -8,
      icon: '∑'
    },
    {
      id: 'van',
      title: 'Ngữ Văn 9',
      subtitle: 'Nghị luận & Tác phẩm',
      count: vanCount,
      spineColor: 'from-teal-600 to-teal-700',
      coverColor: 'from-teal-500 via-emerald-600 to-green-700',
      textColor: 'text-teal-950',
      accentColor: '#14b8a6',
      baseRotate: 0,
      icon: '✒'
    },
    {
      id: 'anh',
      title: 'Tiếng Anh 9',
      subtitle: 'Grammar & Vocab',
      count: anhCount,
      spineColor: 'from-green-600 to-green-700',
      coverColor: 'from-green-500 via-emerald-600 to-emerald-800',
      textColor: 'text-green-950',
      accentColor: '#22c55e',
      baseRotate: 8,
      icon: 'A'
    }
  ];

  const handleBookClick = (bookId: string) => {
    if (openedBook === bookId) {
      setOpenedBook(null);
    } else {
      setOpenedBook(bookId);
    }
    if (onSelectSubject) {
      onSelectSubject(bookId);
    }
  };

  return (
    <div className="relative w-full py-1 select-none flex flex-col items-center">
      {/* Interactive instruction cue */}
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white/95 drop-shadow-xs mb-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
        <span>Chạm / rê chuột vào sách để lật mở</span>
      </div>

      {/* Book stack container */}
      <div className="relative h-28 sm:h-32 w-full max-w-[280px] sm:max-w-[320px] flex items-end justify-center perspective-[1000px]">
        {books.map((book, idx) => {
          const isHovered = activeBook === book.id;
          const isOpened = openedBook === book.id;

          return (
            <motion.div
              key={book.id}
              className="absolute cursor-pointer"
              style={{
                zIndex: isOpened ? 30 : isHovered ? 25 : idx + 1,
                transformOrigin: 'bottom center'
              }}
              initial={false}
              animate={{
                x: (idx - 1) * (isHovered || isOpened ? 52 : 36),
                y: isOpened ? -14 : isHovered ? -10 : 0,
                rotateZ: isOpened ? 0 : isHovered ? book.baseRotate * 0.5 : book.baseRotate,
                scale: isOpened ? 1.08 : isHovered ? 1.04 : 0.98
              }}
              transition={{
                type: 'spring',
                stiffness: 340,
                damping: 24
              }}
              onMouseEnter={() => setActiveBook(book.id)}
              onMouseLeave={() => setActiveBook(null)}
              onClick={() => handleBookClick(book.id)}
            >
              {/* 3D Realistic Book with Cover, Spine, Ribbon and Pages */}
              <div 
                className={`relative w-20 sm:w-24 h-26 sm:h-28 rounded-r-md rounded-l-xs shadow-xl transition-shadow duration-200 ${
                  isHovered || isOpened ? 'shadow-black/40 ring-2 ring-amber-300/80' : 'shadow-black/25'
                }`}
              >
                {/* Book Spine (left ridge) */}
                <div 
                  className={`absolute left-0 top-0 bottom-0 w-2.5 sm:w-3 rounded-l-xs bg-gradient-to-r ${book.spineColor} border-r border-black/20 shadow-inner z-20 flex flex-col justify-between py-1.5 items-center`}
                >
                  <div className="w-1 h-2 bg-amber-400/90 rounded-full" />
                  <div className="w-1 h-6 bg-white/40 rounded-full" />
                  <div className="w-1 h-2 bg-amber-400/90 rounded-full" />
                </div>

                {/* White Paper Pages Trim (Right & Bottom edge) */}
                <div 
                  className="absolute right-0.5 top-1 bottom-1 w-2 bg-slate-50 border-r border-slate-200 shadow-xs z-0 flex flex-col justify-around overflow-hidden"
                >
                  <div className="w-full h-px bg-slate-200" />
                  <div className="w-full h-px bg-slate-200" />
                  <div className="w-full h-px bg-slate-200" />
                  <div className="w-full h-px bg-slate-200" />
                </div>

                {/* Book Front Cover */}
                <motion.div
                  className={`absolute inset-0 pl-3 sm:pl-3.5 pr-1.5 py-1.5 rounded-r-md rounded-l-xs bg-gradient-to-br ${book.coverColor} text-white flex flex-col justify-between border-t border-r border-b border-white/30 overflow-hidden z-10 shadow-inner`}
                  animate={isOpened ? { rotateY: -28, originX: 0 } : { rotateY: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {/* Subtle cover texture / pattern */}
                  <div className="absolute -right-4 -top-4 w-12 h-12 rounded-full bg-white/15 blur-xs pointer-events-none" />
                  
                  {/* Top Emblem & Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-[11px] font-mono font-black text-amber-300 drop-shadow-xs">
                      {book.icon}
                    </span>
                    <span className="text-[8px] sm:text-[9px] bg-black/40 backdrop-blur-xs px-1.5 py-0.5 rounded-full font-bold text-white">
                      {book.count} đề
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="my-auto">
                    <div className="text-[11px] sm:text-xs font-black tracking-tight leading-tight text-white drop-shadow-sm">
                      {book.title}
                    </div>
                    <div className="text-[8px] text-white/90 font-medium truncate mt-0.5">
                      {book.subtitle}
                    </div>
                  </div>

                  {/* Gold bookmark ribbon sticking out */}
                  <div className="absolute right-3.5 -bottom-2 w-2 h-4 bg-amber-400 rounded-b-xs shadow-xs" />

                  {/* Bottom Grade Indicator */}
                  <div className="flex items-center justify-between text-[8px] text-white/80 font-semibold pt-1 border-t border-white/20">
                    <span>LỚP 10</span>
                    <BookOpen className="w-2.5 h-2.5 text-white/90" />
                  </div>
                </motion.div>

                {/* Opened page reveal underneath cover */}
                {isOpened && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-y-0.5 right-0.5 left-2 bg-amber-50 rounded-r-xs p-1.5 flex flex-col justify-between z-5 shadow-inner border border-amber-200"
                  >
                    <div className="text-[8px] font-bold text-emerald-950 line-clamp-2">
                      📖 {book.title}: Sẵn sàng luyện tập!
                    </div>
                    <div className="flex items-center justify-between text-[7px] text-emerald-800 font-semibold">
                      <span>Đã tải</span>
                      <Check className="w-2.5 h-2.5 text-emerald-600" />
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected book alert / caption */}
      <div className="h-5 mt-1 flex items-center justify-center">
        {openedBook ? (
          <motion.span
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] sm:text-[11px] font-bold text-emerald-950 bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full shadow-xs"
          >
            Đang mở: {books.find(b => b.id === openedBook)?.title} — Nhấp lại để đóng
          </motion.span>
        ) : (
          <span className="text-[10px] text-white/80 font-medium">
            Nhấp chọn môn để vào bài luyện
          </span>
        )}
      </div>
    </div>
  );
};
