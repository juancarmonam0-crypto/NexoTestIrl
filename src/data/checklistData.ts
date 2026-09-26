export type OptionValue = 'PASS' | 'FAIL' | 'PENDIENTE' | 'NO_APLICA' | 'YES' | 'NO' | string;

export interface QuestionItem {
  id: string;
  number?: number;
  text: string;
  type: 'standard_4' | 'pass_fail' | 'yes_no' | 'textarea' | 'final_status';
  options?: { value: string; label: string; icon?: string; color?: string }[];
  subtitle?: string;
  isSubheader?: boolean;
}

export interface SectionData {
  id: string;
  number: number;
  title: string;
  description?: string;
  badge?: string;
  items: QuestionItem[];
  feedbackQuestion: string;
}

export const STANDARD_OPTIONS = [
  { value: 'PASS', label: 'PASS', icon: '✅', color: 'emerald' },
  { value: 'FAIL', label: 'FAIL', icon: '❌', color: 'rose' },
  { value: 'PENDIENTE', label: 'PENDIENTE', icon: '⏳', color: 'amber' },
  { value: 'NO_APLICA', label: 'NO APLICA', icon: '➖', color: 'slate' },
];

export const PASS_FAIL_OPTIONS = [
  { value: 'PASS', label: 'PASS', icon: '✅', color: 'emerald' },
  { value: 'FAIL', label: 'FAIL', icon: '❌', color: 'rose' },
];

export const YES_NO_OPTIONS = [
  { value: 'YES', label: 'YES', icon: '🟢', color: 'emerald' },
  { value: 'NO', label: 'NO', icon: '🔴', color: 'rose' },
];

export const FINAL_STATUS_OPTIONS = [
  {
    value: 'NOT_READY',
    label: '🔴 NOT READY',
    description: 'Existen problemas críticos que impiden la operación segura.',
    color: 'rose',
  },
  {
    value: 'READY_WITH_MINOR_ISSUES',
    label: '🟡 READY WITH MINOR ISSUES',
    description: 'Operación principal funciona pero existen correcciones menores.',
    color: 'amber',
  },
  {
    value: 'READY_FOR_LAUNCH',
    label: '🟢 READY FOR LAUNCH',
    description: 'Las operaciones críticas fueron verificadas físicamente con éxito.',
    color: 'emerald',
  },
];

