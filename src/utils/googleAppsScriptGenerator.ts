import { SECTIONS } from '../data/checklistData';

export function generateGoogleAppsScript(): string {
  return `/**
 * ============================================================================
 * SCRIPT PARA CREAR GOOGLE FORM: NEXO — PRUEBAS REALES ANTES DEL LANZAMIENTO
 * ============================================================================
 * Instrucciones de uso:
 * 1. Abre https://script.google.com/
 * 2. Haz clic en "Nuevo proyecto"
 * 3. Pega todo este código en el archivo 'Código.gs' (reemplazando cualquier contenido previo)
 * 4. Haz clic en 'Guardar' (ícono de disco) y luego en 'Ejecutar' (botón Run con la función 'crearFormularioNexo')
 * 5. Concede los permisos que Google te solicite.
 * 6. ¡Listo! En el registro de ejecución verás los enlaces al formulario editable y público creado en tu Google Drive.
 * ============================================================================
 */

function crearFormularioNexo() {
  const form = FormApp.create('NEXO — PRUEBAS REALES ANTES DEL LANZAMIENTO');
  form.setDescription(
    'Checklist para validar toda la operación real de Nexo antes de recibir clientes.\\n\\n' +
    'Cada prueba debe poder marcarse como:\\n' +
    '✅ PASS\\n' +
    '❌ FAIL\\n' +
    '⏳ PENDIENTE\\n' +
    '➖ NO APLICA\\n\\n' +
    'Al final de cada sección se incluye un espacio para observaciones y problemas detectados.'
  );

  form.setAllowResponseEdits(true);
  form.setProgressBar(true);
  form.setConfirmationMessage('¡Gracias! La sesión de pruebas reales de Nexo ha sido registrada.');

  const standardChoices = ['PASS', 'FAIL', 'PENDIENTE', 'NO APLICA'];
  const passFailChoices = ['PASS', 'FAIL'];
  const yesNoChoices = ['YES', 'NO'];

  ${SECTIONS.map((sec, idx) => {
    const isFirst = idx === 0;
    const pageBreakCode = isFirst
      ? ''
      : `
  // Salto de página para Sección ${sec.number}
  const page_${sec.number} = form.addPageBreakItem();
  page_${sec.number}.setTitle('${sec.number}. ${escapeString(sec.title)}');
  ${sec.description ? `page_${sec.number}.setHelpText('${escapeString(sec.description)}');` : ''}`;

    const itemsCode = sec.items
      .map((item) => {
        if (item.isSubheader) {
          return `
  // Subencabezado
  form.addSectionHeaderItem().setTitle('${escapeString(item.text)}');`;
        }

        if (item.type === 'standard_4') {
          const title = item.number ? `${item.number}. ${item.text}` : item.text;
          return `
  {
    const item = form.addMultipleChoiceItem();
    item.setTitle('${escapeString(title)}');
    item.setChoiceValues(standardChoices);
    item.setRequired(false);
  }`;
        }

        if (item.type === 'pass_fail') {
          return `
  {
    const item = form.addMultipleChoiceItem();
    item.setTitle('${escapeString(item.text)}');
    ${item.subtitle ? `item.setHelpText('${escapeString(item.subtitle)}');` : ''}
    item.setChoiceValues(passFailChoices);
    item.setRequired(true);
  }`;
        }

        if (item.type === 'yes_no') {
          return `
  {
    const item = form.addMultipleChoiceItem();
    item.setTitle('${escapeString(item.text)}');
    item.setChoiceValues(yesNoChoices);
    item.setRequired(true);
  }`;
        }

        if (item.type === 'textarea') {
          return `
  {
    const item = form.addParagraphTextItem();
    item.setTitle('${escapeString(item.text)}');
    ${item.subtitle ? `item.setHelpText('${escapeString(item.subtitle)}');` : ''}
    item.setRequired(false);
  }`;
        }

        if (item.type === 'final_status') {
          return `
  {
    const item = form.addMultipleChoiceItem();
    item.setTitle('ESTADO FINAL DE NEXO');
    item.setHelpText('Resolución final del equipo operativo de Nexo');
    item.setChoiceValues([
      '🔴 NOT READY — existen problemas críticos',
      '🟡 READY WITH MINOR ISSUES — operación principal funciona pero existen correcciones menores',
      '🟢 READY FOR LAUNCH — las operaciones críticas fueron verificadas físicamente'
    ]);
    item.setRequired(true);
  }`;
        }

        return '';
      })
      .join('\n');

    const feedbackCode = `
  // Pregunta de feedback al final de la sección ${sec.number}
  {
    const feedback = form.addParagraphTextItem();
    feedback.setTitle('${escapeString(sec.feedbackQuestion)}');
    feedback.setHelpText('Anota detalles de errores, bloqueos, inconsistencias o mejoras detectadas en esta sección.');
    feedback.setRequired(false);
  }`;

    return `
  // ==========================================
  // SECCIÓN ${sec.number}: ${escapeString(sec.title)}
  // ==========================================
  ${pageBreakCode}
  ${itemsCode}
  ${feedbackCode}
`;
  }).join('\n')}

  Logger.log('==================================================');
  Logger.log('🎉 FORMULARIO DE NEXO CREADO CON ÉXITO:');
  Logger.log('URL de Edición: ' + form.getEditUrl());
  Logger.log('URL Pública para responder: ' + form.getPublishedUrl());
  Logger.log('==================================================');
}

function escapeString(str) {
  if (!str) return '';
  return str.replace(/\\\\/g, '\\\\\\\\').replace(/'/g, "\\\\'").replace(/\\n/g, '\\\\n');
}
`;
}

function escapeString(str: string): string {
  if (!str) return '';
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}
