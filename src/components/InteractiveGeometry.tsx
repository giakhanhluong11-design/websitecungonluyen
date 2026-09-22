import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Compass, RotateCw } from 'lucide-react';

interface ShapeState {
  id: string;
  name: string;
  formula: string;
  spinCount: number;
}

export const InteractiveGeometry: React.FC = () => {
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [spins, setSpins] = useState<Record<string, number>>({
    cube: 0,
    sphere: 0,
    pyramid: 0,
    torus: 0
  });

  const triggerSpin = (id: string) => {
    setSpins(prev => ({
      ...prev,
      [id]: prev[id] + 1
    }));
    setSelectedShape(id);
  };

  const shapes: ShapeState[] = [
    { id: 'cube', name: 'Hình lập phương', formula: 'V = a³', spinCount: spins.cube },
    { id: 'pyramid', name: 'Khối chóp tứ giác', formula: 'V = ⅓·S·h', spinCount: spins.pyramid },
    { id: 'sphere', name: 'Khối cầu', formula: 'V = ⁴⁄₃·π·R³', spinCount: spins.sphere },
    { id: 'torus', name: 'Vành xuyến', formula: 'V = 2π²·R·r²', spinCount: spins.torus }
  ];

  return (
    <div className="relative w-full py-1 select-none flex flex-col items-center">
      {/* Interactive instruction cue */}
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white/95 drop-shadow-xs mb-2">
        <Sparkles className="w-3.5 h-3.5 animate-bounce text-amber-300" />
        <span>Chạm vào hình để xoay & khám phá công thức</span>
      </div>

      {/* Shapes Canvas Area */}
      <div className="relative h-28 sm:h-32 w-full max-w-[280px] sm:max-w-[320px] flex items-center justify-around px-2">
        
        {/* Ambient Warm Glow behind shapes */}
        <div className="absolute inset-0 bg-white/10 blur-xl pointer-events-none rounded-2xl" />

        {/* 1. SHAPE: CUBE (Isometric 3D Box) */}
        <motion.div
          className="relative cursor-pointer group flex flex-col items-center"
          animate={{
            y: [-3, 3, -3],
            rotate: spins.cube * 90
          }}
          transition={{
            y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            rotate: { type: 'spring', stiffness: 260, damping: 18 }
          }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => triggerSpin('cube')}
          title="Hình lập phương: Nhấp để xoay"
        >
          <svg width="56" height="56" viewBox="0 0 100 100" className="drop-shadow-lg">
            <defs>
              <linearGradient id="cubeTop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#fed7aa" />
              </linearGradient>
              <linearGradient id="cubeLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#9a3412" />
              </linearGradient>
              <linearGradient id="cubeRight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>
            {/* Top Face */}
            <polygon points="50,15 82,33 50,51 18,33" fill="url(#cubeTop)" stroke="white" strokeWidth="1.5" />
            {/* Left Face */}
            <polygon points="18,33 50,51 50,87 18,69" fill="url(#cubeLeft)" stroke="#9a3412" strokeWidth="1.2" />
            {/* Right Face */}
            <polygon points="50,51 82,33 82,69 50,87" fill="url(#cubeRight)" stroke="#ea580c" strokeWidth="1.2" />
            {/* White highlights */}
            <line x1="50" y1="15" x2="82" y2="33" stroke="white" strokeWidth="1.5" strokeOpacity="0.9" />
          </svg>
          <span className="text-[9px] font-bold text-white drop-shadow-sm mt-1">
            Lập phương
          </span>
        </motion.div>

        {/* 2. SHAPE: PYRAMID (Chóp tứ giác) */}
        <motion.div
          className="relative cursor-pointer group flex flex-col items-center"
          animate={{
            y: [3, -3, 3],
            rotateY: spins.pyramid * 180
          }}
          transition={{
            y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 },
            rotateY: { type: 'spring', stiffness: 220, damping: 16 }
          }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => triggerSpin('pyramid')}
          title="Khối chóp: Nhấp để lật mặt"
        >
          <svg width="56" height="56" viewBox="0 0 100 100" className="drop-shadow-lg">
            <defs>
              <linearGradient id="pyrFront" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#fed7aa" />
              </linearGradient>
              <linearGradient id="pyrSide" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c2410c" />
                <stop offset="100%" stopColor="#7c2d12" />
              </linearGradient>
            </defs>
            {/* Base projection */}
            <polygon points="50,15 15,75 55,88" fill="url(#pyrFront)" stroke="white" strokeWidth="1.5" />
            <polygon points="50,15 55,88 85,70" fill="url(#pyrSide)" stroke="#7c2d12" strokeWidth="1.2" />
            <line x1="50" y1="15" x2="55" y2="88" stroke="white" strokeWidth="1.5" strokeOpacity="0.9" />
          </svg>
          <span className="text-[9px] font-bold text-white drop-shadow-sm mt-1">
            Khối chóp
          </span>
        </motion.div>

        {/* 3. SHAPE: SPHERE (Mặt cầu với kinh tuyến, vĩ tuyến & bóng sáng) */}
        <motion.div
          className="relative cursor-pointer group flex flex-col items-center"
          animate={{
            y: [-2, 4, -2],
            rotate: spins.sphere * 120
          }}
          transition={{
            y: { duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 },
            rotate: { type: 'spring', stiffness: 280, damping: 20 }
          }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => triggerSpin('sphere')}
          title="Khối cầu: Nhấp để xoay"
        >
          <svg width="56" height="56" viewBox="0 0 100 100" className="drop-shadow-lg">
            <defs>
              <radialGradient id="sphereGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="35%" stopColor="#fed7aa" />
                <stop offset="75%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#9a3412" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="34" fill="url(#sphereGrad)" stroke="white" strokeWidth="1.2" />
            {/* Latitude Ring */}
            <ellipse cx="50" cy="50" rx="34" ry="12" fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="1.2" strokeDasharray="3 2" />
            {/* Longitude Ring */}
            <ellipse cx="50" cy="50" rx="14" ry="34" fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="1.2" />
            {/* Gloss highlight */}
            <circle cx="38" cy="38" r="6" fill="white" fillOpacity="0.85" filter="blur(1px)" />
          </svg>
          <span className="text-[9px] font-bold text-white drop-shadow-sm mt-1">
            Khối cầu
          </span>
        </motion.div>

        {/* 4. SHAPE: TORUS / VÀNH TRÒN */}
        <motion.div
          className="relative cursor-pointer group flex flex-col items-center hidden sm:flex"
          animate={{
            y: [3, -3, 3],
            rotate: spins.torus * 90 + 20
          }}
          transition={{
            y: { duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 },
            rotate: { type: 'spring', stiffness: 240, damping: 18 }
          }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => triggerSpin('torus')}
          title="Vành xuyến: Nhấp để xoay"
        >
          <svg width="56" height="56" viewBox="0 0 100 100" className="drop-shadow-lg">
            <defs>
              <linearGradient id="torusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#fed7aa" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>
            <ellipse cx="50" cy="50" rx="35" ry="20" fill="none" stroke="url(#torusGrad)" strokeWidth="12" />
            <ellipse cx="50" cy="50" rx="35" ry="20" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.8" strokeDasharray="4 3" />
          </svg>
          <span className="text-[9px] font-bold text-white drop-shadow-sm mt-1">
            Vành xuyến
          </span>
        </motion.div>
      </div>

      {/* Selected shape details / formula badge */}
      <div className="h-5 mt-1 flex items-center justify-center">
        {selectedShape ? (
          <motion.div
            key={selectedShape + spins[selectedShape]}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-orange-950 bg-white/95 px-2.5 py-0.5 rounded-full shadow-md"
          >
            <RotateCw className="w-2.5 h-2.5 text-orange-600 animate-spin" />
            <span>
              {shapes.find(s => s.id === selectedShape)?.name}: <code>{shapes.find(s => s.id === selectedShape)?.formula}</code>
            </span>
          </motion.div>
        ) : (
          <span className="text-[10px] text-white/80 font-medium">
            Chạm hình học để xem công thức thi 10
          </span>
        )}
      </div>
    </div>
  );
};