export const SECTIONS: SectionData[] = [
  {
    id: 'scenario-1', number: 1, title: 'UTILITY — CUSTOMER PICKUP / SELF-SERVICE',
    description: 'Reserva E2E principal. Debe validar preflight, KYC, acuerdo, pago Sandbox, email/PDF, Manage Reservation, Check-In, TTLock/PIN, Return, evidencias e inspección.',
    feedbackQuestion: 'Anota sólo fallos, bloqueos o diferencias importantes.',
    items: [
      { id: 's1-preflight', text: 'PASO 1 — Abre getnexo.us en el teléfono con datos móviles. Verifica Home, Rent y Admin sin 5xx/503; Utility disponible, precio correcto y dominio canonical getnexo.us.', type: 'standard_4' },
      { id: 's1-diagnostics', text: 'PASO 2 — Admin → Diagnostics: confirma Supabase operativo, Square en el entorno esperado, Resend operativo, VAPID public/private configuradas y key pair consistente. Si alguna tarjeta crítica está roja, NO sigas a Production.', type: 'standard_4' },
      { id: 's1-push', text: 'PASO 3 — En Push Diagnostics suscribe este dispositivo y envía Test Push. Debe llegar al teléfono; refresh debe seguir mostrando la suscripción sin exponer endpoint/keys.', type: 'standard_4' },
      { id: 's1-book', text: 'PASO 4 — Crea una reserva Utility Customer Pickup. Verifica fechas/horas, Nexo Point, disponibilidad, dirección si aplica y total antes de pagar.', type: 'standard_4' },
      { id: 's1-kyc-good', text: 'PASO 5 — Sube una licencia/ID REAL bien iluminada. La UI debe aceptar una imagen válida y nunca mostrar acusaciones de fraude al cliente por simple recorte, glare, perspectiva o incertidumbre.', type: 'standard_4' },
      { id: 's1-kyc-quality', text: 'PASO 6 — Haz UNA prueba controlada con foto de mala calidad/cortada. Debe pedir mejor imagen/reintento o revisión manual con copy neutral; NO debe declarar “counterfeit/fraudulent” salvo evidencia autoritativa real.', type: 'standard_4' },
      { id: 's1-kyc-gate', text: 'PASO 7 — Si KYC queda pending/processing/manual review/rejected, intenta Check-In/acceso: debe seguir BLOQUEADO hasta un verdict autoritativo aprobado. Admin debe mostrar el estado real y permitir resolver/reintentar según corresponda.', type: 'standard_4' },
      { id: 's1-agreement', text: 'PASO 8 — Completa/firma Rental Agreement. Verifica que versión/aceptación quedan asociadas a la reserva y que refrescar no pierde ni duplica la firma.', type: 'standard_4' },
      { id: 's1-pay', text: 'PASO 9 — Paga con Square SANDBOX. Verifica un solo pago, reserva confirmed y depósito/hold separado si corresponde; el hold no debe presentarse como cargo definitivo.', type: 'standard_4' },
      { id: 's1-email', text: 'PASO 10 — Verifica una sola confirmación automática, sender getnexo.us, links correctos y PDF/contrato con precio, fulfillment, Nexo Point/dirección y datos de la reserva correctos.', type: 'standard_4' },
      { id: 's1-manage', text: 'PASO 11 — Cierra la pestaña y vuelve desde el link Manage Reservation del email/confirmación. Debe recuperar LA MISMA reserva sin crear otra ni mostrar datos de otra persona.', type: 'standard_4' },
      { id: 's1-refresh', text: 'PASO 12 — Haz refresh/back/forward en puntos seguros después del pago. No debe duplicar pago, reserva, hold, contrato ni email automático.', type: 'standard_4' },
      { id: 's1-checkin', text: 'PASO 13 — Haz Check-In/Pickup como cliente. Verifica que exige los gates autoritativos y que el acceso/PIN aparece únicamente cuando todos corresponden.', type: 'standard_4' },
      { id: 's1-physical', text: 'PASO 14 — En el trailer real prueba TTLock/lockbox, luces, hitch y enganche. El PIN debe funcionar físicamente y las instrucciones del teléfono deben bastar para operar.', type: 'standard_4' },
      { id: 's1-return', text: 'PASO 15 — Ejecuta Return con checklist/fotos. Refresca Admin y verifica que evidencia/estado persisten y el depósito queda para revisión administrativa.', type: 'standard_4' },
      { id: 'res-s1', text: 'RESULTADO — Utility Self-Service completo', type: 'pass_fail' },
    ],
  },
  {
    id: 'scenario-2', number: 2, title: 'DUMP — ASSISTED PICKUP',
    description: 'Valida todo lo específico del Dump sin repetir controles ya cubiertos por Utility.',
    feedbackQuestion: 'Anota fallos de asistencia, seguridad, operación física o lifecycle.',
    items: [
      { id: 's2-book', text: 'PASO 1 — Reserva el Dump como cliente SIN experiencia usando Square SANDBOX. Verifica que assistance_requirement queda REQUIRED.', type: 'standard_4' },
      { id: 's2-appointment', text: 'PASO 2 — Verifica que Customer Pickup requiere Assisted Pickup/appointment y que no puede saltarse ni forzarse desde el cliente. Intenta reservar el mismo slot desde una segunda sesión: sólo una cita debe ganar.', type: 'standard_4' },
      { id: 's2-block', text: 'PASO 3 — Antes de completar orientación, intenta avanzar al acceso/entrega. Debe quedar bloqueado.', type: 'standard_4' },
      { id: 's2-orientation', text: 'PASO 4 — Desde Admin completa la orientación/asistencia y confirma evidencia visible de quién/cuándo la completó. El cliente queda habilitado sólo después; refresh no debe perder esa evidencia.', type: 'standard_4' },
      { id: 's2-physical', text: 'PASO 5 — Prueba físicamente hitch 2-5/16, 7-way, frenos/luces, tarp, hidráulico y procedimiento seguro de dump.', type: 'standard_4' },
      { id: 's2-return', text: 'PASO 6 — Devuelve el Dump, registra evidencia y verifica inspección + decisión administrativa del depósito.', type: 'standard_4' },
      { id: 'res-s2', text: 'RESULTADO — Dump Assisted Pickup completo', type: 'pass_fail' },
    ],
  },
  {
    id: 'scenario-3', number: 3, title: 'DELIVERY ONLY — NEXO ENTREGA / CLIENTE DEVUELVE',
    description: 'Prueba el modo NEXO_DELIVERY_CUSTOMER_RETURN de principio a fin.',
    feedbackQuestion: 'Anota diferencias entre lo esperado y lo mostrado al cliente/Admin.',
    items: [
      { id: 's3-book', text: 'PASO 1 — Reserva Delivery Only en SANDBOX. Verifica dirección, distancia y fórmula $5 + $1.25/milla para la entrega.', type: 'standard_4' },
      { id: 's3-customer-wait', text: 'PASO 2 — Tras pagar, verifica que el cliente espera a Nexo: NO Check-In inicial ni PIN; email/PDF muestran Delivery y dirección/ventana.', type: 'standard_4' },
      { id: 's3-queue', text: 'PASO 3 — Admin → Entregas y recogidas Nexo debe mostrar DELIVERY REQUIRED. Verifica que un handoff demasiado temprano/requisitos incompletos queda bloqueado.', type: 'standard_4' },
      { id: 's3-delivered', text: 'PASO 4 — Cuando sea elegible ejecuta Mark Delivered. Verifica active/in_progress, delivered_at y que repetir/refrescar no duplica la acción.', type: 'standard_4' },
      { id: 's3-return', text: 'PASO 5 — Al final el CLIENTE sí puede hacer Return. Verifica checklist/fotos, persistencia después de refresh e inspección administrativa.', type: 'standard_4' },
      { id: 'res-s3', text: 'RESULTADO — Delivery Only completo', type: 'pass_fail' },
    ],
  },
  {
    id: 'scenario-4', number: 4, title: 'DELIVERY + NEXO PICKUP',
    description: 'Prueba NEXO_DELIVERY_NEXO_PICKUP, incluido timing autoritativo, orientación Dump y depósito held.',
    feedbackQuestion: 'Anota cualquier acción que aparezca para el actor equivocado o en el momento equivocado.',
    items: [
      { id: 's4-book', text: 'PASO 1 — Reserva Dump + Delivery + Nexo Pickup en SANDBOX. Verifica fórmula de delivery de ida y recogida (doble) y pago correcto.', type: 'standard_4' },
      { id: 's4-gating', text: 'PASO 2 — Cliente NO debe tener Check-In/PIN/Return. Si es Dump sin experiencia, no debe crear cita de patio pero orientación sigue REQUIRED.', type: 'standard_4' },
      { id: 's4-orientation', text: 'PASO 3 — Intenta Mark Delivered antes de completar orientación/requisitos: debe bloquearse. Completa orientación desde Admin y vuelve a intentar cuando sea elegible.', type: 'standard_4' },
      { id: 's4-delivered', text: 'PASO 4 — Ejecuta Mark Delivered y verifica renta activa + evidencia persistente después de refresh.', type: 'standard_4' },
      { id: 's4-early-pickup', text: 'PASO 5 — Intenta Mark Picked Up ANTES del fin autoritativo: debe bloquearse.', type: 'standard_4' },
      { id: 's4-picked', text: 'PASO 6 — Al llegar el fin ejecuta Mark Picked Up una vez. Verifica pending_inspection_review, picked_up_at/by y depósito todavía held.', type: 'standard_4' },
      { id: 's4-inspection', text: 'PASO 7 — Completa inspección/decisión administrativa del depósito y verifica Square + Nexo consistentes.', type: 'standard_4' },
      { id: 'res-s4', text: 'RESULTADO — Delivery + Nexo Pickup completo', type: 'pass_fail' },
    ],
  },
  {
    id: 'scenario-5', number: 5, title: 'SERVICIOS — JUNK REMOVAL + HAULING & DELIVERY',
    description: 'Comprueba Junk Removal, Hauling & Delivery, cotización/aceptación, pago y Assisted Sales sin repetir toda la batería de Rental.',
    feedbackQuestion: 'Anota fallos de formulario, cotización, contacto, pago o Admin.',
    items: [
      { id: 's5-junk', text: 'PASO 1 — Completa un Junk Removal realista: formulario → datos/fotos → Admin. Verifica que request, dirección, fotos y notas persisten después de refresh.', type: 'standard_4' },
      { id: 's5-quote', text: 'PASO 2 — Desde Admin crea y envía cotización. Abre el link como cliente, verifica monto/alcance/validez y prueba aceptar. Si existe Change Request, confirma que genera revisión y no altera silenciosamente una cotización aceptada.', type: 'standard_4' },
      { id: 's5-payment', text: 'PASO 3 — Completa el pago Sandbox del servicio desde el link autorizado. Verifica que el monto viene del servidor, un solo pago queda registrado y refresh/reintento no crea cobros duplicados.', type: 'standard_4' },
      { id: 's5-junk-mobile', text: 'PASO 4 — En móvil verifica que el cliente entiende precio/alcance, recibe el email/link correcto y Nexo conserva toda la información necesaria para ejecutar/cerrar el trabajo.', type: 'standard_4' },
      { id: 's5-hauling', text: 'PASO 5 — Completa Hauling & Delivery con origen/destino/carga adecuados y verifica capacidad/horario y que puede manejar Utility o Dump cuando corresponda.', type: 'standard_4' },
      { id: 's5-admin', text: 'PASO 6 — Verifica que Admin permite operar ambos servicios de REQUESTED → quote → accepted/scheduled → job → payment/close sin entrar manualmente a Supabase.', type: 'standard_4' },
      { id: 's5-assisted-sale', text: 'PASO 7 — Prueba una Assisted Sale para un cliente conseguido por fuera: crea el registro desde Admin, genera Payment Link de Square Sandbox y confirma que SOLO el webhook/pago real cambia a PAID; no debe existir un botón que “invente” pago.', type: 'standard_4' },
      { id: 's5-assisted-gates', text: 'PASO 8 — Si Assisted Sale termina vinculada a una renta, confirma que verificaciones manuales acotadas NO saltan KYC, depósito, firma, check-in, fotos, Assisted Pickup ni TTLock salvo el requisito específico documentado.', type: 'standard_4' },
      { id: 'res-s5', text: 'RESULTADO — Servicios completos', type: 'pass_fail' },
    ],
  },
  {
    id: 'scenario-6', number: 6, title: 'FALLOS CONTROLADOS — SÓLO SANDBOX',
    description: 'Casos destructivos. Nunca provocar estos escenarios intencionalmente con dinero real.',
    badge: 'SANDBOX ONLY',
    feedbackQuestion: 'Para cada FAIL guarda screenshot y el paso exacto.',
    items: [
      { id: 's6-decline', text: 'PASO 1 — Simula pago rechazado. No debe quedar reserva confirmed, hold válido ni operación fantasma.', type: 'standard_4' },
      { id: 's6-double', text: 'PASO 2 — Prueba doble Pay/reintento/refresh. Debe existir un solo pago, una sola reserva y una sola confirmación automática.', type: 'standard_4' },
      { id: 's6-occupancy', text: 'PASO 3 — Intenta reservar el mismo trailer/slot desde dos sesiones. Sólo una debe obtener la disponibilidad autoritativa.', type: 'standard_4' },
      { id: 's6-admin-repeat', text: 'PASO 4 — Repite acciones Admin Delivery/Pickup ya completadas. Deben ser idempotentes y no corromper estado/evidencia.', type: 'standard_4' },
      { id: 's6-network', text: 'PASO 5 — Corta conexión/refresca/cierra la pestaña durante un punto seguro del flujo y verifica recuperación sin duplicados ni estados falsos de “pagado/confirmado”.', type: 'standard_4' },
      { id: 's6-auth', text: 'PASO 6 — En incógnito/sin sesión Admin intenta abrir acciones protegidas. Debe pedir autenticación y las APIs Admin no deben entregar datos operativos/PII sin credencial válida.', type: 'standard_4' },
      { id: 's6-deeplink', text: 'PASO 7 — Abre directamente links de Manage Reservation, quote/payment y Admin desde una pestaña nueva. Cada deep link debe cargar o rechazar de forma explícita; nunca pantalla blanca ni datos de otro registro.', type: 'standard_4' },
      { id: 'res-s6', text: 'RESULTADO — Fallos controlados', type: 'pass_fail' },
    ],
  },
  {
    id: 'scenario-7', number: 7, title: 'INSPECCIÓN FÍSICA / OPERACIÓN DE CAMPO',
    description: 'Una sola vuelta física cubre equipo, Nexo Point, móvil, noche y operación del socio.',
    feedbackQuestion: 'Anota cualquier cosa que pueda confundir o poner en riesgo a un cliente.',
    items: [
      { id: 's7-location', text: 'PASO 1 — Sigue el link/mapa como si fueras cliente. Debe llevar al punto exacto del trailer y las instrucciones deben ser suficientes sin llamada.', type: 'standard_4' },
      { id: 's7-mobile', text: 'PASO 2 — Recorre instrucciones, contrato, fotos y Admin desde teléfono con datos móviles. Verifica legibilidad y acciones críticas.', type: 'standard_4' },
      { id: 's7-utility', text: 'PASO 3 — Utility: llantas, luces, hitch, cadenas, jack, rampa, lockbox/TTLock y condición general.', type: 'standard_4' },
      { id: 's7-dump', text: 'PASO 4 — Dump: llantas, luces/frenos, hitch, cadenas, jack, tarp, hidráulico/batería y condición general.', type: 'standard_4' },
      { id: 's7-night', text: 'PASO 5 — Si es posible al anochecer, confirma visibilidad, identificación del Nexo Point y que pickup/return puede hacerse de forma clara.', type: 'standard_4' },
      { id: 's7-partner', text: 'PASO 6 — Tu socio ejecuta una entrega/recogida simulada usando sólo Admin e instrucciones disponibles, sin ayuda técnica.', type: 'standard_4' },
      { id: 's7-gps', text: 'PASO 7 — Si GPS/Traccar está instalado en esta unidad, confirma que Admin muestra el dispositivo correcto y una ubicación reciente sin mezclar identificadores entre trailers. Si aún no está instalado, marca NO APLICA.', type: 'standard_4' },
      { id: 's7-mobile-layout', text: 'PASO 8 — Revisa móvil en modo claro: header, botones, modales, teclado, safe areas/notch y CTA críticos no deben quedar cortados/ocultos ni requerir zoom.', type: 'standard_4' },
      { id: 'res-s7', text: 'RESULTADO — Operación física', type: 'pass_fail' },
    ],
  },
  {
    id: 'scenario-8', number: 8, title: '🔥 PRUEBA DE FUEGO — SQUARE PRODUCTION',
    description: 'Una sola reserva real y barata al final. Debe atravesar el máximo de infraestructura sin ejecutar casos destructivos.',
    badge: 'PRODUCTION · DINERO REAL',
    feedbackQuestion: 'Registra Reservation ID, Payment ID, monto y cualquier diferencia.',
    items: [
      { id: 's8-gate', text: 'PASO 1 — NO CONTINÚES hasta que escenarios 1–7 críticos estén PASS y Admin Diagnostics esté verde en lo crítico. Confirma credenciales/location/webhooks de Square Production y que cualquier modo de prueba temporal tenga el valor esperado.', type: 'standard_4' },
      { id: 's8-price', text: 'PASO 2 — Usa el mecanismo controlado de descuento/cupón de prueba para dejar el cargo real en el mínimo práctico SIN cambiar precios públicos. Confirma total antes de pagar.', type: 'standard_4' },
      { id: 's8-book', text: 'PASO 3 — Haz UNA reserva real Dump + Delivery + Nexo Pickup con tarjeta real. Verifica exactamente un cargo Production y, si aplica, hold separado.', type: 'standard_4' },
      { id: 's8-confirm', text: 'PASO 4 — Verifica webhook → reserva confirmed → una sola confirmación automática + PDF. Refresca y confirma que nada se duplica.', type: 'standard_4' },
      { id: 's8-delivery', text: 'PASO 5 — Completa orientación/requisitos y Mark Delivered. Verifica cliente sin PIN/Return y Admin consistente.', type: 'standard_4' },
      { id: 's8-pickup', text: 'PASO 6 — Cuando sea temporalmente elegible, Mark Picked Up → pending_inspection_review. El depósito debe seguir held.', type: 'standard_4' },
      { id: 's8-close', text: 'PASO 7 — Cierra la prueba: inspección + release/refund administrativo requerido. Verifica Square y Nexo consistentes y desactiva/inutiliza el cupón de prueba.', type: 'standard_4' },
      { id: 's8-no-destructive', text: 'CONTROL — NO probar declined cards, doble clic intencional, concurrencia ni reintentos destructivos en Production.', type: 'standard_4' },
      { id: 'res-s8', text: 'RESULTADO — Square Production Fire Test', type: 'pass_fail' },
    ],
  },
  {
    id: 'scenario-9', number: 9, title: 'CIERRE — GO / NO-GO',
    description: 'Resumen corto. Un fallo cosmético se registra; un fallo crítico bloquea lanzamiento hasta corregirlo y repetir su escenario.',
    feedbackQuestion: 'Lista los bloqueadores reales y mejoras no críticas por separado.',
    items: [
      { id: 'final-rentals', text: '¿Customer Pickup, Assisted Pickup, Delivery Only y Delivery + Nexo Pickup pasaron?', type: 'yes_no' },
      { id: 'final-payments', text: '¿Square Sandbox + depósito + idempotencia + recuperación tras refresh/reintento pasaron?', type: 'yes_no' },
      { id: 'final-kyc', text: '¿KYC real + mala calidad + manual review/retry + gating autoritativo pasaron sin mensajes falsos de fraude?', type: 'yes_no' },
      { id: 'final-comms', text: '¿Email/PDF/Manage Reservation + Push Diagnostics funcionan y apuntan a getnexo.us?', type: 'yes_no' },
      { id: 'final-services', text: '¿Junk Removal + Hauling & Delivery + cotizaciones/pagos + Assisted Sales pasaron?', type: 'yes_no' },
      { id: 'final-physical', text: '¿TTLock/PIN real, equipo, Nexo Point y operación física pasaron?', type: 'yes_no' },
      { id: 'final-production', text: '¿La prueba de fuego Square Production pasó y quedó cerrada sin dinero/hold de prueba pendiente?', type: 'yes_no' },
      { id: 'final-status', text: 'ESTADO FINAL DE LANZAMIENTO', type: 'final_status', options: FINAL_STATUS_OPTIONS },
      { id: 'blockers_text', text: 'BLOQUEADORES CRÍTICOS — pagos, depósito, seguridad, acceso, reserva, Delivery/Return o Admin', type: 'textarea' },
      { id: 'minor_text', text: 'MEJORAS NO CRÍTICAS — registrar para después del lanzamiento', type: 'textarea' },
    ],
  },
];
