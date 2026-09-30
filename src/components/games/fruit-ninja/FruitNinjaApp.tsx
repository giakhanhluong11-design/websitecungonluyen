import React, { useState, useEffect } from 'react';
import { Play, Settings, Trophy, BookOpen, RotateCcw, Home, X } from 'lucide-react';
import { FruitNinjaGameplay } from './FruitNinjaGameplay';
import { questionBank } from './questions';

type Screen = 'HOME' | 'PLAY_CLASSIC' | 'PLAY_PRACTICE' | 'LEADERBOARD' | 'SETTINGS';

interface FruitNinjaAppProps {
  onClose: () => void;
}

export const FruitNinjaApp: React.FC<FruitNinjaAppProps> = ({ onClose }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('HOME');
  
  const [stats, setStats] = useState({
    bestScore: 0,
    bestCombo: 0,
    highestLevel: 1,
    totalCorrect: 0
  });

  useEffect(() => {
    const saved = localStorage.getItem('fruit_ninja_stats');
    if (saved) {
      try {
        setStats(JSON.parse(saved));
      } catch(e) {}
    }
  }, []);

  const handleGameOver = (score: number, combo: number, level: number, correct: number) => {
    setStats(prev => {
      const newStats = {
        bestScore: Math.max(prev.bestScore, score),
        bestCombo: Math.max(prev.bestCombo, combo),
        highestLevel: Math.max(prev.highestLevel, level),
        totalCorrect: prev.totalCorrect + correct
      };
      localStorage.setItem('fruit_ninja_stats', JSON.stringify(newStats));
      return newStats;
    });
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'HOME':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                <span>🍎</span>
                <span className="text-red-500 bg-clip-text text-transparent bg-gradient-to-b from-red-400 to-red-600">BRITISH</span>
                <span>🍊</span>
                <span className="text-orange-500 bg-clip-text text-transparent bg-gradient-to-b from-orange-400 to-orange-600">FRUIT</span>
                <span>🍓</span>
                <span className="text-rose-500 bg-clip-text text-transparent bg-gradient-to-b from-rose-400 to-rose-600">NINJA</span>
              </div>
              <p className="text-lg sm:text-xl text-yellow-300 font-bold tracking-widest uppercase drop-shadow-md">
                “Slash your way to English mastery.”
              </p>
            </div>

            <div className="flex flex-col gap-4 w-64 max-w-full">
              <button
                onClick={() => setCurrentScreen('PLAY_CLASSIC')}
                className="group relative px-6 py-4 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-black text-xl rounded-2xl shadow-[0_8px_0_#991b1b] active:shadow-[0_0px_0_#991b1b] active:translate-y-2 transition-all flex items-center justify-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-white/20 -skew-x-12 -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></div>
                <Play className="w-6 h-6 fill-white" />
                PLAY CLASSIC
              </button>

              <button
                onClick={() => setCurrentScreen('PLAY_PRACTICE')}
                className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-lg rounded-2xl shadow-[0_6px_0_#065f46] active:shadow-[0_0px_0_#065f46] active:translate-y-1.5 transition-all flex items-center justify-center gap-3"
              >
                <BookOpen className="w-5 h-5" />
                PRACTICE
              </button>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setCurrentScreen('LEADERBOARD')}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 text-white font-bold text-sm rounded-2xl shadow-[0_4px_0_#475569] active:shadow-[0_0px_0_#475569] active:translate-y-1 transition-all flex flex-col items-center gap-1"
                >
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  LEADERBOARD
                </button>
                <button
                  onClick={() => setCurrentScreen('SETTINGS')}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 text-white font-bold text-sm rounded-2xl shadow-[0_4px_0_#475569] active:shadow-[0_0px_0_#475569] active:translate-y-1 transition-all flex flex-col items-center gap-1"
                >
                  <Settings className="w-5 h-5 text-slate-400" />
                  SETTINGS
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'PLAY_CLASSIC':
      case 'PLAY_PRACTICE':
        return (
          <FruitNinjaGameplay
            mode={currentScreen === 'PLAY_CLASSIC' ? 'CLASSIC' : 'PRACTICE'}
            questions={questionBank}
            onGameOver={handleGameOver}
            onExit={() => setCurrentScreen('HOME')}
          />
        );

      case 'LEADERBOARD':
        return (
          <div className="flex flex-col items-center justify-center h-full text-white max-w-md mx-auto w-full px-4">
            <h2 className="text-3xl font-black mb-8 text-yellow-400 drop-shadow-md flex items-center gap-3">
              <Trophy className="w-8 h-8" />
              LEADERBOARD
            </h2>
            <div className="bg-slate-900/80 border border-slate-700 rounded-3xl p-6 w-full space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-700">
                <span className="text-slate-400 font-bold">Best Score</span>
                <span className="text-xl font-black text-white">{stats.bestScore}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-700">
                <span className="text-slate-400 font-bold">Best Combo</span>
                <span className="text-xl font-black text-white">x{stats.bestCombo}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-700">
                <span className="text-slate-400 font-bold">Highest Level</span>
                <span className="text-xl font-black text-white">{stats.highestLevel}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-400 font-bold">Total Correct</span>
                <span className="text-xl font-black text-white">{stats.totalCorrect}</span>
              </div>
            </div>
            <button 
              onClick={() => setCurrentScreen('HOME')}
              className="mt-8 px-8 py-3 bg-gradient-to-r from-slate-700 to-slate-800 rounded-full font-bold shadow-[0_4px_0_#334155] active:translate-y-1 active:shadow-none hover:brightness-110 flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              BACK TO HOME
            </button>
          </div>
        );

      case 'SETTINGS':
        return (
          <div className="flex flex-col items-center justify-center h-full text-white max-w-md mx-auto w-full px-4">
            <h2 className="text-3xl font-black mb-8 text-slate-300 drop-shadow-md flex items-center gap-3">
              <Settings className="w-8 h-8" />
              SETTINGS
            </h2>
            <div className="bg-slate-900/80 border border-slate-700 rounded-3xl p-6 w-full space-y-4 text-center">
              <p className="text-slate-400">Settings coming soon...</p>
            </div>
            <button 
              onClick={() => setCurrentScreen('HOME')}
              className="mt-8 px-8 py-3 bg-gradient-to-r from-slate-700 to-slate-800 rounded-full font-bold shadow-[0_4px_0_#334155] active:translate-y-1 active:shadow-none hover:brightness-110 flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              BACK TO HOME
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2d1b11] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#4a2e1d] to-[#1a0f0a] overflow-hidden select-none touch-none font-sans">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] mix-blend-overlay"></div>
      
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-12 h-12 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white/70 hover:text-white backdrop-blur-sm transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Content */}
      <div className="relative z-10 w-full h-full">
        {renderScreen()}
      </div>

      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};
