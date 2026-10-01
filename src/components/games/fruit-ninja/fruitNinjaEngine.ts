import { Question } from "./questions";

export interface Point {
  x: number;
  y: number;
  time: number;
}

export interface Fruit {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  text: string;
  isCorrect: boolean;
  isBomb: boolean;
  isSliced: boolean;
  rotation: number;
  rotationSpeed: number;
  color: string;
  slicedPieces?: { x: number; y: number; vx: number; vy: number; rotation: number }[];
  slicedTime?: number;
  spawnDelay?: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface GameState {
  fruits: Fruit[];
  particles: Particle[];
  trail: Point[];
  score: number;
  combo: number;
  lives: number;
  status: 'PLAYING' | 'GAME_OVER' | 'REVIEW';
  currentQuestion: Question | null;
  mode: 'CLASSIC' | 'PRACTICE';
  reviewMessage: string;
  lastSpawnTime: number;
}

export const GRAVITY = 0.15;
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

export const FRUIT_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#84cc16', // lime
  '#06b6d4', // cyan
  '#8b5cf6', // violet
  '#f43f5e', // rose
];

// Helper to detect line segment and circle collision
export const lineIntersectsCircle = (
  p1: Point,
  p2: Point,
  circle: { x: number; y: number; radius: number }
): boolean => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const length = Math.sqrt(dx * dx + dy * dy);

  if (length === 0) return false;

  const dot =
    ((circle.x - p1.x) * dx + (circle.y - p1.y) * dy) / (length * length);

  const closestX = p1.x + dot * dx;
  const closestY = p1.y + dot * dy;

  // Check if closest point is within the line segment
  if (
    closestX < Math.min(p1.x, p2.x) - 1 ||
    closestX > Math.max(p1.x, p2.x) + 1 ||
    closestY < Math.min(p1.y, p2.y) - 1 ||
    closestY > Math.max(p1.y, p2.y) + 1
  ) {
    return false;
  }

  const distX = closestX - circle.x;
  const distY = closestY - circle.y;
  const distance = Math.sqrt(distX * distX + distY * distY);

  return distance <= circle.radius;
};

export const createExplosion = (x: number, y: number, color: string): Particle[] => {
  const particles: Particle[] = [];
  for (let i = 0; i < 20; i++) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      life: 1.0,
      maxLife: 1.0 + Math.random() * 0.5,
      color,
      size: Math.random() * 6 + 2,
    });
  }
  return particles;
};
