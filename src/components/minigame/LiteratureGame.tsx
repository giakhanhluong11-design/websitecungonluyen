import React, { useState, useEffect, useRef } from 'react';
import { Trophy, AlertCircle, ArrowLeft, RefreshCw, CheckCircle2, XCircle, Flame, Clock, BrainCircuit } from 'lucide-react';
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
    
    // optionRaw is like "A. trong nguồn"
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

    setTimeout(() => nextQuestion(), 3000);
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <BrainCircuit className="w-16 h-16 text-indigo-500 animate-pulse mb-4" />
        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300">Gemini AI đang sáng tác câu hỏi...</h2>
        <p className="text-sm text-slate-500 mt-2">Mỗi lần chơi là 10 câu hỏi hoàn toàn mới</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-md mx-auto">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Lỗi kết nối AI</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
        <button onClick={onBack} className="px-6 py-2 bg-slate-200 dark:bg-slate-800 rounded-xl font-semibold">Quay lại</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 w-full animate-in fade-in">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-bold text-sm border border-indigo-100 dark:border-indigo-900/50">
            <Trophy className="w-4 h-4" />
            <span>Score: {score * 10}</span>
          </div>
          {currentCombo > 1 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 font-bold text-sm border border-orange-100 dark:border-orange-900/50 animate-bounce">
              <Flame className="w-4 h-4" />
              <span>Combo x{currentCombo}</span>
            </div>
          )}
        </div>
      </header>

      {gameState === 'intro' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center shadow-lg">
          <BrainCircuit className="w-20 h-20 text-purple-500 mx-auto mb-6" />
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Ai Là Nhà Văn?</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-lg mx-auto">
            10 câu đố văn học, tác giả, tác phẩm, ca dao tục ngữ được AI sinh ngẫu nhiên.
            Bạn có 15 giây cho mỗi câu. Vượt qua 10 câu để chứng minh đẳng cấp!
          </p>
          <button
            onClick={startGame}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-black text-lg transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/25"
          >
            BẮT ĐẦU CHƠI
          </button>
        </div>
      )}

      {(gameState === 'playing' || gameState === 'revealing') && questions.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-lg relative overflow-hidden">
          {/* Progress & Timer */}
          <div className="flex items-center justify-between mb-8">
            <span className="text-sm font-bold text-slate-500">Câu hỏi {currentIndex + 1}/10</span>
            <div className="flex items-center gap-2">
              <Clock className={`w-5 h-5 \${timeLeft <= 5 ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
              <span className={`font-mono text-xl font-bold \${timeLeft <= 5 ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}`}>
                00:{timeLeft.toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full absolute top-0 left-0">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-linear"
              style={{ width: `\${((15 - timeLeft) / 15) * 100}%` }}
            />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-8 leading-relaxed">
            {questions[currentIndex].question}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {questions[currentIndex].options.map((option, idx) => {
              const optionLetter = option.split('.')[0].trim();
              const isCorrectAnswer = optionLetter === questions[currentIndex].correctAnswer;
              
              let buttonStyle = "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 text-slate-700 dark:text-slate-200";
              
              if (gameState === 'revealing') {
                if (isCorrectAnswer) {
                  buttonStyle = "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20";
                } else if (selectedOption === optionLetter) {
                  buttonStyle = "bg-rose-50 dark:bg-rose-900/30 border-rose-500 text-rose-700 dark:text-rose-300";
                } else {
                  buttonStyle = "opacity-50 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={gameState !== 'playing'}
                  onClick={() => handleSelectOption(option)}
                  className={`p-4 rounded-2xl border-2 text-left font-medium transition-all \${buttonStyle}`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {gameState === 'revealing' && (
            <div className="mt-8 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 animate-in slide-in-from-bottom-4">
              <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
                {questions[currentIndex].explanation}
              </p>
            </div>
          )}
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center shadow-lg">
          {score >= 8 ? (
            <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-amber-500" />
            </div>
          )}
          
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
            {score === 10 ? 'Tuyệt đỉnh!' : score >= 8 ? 'Xuất sắc!' : score >= 5 ? 'Làm tốt lắm!' : 'Cần cố gắng hơn'}
          </h2>
          <p className="text-slate-500 mb-8">Bạn đã trả lời đúng {score}/10 câu hỏi.</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onBack}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-colors"
            >
              Về thư viện
            </button>
            <button
              onClick={() => {
                fetchQuestions();
                setGameState('intro');
              }}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Chơi lại (Đề mới)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
