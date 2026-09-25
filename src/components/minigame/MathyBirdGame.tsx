import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  ArrowLeft, 
  Trophy, 
  Zap, 
  Flame, 
  Sparkles, 
  Maximize2, 
  HelpCircle,
  Play,
  Share2
} from 'lucide-react';
import { MinigameResult } from '../../types';

interface MathyBirdGameProps {
  onBackToHub: () => void;
  onSaveResult: (result: MinigameResult) => { isNewBest: boolean };
  currentBestScore: number;
}

// -------------------------------------------------------------
// SOUND SYNTHESIZER (Pure Web Audio API - Zero dependencies)
// -------------------------------------------------------------
class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled = true;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playFlap() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(620, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.13);
    } catch {
      // Audio context error ignore
    }
  }

  playCorrect() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        gain.gain.setValueAtTime(0.18, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.19);
      });
    } catch {
      // Audio context error ignore
    }
  }

  playGameOver() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.35);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.36);
    } catch {
      // Audio context error ignore
    }
  }
}

// -------------------------------------------------------------
// MATH PROBLEM GENERATOR
// -------------------------------------------------------------
interface MathProblem {
  question: string;
  correctAnswer: number;
  options: number[]; // 2 options: [Top, Bottom]
  correctIndex: number; // 0: Top, 1: Bottom
}

function generateDistractor(correct: number): number {
  const candidateDeltas = [1, -1, 2, -2, 5, -5, 10, -10, 3, -3, 4, -4].sort(() => Math.random() - 0.5);

  for (const d of candidateDeltas) {
    const val = correct + d;
    if (val >= 0 && val !== correct) {
      return val;
    }
  }

  return correct > 5 ? correct - 2 : correct + 2;
}

function generateMathProblem(): MathProblem {
  // 3 types:
  // 0: + or - within 1-2 digits, positive result
  // 1: 1-digit multiplication
  // 2: 2-digit multiplication ending in 0 or 5
  const cat = Math.floor(Math.random() * 3);
  let question = '';
  let correctAnswer = 0;

  if (cat === 0) {
    const isAdd = Math.random() > 0.45;
    if (isAdd) {
      const a = Math.floor(Math.random() * 60) + 6; // 6..65
      const b = Math.floor(Math.random() * 35) + 4; // 4..38
      correctAnswer = a + b;
      question = `${a} + ${b} = ?`;
    } else {
      const a = Math.floor(Math.random() * 70) + 20; // 20..89
      const b = Math.floor(Math.random() * (a - 5)) + 4; // 4..a-1
      correctAnswer = a - b;
      question = `${a} - ${b} = ?`;
    }
  } else if (cat === 1) {
    const a = Math.floor(Math.random() * 8) + 2; // 2..9
    const b = Math.floor(Math.random() * 8) + 2; // 2..9
    correctAnswer = a * b;
    question = `${a} × ${b} = ?`;
  } else {
    const candidates = [10, 15, 20, 25, 30, 35, 40, 50];
    const a = candidates[Math.floor(Math.random() * candidates.length)];
    const b = Math.floor(Math.random() * 5) + 2; // 2..6
    correctAnswer = a * b;
    question = `${a} × ${b} = ?`;
  }

  const distractor = generateDistractor(correctAnswer);
  const options = [correctAnswer, distractor].sort(() => Math.random() - 0.5);
  const correctIndex = options.indexOf(correctAnswer);

  return {
    question,
    correctAnswer,
    options,
    correctIndex
  };
}

// -------------------------------------------------------------
// GAME ENTITIES: BIRD, OBSTACLE, PARTICLE
// -------------------------------------------------------------
class Bird {
  x: number;
  y: number;
  radius = 18;
  vy = 0;
  gravity = 0.38;
  jumpForce = -7.5;
  rotation = 0;
  wingAngle = 0;
  flapping = false;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  jump() {
    this.vy = this.jumpForce;
    this.flapping = true;
  }

