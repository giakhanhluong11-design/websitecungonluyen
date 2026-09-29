import React, { useState, useEffect, useRef } from 'react';
import { Trophy, AlertCircle, ArrowLeft, RefreshCw, CheckCircle2, XCircle, Flame, Clock, BrainCircuit, X } from 'lucide-react';
import { MinigameResult } from '../../types';

interface LiteratureGameProps {
  onBack: () => void;
  onSaveResult: (result: MinigameResult) => { isNewBest: boolean };
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export const LiteratureGame: React.FC<LiteratureGameProps> = ({ onBack, onSaveResult }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'revealing' | 'gameover'>('intro');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const [bestCombo, setBestCombo] = useState(0);
  const [currentCombo, setCurrentCombo] = useState(0);

  const timerRef = useRef<number | null>(null);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/generate/literature-minigame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 10 }),
      });
      const data = await res.json();
      if (data.success && data.questions) {
        setQuestions(data.questions);
      } else {
        setError(data.error || 'Lỗi khi tải câu hỏi từ AI');
      }
    } catch (err: any) {
      setError(err.message || 'Không thể kết nối đến máy chủ AI');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = window.setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (gameState === 'playing' && timeLeft === 0) {
      handleTimeOut();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, gameState]);

  const startGame = () => {
    if (questions.length === 0) return;
    setGameState('playing');
    setCurrentIndex(0);
    setScore(0);
    setCurrentCombo(0);
    setBestCombo(0);
    setTimeLeft(15);
  };

  const handleTimeOut = () => {
    setSelectedOption(null);
    setGameState('revealing');
    setCurrentCombo(0);
    setTimeout(() => nextQuestion(), 3000);
  };

  const handleSelectOption = (optionRaw: string) => {
    if (gameState !== 'playing') return;
    
    const optionLetter = optionRaw.split('.')[0].trim();
    setSelectedOption(optionLetter);
    setGameState('revealing');

    const isCorrect = optionLetter === questions[currentIndex].correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
      const newCombo = currentCombo + 1;
      setCurrentCombo(newCombo);
      setBestCombo(prev => Math.max(prev, newCombo));
    } else {
      setCurrentCombo(0);
    }

    setTimeout(() => nextQuestion(), 4000);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setGameState('playing');
      setSelectedOption(null);
      setTimeLeft(15);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setGameState('gameover');
    const finalScore = score * 10;
    const result: MinigameResult = {
      id: Date.now().toString(),
      player: 'Anonymous',
      subject: 'van',
      gameType: 'quiz',
      gameId: 'ai-la-nha-van',
      gameTitle: 'Ai là nhà văn?',
      score: finalScore,
      correct: score,
      total: questions.length,
      bestCombo: Math.max(bestCombo, currentCombo),
      timeSeconds: 0,
      createdAt: new Date().toISOString()
    };
    onSaveResult(result);
  };

  // Helper cho hình đa giác (Hexagon-like) để tạo kiểu viền vát góc giống Ai là triệu phú
  const hexagonClipPath = 'polygon(20px 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 20px 100%, 0 50%)';

  if (loading) {
    return (
      <div className="w-full h-[80vh] flex flex-col items-center justify-center bg-[#130724] rounded-3xl text-white">
        <BrainCircuit className="w-16 h-16 text-purple-500 animate-pulse mb-4" />
        <h2 className="text-xl font-bold">Đang kết nối trường quay...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[80vh] flex flex-col items-center justify-center bg-[#130724] rounded-3xl text-white text-center p-8">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Lỗi kết nối</h2>
        <p className="text-slate-400 mb-6">{error}</p>
        <button onClick={onBack} className="px-6 py-2 bg-purple-900/50 hover:bg-purple-800 rounded-xl font-semibold border border-purple-500/30">Quay lại</button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[80vh] rounded-3xl overflow-hidden relative font-sans animate-in fade-in bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900 via-[#1e053d] to-black shadow-2xl border border-purple-900/50">
      
      {/* Background Decorative Grid/Lines like the show */}
      <div className="absolute inset-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Top Navigation Bar */}
      <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-center z-20">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/10 transition-colors cursor-pointer">
          <X className="w-5 h-5" />
        </button>
        <div className="text-white/60 font-bold tracking-widest text-sm uppercase">
          {gameState === 'intro' ? 'GameVui' : 'Trường quay'}
        </div>
        <div className="w-10 h-10" /> {/* Spacer for centering */}
      </div>

      {gameState === 'intro' && (
        <div className="relative z-10 w-full h-full min-h-[80vh] flex flex-col items-center justify-center p-6 mt-6">
          {/* Logo */}
          <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full flex flex-col items-center justify-center mb-10 shadow-[0_0_50px_rgba(161,134,65,0.4)] overflow-hidden">
            <img src="/ai-la-nha-van-logo.jpg" alt="Ai Là Nhà Văn Logo" className="w-full h-full object-cover" />
          </div>

          <h1 className="sr-only">AI LÀ NHÀ VĂN</h1>
          <p className="text-purple-200 font-medium mb-12 uppercase tracking-[0.2em] text-xs md:text-sm">
            Thử tài văn học (H5)
          </p>

          <div className="flex flex-col gap-4 w-full max-w-xs">
            <button
              onClick={startGame}
              className="py-3 px-6 bg-gradient-to-b from-purple-700 to-purple-950 hover:from-purple-600 hover:to-purple-900 border border-purple-500 text-[#ebd288] font-bold rounded-full transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] uppercase tracking-wider cursor-pointer"
            >
              Bắt đầu
            </button>
            <button
              onClick={onBack}
              className="py-3 px-6 bg-[#180528] hover:bg-[#2a0e44] border border-white/10 text-white/70 font-bold rounded-full transition-all uppercase tracking-wider cursor-pointer"
            >
              Giới thiệu
            </button>
          </div>
          
          <p className="text-white/40 text-[10px] mt-12">
            Ưu tiên chơi ở màn hình lớn để trải nghiệm như ở trường quay.
          </p>
        </div>
      )}

      {(gameState === 'playing' || gameState === 'revealing') && questions.length > 0 && (
        <div className="relative z-10 w-full h-full min-h-[80vh] flex flex-col p-4 sm:p-8 mt-12 sm:mt-4">
          
          {/* Game Top Info */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 sm:mb-auto">
            {/* Left: Question Num & Timer */}
            <div className="flex items-center gap-4">
              <div className="px-4 py-1.5 rounded-full bg-purple-900/50 border border-purple-500/50 text-white font-bold text-xs sm:text-sm tracking-widest">
                CÂU {currentIndex + 1}/10
              </div>
              <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-black text-xl bg-black/40 \${timeLeft <= 5 ? 'text-rose-500 border-rose-500 animate-pulse' : 'text-[#ebd288] border-[#ebd288]'}`}>
                {timeLeft}
              </div>
            </div>

            {/* Right: Topic */}
            <div className="px-4 py-1.5 rounded-full bg-purple-900/50 border border-purple-500/50 text-white font-bold text-xs sm:text-sm tracking-widest uppercase flex items-center gap-2">
              Chủ đề: Văn Học
            </div>
          </div>

          {/* Logo top left background (decorative) */}
          <div className="absolute top-24 left-8 opacity-40 pointer-events-none hidden lg:flex flex-col items-center">
            <div className="w-24 h-24 rounded-full shadow-2xl shadow-[#a18641]/20 overflow-hidden">
              <img src="/ai-la-nha-van-logo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Question Box */}
          <div className="w-full max-w-4xl mx-auto mb-6 sm:mb-12 mt-4 sm:mt-auto relative">
            <div 
              className="w-full min-h-[80px] bg-gradient-to-b from-purple-800 to-[#2a0e44] border-y-2 border-purple-400 flex items-center justify-center p-6 sm:p-10 text-center shadow-[0_0_30px_rgba(168,85,247,0.3)]"
              style={{ clipPath: hexagonClipPath }}
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-relaxed drop-shadow-md px-4 sm:px-10">
                {questions[currentIndex].question}
              </h2>
            </div>
          </div>

          {/* Answers Grid */}
          <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 mb-4">
            {questions[currentIndex].options.map((option, idx) => {
              const optionLetter = option.split('.')[0].trim();
              const optionText = option.substring(option.indexOf('.') + 1).trim();
              const isCorrectAnswer = optionLetter === questions[currentIndex].correctAnswer;
              
              // Base style
              let bgGradient = "from-[#290d45] to-[#110520]";
              let borderColor = "border-purple-500";
              let textColor = "text-white";
              let letterColor = "text-[#ebd288]";
              
              if (gameState === 'revealing') {
                if (isCorrectAnswer) {
                  // Correct -> Green
                  bgGradient = "from-[#15803d] to-[#14532d] animate-pulse";
                  borderColor = "border-[#4ade80]";
                  letterColor = "text-white";
                } else if (selectedOption === optionLetter) {
                  // Wrong picked -> Orange
                  bgGradient = "from-[#b45309] to-[#78350f]";
                  borderColor = "border-[#f59e0b]";
                  letterColor = "text-white";
                } else {
                  // Dim others
                  bgGradient = "from-[#130520] to-black";
                  borderColor = "border-purple-900";
                  textColor = "text-white/30";
                  letterColor = "text-white/30";
                }
              } else if (selectedOption === optionLetter && gameState === 'playing') {
                // Picked but waiting for reveal (mocking suspense)
                bgGradient = "from-[#b45309] to-[#78350f]";
                borderColor = "border-[#f59e0b]";
                letterColor = "text-white";
              }

              return (
                <button
                  key={idx}
                  disabled={gameState !== 'playing'}
                  onClick={() => handleSelectOption(option)}
                  className={`cursor-pointer w-full group relative flex items-center min-h-[50px] sm:min-h-[60px] bg-gradient-to-b \${bgGradient} border-y-2 \${borderColor} px-6 sm:px-10 transition-all hover:brightness-125 disabled:cursor-default`}
                  style={{ clipPath: hexagonClipPath }}
                >
                  <div className={`absolute left-8 sm:left-12 font-bold text-lg sm:text-xl drop-shadow-md \${letterColor}`}>
                    {optionLetter}
                  </div>
                  <div className={`ml-8 sm:ml-12 text-left font-semibold text-sm sm:text-lg \${textColor} drop-shadow-md`}>
                    {optionText}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation Toast during revealing */}
          {gameState === 'revealing' && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#1b082e]/95 border border-[#a18641]/80 p-6 rounded-2xl backdrop-blur-md w-full max-w-md animate-in zoom-in text-center z-50 shadow-[0_0_40px_rgba(161,134,65,0.4)]">
              <p className="text-white text-sm sm:text-base font-medium">
                {questions[currentIndex].explanation}
              </p>
            </div>
          )}

        </div>
      )}

      {gameState === 'gameover' && (
        <div className="relative z-10 w-full h-full min-h-[80vh] flex flex-col items-center justify-center p-6 text-center mt-6">
           <div className="w-32 h-32 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(161,134,65,0.3)] overflow-hidden">
             <img src="/ai-la-nha-van-logo.jpg" alt="Logo" className="w-full h-full object-cover" />
           </div>
           
           <h2 className="text-3xl sm:text-4xl font-black text-[#ebd288] mb-2 uppercase tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
             {score === 10 ? 'Tuyệt Đỉnh!' : score >= 8 ? 'Xuất Sắc!' : score >= 5 ? 'Làm Tốt Lắm!' : 'Cần Cố Gắng Thêm'}
           </h2>
           <p className="text-xl text-purple-200 mb-8 font-medium">Bạn đã trả lời đúng {score}/10 câu hỏi.</p>
           
           <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
             <button
               onClick={onBack}
               className="flex-1 py-3 px-6 bg-[#180528] hover:bg-[#2a0e44] border border-white/20 text-white/80 font-bold rounded-full transition-all uppercase tracking-wider text-sm cursor-pointer"
             >
               Kết thúc
             </button>
             <button
               onClick={() => {
                 fetchQuestions();
                 setGameState('intro');
               }}
               className="flex-1 py-3 px-6 bg-gradient-to-b from-purple-700 to-purple-950 hover:from-purple-600 hover:to-purple-900 border border-purple-500 text-[#ebd288] font-bold rounded-full transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] flex items-center justify-center gap-2 uppercase tracking-wider text-sm cursor-pointer"
             >
               <RefreshCw className="w-4 h-4" />
               Chơi lại
             </button>
           </div>
        </div>
      )}
    </div>
  );
};
