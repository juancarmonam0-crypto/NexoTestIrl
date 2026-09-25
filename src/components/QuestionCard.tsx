import React from 'react';
import { 
  QuestionItem, 
  STANDARD_OPTIONS, 
  PASS_FAIL_OPTIONS, 
  YES_NO_OPTIONS, 
  FINAL_STATUS_OPTIONS 
} from '../data/checklistData';
import { CheckCircle2, XCircle, Clock, MinusCircle, AlertCircle } from 'lucide-react';

interface QuestionCardProps {
  item: QuestionItem;
  value?: string;
  onChange: (val: string) => void;
  sectionNumber: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  item,
  value,
  onChange,
  sectionNumber,
}) => {
  if (item.isSubheader) {
    return (
      <div className="pt-5 pb-2 border-b border-slate-700/80 mb-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800 text-amber-300 font-bold text-xs uppercase tracking-wider border border-slate-700">
          <span>{item.text}</span>
        </div>
      </div>
    );
  }

  // Textarea field (for Section 25 special notes)
  if (item.type === 'textarea') {
    return (
      <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/90 rounded-2xl p-4 sm:p-5 transition-all shadow-md">
        <label className="block text-sm font-semibold text-slate-100 mb-1">
          {item.text}
        </label>
        {item.subtitle && (
          <p className="text-xs text-slate-400 mb-3">{item.subtitle}</p>
        )}
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          placeholder="Escribe aquí los detalles u observaciones..."
          className="w-full bg-slate-950/80 border border-slate-700/90 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-y"
        />
      </div>
    );
  }

  // Final launch status resolution
  if (item.type === 'final_status') {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-amber-500/40 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
        <div>
          <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-extrabold uppercase tracking-wider mb-2">
            Dictamen Final Obligatorio
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">{item.text}</h3>
          {item.subtitle && <p className="text-xs text-slate-400 mt-0.5">{item.subtitle}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {FINAL_STATUS_OPTIONS.map((opt) => {
            const isSelected = value === opt.value;
            const borderColor = 
              opt.color === 'rose' 
                ? isSelected ? 'border-rose-500 bg-rose-950/60 ring-2 ring-rose-500' : 'border-rose-900/40 bg-rose-950/20 hover:border-rose-800'
                : opt.color === 'amber'
                ? isSelected ? 'border-amber-500 bg-amber-950/60 ring-2 ring-amber-500' : 'border-amber-900/40 bg-amber-950/20 hover:border-amber-800'
                : isSelected ? 'border-emerald-500 bg-emerald-950/60 ring-2 ring-emerald-500' : 'border-emerald-900/40 bg-emerald-950/20 hover:border-emerald-800';

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange(opt.value)}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${borderColor}`}
              >
                <div>
                  <div className="font-bold text-sm text-white flex items-center justify-between mb-1">
                    <span>{opt.label}</span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">{opt.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Pass / Fail for Section 22 results
  if (item.type === 'pass_fail') {
    return (
      <div className="bg-slate-900/90 border-2 border-slate-700 rounded-2xl p-4 sm:p-5 transition-all shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-900/60 inline-block mb-1">
            Resultado Integral
          </span>
          <h4 className="text-sm sm:text-base font-bold text-white">{item.text}</h4>
          {item.subtitle && <p className="text-xs text-slate-400">{item.subtitle}</p>}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {PASS_FAIL_OPTIONS.map((opt) => {
            const isSelected = value === opt.value;
            const isPass = opt.value === 'PASS';
            const activeStyle = isPass
              ? 'bg-emerald-600 text-white font-bold ring-2 ring-emerald-400 shadow-lg shadow-emerald-600/30'
              : 'bg-rose-600 text-white font-bold ring-2 ring-rose-400 shadow-lg shadow-rose-600/30';
            const inactiveStyle = isPass
              ? 'bg-slate-800/80 text-emerald-400 hover:bg-emerald-950/40 border border-emerald-900/50'
              : 'bg-slate-800/80 text-rose-400 hover:bg-rose-950/40 border border-rose-900/50';

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange(opt.value)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected ? activeStyle : inactiveStyle
                }`}
              >
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // YES / NO for Section 25
  if (item.type === 'yes_no') {
    return (
      <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-3.5 sm:p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="w-6 h-6 rounded-lg bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
            ✓
          </span>
          <p className="text-xs sm:text-sm font-medium text-slate-100 leading-relaxed">
            {item.text}
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          {YES_NO_OPTIONS.map((opt) => {
            const isSelected = value === opt.value;
            const isYes = opt.value === 'YES';
            const activeStyle = isYes
              ? 'bg-emerald-600 text-white font-bold shadow-md ring-1 ring-emerald-400'
              : 'bg-rose-600 text-white font-bold shadow-md ring-1 ring-rose-400';
            const inactiveStyle = isYes
              ? 'bg-slate-800 text-emerald-400 hover:bg-emerald-950/40 border border-slate-700'
              : 'bg-slate-800 text-rose-400 hover:bg-rose-950/40 border border-slate-700';

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected ? activeStyle : inactiveStyle
                }`}
              >
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Standard 4-Option Question (PASS, FAIL, PENDIENTE, NO APLICA)
  const isFailed = value === 'FAIL';
  const isPassed = value === 'PASS';
  const isPending = !value || value === 'PENDIENTE';
  const isNA = value === 'NO_APLICA';

  return (
    <div
      className={`rounded-2xl p-3.5 sm:p-4.5 border transition-all ${
        isFailed
          ? 'bg-rose-950/25 border-rose-800/80 shadow-md shadow-rose-950/20'
          : isPassed
          ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700/80'
          : isNA
          ? 'bg-slate-900/60 border-slate-800/60 opacity-80'
          : 'bg-slate-900/90 border-slate-800/90 hover:border-slate-700'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        {/* Question Text */}
        <div className="flex items-start gap-3">
          {item.number && (
            <span
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 ${
                isFailed
                  ? 'bg-rose-600 text-white'
                  : isPassed
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : isNA
                  ? 'bg-slate-800 text-slate-400'
                  : 'bg-slate-800 text-amber-300 border border-slate-700'
              }`}
            >
              {item.number}
            </span>
          )}
          <div className="flex-1">
            <p className="text-xs sm:text-sm font-medium text-slate-100 leading-relaxed">
              {item.text}
            </p>
            {isFailed && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 mt-1">
                <AlertCircle className="w-3 h-3" /> Falla detectada en prueba de campo
              </span>
            )}
          </div>
        </div>

        {/* 4 Interactive Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 shrink-0 self-stretch sm:self-auto">
          {STANDARD_OPTIONS.map((opt) => {
            const isSelected = (value || 'PENDIENTE') === opt.value;
            
            let btnClasses = 'bg-slate-800/90 text-slate-400 hover:text-slate-200 border border-slate-700/80 hover:bg-slate-700/60';

            if (isSelected) {
              if (opt.value === 'PASS') {
                btnClasses = 'bg-emerald-600 text-white font-bold ring-2 ring-emerald-400 shadow-md shadow-emerald-600/30';
              } else if (opt.value === 'FAIL') {
                btnClasses = 'bg-rose-600 text-white font-bold ring-2 ring-rose-400 shadow-md shadow-rose-600/30 animate-pulse';
              } else if (opt.value === 'PENDIENTE') {
                btnClasses = 'bg-amber-600 text-white font-bold ring-2 ring-amber-400 shadow-md shadow-amber-600/30';
              } else if (opt.value === 'NO_APLICA') {
                btnClasses = 'bg-slate-700 text-slate-200 font-semibold ring-1 ring-slate-500';
              }
            }

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange(opt.value)}
                className={`py-2 px-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none active:scale-95 ${btnClasses}`}
              >
                <span className="text-xs">{opt.icon}</span>
                <span className="truncate">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
