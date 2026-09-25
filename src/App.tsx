import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  SECTIONS, 
  SectionData, 
  QuestionItem, 
  STANDARD_OPTIONS 
} from './data/checklistData';
import { Header } from './components/Header';
import { SectionNav } from './components/SectionNav';
import { QuestionCard } from './components/QuestionCard';
import { SectionFeedbackBox } from './components/SectionFeedbackBox';
import { GoogleFormsModal } from './components/GoogleFormsModal';
import { ExportModal } from './components/ExportModal';
import { LaunchSummaryCard } from './components/LaunchSummaryCard';
import { FormAnswers, SectionNotes } from './utils/exportHelpers';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCheck, 
  RotateCcw, 
  LayoutList, 
  FileSpreadsheet, 
  Share2, 
  Layers, 
  Sparkles,
  Search,
  Filter,
  ArrowUp
} from 'lucide-react';

const STORAGE_KEY_ANSWERS = 'nexo_qa_answers_v1';
const STORAGE_KEY_NOTES = 'nexo_qa_notes_v1';
const STORAGE_KEY_AUDITOR = 'nexo_qa_auditor_v1';

export default function App() {
  // State
  const [answers, setAnswers] = useState<FormAnswers>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ANSWERS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [notes, setNotes] = useState<SectionNotes>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [auditorName, setAuditorName] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_AUDITOR) || '';
  });

  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isGoogleFormsModalOpen, setIsGoogleFormsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const topRef = useRef<HTMLDivElement>(null);

  // Auto-save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(answers));
    } catch (e) {
      console.error('Error saving answers to localStorage', e);
    }
  }, [answers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
    } catch (e) {
      console.error('Error saving notes to localStorage', e);
    }
  }, [notes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_AUDITOR, auditorName);
    } catch (e) {
      console.error('Error saving auditor to localStorage', e);
    }
  }, [auditorName]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2500);
  };

  // Metrics calculation
  const { totalCount, completedCount, passCount, failCount, pendingCount, naCount } = useMemo(() => {
    let total = 0;
    let completed = 0;
    let pass = 0;
    let fail = 0;
    let pending = 0;
    let na = 0;

    SECTIONS.forEach((sec) => {
      sec.items.forEach((it) => {
        if (it.isSubheader) return;
        total++;
        const val = answers[it.id];
        if (val === 'PASS' || val === 'YES') {
          pass++;
          completed++;
        } else if (val === 'FAIL' || val === 'NO') {
          fail++;
          completed++;
        } else if (val === 'NO_APLICA') {
          na++;
          completed++;
        } else if (val && val !== 'PENDIENTE') {
          completed++;
        } else {
          pending++;
        }
      });
    });

    return {
      totalCount: total,
      completedCount: completed,
      passCount: pass,
      failCount: fail,
      pendingCount: pending,
      naCount: na,
    };
  }, [answers]);

  // Answer handler
  const handleAnswerChange = (itemId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [itemId]: value,
    }));
  };

  // Note handler
  const handleNoteChange = (sectionId: string, value: string) => {
    setNotes((prev) => ({
      ...prev,
      [sectionId]: value,
    }));
  };

  // Batch section actions
  const handleMarkSectionPass = (sec: SectionData) => {
    const updates: FormAnswers = {};
    sec.items.forEach((it) => {
      if (it.isSubheader) return;
      if (it.type === 'standard_4') updates[it.id] = 'PASS';
      else if (it.type === 'pass_fail') updates[it.id] = 'PASS';
      else if (it.type === 'yes_no') updates[it.id] = 'YES';
    });
    setAnswers((prev) => ({ ...prev, ...updates }));
    showToast(`Sección ${sec.number} marcada como PASS.`);
  };

  const handleResetSection = (sec: SectionData) => {
    if (!confirm(`¿Estás seguro de reiniciar todas las respuestas de la sección ${sec.number}?`)) {
      return;
    }
    const nextAnswers = { ...answers };
    sec.items.forEach((it) => {
      delete nextAnswers[it.id];
    });
    setAnswers(nextAnswers);
    showToast(`Sección ${sec.number} reiniciada.`);
  };

  const handleGlobalReset = () => {
    if (confirm('¿Deseas borrar TODAS las respuestas y observaciones del checklist? Esta acción no se puede deshacer.')) {
      setAnswers({});
      setNotes({});
      localStorage.removeItem(STORAGE_KEY_ANSWERS);
      localStorage.removeItem(STORAGE_KEY_NOTES);
      showToast('Checklist reiniciado a cero.');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered sections / items
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim() && statusFilter === 'ALL') {
      return SECTIONS;
    }

    const query = searchQuery.toLowerCase().trim();

    return SECTIONS.map((sec) => {
      const matchSectionTitle = sec.title.toLowerCase().includes(query);
      const filteredItems = sec.items.filter((item) => {
        if (item.isSubheader) return true;

        const val = answers[item.id] || 'PENDIENTE';

        // Check status filter
        if (statusFilter === 'PASS' && val !== 'PASS' && val !== 'YES') return false;
        if (statusFilter === 'FAIL' && val !== 'FAIL' && val !== 'NO') return false;
        if (statusFilter === 'PENDIENTE' && val !== 'PENDIENTE' && val !== '') return false;

        // Check query filter
        if (query) {
          const matchQuestion = item.text.toLowerCase().includes(query);
          const matchNumber = item.number ? `${item.number}`.includes(query) : false;
          return matchQuestion || matchNumber || matchSectionTitle;
        }

        return true;
      });

      return {
        ...sec,
        items: filteredItems,
      };
    }).filter((sec) => sec.items.length > 0);
  }, [searchQuery, statusFilter, answers]);

  const currentSection = SECTIONS[activeSectionIndex] || SECTIONS[0];

  return (
    <div ref={topRef} className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30">
      
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-amber-500/60 text-amber-300 px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with Stats and Actions */}
      <Header
        totalItems={totalCount}
        completedCount={completedCount}
        passCount={passCount}
        failCount={failCount}
        pendingCount={pendingCount}
        naCount={naCount}
        auditorName={auditorName}
        onAuditorChange={setAuditorName}
        onOpenGoogleFormsModal={() => setIsGoogleFormsModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onReset={handleGlobalReset}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onPrint={() => window.print()}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Launch Readiness Summary Card */}
        <LaunchSummaryCard
          answers={answers}
          onJumpToSection={(secIdx) => {
            setActiveSectionIndex(secIdx);
            setViewMode('single');
            scrollToTop();
          }}
        />

        {/* View Mode and Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('single')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'single'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Por Sección (1 a 25)</span>
            </button>

            <button
              onClick={() => setViewMode('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>Vista Continua Completa</span>
            </button>
          </div>

          {(statusFilter !== 'ALL' || searchQuery) && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Filtro activo: {statusFilter !== 'ALL' ? statusFilter : ''} {searchQuery ? `"${searchQuery}"` : ''}
              </span>
              <button
                onClick={() => {
                  setStatusFilter('ALL');
                  setSearchQuery('');
                }}
                className="text-slate-400 hover:text-white underline cursor-pointer"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: 25-Section Navigation (Sticky) */}
          <div className="hidden lg:block lg:col-span-4 sticky top-36">
            <SectionNav
              activeSectionIndex={activeSectionIndex}
              onSelectSection={(idx) => {
                setActiveSectionIndex(idx);
                setViewMode('single');
                scrollToTop();
              }}
              answers={answers}
              notes={notes}
            />
          </div>

          {/* Right Column: Section Items */}
          <div className="lg:col-span-8 space-y-8">
            
            {viewMode === 'single' ? (
              /* Single Section Mode */
              <div className="space-y-6">
                
                {/* Section Header Card */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-mono font-extrabold flex items-center justify-center text-sm shadow-md">
                        {currentSection.number}
                      </span>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                        Sección {currentSection.number} de {SECTIONS.length}
                      </span>
                    </div>

                    {/* Section Quick Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleMarkSectionPass(currentSection)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-900/80 text-xs font-semibold transition-all cursor-pointer"
                        title="Marcar todas las preguntas estándar de esta sección como PASS"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Aprobar Sección (PASS)</span>
                      </button>

                      <button
                        onClick={() => handleResetSection(currentSection)}
                        className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-950/50 text-slate-400 hover:text-rose-300 border border-slate-700 text-xs transition-all cursor-pointer"
                        title="Limpiar respuestas de esta sección"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {currentSection.title}
                  </h2>

                  {currentSection.description && (
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                      {currentSection.description}
                    </p>
                  )}

                  {currentSection.badge && (
                    <div className="mt-3">
                      <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
                        ⚠️ {currentSection.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Question List */}
                <div className="space-y-3">
                  {currentSection.items.map((item) => (
                    <QuestionCard
                      key={item.id}
                      item={item}
                      value={answers[item.id]}
                      onChange={(val) => handleAnswerChange(item.id, val)}
                      sectionNumber={currentSection.number}
                    />
                  ))}
                </div>

                {/* Section Feedback Box */}
                <SectionFeedbackBox
                  sectionNumber={currentSection.number}
                  questionTitle={currentSection.feedbackQuestion}
                  value={notes[currentSection.id] || ''}
                  onChange={(val) => handleNoteChange(currentSection.id, val)}
                />

                {/* Next / Previous Navigation Controls */}
                <div className="pt-6 border-t border-slate-800 flex items-center justify-between gap-4">
                  <button
                    onClick={() => {
                      if (activeSectionIndex > 0) {
                        setActiveSectionIndex(activeSectionIndex - 1);
                        scrollToTop();
                      }
                    }}
                    disabled={activeSectionIndex === 0}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                      activeSectionIndex === 0
                        ? 'opacity-40 cursor-not-allowed text-slate-600 bg-slate-900 border border-slate-800'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 cursor-pointer'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Sección Anterior</span>
                  </button>

                  <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                    {activeSectionIndex + 1} / {SECTIONS.length}
                  </span>

                  <button
                    onClick={() => {
                      if (activeSectionIndex < SECTIONS.length - 1) {
                        setActiveSectionIndex(activeSectionIndex + 1);
                        scrollToTop();
                      }
                    }}
                    disabled={activeSectionIndex === SECTIONS.length - 1}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                      activeSectionIndex === SECTIONS.length - 1
                        ? 'opacity-40 cursor-not-allowed text-slate-600 bg-slate-900 border border-slate-800'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 cursor-pointer'
                    }`}
                  >
                    <span>Siguiente Sección</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ) : (
              /* All Sections Continuous View */
              <div className="space-y-12">
                {filteredSections.map((sec) => (
                  <section key={sec.id} className="space-y-4 pt-4">
                    {/* Section Header */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-mono font-bold flex items-center justify-center text-xs">
                            {sec.number}
                          </span>
                          <h3 className="text-base sm:text-lg font-bold text-white">
                            {sec.title}
                          </h3>
                        </div>
                        {sec.description && (
                          <p className="text-xs text-slate-400 mt-1">{sec.description}</p>
                        )}
                      </div>

                      <button
                        onClick={() => handleMarkSectionPass(sec)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 border border-emerald-900/80 text-xs font-semibold transition-all cursor-pointer self-start sm:self-auto"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Aprobar Sección</span>
                      </button>
                    </div>

                    {/* Questions */}
                    <div className="space-y-2.5">
                      {sec.items.map((item) => (
                        <QuestionCard
                          key={item.id}
                          item={item}
                          value={answers[item.id]}
                          onChange={(val) => handleAnswerChange(item.id, val)}
                          sectionNumber={sec.number}
                        />
                      ))}
                    </div>

                    {/* Feedback */}
                    <SectionFeedbackBox
                      sectionNumber={sec.number}
                      questionTitle={sec.feedbackQuestion}
                      value={notes[sec.id] || ''}
                      onChange={(val) => handleNoteChange(sec.id, val)}
                    />
                  </section>
                ))}
              </div>
            )}

          </div>

        </div>

      </main>

      {/* Floating Bottom Navigation for Mobile */}
      <div className="lg:hidden sticky bottom-0 z-30 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-3 flex items-center justify-between gap-2 shadow-2xl">
        <button
          onClick={() => {
            if (activeSectionIndex > 0) {
              setActiveSectionIndex(activeSectionIndex - 1);
              setViewMode('single');
              scrollToTop();
            }
          }}
          disabled={activeSectionIndex === 0}
          className="p-2 rounded-xl bg-slate-800 text-slate-200 disabled:opacity-40"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="text-xs font-bold text-white truncate max-w-[200px]">
            {currentSection.number}. {currentSection.title}
          </div>
          <div className="text-[10px] text-amber-400 font-mono">
            {completedCount}/{totalCount} verificadas
          </div>
        </div>

        <button
          onClick={() => {
            if (activeSectionIndex < SECTIONS.length - 1) {
              setActiveSectionIndex(activeSectionIndex + 1);
              setViewMode('single');
              scrollToTop();
            }
          }}
          disabled={activeSectionIndex === SECTIONS.length - 1}
          className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold disabled:opacity-40"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500">
        <p className="max-w-md mx-auto leading-relaxed">
          NEXO — Checklist de Verificación Operacional Pre-Lanzamiento • Desarrollado para auditoría en terreno y generación de Google Form.
        </p>
      </footer>

      {/* Modals */}
      <GoogleFormsModal
        isOpen={isGoogleFormsModalOpen}
        onClose={() => setIsGoogleFormsModalOpen(false)}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        answers={answers}
        notes={notes}
        auditorName={auditorName}
      />

    </div>
  );
}