  update() {
    this.vy += this.gravity;
    this.y += this.vy;

    // Smooth rotation: tilt up when rising, dive down when falling
    const targetRot = Math.min(Math.PI / 2.4, Math.max(-Math.PI / 4, (this.vy * 0.08)));
    this.rotation += (targetRot - this.rotation) * 0.18;

    // Wing flap oscillation
    if (this.flapping || this.vy < 0) {
      this.wingAngle = Math.sin(Date.now() * 0.025) * 0.8;
    } else {
      this.wingAngle = 0.1;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Drop shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;

    // Body (Round cute bird with gradient)
    const bodyGrad = ctx.createRadialGradient(-4, -4, 2, 0, 0, this.radius);
    bodyGrad.addColorStop(0, '#fef08a'); // yellow-200
    bodyGrad.addColorStop(0.6, '#facc15'); // yellow-400
    bodyGrad.addColorStop(1, '#eab308'); // yellow-500

    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = bodyGrad;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ca8a04';
    ctx.stroke();

    // Belly (soft lighter crescent)
    ctx.shadowColor = 'transparent';
    ctx.beginPath();
    ctx.arc(-2, 3, this.radius * 0.65, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Wing with flap animation
    ctx.save();
    ctx.translate(-5, 0);
    ctx.rotate(this.wingAngle);
    ctx.beginPath();
    ctx.ellipse(0, 0, this.radius * 0.65, this.radius * 0.42, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#d97706';
    ctx.stroke();
    ctx.restore();

    // Big anime-like eye
    const eyeX = 7;
    const eyeY = -5;
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, 6.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Pupil
    ctx.beginPath();
    ctx.arc(eyeX + 1.5, eyeY, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();

    // Eye highlight
    ctx.beginPath();
    ctx.arc(eyeX + 2.5, eyeY - 1.5, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Beak
    ctx.beginPath();
    ctx.moveTo(this.radius - 2, -2);
    ctx.lineTo(this.radius + 12, 1);
    ctx.lineTo(this.radius - 1, 7);
    ctx.closePath();
    ctx.fillStyle = '#f97316';
    ctx.fill();
    ctx.strokeStyle = '#c2410c';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Cheek blush
    ctx.beginPath();
    ctx.arc(3, 5, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(244, 63, 94, 0.4)';
    ctx.fill();

    ctx.restore();
  }
}

interface PortalZone {
  top: number;
  bottom: number;
  value: number;
  isCorrect: boolean;
}

class Obstacle {
  x: number;
  width = 76;
  speed: number;
  problem: MathProblem;
  scored = false;

  // 2 large portals configuration
  // Total playable height: 0 to 530 (ground is at 530)
  // Top Wall: 0 - 45 (height 45)
  // Gap 0 (Top Portal): 45 - 235 (height 190 - super spacious!)
  // Dividing Wall: 235 - 320 (height 85)
  // Gap 1 (Bottom Portal): 320 - 510 (height 190 - super spacious!)
  // Bottom Wall: 510 - 530 (height 20)
  portals: PortalZone[];

  constructor(x: number, speed: number) {
    this.x = x;
    this.speed = speed;
    this.problem = generateMathProblem();

    this.portals = [
      {
        top: 45,
        bottom: 235,
        value: this.problem.options[0],
        isCorrect: this.problem.correctIndex === 0
      },
      {
        top: 320,
        bottom: 510,
        value: this.problem.options[1],
        isCorrect: this.problem.correctIndex === 1
      }
    ];
  }

  update() {
    this.x -= this.speed;
  }

  draw(ctx: CanvasRenderingContext2D, groundY: number) {
    ctx.save();

    // 1. Draw solid wall segments
    const wallSegments = [
      { y: 0, h: 45 },
      { y: 235, h: 85 },
      { y: 510, h: groundY - 510 }
    ];

    for (const seg of wallSegments) {
      if (seg.h <= 0) continue;

      // Stylized brick / pillar gradient
      const wallGrad = ctx.createLinearGradient(this.x, seg.y, this.x + this.width, seg.y);
      wallGrad.addColorStop(0, '#334155');
      wallGrad.addColorStop(0.3, '#475569');
      wallGrad.addColorStop(0.8, '#334155');
      wallGrad.addColorStop(1, '#1e293b');

      ctx.fillStyle = wallGrad;
      ctx.fillRect(this.x, seg.y, this.width, seg.h);

      // Border and brick lines
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.strokeRect(this.x, seg.y, this.width, seg.h);

      // Horizontal brick mortar lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      const step = 20;
      for (let ly = seg.y + step; ly < seg.y + seg.h; ly += step) {
        ctx.beginPath();
        ctx.moveTo(this.x, ly);
        ctx.lineTo(this.x + this.width, ly);
        ctx.stroke();
      }
    }

    // 2. Draw 2 portals (Cổng đáp án siêu rộng)
    this.portals.forEach((p, idx) => {
      const portalHeight = p.bottom - p.top;
      const portalCenterY = (p.top + p.bottom) / 2;
      const portalCenterX = this.x + this.width / 2;

      // Portal side light rails (cyan/violet glow)
      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.fillRect(this.x, p.top, 4, portalHeight);
      ctx.fillRect(this.x + this.width - 4, p.top, 4, portalHeight);

      // Answer billboard/sign in the center of the gap
      const badgeW = 68;
      const badgeH = 38;
      const badgeX = portalCenterX - badgeW / 2;
      const badgeY = portalCenterY - badgeH / 2;

      // Soft glow
      ctx.shadowColor = 'rgba(14, 165, 233, 0.45)';
      ctx.shadowBlur = 12;

      // Rounded pill badge
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 12);
      const bgGrad = ctx.createLinearGradient(badgeX, badgeY, badgeX, badgeY + badgeH);
      bgGrad.addColorStop(0, '#ffffff');
      bgGrad.addColorStop(1, '#f1f5f9');
      ctx.fillStyle = bgGrad;
      ctx.fill();

      // Border
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#0284c7';
      ctx.stroke();

      // Portal number badge label
      ctx.shadowColor = 'transparent';
      ctx.font = 'bold 20px "Inter", system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(p.value.toString(), portalCenterX, portalCenterY);

      // Gate indicator tag
      ctx.font = 'bold 10px system-ui';
      ctx.fillStyle = '#64748b';
      const slotName = idx === 0 ? 'CỔNG TRÊN' : 'CỔNG DƯỚI';
      ctx.fillText(slotName, portalCenterX, badgeY - 8);
    });

    ctx.restore();
  }
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha = 1;
  life = 1;
  decay: number;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.color = color;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 1.5;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.size = Math.random() * 5 + 3;
    this.decay = Math.random() * 0.03 + 0.02;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
    this.alpha = Math.max(0, this.life);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// -------------------------------------------------------------
// MAIN COMPONENT
// -------------------------------------------------------------
export const MathyBirdGame: React.FC<MathyBirdGameProps> = ({
  onBackToHub,
  onSaveResult,
  currentBestScore
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const soundManagerRef = useRef<SoundManager>(new SoundManager());

  // Game state
  const [gameState, setGameState] = useState<'READY' | 'PLAYING' | 'GAMEOVER'>('READY');
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(currentBestScore);
  const [currentQuestion, setCurrentQuestion] = useState('Sẵn sàng?');
  const [gameOverReason, setGameOverReason] = useState('');
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTutorialModal, setShowTutorialModal] = useState(false);

  // References to keep engine state in sync with animation frame
  const engineRef = useRef({
    bird: new Bird(160, 260),
    obstacles: [] as Obstacle[],
    particles: [] as Particle[],
    score: 0,
    startTime: 0,
    speed: 2.7,
    activeQuestion: 'Bấm Bắt đầu để bay',
    groundY: 530,
    animId: 0,
    state: 'READY' as 'READY' | 'PLAYING' | 'GAMEOVER'
  });

  const toggleSound = () => {
    setIsSoundMuted(prev => {
      const next = !prev;
      soundManagerRef.current.enabled = !next;
      return next;
    });
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Jump handler (Click, Space, Touch)
  const handleFlap = useCallback(() => {
    const engine = engineRef.current;
    if (engine.state === 'READY') {
      // Start game
      startGame();
    } else if (engine.state === 'PLAYING') {
      engine.bird.jump();
      soundManagerRef.current.playFlap();

      // Emit feather particles
      for (let i = 0; i < 3; i++) {
        engine.particles.push(new Particle(engine.bird.x - 10, engine.bird.y + 8, '#fef08a'));
      }
    }
  }, []);

  // Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        handleFlap();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlap]);

  const startGame = () => {
    const engine = engineRef.current;
    engine.bird = new Bird(160, 260);
    engine.obstacles = [new Obstacle(820, 2.7)];
    engine.particles = [];
    engine.score = 0;
    engine.speed = 2.7;
    engine.startTime = Date.now();
    engine.state = 'PLAYING';
    engine.activeQuestion = engine.obstacles[0].problem.question;

    setScore(0);
    setCurrentQuestion(engine.activeQuestion);
    setGameState('PLAYING');
    setGameOverReason('');

    engine.bird.jump();
    soundManagerRef.current.playFlap();
  };

  const handleGameOver = (reason: string) => {
    const engine = engineRef.current;
    engine.state = 'GAMEOVER';
    soundManagerRef.current.playGameOver();

    // Burst crash particles
    for (let i = 0; i < 16; i++) {
      engine.particles.push(new Particle(engine.bird.x, engine.bird.y, '#ef4444'));
    }

    const durationSec = Math.max(1, Math.round((Date.now() - engine.startTime) / 1000));
    const finalScore = engine.score;

    // Save result to overall app progress
    const result: MinigameResult = {
      id: `mathy-bird-${Date.now()}`,
      player: 'Bạn',
      subject: 'toan',
      gameType: 'mathy-bird',
      gameId: 'mathy-bird',
      gameTitle: 'Mathy Bird – Chim Bay Giải Toán',
      score: finalScore,
      correct: finalScore,
      total: finalScore + 1,
      bestCombo: finalScore,
      timeSeconds: durationSec,
      createdAt: new Date().toISOString()
    };

    onSaveResult(result);

    if (finalScore > bestScore) {
      setBestScore(finalScore);
    }

    setGameOverReason(reason);
    setGameState('GAMEOVER');
  };

  // Main game loop (HTML5 Canvas 60fps)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI scaling
    const dpr = window.devicePixelRatio || 1;
    const virtualW = 800;
    const virtualH = 600;
    canvas.width = virtualW * dpr;
    canvas.height = virtualH * dpr;
    ctx.scale(dpr, dpr);

    let cloudsX = 0;
    let groundOffset = 0;

    const gameLoop = () => {
      const engine = engineRef.current;
      const groundY = engine.groundY;

      // -------------------------------------------------------
      // 1. UPDATE LOGIC (ONLY IF PLAYING)
      // -------------------------------------------------------
      if (engine.state === 'PLAYING') {
        engine.bird.update();

        // Check ceiling & ground collision
        if (engine.bird.y - engine.bird.radius <= 0) {
          handleGameOver('Chạm nóc trần màn hình!');
        } else if (engine.bird.y + engine.bird.radius >= groundY) {
          handleGameOver('Rơi xuống mặt đất!');
        }

        // Update obstacles
        for (let i = engine.obstacles.length - 1; i >= 0; i--) {
          const obs = engine.obstacles[i];
          obs.update();

          // AABB + Portal Collision Detection
          const birdLeft = engine.bird.x - engine.bird.radius;
          const birdRight = engine.bird.x + engine.bird.radius;
          const obsLeft = obs.x;
          const obsRight = obs.x + obs.width;

          // If bird is horizontally inside the wall column
          if (birdRight > obsLeft && birdLeft < obsRight) {
            // Check vertical positioning among the 3 portals
            let inAnyPortal = false;
            let enteredCorrectPortal = false;

            for (const p of obs.portals) {
              // Bird vertical bounding box must be cleanly inside the portal opening
              if (engine.bird.y - engine.bird.radius >= p.top && engine.bird.y + engine.bird.radius <= p.bottom) {
                inAnyPortal = true;
                if (p.isCorrect) {
                  enteredCorrectPortal = true;
                }
                break;
              }
            }

            if (!inAnyPortal) {
              // Collided with the solid brick wall
              handleGameOver('Va vào bức tường chướng ngại vật!');
              break;
            } else if (!enteredCorrectPortal) {
              // Flew into the wrong answer portal
              handleGameOver(`Chọn sai đáp án! Bạn đã bay vào cổng sai.`);
              break;
            }
          }

          // Check if bird successfully cleared the obstacle
          if (!obs.scored && birdLeft > obsRight) {
            obs.scored = true;
            engine.score += 1;
            setScore(engine.score);
            soundManagerRef.current.playCorrect();

            // Star particles celebration
            for (let p = 0; p < 18; p++) {
              engine.particles.push(new Particle(obsRight, engine.bird.y, '#f59e0b'));
              engine.particles.push(new Particle(obsRight, engine.bird.y, '#10b981'));
            }

            // Speed up slightly every 5 points
            if (engine.score % 5 === 0) {
              engine.speed = Math.min(4.8, engine.speed + 0.35);
            }
          }

          // Remove off-screen obstacles
          if (obs.x + obs.width < -100) {
            engine.obstacles.splice(i, 1);
          }
        }

        // Spawn next obstacle
        const lastObstacle = engine.obstacles[engine.obstacles.length - 1];
        if (!lastObstacle || lastObstacle.x < virtualW - 360) {
          const nextObs = new Obstacle(virtualW + 40, engine.speed);
          engine.obstacles.push(nextObs);
        }

        // Update active HUD question based on upcoming obstacle
        const upcomingObs = engine.obstacles.find(o => o.x + o.width > engine.bird.x);
        if (upcomingObs) {
          if (upcomingObs.problem.question !== engine.activeQuestion) {
            engine.activeQuestion = upcomingObs.problem.question;
            setCurrentQuestion(upcomingObs.problem.question);
          }
        }
      }

      // Update particles
      for (let i = engine.particles.length - 1; i >= 0; i--) {
        const p = engine.particles[i];
        p.update();
        if (p.life <= 0) {
          engine.particles.splice(i, 1);
        }
      }

      // Parallax scroll offsets
      if (engine.state === 'PLAYING') {
        cloudsX = (cloudsX - 0.4) % virtualW;
        groundOffset = (groundOffset - engine.speed) % 24;
      }

      // -------------------------------------------------------
      // 2. RENDER GRAPHICS
      // -------------------------------------------------------
      // Sky Background gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
      skyGrad.addColorStop(0, '#38bdf8'); // sky-400
      skyGrad.addColorStop(0.6, '#7dd3fc'); // sky-300
      skyGrad.addColorStop(1, '#bae6fd'); // sky-200
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, virtualW, virtualH);

      // Clouds (Parallax)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      const drawCloud = (cx: number, cy: number, scale: number) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 26 * scale, 0, Math.PI * 2);
        ctx.arc(cx + 22 * scale, cy - 8 * scale, 20 * scale, 0, Math.PI * 2);
        ctx.arc(cx + 44 * scale, cy, 24 * scale, 0, Math.PI * 2);
        ctx.arc(cx + 22 * scale, cy + 8 * scale, 18 * scale, 0, Math.PI * 2);
        ctx.fill();
      };
      drawCloud(cloudsX + 100, 90, 1.2);
      drawCloud(cloudsX + virtualW + 100, 90, 1.2);
      drawCloud(cloudsX + 480, 140, 0.9);
      drawCloud(cloudsX + virtualW + 480, 140, 0.9);

      // Draw obstacles
      for (const obs of engine.obstacles) {
        obs.draw(ctx, groundY);
      }

      // Draw bird
      engine.bird.draw(ctx);

      // Draw particles
      for (const p of engine.particles) {
        p.draw(ctx);
      }

      // Draw Ground
      const groundGrad = ctx.createLinearGradient(0, groundY, 0, virtualH);
      groundGrad.addColorStop(0, '#15803d'); // grass top green-700
      groundGrad.addColorStop(0.12, '#22c55e'); // grass blade highlight
      groundGrad.addColorStop(0.2, '#78350f'); // dirt amber-900
      groundGrad.addColorStop(1, '#451a03'); // deep earth
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, groundY, virtualW, virtualH - groundY);

      // Grass border stripe
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(0, groundY, virtualW, 6);

      // Moving ground stripes
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 3;
      for (let gx = groundOffset - 24; gx < virtualW + 24; gx += 24) {
        ctx.beginPath();
        ctx.moveTo(gx, groundY + 8);
        ctx.lineTo(gx + 12, virtualH);
        ctx.stroke();
      }

      // Loop continuation
      engine.animId = requestAnimationFrame(gameLoop);
    };

    engineRef.current.animId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(engineRef.current.animId);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full flex flex-col items-center select-none bg-slate-950 font-sans ${
        isFullscreen ? 'h-screen justify-center' : 'max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-800 my-4'
      }`}
    >
      {/* TOP HEADER CONTROLS */}
      <div className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between text-white z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHub}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Thoát ra Hub</span>
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> Mathy Bird
            </span>
          </div>
        </div>

        {/* HUD Center: Active Equation */}
        <div className="flex items-center gap-2">
          {gameState === 'PLAYING' && (
            <div className="animate-pulse flex items-center gap-2 px-4 py-1 rounded-full bg-indigo-600 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{currentQuestion}</span>
            </div>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTutorialModal(true)}
            title="Hướng dẫn chơi"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            onClick={toggleSound}
            title={isSoundMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            {isSoundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={toggleFullscreen}
            title="Toàn màn hình"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* GAME CANVAS CONTAINER */}
      <div 
        className="relative w-full aspect-[4/3] max-h-[70vh] flex items-center justify-center bg-sky-200 cursor-pointer overflow-hidden touch-none"
        onClick={handleFlap}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain block"
        />

        {/* FLOATING SCORE (Top Left HUD) */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-3 pointer-events-none">
          <div className="px-4 py-2 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/20 text-white shadow-xl flex items-center gap-2.5">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Điểm</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">{score}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 backdrop-blur-sm border border-white/10 text-slate-300 text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Kỷ lục: {bestScore}</span>
          </div>
        </div>

        {/* BIG HUD CENTER QUESTION OVERLAY (During gameplay) */}
        {gameState === 'PLAYING' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <div className="px-6 py-2 rounded-2xl bg-gradient-to-r from-indigo-700/90 to-blue-700/90 backdrop-blur-md border-2 border-indigo-400/50 shadow-2xl text-white flex items-center gap-3">
              <span className="text-xs uppercase tracking-widest text-indigo-200 font-bold">Câu hỏi:</span>
              <span className="text-2xl sm:text-3xl font-black tracking-wider text-amber-300 font-mono drop-shadow">
                {currentQuestion}
              </span>
            </div>
          </div>
        )}

        {/* READY / START SCREEN OVERLAY */}
        {gameState === 'READY' && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="max-w-md w-full bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold">
                  <Flame className="w-3.5 h-3.5" /> Minigame Toán Học #1
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Mathy Bird
                </h2>
                <p className="text-sm text-slate-400">
                  Bay qua đúng cánh cổng mang kết quả phép toán để ghi điểm!
                </p>
              </div>

              {/* Game Key Mechanics Box */}
              <div className="grid grid-cols-3 gap-2.5 text-left text-xs bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
                <div className="space-y-1">
                  <span className="font-bold text-amber-400 block">1. Nhảy</span>
                  <span className="text-slate-400">Nhấn Space, Click hoặc chạm màn hình để bay.</span>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-indigo-400 block">2. Tính nhẩm</span>
                  <span className="text-slate-400">Nhìn phép toán to ở đỉnh màn hình.</span>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-emerald-400 block">3. Chọn cổng</span>
                  <span className="text-slate-400">Bay vào đúng ô số ĐÚNG (Cổng Trên hoặc Cổng Dưới).</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={startGame}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-black text-base tracking-wide shadow-lg shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>BẮT ĐẦU BAY</span>
                </button>

                <p className="text-[11px] text-slate-500">
                  Tip: Đâm vào tường hoặc bay vào đáp án sai sẽ thua ngay lập tức!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* GAME OVER SCREEN OVERLAY */}
        {gameState === 'GAMEOVER' && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-rose-400 font-extrabold px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 inline-block">
                  Trò chơi kết thúc
                </span>
                <h3 className="text-2xl font-black text-white">
                  Game Over!
                </h3>
                {gameOverReason && (
                  <p className="text-xs text-rose-300 font-medium pt-1">
                    {gameOverReason}
                  </p>
                )}
              </div>

              {/* Score Display Card */}
              <div className="grid grid-cols-2 gap-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50">
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-bold uppercase">Điểm của bạn</span>
                  <div className="text-3xl font-black text-amber-400 font-mono">{score}</div>
                </div>
                <div className="space-y-1 border-l border-slate-700 pl-3">
                  <span className="text-xs text-slate-400 font-bold uppercase">Kỷ lục</span>
                  <div className="text-3xl font-black text-white font-mono">{bestScore}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={startGame}
                  className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Chơi lại ngay (Space)</span>
                </button>

                <button
                  type="button"
                  onClick={onBackToHub}
                  className="w-full py-3 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition cursor-pointer"
                >
                  Quay lại thư viện Minigame
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER CONTROLS / HINTS */}
      <div className="w-full bg-slate-900 border-t border-slate-800 px-4 py-2.5 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono font-bold text-[10px]">SPACE</span>
          <span>hoặc</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono font-bold text-[10px]">CLICK</span>
          <span>để chim đập cánh bay lên.</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-500 text-[11px]">Độ khó tăng dần sau mỗi 5 điểm</span>
        </div>
      </div>

      {/* TUTORIAL MODAL */}
      {showTutorialModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              Cách chơi Mathy Bird
            </h3>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong>1. Điều khiển:</strong> Click chuột trái, chạm vào màn hình cảm ứng hoặc nhấn phím <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300">Space</code> để chim vỗ cánh bay lên. Nếu không bấm, chim sẽ rơi tự do theo trọng lực.
              </p>
              <p>
                <strong>2. Giải toán nhanh:</strong> Phía trên đỉnh màn hình sẽ luôn hiển thị to một phép tính (+, -, ×).
              </p>
              <p>
                <strong>3. 2 Cánh cổng đáp án siêu rộng:</strong> Bức tường di chuyển từ phải qua trái có 2 ô số rộng rãi (Cổng Trên và Cổng Dưới). Chỉ có <strong>1 cổng chứa đáp án đúng</strong>.
              </p>
              <p>
                <strong>4. Điều kiện Game Over:</strong> Bay vào cổng đáp án sai, va chạm vào tường gạch hoặc chạm vào nóc/mặt đất.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowTutorialModal(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer"
            >
              Đã hiểu, sẵn sàng chơi!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
