import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  CheckSquare, 
  FileText, 
  BarChart3,
  Gamepad2
} from 'lucide-react';

interface MobileNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, setCurrentTab }) => {
  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: GraduationCap },
    { id: 'knowledge', label: 'Kiến thức', icon: BookOpen },
    { id: 'practice', label: 'Luyện tập', icon: CheckSquare },
    { id: 'exams', label: 'Đề thi', icon: FileText },
    { id: 'minigame', label: 'Minigame', icon: Gamepad2 },
    { id: 'benchmarks', label: 'Điểm chuẩn', icon: BarChart3 }
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      id="mobile-bottom-navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 py-1 px-2"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => setCurrentTab(item.id)}
              title={item.label}
              aria-label={item.label}
              className={`flex items-center justify-center h-11 w-11 rounded-xl transition-all cursor-pointer active:scale-95 ${
                isActive
                  ? 'bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold shadow-2xs ring-1 ring-indigo-500/20'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400 stroke-[2.2]' : 'text-slate-500 dark:text-slate-400 stroke-[1.9]'}`} />
            </button>
          );
        })}
      </div>
    </nav>
  );
};
