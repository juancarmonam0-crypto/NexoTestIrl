import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MinusCircle, 
  FileSpreadsheet, 
  Share2, 
  Sparkles, 
  Printer, 
  RotateCcw,
  SlidersHorizontal,
  Search
} from 'lucide-react';

interface HeaderProps {
  totalItems: number;
  completedCount: number;
  passCount: number;
  failCount: number;
  pendingCount: number;
  naCount: number;
  auditorName: string;
  onAuditorChange: (name: string) => void;
  onOpenGoogleFormsModal: () => void;
  onOpenExportModal: () => void;
  onReset: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusFilterChange: (filter: string) => void;
  onPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalItems,
  completedCount,
  passCount,
  failCount,
  pendingCount,
  naCount,
  auditorName,
  onAuditorChange,
  onOpenGoogleFormsModal,
  onOpenExportModal,
  onReset,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onPrint,
}) => {
  const progressPercent = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;
  const passRate = (passCount + failCount) > 0 
    ? Math.round((passCount / (passCount + failCount)) * 100) 
    : 100;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/90 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Main top bar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Brand & Title */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-xl shadow-lg shadow-amber-500/20 shrink-0">
              N
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  Checklist Operativo Oficial
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  v1.1 • 9 Escenarios • {totalItems} Pruebas
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                NEXO — PRUEBAS REALES ANTES DEL LANZAMIENTO
              </h1>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              onClick={onOpenGoogleFormsModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/90 hover:bg-indigo-600 text-indigo-50 text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              title="Generar Google Form oficial en Google Drive"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Generar Google Form</span>
            </button>

            <button
              onClick={onOpenExportModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all cursor-pointer hover:text-white"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Exportar / Reporte</span>
            </button>

            <button
              onClick={onPrint}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-all cursor-pointer"
              title="Imprimir o Guardar como PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>

            <button
              onClick={onReset}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-800/40 text-xs transition-all cursor-pointer"
              title="Reiniciar respuestas guardadas"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats & Search Toolbar */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Quick Stats Badges */}
          <div className="md:col-span-6 flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 text-xs font-medium">
            <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 px-2.5 py-1 rounded-md text-slate-300 shrink-0">
              <span className="text-slate-400">Progreso:</span>
              <span className="font-bold text-white">{completedCount}/{totalItems} ({progressPercent}%)</span>
            </div>

            <button
              onClick={() => onStatusFilterChange(statusFilter === 'PASS' ? 'ALL' : 'PASS')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs cursor-pointer transition-all shrink-0 ${
                statusFilter === 'PASS'
                  ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 ring-1 ring-emerald-400'
                  : 'bg-emerald-950/40 border-emerald-900/60 text-emerald-400 hover:bg-emerald-900/40'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>PASS: <strong>{passCount}</strong></span>
            </button>

            <button
              onClick={() => onStatusFilterChange(statusFilter === 'FAIL' ? 'ALL' : 'FAIL')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs cursor-pointer transition-all shrink-0 ${
                statusFilter === 'FAIL'
                  ? 'bg-rose-500/25 border-rose-400 text-rose-300 ring-1 ring-rose-400'
                  : 'bg-rose-950/40 border-rose-900/60 text-rose-400 hover:bg-rose-900/40'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>FAIL: <strong>{failCount}</strong></span>
            </button>

            <button
              onClick={() => onStatusFilterChange(statusFilter === 'PENDIENTE' ? 'ALL' : 'PENDIENTE')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs cursor-pointer transition-all shrink-0 ${
                statusFilter === 'PENDIENTE'
                  ? 'bg-amber-500/25 border-amber-400 text-amber-300 ring-1 ring-amber-400'
                  : 'bg-amber-950/40 border-amber-900/60 text-amber-400 hover:bg-amber-900/40'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pendientes: <strong>{pendingCount}</strong></span>
            </button>

            {failCount > 0 && (
              <span className="bg-rose-500 text-white font-extrabold text-[10px] px-1.5 py-0.5 rounded-full uppercase shrink-0 animate-pulse">
                {failCount} Bloqueos
              </span>
            )}
          </div>

          {/* Search and Auditor Input */}
          <div className="md:col-span-6 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar en las 383 pruebas..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-xs bg-slate-950/70 border border-slate-700/80 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="w-36 sm:w-44 shrink-0">
              <input
                type="text"
                placeholder="Nombre de Auditor..."
                value={auditorName}
                onChange={(e) => onAuditorChange(e.target.value)}
                className="w-full px-2.5 py-1 text-xs bg-slate-950/70 border border-slate-700/80 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

        </div>

        {/* Global Progress Bar */}
        <div className="mt-2.5 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden flex">
          <div
            className="bg-emerald-500 transition-all duration-300"
            style={{ width: `${(passCount / totalItems) * 100}%` }}
            title={`PASS: ${passCount}`}
          />
          <div
            className="bg-rose-500 transition-all duration-300"
            style={{ width: `${(failCount / totalItems) * 100}%` }}
            title={`FAIL: ${failCount}`}
          />
          <div
            className="bg-slate-600 transition-all duration-300"
            style={{ width: `${(naCount / totalItems) * 100}%` }}
            title={`NO APLICA: ${naCount}`}
          />
        </div>
      </div>
    </header>
  );
};
