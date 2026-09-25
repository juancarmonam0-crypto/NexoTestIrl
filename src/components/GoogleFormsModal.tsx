import React, { useState } from 'react';
import { generateGoogleAppsScript } from '../utils/googleAppsScriptGenerator';
import { Copy, Check, ExternalLink, X, FileCode2, PlayCircle, ShieldCheck } from 'lucide-react';

interface GoogleFormsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleFormsModal: React.FC<GoogleFormsModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const scriptCode = generateGoogleAppsScript();

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Generador de Google Form Oficial
              </h2>
              <p className="text-xs text-slate-400">
                Crea el formulario idéntico en tu propia cuenta de Google Drive con 1 clic.
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

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-300 text-xs sm:text-sm">
          
          {/* Quick Steps */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <PlayCircle className="w-4 h-4 text-amber-400" />
              Pasos para crearlo en 30 segundos:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-slate-300 leading-relaxed text-xs">
              <li>
                Abre{' '}
                <a
                  href="https://script.google.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline font-semibold inline-flex items-center gap-1"
                >
                  script.google.com <ExternalLink className="w-3 h-3" />
                </a>{' '}
                en una nueva pestaña e inicia sesión con tu cuenta de Google.
              </li>
              <li>Haz clic en el botón <strong>"Nuevo proyecto"</strong>.</li>
              <li>Haz clic en <strong>"Copiar Código del Script"</strong> abajo y pégalo en el editor reemplazando todo.</li>
              <li>Presiona <strong>Guardar (Ctrl+S / Cmd+S)</strong> y luego haz clic en <strong>"Ejecutar" (Run)</strong>.</li>
              <li>Acepta los permisos de Google. ¡El formulario se creará automáticamente en tu Google Drive!</li>
            </ol>
          </div>

          {/* Action copy button */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-slate-400 font-mono">
              Script contiene 25 secciones y 383 pruebas completas
            </span>
            <button
              onClick={handleCopy}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-lg ${
                copied
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 active:scale-95'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '¡Código Copiado al Portapapeles!' : 'Copiar Código del Script (.gs)'}</span>
            </button>
          </div>

          {/* Code Viewer Preview */}
          <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 max-h-56 overflow-y-auto">
            <pre className="whitespace-pre-wrap">{scriptCode.slice(0, 1200)}...</pre>
            <div className="sticky bottom-0 left-0 right-0 py-2 text-center bg-gradient-to-t from-slate-950 to-transparent text-[11px] text-slate-500">
              (Código completo listo para ejecutarse en Google Apps Script)
            </div>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[12px] text-amber-200/90 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              El script genera el Google Form con todas las 25 secciones separadas por saltos de página para que sea 100% amigable en teléfonos móviles y guarde respuestas directas en Google Sheets.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
