import React, { useState } from 'react';
import { 
  FormAnswers, 
  SectionNotes, 
  exportToJSON, 
  exportToCSV, 
  generateMarkdownReport 
} from '../utils/exportHelpers';
import { Download, FileJson, FileSpreadsheet, FileText, Copy, Check, X, Share2 } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  answers: FormAnswers;
  notes: SectionNotes;
  auditorName: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  answers,
  notes,
  auditorName,
}) => {
  const [copiedMd, setCopiedMd] = useState(false);

  if (!isOpen) return null;

  const markdownContent = generateMarkdownReport(answers, notes, auditorName);

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Exportar Informe de Auditoría
              </h2>
              <p className="text-xs text-slate-400">
                Descarga los resultados en el formato que requiera tu equipo técnico.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* CSV Export */}
            <button
              onClick={() => exportToCSV(answers, notes, auditorName)}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-950/20 text-left transition-all cursor-pointer group flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
                <Download className="w-4 h-4 text-slate-500 group-hover:text-emerald-300 transition-colors" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs sm:text-sm">Descargar CSV</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Compatible con Google Sheets y Excel</p>
              </div>
            </button>

            {/* JSON Export */}
            <button
              onClick={() => exportToJSON(answers, notes, auditorName, new Date().toISOString())}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 hover:bg-amber-950/20 text-left transition-all cursor-pointer group flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <FileJson className="w-6 h-6 text-amber-400" />
                <Download className="w-4 h-4 text-slate-500 group-hover:text-amber-300 transition-colors" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs sm:text-sm">Descargar JSON</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Estructura completa para logs o APIs</p>
              </div>
            </button>

            {/* Copy Markdown Report */}
            <button
              onClick={handleCopyMarkdown}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-950/20 text-left transition-all cursor-pointer group flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <FileText className="w-6 h-6 text-indigo-400" />
                {copiedMd ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-500 group-hover:text-indigo-300 transition-colors" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-white text-xs sm:text-sm">
                  {copiedMd ? '¡Copiado!' : 'Copiar Markdown'}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Para GitHub, Slack o Notion</p>
              </div>
            </button>
          </div>

          {/* Markdown Preview */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Vista previa del Informe Markdown:
            </label>
            <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 max-h-60 overflow-y-auto">
              <pre className="whitespace-pre-wrap">{markdownContent}</pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
