import React from 'react';
import { Tag, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { GrammarRule } from '../data/englishGrammarData';

interface EnglishGrammarCardProps {
  rule: GrammarRule;
  index: number;
}

export const EnglishGrammarCard: React.FC<EnglishGrammarCardProps> = ({ rule, index }) => {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden transition-all">
      {/* Title Header */}
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/60 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs">
            {index + 1}
          </span>
          <div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {rule.title}
            </h4>
            {rule.subtitle && (
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {rule.subtitle}
              </p>
            )}
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
          <CheckCircle2 className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
          Ngữ pháp trọng tâm
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        {/* 1. USE Section */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs tracking-wider uppercase">
            <span className="text-xs">💡</span>
            <span>USE</span>
          </div>
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
            {rule.use}
          </div>
        </div>

        {/* 2. FORM Section */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs tracking-wider uppercase">
            <span className="text-xs">📝</span>
            <span>FORM</span>
          </div>
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-sm sm:text-base font-semibold text-indigo-900 dark:text-indigo-300 leading-relaxed whitespace-pre-line">
            {rule.form}
          </div>
        </div>

        {/* 3. SIGNAL WORDS (if present) */}
        {rule.signalWords && (
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-300 font-bold text-xs uppercase tracking-wider">
              <Tag className="h-3.5 w-3.5" />
              <span>SIGNAL WORDS</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
              {rule.signalWords}
            </div>
          </div>
        )}

        {/* 4. EXAMPLES Section */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs tracking-wider uppercase">
            <span className="text-xs">✨</span>
            <span>EXAMPLES</span>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-4 space-y-2.5">
            <ul className="space-y-2.5 list-none">
              {rule.examples.map((ex, exIdx) => (
                <li key={exIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-[11px] mt-0.5">
                    {exIdx + 1}
                  </span>
                  <div className="font-normal break-words">
                    {ex}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 5. COMMON MISTAKES Section */}
        {rule.commonMistakes && (
          <div className="space-y-2 pt-1 border-t border-slate-200 dark:border-slate-800">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
              <span>COMMON MISTAKES</span>
            </div>
            <p className="text-xs sm:text-sm text-rose-700 dark:text-rose-300 leading-relaxed font-normal bg-rose-50/50 dark:bg-rose-950/20 p-3 rounded-xl border border-rose-100 dark:border-rose-900/40">
              {rule.commonMistakes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
