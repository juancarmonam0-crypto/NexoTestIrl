import React from 'react';
import { FormAnswers } from '../utils/exportHelpers';
import { FINAL_STATUS_OPTIONS, SECTIONS } from '../data/checklistData';
import { AlertCircle, CheckCircle2, ShieldAlert, Sparkles, ChevronRight } from 'lucide-react';

interface LaunchSummaryCardProps {
  answers: FormAnswers;
  onJumpToSection: (sectionIndex: number) => void;
}

export const LaunchSummaryCard: React.FC<LaunchSummaryCardProps> = ({
  answers,
  onJumpToSection,
}) => {
  const currentStatusVal = answers['launch_status'];
  const currentStatusObj = FINAL_STATUS_OPTIONS.find((s) => s.value === currentStatusVal);

  // Find all failed questions
  const failedItems: { secIndex: number; secTitle: string; qText: string; qNum?: number }[] = [];

  SECTIONS.forEach((sec, sIdx) => {
    sec.items.forEach((it) => {
      const val = answers[it.id];
      if (val === 'FAIL' || val === 'NO') {
        failedItems.push({
          secIndex: sIdx,
          secTitle: sec.title,
          qText: it.text,
          qNum: it.number,
        });
      }
    });
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded uppercase tracking-wider">
            Tablero de Control de Lanzamiento
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white mt-1">
            Dictamen Operativo Nexo
          </h3>
        </div>

        <div>
          {currentStatusObj ? (
            <div
              className={`px-4 py-2 rounded-2xl border flex items-center gap-2 font-bold text-xs sm:text-sm ${
                currentStatusObj.color === 'emerald'
                  ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300'
                  : currentStatusObj.color === 'amber'
                  ? 'bg-amber-950/80 border-amber-500/80 text-amber-300'
                  : 'bg-rose-950/80 border-rose-500/80 text-rose-300'
              }`}
            >
              <span>{currentStatusObj.label}</span>
            </div>
          ) : (
            <div className="text-xs text-slate-400 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-xl">
              ⏳ Dictamen final en Sección 25 pendiente
            </div>
          )}
        </div>
      </div>

      {/* Failures Alert Box */}
      {failedItems.length > 0 ? (
        <div className="mt-4 p-4 rounded-2xl bg-rose-950/40 border border-rose-900/70 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>{failedItems.length} Pruebas Marcadas como FAIL / NO</span>
            </h4>
            <span className="text-[11px] text-rose-400 font-semibold">Requiere atención</span>
          </div>

          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 text-xs">
            {failedItems.map((fail, i) => (
              <button
                key={i}
                onClick={() => onJumpToSection(fail.secIndex)}
                className="w-full text-left p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-rose-900/40 flex items-center justify-between gap-2 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-rose-400 font-bold shrink-0">❌</span>
                  <span className="text-slate-400 text-[11px] shrink-0">[{fail.secTitle}]:</span>
                  <span className="truncate text-white font-medium">{fail.qNum ? `#${fail.qNum} ` : ''}{fail.qText}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-4 p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-900/50 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs text-emerald-200">
            No hay pruebas marcadas como fallidas hasta el momento.
          </p>
        </div>
      )}
    </div>
  );
};
