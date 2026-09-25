import React from 'react';
import { SECTIONS, SectionData } from '../data/checklistData';
import { CheckCircle2, AlertTriangle, ChevronRight, Layers } from 'lucide-react';
import { FormAnswers } from '../utils/exportHelpers';

interface SectionNavProps {
  activeSectionIndex: number;
  onSelectSection: (index: number) => void;
  answers: FormAnswers;
  notes: { [secId: string]: string };
}

export const SectionNav: React.FC<SectionNavProps> = ({
  activeSectionIndex,
  onSelectSection,
  answers,
  notes,
}) => {
  return (
    <aside className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between px-2 pb-2.5 mb-2 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>9 Escenarios E2E</span>
        </div>
      </div>

      <nav className="space-y-1 max-h-[70vh] overflow-y-auto pr-1">
        {SECTIONS.map((sec, idx) => {
          const items = sec.items.filter((it) => !it.isSubheader);
          const totalItems = items.length;
          
          let answered = 0;
          let hasFail = false;

          items.forEach((it) => {
            const ans = answers[it.id];
            if (ans && ans !== 'PENDIENTE') answered++;
            if (ans === 'FAIL' || ans === 'NO') hasFail = true;
          });

          const isComplete = totalItems > 0 && answered === totalItems;
          const isActive = activeSectionIndex === idx;

          return (
            <button
              key={sec.id}
              onClick={() => onSelectSection(idx)}
              className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer group ${
                isActive
                  ? 'bg-amber-500/15 border border-amber-500/40 text-amber-200 font-semibold shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <span
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                    isActive
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {sec.number}
                </span>
                <span className="truncate">{sec.title}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {hasFail ? (
                  <span className="text-rose-400 bg-rose-950/60 border border-rose-900/60 px-1 py-0.5 rounded text-[10px] font-bold">
                    FAIL
                  </span>
                ) : isComplete ? (
                  <span className="text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-500">
                    {answered}/{totalItems}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
