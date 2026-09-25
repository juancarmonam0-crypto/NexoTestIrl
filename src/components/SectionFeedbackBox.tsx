import React from 'react';
import { MessageSquarePlus, Sparkles } from 'lucide-react';

interface SectionFeedbackBoxProps {
  sectionNumber: number;
  questionTitle: string;
  value: string;
  onChange: (val: string) => void;
}

export const SectionFeedbackBox: React.FC<SectionFeedbackBoxProps> = ({
  sectionNumber,
  questionTitle,
  value,
  onChange,
}) => {
  return (
    <div className="mt-6 pt-5 border-t border-slate-800 bg-slate-900/95 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex items-start gap-3 mb-2.5">
        <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0">
          <MessageSquarePlus className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <span>{questionTitle}</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Escribe aquí cualquier fallo, comportamiento inesperado, retraso o detalle a corregir en la sección {sectionNumber}.
          </p>
        </div>
      </div>

      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder="Ej: El botón de confirmar tardó 3s en responder en red 4G / El PIN del lockbox requirió 2 intentos..."
        className="w-full bg-slate-950/90 border border-slate-700/90 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-y"
      />

      {value && value.trim().length > 0 && (
        <div className="mt-2 text-right">
          <span className="text-[11px] text-amber-400 font-mono">
            {value.length} caracteres guardados
          </span>
        </div>
      )}
    </div>
  );
};
