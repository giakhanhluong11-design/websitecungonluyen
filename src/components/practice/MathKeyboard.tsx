import React, { useState } from 'react';
import { Delete, X } from 'lucide-react';

interface MathKeyboardProps {
  onInsert: (symbol: string) => void;
  onBackspace: () => void;
  onClear: () => void;
}

export const MathKeyboard: React.FC<MathKeyboardProps> = ({
  onInsert,
  onBackspace,
  onClear
}) => {
  const [activeTab, setActiveTab] = useState<'common' | 'geometry' | 'greek' | 'sets'>('common');

  const COMMON_SYMBOLS = [
    { label: '+', val: '+' },
    { label: '−', val: ' - ' },
    { label: '×', val: ' × ' },
    { label: '÷', val: ' ÷ ' },
    { label: '=', val: ' = ' },
    { label: '≠', val: ' ≠ ' },
    { label: '±', val: ' ± ' },
    { label: '√x', val: '√(' },
    { label: 'x²', val: '²' },
    { label: 'x³', val: '³' },
    { label: 'xⁿ', val: '^' },
    { label: 'a/b', val: ' / ' },
    { label: '<', val: ' < ' },
    { label: '>', val: ' > ' },
    { label: '≤', val: ' ≤ ' },
    { label: '≥', val: ' ≥ ' },
    { label: '≈', val: ' ≈ ' },
    { label: 'π', val: 'π' },
    { label: 'Δ', val: 'Δ' },
    { label: '∞', val: '∞' },
    { label: '(', val: '(' },
    { label: ')', val: ')' },
    { label: '|x|', val: '|' },
    { label: '%', val: '%' }
  ];

  const GEOMETRY_SYMBOLS = [
    { label: '∠ (Góc)', val: '∠' },
    { label: '° (Độ)', val: '°' },
    { label: '⊥ (Vuông góc)', val: ' ⊥ ' },
    { label: '∥ (Song song)', val: ' ∥ ' },
    { label: '△ (Tam giác)', val: '△' },
    { label: '□ (Tứ giác)', val: '□' },
    { label: '(O; R)', val: '(O; R)' },
    { label: '⌒ (Cung)', val: '⌒' },
    { label: '≡ (Trùng/Đồng dạng)', val: ' ≡ ' },
    { label: '∽ (Đồng dạng)', val: ' ∽ ' },
    { label: '⇒ (Suy ra)', val: ' ⇒ ' },
    { label: '⇔ (Tương đương)', val: ' ⇔ ' }
  ];

  const GREEK_SYMBOLS = [
    { label: 'α (alpha)', val: 'α' },
    { label: 'β (beta)', val: 'β' },
    { label: 'γ (gamma)', val: 'γ' },
    { label: 'θ (theta)', val: 'θ' },
    { label: 'λ (lambda)', val: 'λ' },
    { label: 'μ (mu)', val: 'μ' },
    { label: 'ω (omega)', val: 'ω' },
    { label: 'Σ (sigma/tổng)', val: 'Σ' },
    { label: 'Δ (delta)', val: 'Δ' },
    { label: 'π (pi)', val: 'π' }
  ];

  const SETS_SYMBOLS = [
    { label: '∈', val: ' ∈ ' },
    { label: '∉', val: ' ∉ ' },
    { label: '⊂', val: ' ⊂ ' },
    { label: '⊆', val: ' ⊆ ' },
    { label: '∪', val: ' ∪ ' },
    { label: '∩', val: ' ∩ ' },
    { label: '∅', val: '∅' },
    { label: 'ℝ', val: 'ℝ' },
    { label: 'ℤ', val: 'ℤ' },
    { label: 'ℕ', val: 'ℕ' },
    { label: 'ℚ', val: 'ℚ' },
    { label: '→', val: ' → ' }
  ];

  const currentList = 
    activeTab === 'common' ? COMMON_SYMBOLS :
    activeTab === 'geometry' ? GEOMETRY_SYMBOLS :
    activeTab === 'greek' ? GREEK_SYMBOLS : SETS_SYMBOLS;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-2.5 sm:p-3 shadow-md space-y-2 animate-in fade-in duration-150">
      {/* Category switcher */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('common')}
            className={`px-2 py-1 rounded-md transition-colors ${
              activeTab === 'common'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Cơ bản & Phép tính
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('geometry')}
            className={`px-2 py-1 rounded-md transition-colors ${
              activeTab === 'geometry'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Hình học (∠, ⊥, ∥)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('greek')}
            className={`px-2 py-1 rounded-md transition-colors ${
              activeTab === 'greek'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Kí hiệu Hy Lạp
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sets')}
            className={`px-2 py-1 rounded-md transition-colors ${
              activeTab === 'sets'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Tập hợp & Mệnh đề
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onBackspace}
            title="Xóa 1 ký tự"
            className="p-1.5 rounded-md bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-950 dark:text-rose-300 dark:hover:bg-rose-900 transition-colors"
          >
            <Delete className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onClear}
            title="Xóa trắng"
            className="p-1.5 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Buttons grid */}
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-1.5">
        {currentList.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onInsert(item.val)}
            className="h-9 px-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:border-indigo-400 dark:hover:border-indigo-600 text-slate-900 dark:text-slate-100 font-bold text-xs sm:text-sm flex items-center justify-center transition-all active:scale-95 shadow-2xs"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Quick guide */}
      <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1">
        <span>Mẹo: Bạn cũng có thể gõ trực tiếp: song song, vuong goc, ^2, can bậc 2...</span>
        <span className="font-semibold text-indigo-600 dark:text-indigo-400">Chèn vào vị trí con trỏ</span>
      </div>
    </div>
  );
};
