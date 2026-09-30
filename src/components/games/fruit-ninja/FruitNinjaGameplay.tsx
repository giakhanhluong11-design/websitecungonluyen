import React, { useEffect, useRef, useState } from 'react';
import { Question, shuffleArray } from './questions';
import { 
  GameState, 
  Point, 
  Fruit, 
  Particle,
  GRAVITY, 
  CANVAS_WIDTH, 
  CANVAS_HEIGHT, 
  lineIntersectsCircle, 
  createExplosion,
  FRUIT_COLORS
} from './fruitNinjaEngine';
import { XCircle, Trophy, RotateCcw, AlertTriangle } from 'lucide-react';

interface FruitNinjaGameplayProps {
  mode: 'CLASSIC' | 'PRACTICE';
  questions: Question[];
  onGameOver: (score: number, combo: number, level: number, correct: number) => void;
  onExit: () => void;
}

export const FruitNinjaGameplay: React.FC<FruitNinjaGameplayProps> = ({ mode, questions, onGameOver, onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Ref để truy cập GameState bên trong requestAnimationFrame mà không bị closure trap
  const stateRef = useRef<GameState>({
    fruits: [],
    particles: [],
    trail: [],
    score: 0,
    combo: 0,
    lives: mode === 'CLASSIC' ? 3 : 999, // Practice có vô hạn mạng
    status: 'PLAYING',
    currentQuestion: null,
    mode,
    reviewMessage: '',
    lastSpawnTime: 0,
  });

  const [uiState, setUiState] = useState({
    score: 0,
    combo: 0,
    lives: mode === 'CLASSIC' ? 3 : 999,
    status: 'PLAYING',
    question: null as Question | null,
    reviewMessage: ''
  });

  const questionQueueRef = useRef<Question[]>([...shuffleArray(questions)]);
  const isMouseDownRef = useRef(false);
  const animationFrameRef = useRef<number>();

  const updateUi = () => {
    setUiState({
      score: stateRef.current.score,
      combo: stateRef.current.combo,
      lives: stateRef.current.lives,
      status: stateRef.current.status,
      question: stateRef.current.currentQuestion,
      reviewMessage: stateRef.current.reviewMessage
    });
  };

  const spawnQuestion = (time: number) => {
    if (questionQueueRef.current.length === 0) {
      questionQueueRef.current = [...shuffleArray(questions)]; // Loop questions
    }
    const q = questionQueueRef.current.shift()!;
    stateRef.current.currentQuestion = q;
    
    // Tạo mảng lựa chọn: 1 đúng, 3 sai, 1 bom (hoặc 2 sai + 1 bom)
    const options = [
      { text: q.correctAnswer, isCorrect: true, isBomb: false },
      ...shuffleArray(q.wrongAnswers).slice(0, 3).map(wa => ({ text: wa, isCorrect: false, isBomb: false })),
    ];
    
    // Có thể thêm 1 quả bom vào chế độ Classic cho khó
    if (mode === 'CLASSIC' && Math.random() > 0.5) {
      options.push({ text: '💣', isCorrect: false, isBomb: true });
    }

    const shuffledOptions = shuffleArray(options);
    
    const numFruits = shuffledOptions.length;
    const spacing = CANVAS_WIDTH / (numFruits + 1);

    const newFruits: Fruit[] = shuffledOptions.map((opt, index) => {
      const color = opt.isBomb ? '#111827' : FRUIT_COLORS[index % FRUIT_COLORS.length];
      return {
        id: Math.random().toString(36).substr(2, 9),
        x: spacing * (index + 1) + (Math.random() - 0.5) * 40,
        y: CANVAS_HEIGHT + 50 + Math.random() * 50,
        vx: (CANVAS_WIDTH / 2 - (spacing * (index + 1))) * 0.015 + (Math.random() - 0.5) * 2,
        vy: -15 - Math.random() * 3, // Nhảy lên
        radius: opt.isBomb ? 40 : 45,
        text: opt.text,
        isCorrect: opt.isCorrect,
        isBomb: opt.isBomb,
        isSliced: false,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        color,
      };
    });

    stateRef.current.fruits = newFruits;
    stateRef.current.lastSpawnTime = time;
    updateUi();
  };

  // ─── GAME LOOP ──────────────────────────────────────────────────────────
  const gameLoop = (time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Kích thước canvas
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width || canvas.height !== rect.height) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const scaleX = canvas.width / CANVAS_WIDTH;
    const scaleY = canvas.height / CANVAS_HEIGHT;
    
    ctx.scale(scaleX, scaleY); // Scale logic coordinates to physical canvas

    const state = stateRef.current;

    if (state.status === 'PLAYING') {
      // 1. Cập nhật Trail
      const now = performance.now();
      state.trail = state.trail.filter(p => now - p.time < 150); // Mờ dần sau 150ms

      // 2. Cập nhật và vẽ Particles
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += GRAVITY * 0.5;
        p.life -= 0.02;
        
        if (p.life <= 0) {
          state.particles.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // 3. Cập nhật và vẽ Fruits
      let allFruitsGone = true;

      for (let i = state.fruits.length - 1; i >= 0; i--) {
        const fruit = state.fruits[i];
        
        fruit.vy += GRAVITY;
        fruit.x += fruit.vx;
        fruit.y += fruit.vy;
        fruit.rotation += fruit.rotationSpeed;

        if (fruit.y < CANVAS_HEIGHT + 100) {
          allFruitsGone = false;
        }

        if (fruit.isSliced) {
          // Vẽ 2 nửa trái cây
          if (!fruit.slicedPieces) {
             fruit.slicedPieces = [
               { x: fruit.x, y: fruit.y, vx: fruit.vx - 2, vy: fruit.vy, rotation: fruit.rotation },
               { x: fruit.x, y: fruit.y, vx: fruit.vx + 2, vy: fruit.vy, rotation: fruit.rotation }
             ];
             fruit.slicedTime = now;
          }
          fruit.slicedPieces.forEach((piece, pIdx) => {
             piece.x += piece.vx;
             piece.y += piece.vy;
             piece.vy += GRAVITY;
             piece.rotation += fruit.rotationSpeed;
             
             ctx.save();
             ctx.translate(piece.x, piece.y);
             ctx.rotate(piece.rotation);
             
             ctx.fillStyle = fruit.color;
             ctx.beginPath();
             if (pIdx === 0) {
               ctx.arc(0, 0, fruit.radius, Math.PI/2, Math.PI*1.5);
             } else {
               ctx.arc(0, 0, fruit.radius, -Math.PI/2, Math.PI/2);
             }
             ctx.fill();
             
             // Vẽ màu bên trong
             ctx.fillStyle = '#fff9c4';
             ctx.beginPath();
             if (pIdx === 0) {
               ctx.arc(0, 0, fruit.radius * 0.8, Math.PI/2, Math.PI*1.5);
             } else {
               ctx.arc(0, 0, fruit.radius * 0.8, -Math.PI/2, Math.PI/2);
             }
             ctx.fill();
             
             ctx.restore();
          });

        } else {
          // Vẽ trái cây nguyên vẹn
          ctx.save();
          ctx.translate(fruit.x, fruit.y);
          
          if (fruit.isBomb) {
            ctx.rotate(fruit.rotation);
            ctx.fillStyle = '#1f2937';
            ctx.beginPath();
            ctx.arc(0, 0, fruit.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Vẽ ngòi nổ
            ctx.strokeStyle = '#fca5a5';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(0, -fruit.radius);
            ctx.quadraticCurveTo(20, -fruit.radius - 20, 10, -fruit.radius - 30);
            ctx.stroke();
            
            // Text bom không xoay
            ctx.rotate(-fruit.rotation);
            ctx.fillStyle = '#ef4444';
            ctx.font = 'bold 24px Inter';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('💣', 0, 0);
          } else {
            // Fruit BG xoay
            ctx.rotate(fruit.rotation);
            ctx.fillStyle = fruit.color;
            ctx.beginPath();
            ctx.arc(0, 0, fruit.radius, 0, Math.PI * 2);
            ctx.fill();
            // Cuống
            ctx.fillStyle = '#166534';
            ctx.fillRect(-4, -fruit.radius - 8, 8, 12);
            
            // Chữ bên trên KHÔNG xoay để dễ đọc
            ctx.rotate(-fruit.rotation);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 20px Inter';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = 'rgba(0,0,0,0.8)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetY = 2;
            
            // Handle long text wrapping simply by shrinking or splitting
            const lines = fruit.text.split(' ');
            if (lines.length > 2) {
              ctx.font = 'bold 16px Inter';
              ctx.fillText(lines.slice(0, Math.ceil(lines.length/2)).join(' '), 0, -10);
              ctx.fillText(lines.slice(Math.ceil(lines.length/2)).join(' '), 0, 10);
            } else {
              ctx.fillText(fruit.text, 0, 0);
            }
            ctx.shadowColor = 'transparent';
          }
          
          ctx.restore();

          // ─── KIỂM TRA CHÉM TRÚNG (COLLISION) ───────────────────
          if (state.trail.length > 1) {
            const p1 = state.trail[state.trail.length - 2];
            const p2 = state.trail[state.trail.length - 1];
            
            if (lineIntersectsCircle(p1, p2, fruit)) {
              fruit.isSliced = true;
              state.particles.push(...createExplosion(fruit.x, fruit.y, fruit.color));
              
              if (fruit.isBomb) {
                // Chém trúng bom
                handleWrongAnswer("Oops! You slashed a bomb!");
              } else if (fruit.isCorrect) {
                // Chém trúng đáp án ĐÚNG
                state.score += 10 + (state.combo * 2);
                state.combo += 1;
                
                // Mở câu mới ngay sau khi chém đúng
                setTimeout(() => {
                  if (stateRef.current.status === 'PLAYING') {
                    spawnQuestion(performance.now());
                  }
                }, 1000);
                
              } else {
                // Chém trúng đáp án SAI
                handleWrongAnswer(`Wrong! The correct answer was "${state.currentQuestion?.correctAnswer}".`);
              }
              updateUi();
            }
          }
        }
      }

      // Xử lý rơi rớt: Nếu rơi hết trái mà chưa chém trúng trái đúng -> sai
      if (allFruitsGone && state.fruits.length > 0 && time - state.lastSpawnTime > 2000) {
        const hasCorrectSliced = state.fruits.some(f => f.isCorrect && f.isSliced);
        if (!hasCorrectSliced) {
          handleWrongAnswer(`Missed! The correct answer was "${state.currentQuestion?.correctAnswer}".`);
          state.combo = 0;
          updateUi();
        }
      }

      // Vẽ tia chém (Trail)
      if (state.trail.length > 0) {
        ctx.beginPath();
        ctx.moveTo(state.trail[0].x, state.trail[0].y);
        for (let i = 1; i < state.trail.length; i++) {
          ctx.lineTo(state.trail[i].x, state.trail[i].y);
        }
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#e2e8f0'; // white-ish
        ctx.shadowColor = '#60a5fa'; // blue glow
        ctx.shadowBlur = 10;
        ctx.stroke();
        
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
        ctx.shadowColor = 'transparent';
      }
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset scale
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  };

  const handleWrongAnswer = (msg: string) => {
    const state = stateRef.current;
    if (state.mode === 'CLASSIC') {
      state.lives -= 1;
      if (state.lives <= 0) {
        state.status = 'GAME_OVER';
        state.reviewMessage = msg;
      } else {
        // Classic mode but has lives? User prompt said "chém sai = thua". 
        // I'll make it instant game over for Classic mode to match "chém sai = thua"
        state.status = 'GAME_OVER';
        state.reviewMessage = msg;
      }
    } else {
      // PRACTICE MODE
      state.combo = 0;
      state.status = 'REVIEW';
      state.reviewMessage = msg;
    }
  };

  useEffect(() => {
    // Khởi tạo game
    spawnQuestion(performance.now());
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // ─── EVENT HANDLERS ───────────────────────────────────────────────────────
  const getPointerPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: ((clientX - rect.left) / rect.width) * CANVAS_WIDTH,
      y: ((clientY - rect.top) / rect.height) * CANVAS_HEIGHT,
    };
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    isMouseDownRef.current = true;
    const pos = getPointerPos(e);
    stateRef.current.trail = [{ ...pos, time: performance.now() }];
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isMouseDownRef.current) return;
    // Bỏ qua hành vi scroll trình duyệt khi quẹt trên canvas
    if (e.cancelable) e.preventDefault();
    
    const pos = getPointerPos(e);
    stateRef.current.trail.push({ ...pos, time: performance.now() });
  };

  const handlePointerUp = () => {
    isMouseDownRef.current = false;
  };

  const handleContinuePractice = () => {
    stateRef.current.status = 'PLAYING';
    spawnQuestion(performance.now());
    updateUi();
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#1e293b] flex flex-col touch-none overflow-hidden select-none">
      
      {/* ─── UI LAYER ─── */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-10 pointer-events-none">
        
        {/* Score & Combo */}
        <div className="flex flex-col gap-1">
          <div className="bg-slate-900/80 backdrop-blur rounded-xl px-4 py-2 border border-slate-700 shadow-lg flex items-center gap-2">
            <span className="text-yellow-400 font-black text-xl">{uiState.score}</span>
            <span className="text-slate-300 text-xs font-bold uppercase tracking-wider">Score</span>
          </div>
          {uiState.combo > 1 && (
            <div className="animate-in slide-in-from-left-4 fade-in font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500 text-lg drop-shadow-md">
              {uiState.combo}x COMBO!
            </div>
          )}
        </div>

        {/* Current Question */}
        <div className="flex-1 max-w-lg mx-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-xl border-2 border-indigo-100 text-center pointer-events-auto">
            <span className="inline-block px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-widest mb-1">
              {uiState.question?.category}
            </span>
            <h3 className="text-slate-800 font-bold text-sm sm:text-lg leading-snug">
              {uiState.question?.text}
            </h3>
          </div>
        </div>

        {/* Mode / Lives */}
        <div className="bg-slate-900/80 backdrop-blur rounded-xl px-4 py-2 border border-slate-700 shadow-lg flex items-center gap-2">
          <span className="text-slate-300 text-xs font-bold uppercase tracking-wider">{mode}</span>
          {mode === 'CLASSIC' && (
            <div className="flex gap-1">
              <XCircle className={`w-5 h-5 ${uiState.lives < 1 ? 'text-slate-600' : 'text-red-500'}`} />
            </div>
          )}
        </div>
      </div>

      {/* ─── CANVAS LAYER ─── */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-crosshair"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        onTouchCancel={handlePointerUp}
      />

      {/* ─── OVERLAYS ─── */}
      {uiState.status === 'REVIEW' && (
        <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <AlertTriangle className="w-8 h-8" />
              <h2 className="text-2xl font-black">Incorrect!</h2>
            </div>
            <p className="text-slate-700 font-medium mb-4">{uiState.reviewMessage}</p>
            
            <div className="bg-emerald-50 rounded-2xl p-4 mb-6 border border-emerald-100">
              <h4 className="text-emerald-800 font-bold text-sm mb-1">Correct Structure:</h4>
              <p className="text-emerald-700 text-sm leading-relaxed">{uiState.question?.explanation}</p>
            </div>

            <button 
              onClick={handleContinuePractice}
              className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg active:scale-95 transition-transform"
            >
              Continue Practice
            </button>
          </div>
        </div>
      )}

      {uiState.status === 'GAME_OVER' && (
        <div className="absolute inset-0 z-20 bg-red-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center">
          <Trophy className="w-20 h-20 text-yellow-500 mb-4 drop-shadow-lg" />
          <h2 className="text-5xl font-black text-white mb-2 tracking-tight">GAME OVER</h2>
          <p className="text-red-200 text-lg mb-8">{uiState.reviewMessage}</p>
          
          <div className="bg-black/40 rounded-3xl p-6 w-full max-w-sm mb-8 border border-red-900/50">
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-red-200 font-bold">Final Score</span>
              <span className="text-2xl font-black text-white">{uiState.score}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-red-200 font-bold">Max Combo</span>
              <span className="text-xl font-black text-white">x{uiState.combo}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={onExit}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-2 transition-colors"
            >
              Back to Menu
            </button>
            <button 
              onClick={() => {
                onGameOver(uiState.score, uiState.combo, 1, 0); // Save to local storage logic in parent
                // Quick restart
                stateRef.current.score = 0;
                stateRef.current.combo = 0;
                stateRef.current.status = 'PLAYING';
                spawnQuestion(performance.now());
                updateUi();
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 hover:brightness-110 text-white font-bold flex items-center gap-2 shadow-lg transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              Play Again
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
