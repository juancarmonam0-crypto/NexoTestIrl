import { SECTIONS, SectionData, FINAL_STATUS_OPTIONS } from '../data/checklistData';

export interface FormAnswers {
  [itemId: string]: string;
}

export interface SectionNotes {
  [sectionId: string]: string;
}

export function exportToJSON(
  answers: FormAnswers,
  notes: SectionNotes,
  auditorName: string,
  sessionDate: string
): void {
  const data = {
    title: 'NEXO — PRUEBAS REALES ANTES DEL LANZAMIENTO',
    auditor: auditorName || 'Auditor Nexo',
    date: sessionDate || new Date().toISOString(),
    completedAt: new Date().toISOString(),
    totalSections: SECTIONS.length,
    sections: SECTIONS.map((sec) => ({
      number: sec.number,
      title: sec.title,
      notes: notes[sec.id] || '',
      items: sec.items
        .filter((item) => !item.isSubheader)
        .map((item) => ({
          id: item.id,
          number: item.number,
          question: item.text,
          type: item.type,
          answer: answers[item.id] || 'PENDIENTE',
        })),
    })),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `NEXO-Pruebas-Lanzamiento-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToCSV(
  answers: FormAnswers,
  notes: SectionNotes,
  auditorName: string
): void {
  const rows: string[][] = [
    ['NEXO — PRUEBAS REALES ANTES DEL LANZAMIENTO', '', '', ''],
    ['Auditor:', auditorName || 'Equipo Nexo', 'Fecha:', new Date().toLocaleDateString('es-US')],
    [],
    ['Sección #', 'Sección', 'Pregunta #', 'Pregunta / Prueba', 'Respuesta / Estado', 'Observaciones de Sección']
  ];

  SECTIONS.forEach((sec) => {
    const secNote = notes[sec.id] || '';
    sec.items.forEach((item, idx) => {
      if (item.isSubheader) {
        rows.push([
          `${sec.number}`,
          sec.title,
          '-',
          `[SUB-SECCIÓN] ${item.text}`,
          '-',
          idx === 0 ? secNote : ''
        ]);
        return;
      }

      const ans = answers[item.id] || 'PENDIENTE';
      rows.push([
        `${sec.number}`,
        sec.title,
        item.number ? `${item.number}` : '-',
        `"${item.text.replace(/"/g, '""')}"`,
        `"${ans}"`,
        idx === 0 ? `"${secNote.replace(/"/g, '""')}"` : ''
      ]);
    });
  });

  const csvContent = '\uFEFF' + rows.map((r) => r.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `NEXO-Auditoria-Checklist-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function generateMarkdownReport(
  answers: FormAnswers,
  notes: SectionNotes,
  auditorName: string
): string {
  let totalStandard = 0;
  let passCount = 0;
  let failCount = 0;
  let pendingCount = 0;
  let naCount = 0;

  SECTIONS.forEach((sec) => {
    sec.items.forEach((item) => {
      if (!item.isSubheader && item.type === 'standard_4') {
        totalStandard++;
        const val = answers[item.id] || 'PENDIENTE';
        if (val === 'PASS') passCount++;
        else if (val === 'FAIL') failCount++;
        else if (val === 'PENDIENTE') pendingCount++;
        else if (val === 'NO_APLICA') naCount++;
      }
    });
  });

  const finalStatus = answers['launch_status'] || 'PENDIENTE DE EVALUACIÓN';
  const blockers = answers['blockers_text'] || 'Ninguno especificado.';
  const minorIssues = answers['minor_issues_text'] || 'Ninguno especificado.';
  const improvements = answers['improvements_text'] || 'Ninguna especificada.';

  let md = `# NEXO — INFORME DE PRUEBAS REALES ANTES DEL LANZAMIENTO\n\n`;
  md += `**Auditor / Inspector:** ${auditorName || 'Equipo Nexo'}\n`;
  md += `**Fecha de Ejecución:** ${new Date().toLocaleString('es-US')}\n`;
  md += `**Dictamen Final:** ${finalStatus}\n\n`;

  md += `## 📊 Resumen Ejecutivo\n\n`;
  md += `| Métrica | Cantidad | Porcentaje |\n`;
  md += `|---|---|---|\n`;
  md += `| ✅ PASS | ${passCount} | ${Math.round((passCount / totalStandard) * 100)}% |\n`;
  md += `| ❌ FAIL | ${failCount} | ${Math.round((failCount / totalStandard) * 100)}% |\n`;
  md += `| ⏳ PENDIENTE | ${pendingCount} | ${Math.round((pendingCount / totalStandard) * 100)}% |\n`;
  md += `| ➖ NO APLICA | ${naCount} | ${Math.round((naCount / totalStandard) * 100)}% |\n`;
  md += `| **Total de Pruebas** | **${totalStandard}** | 100% |\n\n`;

  md += `## 🚨 Hallazgos Críticos & Bloqueantes\n\n`;
  md += `### Blockers encontrados antes del lanzamiento:\n${blockers}\n\n`;
  md += `### Problemas importantes pero no bloqueantes:\n${minorIssues}\n\n`;
  md += `### Mejoras post-lanzamiento:\n${improvements}\n\n`;

  md += `## 📋 Detalle por Sección\n\n`;

  SECTIONS.forEach((sec) => {
    md += `### ${sec.number}. ${sec.title}\n\n`;
    if (sec.description) md += `*${sec.description}*\n\n`;

    sec.items.forEach((item) => {
      if (item.isSubheader) {
        md += `\n**--- ${item.text} ---**\n\n`;
        return;
      }
      const ans = answers[item.id] || '⏳ PENDIENTE';
      const numPrefix = item.number ? `${item.number}. ` : '';
      md += `- [${ans}] ${numPrefix}${item.text}\n`;
    });

    const note = notes[sec.id];
    if (note && note.trim()) {
      md += `\n> **Observaciones de la sección:**\n> ${note.replace(/\n/g, '\n> ')}\n\n`;
    } else {
      md += `\n*Sin observaciones adicionales.*\n\n`;
    }
  });

  return md;
}
