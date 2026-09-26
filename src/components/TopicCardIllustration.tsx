import React from 'react';
import { CourseModule } from '../data/curriculumData';

interface TopicCardIllustrationProps {
  module: CourseModule;
}

export const TopicCardIllustration: React.FC<TopicCardIllustrationProps> = ({ module }) => {
  const { code, subjectId } = module;

  // Render tailored visual artwork for each module
  const renderArt = () => {
    switch (code) {
      // ── TOÁN HỌC ──────────────────────────────────────────────────────
      case 'T1': // Căn bậc hai & Căn thức
        return (
          <svg viewBox="0 0 360 200" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="g-t1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d1fae5" />
                <stop offset="50%" stopColor="#bfdbfe" />
                <stop offset="100%" stopColor="#e0e7ff" />
              </linearGradient>
              <linearGradient id="g-laptop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
            </defs>
            <rect width="360" height="200" fill="url(#g-t1)" />
            {/* Soft grid background */}
            <circle cx="60" cy="50" r="35" fill="#10b981" opacity="0.1" />
            <circle cx="310" cy="140" r="45" fill="#6366f1" opacity="0.1" />
            
            {/* Floating radical symbol */}
            <g transform="translate(45, 60)">
              <rect x="0" y="0" width="70" height="60" rx="14" fill="#ffffff" opacity="0.9" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))" />
              <text x="35" y="42" fontSize="32" fontFamily="serif" fontWeight="bold" fill="#047857" textAnchor="middle">√A</text>
            </g>

            {/* Central Student & Laptop study desk */}
            <g transform="translate(140, 45)">
              {/* Laptop screen */}
              <rect x="10" y="30" width="100" height="65" rx="6" fill="#1e293b" />
              <rect x="15" y="35" width="90" height="55" rx="3" fill="#ffffff" />
              {/* Content on laptop: Radical formula */}
              <text x="60" y="62" fontSize="13" fontFamily="sans-serif" fontWeight="bold" fill="#2563eb" textAnchor="middle">√(A²) = |A|</text>
              <line x1="25" y1="74" x2="95" y2="74" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" />
              {/* Laptop base */}
              <path d="M0,95 L120,95 L112,102 L8,102 Z" fill="#94a3b8" />

              {/* Graduation Cap */}
              <g transform="translate(40, -10)">
                <polygon points="20,0 40,10 20,20 0,10" fill="#1e1b4b" />
                <rect x="10" y="15" width="20" height="12" fill="#312e81" rx="2" />
                <path d="M40,10 L44,22" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                <circle cx="44" cy="23" r="2.5" fill="#f59e0b" />
              </g>
            </g>

            {/* Floating idea lightbulb */}
            <g transform="translate(265, 45)">
              <circle cx="20" cy="20" r="18" fill="#fef08a" />
              <path d="M15,22 C13,18 16,12 20,12 C24,12 27,18 25,22 Z" fill="#eab308" />
              <rect x="17" y="24" width="6" height="4" rx="1" fill="#ca8a04" />
            </g>

            {/* Formula badge */}
            <g transform="translate(245, 115)">
              <rect x="0" y="0" width="85" height="32" rx="10" fill="#ffffff" opacity="0.95" />
              <text x="42" y="21" fontSize="12" fontWeight="bold" fill="#4338ca" textAnchor="middle">A ≥ 0 ⇔ √A</text>
            </g>
          </svg>
        );

      case 'T2': // Hệ hai phương trình bậc nhất hai ẩn
        return (
          <svg viewBox="0 0 360 200" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="g-t2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e0e7ff" />
                <stop offset="50%" stopColor="#ede9fe" />
                <stop offset="100%" stopColor="#fed7aa" />
              </linearGradient>
            </defs>
            <rect width="360" height="200" fill="url(#g-t2)" />
            {/* Coordinate lines */}
            <line x1="40" y1="140" x2="320" y2="140" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="80" y1="20" x2="80" y2="180" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />

            {/* Intersection lines */}
            <line x1="70" y1="160" x2="280" y2="40" stroke="#4f46e5" strokeWidth="4" strokeLinecap="round" />
            <line x1="70" y1="40" x2="280" y2="150" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" />
            {/* Intersection Point (x₀, y₀) */}
            <circle cx="178" cy="98" r="8" fill="#ffffff" stroke="#e11d48" strokeWidth="4" />
            <text x="178" y="85" fontSize="12" fontWeight="bold" fill="#be123c" textAnchor="middle">(x₀; y₀)</text>

            {/* System Bracket Card */}
            <g transform="translate(35, 45)">
              <rect x="0" y="0" width="115" height="60" rx="12" fill="#ffffff" opacity="0.95" />
              <text x="12" y="27" fontSize="22" fontFamily="serif" fill="#4338ca">{'{'}</text>
              <text x="24" y="26" fontSize="11" fontWeight="bold" fill="#1e293b">ax + by = c</text>
              <text x="24" y="44" fontSize="11" fontWeight="bold" fill="#1e293b">a'x + b'y = c'</text>
            </g>
          </svg>
        );

      case 'T3': // Phương trình bậc hai & Định lý Viète
        return (
          <svg viewBox="0 0 360 200" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="g-t3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ecfdf5" />
                <stop offset="50%" stopColor="#cffafe" />
                <stop offset="100%" stopColor="#ede9fe" />
              </linearGradient>
            </defs>
            <rect width="360" height="200" fill="url(#g-t3)" />
            {/* Central Card: Viète formula */}
            <g transform="translate(90, 35)">
              <rect x="0" y="0" width="180" height="110" rx="16" fill="#ffffff" opacity="0.95" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.05))" />
              <rect x="15" y="15" width="150" height="26" rx="8" fill="#0284c7" />
              <text x="90" y="33" fontSize="12" fontWeight="bold" fill="#ffffff" textAnchor="middle">Δ = b² - 4ac ≥ 0</text>
              <text x="90" y="68" fontSize="13" fontWeight="bold" fill="#0f172a" textAnchor="middle">S = x₁ + x₂ = -b/a</text>
              <text x="90" y="94" fontSize="13" fontWeight="bold" fill="#0f172a" textAnchor="middle">P = x₁ · x₂ = c/a</text>
            </g>
            {/* Floating badges */}
            <circle cx="50" cy="80" r="24" fill="#38bdf8" opacity="0.25" />
            <text x="50" y="87" fontSize="18" fontWeight="black" fill="#0284c7" textAnchor="middle">x₁</text>
            <circle cx="310" cy="110" r="24" fill="#a855f7" opacity="0.25" />
            <text x="310" y="117" fontSize="18" fontWeight="black" fill="#7e22ce" textAnchor="middle">x₂</text>
          </svg>
        );

      case 'T4': // Hàm số y = ax² & Parabol
        return (
          <svg viewBox="0 0 360 200" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="g-t4" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fdf4ff" />
                <stop offset="50%" stopColor="#fae8ff" />
                <stop offset="100%" stopColor="#e0e7ff" />
              </linearGradient>
            </defs>
            <rect width="360" height="200" fill="url(#g-t4)" />
            {/* Axes */}
            <line x1="60" y1="150" x2="300" y2="150" stroke="#94a3b8" strokeWidth="2" />
            <line x1="180" y1="30" x2="180" y2="175" stroke="#94a3b8" strokeWidth="2" />
            <polygon points="300,150 292,146 292,154" fill="#94a3b8" />
            <polygon points="180,30 176,38 184,38" fill="#94a3b8" />
            <text x="295" y="165" fontSize="11" fontWeight="bold" fill="#64748b">x</text>
            <text x="165" y="38" fontSize="11" fontWeight="bold" fill="#64748b">y</text>
            <text x="170" y="163" fontSize="10" fill="#64748b">O</text>

            {/* Parabola curve */}
            <path d="M90,45 Q180,150 270,45" fill="none" stroke="#9333ea" strokeWidth="4.5" strokeLinecap="round" />
            {/* Line intersecting parabola */}
            <line x1="85" y1="130" x2="275" y2="60" stroke="#2563eb" strokeWidth="3" strokeDasharray="5 4" />

            <g transform="translate(45, 30)">
              <rect width="90" height="32" rx="8" fill="#ffffff" opacity="0.9" />
              <text x="45" y="21" fontSize="12" fontWeight="bold" fill="#9333ea" textAnchor="middle">(P): y = ax²</text>
            </g>
          </svg>
        );

      case 'T6': // Toán thực tế liên môn
        return (
          <svg viewBox="0 0 360 200" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="g-t6" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="50%" stopColor="#ecfdf5" />
                <stop offset="100%" stopColor="#dbeafe" />
              </linearGradient>
            </defs>
            <rect width="360" height="200" fill="url(#g-t6)" />
            {/* Shopping discount tag */}
            <g transform="translate(60, 50)">
              <polygon points="0,25 35,0 85,0 85,50 35,50" fill="#ef4444" />
              <circle cx="20" cy="25" r="5" fill="#ffffff" />
              <text x="58" y="32" fontSize="16" fontWeight="black" fill="#ffffff" textAnchor="middle">-25%</text>
            </g>
            {/* Money / growth chart */}
            <g transform="translate(180, 45)">
              <rect width="130" height="90" rx="14" fill="#ffffff" opacity="0.95" />
              <circle cx="40" cy="45" r="22" fill="#10b981" opacity="0.2" />
              <text x="40" y="53" fontSize="24" fontWeight="bold" fill="#059669" textAnchor="middle">₫</text>
              <text x="88" y="40" fontSize="11" fontWeight="bold" fill="#334155">Toán kinh tế</text>
              <text x="88" y="58" fontSize="10" fill="#64748b">VAT • Lãi suất</text>
              <text x="88" y="74" fontSize="10" fill="#059669" fontWeight="bold">Giảm 2 lần</text>
            </g>
          </svg>
        );

      case 'T7': // Hệ thức lượng trong tam giác vuông
      case 'T8': // Đường tròn
      case 'T9': // Tứ giác nội tiếp
      case 'T10': // Hình học không gian
        return (
          <svg viewBox="0 0 360 200" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="g-geom" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e0f2fe" />
                <stop offset="50%" stopColor="#dbeafe" />
                <stop offset="100%" stopColor="#ede9fe" />
              </linearGradient>
            </defs>
            <rect width="360" height="200" fill="url(#g-geom)" />
            {/* Circle */}
            <circle cx="180" cy="100" r="65" fill="#ffffff" opacity="0.8" stroke="#3b82f6" strokeWidth="3" />
            <circle cx="180" cy="100" r="3.5" fill="#1d4ed8" />
            <text x="180" y="118" fontSize="11" fontWeight="bold" fill="#1d4ed8" textAnchor="middle">O</text>
            {/* Tangent line */}
            <line x1="80" y1="165" x2="280" y2="165" stroke="#ef4444" strokeWidth="3" />
            <line x1="180" y1="100" x2="180" y2="165" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 3" />
            {/* Inscribed triangle */}
            <polygon points="180,35 125,135 235,135" fill="none" stroke="#8b5cf6" strokeWidth="3" />

            <g transform="translate(30, 30)">
              <rect width="90" height="30" rx="8" fill="#ffffff" opacity="0.9" />
              <text x="45" y="20" fontSize="11" fontWeight="bold" fill="#2563eb" textAnchor="middle">Hình học 9</text>
            </g>
          </svg>
        );

      // ── NGỮ VĂN ────────────────────────────────────────────────────────
      case 'V1': // Truyện hiện đại
      case 'V2': // Thơ hiện đại
      case 'V3': // Văn bản nghị luận
      case 'V4': // Tiếng Việt & Biện pháp tu từ
      case 'V5': // Nghị luận xã hội
      case 'V6': // Nghị luận văn học
        return (
          <svg viewBox="0 0 360 200" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="g-van" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="40%" stopColor="#fee2e2" />
                <stop offset="100%" stopColor="#ede9fe" />
              </linearGradient>
            </defs>
            <rect width="360" height="200" fill="url(#g-van)" />
            {/* Floating poetry leaves */}
            <circle cx="70" cy="45" r="28" fill="#f59e0b" opacity="0.15" />
            <circle cx="300" cy="140" r="38" fill="#ec4899" opacity="0.15" />

            {/* Central Open Book */}
            <g transform="translate(110, 45)">
              {/* Left page */}
              <path d="M10,20 C40,15 65,22 70,25 L70,95 C65,92 40,85 10,90 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
              {/* Right page */}
              <path d="M70,25 C75,22 100,15 130,20 L130,90 C100,85 75,92 70,95 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
              {/* Spine */}
              <line x1="70" y1="25" x2="70" y2="95" stroke="#94a3b8" strokeWidth="3" />
              {/* Text lines */}
              <line x1="25" y1="40" x2="55" y2="40" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="25" y1="52" x2="55" y2="52" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
              <line x1="25" y1="64" x2="48" y2="64" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />

              <line x1="85" y1="40" x2="115" y2="40" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="85" y1="52" x2="115" y2="52" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
              <line x1="85" y1="64" x2="108" y2="64" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />

              {/* Feather quill pen */}
              <path d="M125,10 Q145,-5 155,15 Q145,25 130,35 Z" fill="#6366f1" />
              <line x1="130" y1="35" x2="120" y2="45" stroke="#4338ca" strokeWidth="2" />
            </g>

            {/* Badge */}
            <g transform="translate(30, 130)">
              <rect width="100" height="28" rx="8" fill="#ffffff" opacity="0.95" />
              <text x="50" y="19" fontSize="11" fontWeight="bold" fill="#b45309" textAnchor="middle">
                {code === 'V5' ? 'Đoạn NLXH' : code === 'V6' ? 'Bài NLVH' : 'Đọc hiểu & Thơ'}
              </text>
            </g>
          </svg>
        );

      // ── TIẾNG ANH ──────────────────────────────────────────────────────
      case 'A1': // Các thì
      case 'A2': // Câu bị động
      case 'A3': // Câu gián tiếp
      case 'A4': // Câu điều kiện
      case 'A5': // Mệnh đề quan hệ
      case 'A6': // So sánh
      case 'A7': // Cụm động từ
      case 'A8': // Đọc hiểu
      default:
        return (
          <svg viewBox="0 0 360 200" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="g-anh" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ccfbf1" />
                <stop offset="50%" stopColor="#e0f2fe" />
                <stop offset="100%" stopColor="#f3e8ff" />
              </linearGradient>
            </defs>
            <rect width="360" height="200" fill="url(#g-anh)" />
            {/* Global English speech bubbles */}
            <g transform="translate(50, 45)">
              <rect width="105" height="50" rx="14" fill="#ffffff" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))" />
              <polygon points="40,50 48,60 56,50" fill="#ffffff" />
              <text x="52" y="32" fontSize="15" fontWeight="black" fill="#0284c7" textAnchor="middle">ENGLISH</text>
            </g>

            <g transform="translate(195, 65)">
              <rect width="115" height="48" rx="14" fill="#2563eb" filter="drop-shadow(0 4px 6px rgba(37,99,235,0.2))" />
              <polygon points="75,48 83,58 91,48" fill="#2563eb" />
              <text x="57" y="30" fontSize="13" fontWeight="bold" fill="#ffffff" textAnchor="middle">
                {code === 'A1' ? 'Tenses 10/10' : code === 'A2' ? 'Passive Voice' : code === 'A4' ? 'Conditional' : 'Grammar A+'}
              </text>
            </g>

            {/* A+ Badge */}
            <circle cx="170" cy="140" r="22" fill="#f59e0b" />
            <text x="170" y="148" fontSize="18" fontWeight="black" fill="#ffffff" textAnchor="middle">A+</text>
          </svg>
        );
    }
  };

  return (
    <div className="w-full h-36 sm:h-40 overflow-hidden relative bg-slate-100 dark:bg-slate-800">
      {renderArt()}
      {/* Code badge overlay on top-right */}
      <div className="absolute top-2.5 right-2.5">
        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md shadow-xs ${
          subjectId === 'toan'
            ? 'bg-blue-600/90 text-white'
            : subjectId === 'van'
            ? 'bg-emerald-600/90 text-white'
            : 'bg-amber-600/90 text-white'
        }`}>
          {code}
        </span>
      </div>
    </div>
  );
};
