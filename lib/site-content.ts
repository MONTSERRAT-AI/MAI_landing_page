// Textos y datos públicos de la landing.
// Los escenarios y cifras de las maquetas son ficticios y se marcan como DEMO.
// No agregar clientes, testimonios ni cifras que no estén confirmados y autorizados.

export const hero = {
  brand: ["Menos tareas.", "Más negocio."],
  title: "La IA hace lo repetitivo. Tu equipo, lo importante.",
  description:
    "Conectamos tus mensajes, tu agenda y tus herramientas.",
  primaryCta: "Cuéntanos qué necesitas",
  secondaryCta: "Ver cómo funciona",
};

/** Texto del CTA principal: el mismo en inicio, navegación, soluciones y cierre. */
export const PRIMARY_CTA = hero.primaryCta;

export type Solution = {
  id: string;
  label: string;
  title: string;
  situation: string;
  automate: string;
  change: string;
};

export const solutions: Solution[] = [
  {
    id: "atender",
    label: "ATENDER Y VENDER",
    title: "Respuestas rápidas y oportunidades que no se pierden",
    situation:
      "Respondes las mismas preguntas por WhatsApp todo el día y algunos clientes que preguntaron nunca reciben seguimiento.",
    automate:
      "MAI atiende las consultas frecuentes en tus canales y cada oportunidad avanza en el pipeline con su ficha, su historial y su próximo paso.",
    change:
      "MAI te avisa cuando necesita ayuda: tu equipo responde, le devuelve el control y se enfoca en lo que necesita criterio humano.",
  },
  {
    id: "reservar",
    label: "RESERVAR Y COORDINAR",
    title: "Reservas que se agendan, confirman y recuerdan solas",
    situation:
      "Agendar, confirmar y reprogramar citas te quita horas, y los mensajes que llegan de noche esperan hasta el día siguiente.",
    automate:
      "Tus clientes consultan disponibilidad y reservan según empleados, sedes y horarios; la cita queda en la agenda con confirmación y recordatorio.",
    change:
      "El equipo ve la agenda al día, marca la asistencia y dedica su tiempo a atender, no a coordinar por chat.",
  },
  {
    id: "conectar",
    label: "CONECTAR LA OPERACIÓN",
    title: "Tu tienda, tus envíos y tus herramientas, conectados",
    situation:
      "Copias datos a mano entre herramientas que no se hablan entre sí y tus clientes preguntan todo el día dónde está su pedido.",
    automate:
      "Automatizaciones a medida de tu operación: pedidos que avisan al cliente de su envío y datos que pasan solos entre tu tienda, planillas, CRM y otras aplicaciones. Las definimos y construimos según tu caso.",
    change:
      "Menos tareas manuales y la información de tu operación en un solo lugar.",
  },
];

/** Sectores donde aplica (solo como referencia, sin protagonismo). */
export const sectors = [
  "Barberías y peluquerías",
  "Clínicas y consultorios",
  "E-commerce",
  "Restaurantes",
  "Spas y estética",
  "Gimnasios y estudios",
  "Inmobiliarias",
  "Academias y cursos",
];

export type JourneyStep = {
  id: string;
  label: string;
  title: string;
  system: string;
  team: string;
  mai: string;
};

/**
 * Recorrido de la demostración, igual al flujo real de la plataforma:
 * mensaje → atención → reserva → asistencia → pago → seguimiento.
 * El pago se REGISTRA en la plataforma; no se procesa dinero.
 */
export const journey: JourneyStep[] = [
  {
    id: "mensaje",
    label: "Mensaje",
    title: "Llega una consulta",
    system: "La conversación entra al Inbox junto con las de tus otros canales.",
    team: "Ve todas las conversaciones en un solo lugar.",
    mai: "Llegó un mensaje nuevo por WhatsApp.",
  },
  {
    id: "atencion",
    label: "Atención",
    title: "MAI atiende",
    system:
      "Responde con la información de tu negocio y ofrece los horarios disponibles. Si necesita ayuda, te avisa.",
    team: "Toma la conversación cuando quiera y luego le devuelve el control a MAI.",
    mai: "Le ofrezco los horarios libres del sábado.",
  },
  {
    id: "reserva",
    label: "Reserva",
    title: "La cita queda agendada",
    system:
      "Crea la reserva según la disponibilidad del empleado y la sede, y envía la confirmación.",
    team: "Ve la cita en la Agenda y puede moverla si hace falta.",
    mai: "Reserva creada y confirmada.",
  },
  {
    id: "asistencia",
    label: "Asistencia",
    title: "El cliente llega",
    system: "Envía el recordatorio y la oportunidad avanza en el Pipeline.",
    team: "Marca la asistencia desde la Agenda.",
    mai: "Recordatorio enviado el viernes.",
  },
  {
    id: "pago",
    label: "Pago",
    title: "La venta queda registrada",
    system: "El pago queda registrado con su método y su importe en Ventas y cobros.",
    team: "Registra el pago o hace un ajuste desde la plataforma.",
    mai: "Venta registrada en el historial de Laura.",
  },
  {
    id: "seguimiento",
    label: "Seguimiento",
    title: "Nada queda pendiente",
    system:
      "Actualiza la ficha del cliente con su historial y deja el próximo paso registrado.",
    team: "Sabe en qué va cada cliente y qué sigue.",
    mai: "Próximo paso agendado para Laura.",
  },
];

/** Módulos que existen hoy en la plataforma. Cada negocio accede según su plan. */
export const platformModules: [string, string][] = [
  ["Inbox", "Conversaciones de todos tus canales; MAI avisa cuando necesita ayuda."],
  ["Clientes", "Fichas, historial, notas, etiquetas y seguimiento."],
  ["Pipeline", "Oportunidades desde el contacto hasta la reserva, la asistencia y el pago."],
  ["Agenda", "Citas, disponibilidad, empleados, sedes, horarios y ausencias."],
  ["Catálogo", "Servicios, productos, precios y promociones."],
  ["Ventas y cobros", "Registro de pagos, métodos y ajustes."],
  ["Presencia y marketing", "Página de reservas, reseñas y origen de tus campañas."],
  ["Resultados", "Actividad de MAI y del equipo, reservas, conversión, importes y costos de IA."],
  ["Automatizaciones", "Flujos con n8n que envían información a otras aplicaciones."],
];

export const process = [
  [
    "Entendemos tu necesidad",
    "Conversamos sobre cómo trabaja tu negocio hoy, qué tareas se repiten y dónde se pierde tiempo o se escapan clientes.",
  ],
  [
    "Definimos la solución",
    "Te proponemos qué automatizar, con qué herramientas y cómo se verá en el día a día, antes de empezar a construir.",
  ],
  [
    "Implementamos",
    "Construimos y conectamos la solución con tus canales y herramientas, y la probamos con casos reales de tu operación.",
  ],
  [
    "Acompañamos la puesta en marcha",
    "Te mostramos cómo usarla, ajustamos lo necesario en las primeras semanas y revisamos juntos cómo está funcionando.",
  ],
];

/** Qué contrata el cliente: plataforma + implementación a medida. */
export const engagement = {
  uses: {
    title: "Lo que usas",
    text: "La plataforma de MONTSERRAT_AI con los módulos de tu plan: Inbox, clientes, pipeline, agenda, catálogo, ventas y cobros, presencia y marketing, y resultados.",
  },
  weDo: {
    title: "Lo que hacemos nosotros",
    items: [
      "Configuramos la plataforma para tu negocio.",
      "Construimos las automatizaciones que acordamos, también las de tu tienda y tus envíos.",
      "Conectamos tus canales y herramientas.",
      "Probamos con casos reales de tu operación.",
      "Te mostramos cómo usarla.",
    ],
  },
  scope: {
    title: "Cómo se define y se cotiza",
    text: "Antes de construir te proponemos qué automatizar y con qué herramientas. Cada proyecto se cotiza según ese alcance. Si la solución usa herramientas o proveedores externos con costo propio, te lo indicamos en la propuesta.",
  },
  deliverables: [
    "Configuración de la plataforma",
    "Integraciones con tus canales y herramientas",
    "Acceso al panel",
    "Capacitación para tu equipo",
    "Ajustes durante la puesta en marcha",
  ],
  start: [
    "Nos escribes por el formulario o por WhatsApp.",
    "Conversamos sobre tu operación.",
    "Te proponemos el alcance antes de construir.",
  ],
};

export const marketing = [
  [
    "Página de reservas",
    "Una página pública con tus servicios, precios y horarios donde tus clientes reservan solos. Se conecta con tu agenda.",
  ],
  [
    "Campañas de Meta",
    "Agrupamos tus anuncios por campaña y ves cuántos clientes potenciales llegan por cada uno y cuándo llegó el último.",
  ],
  [
    "Reseñas",
    "Reúne las opiniones de tus clientes en un solo lugar para cuidar la reputación de tu negocio.",
  ],
];

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "¿Esto reemplaza a mi equipo?",
    a: "No. Automatizamos las tareas que se repiten para que tu equipo dedique su tiempo a atender, decidir y vender.",
  },
  {
    q: "¿Necesito conocimientos técnicos?",
    a: "No. Nosotros configuramos, construimos y conectamos la solución, y te mostramos cómo usarla en el día a día.",
  },
  {
    q: "¿Se puede conectar con mis herramientas?",
    a: "Sí. Si tu tienda, tu sistema de envíos u otra herramienta tiene una forma de conectarse, como una API o un webhook, lo integramos con automatizaciones a medida. Lo revisamos al definir el alcance.",
  },
  {
    q: "¿Mi equipo puede intervenir en las conversaciones?",
    a: "Sí. MAI detecta cuándo necesita ayuda y te avisa. Tu equipo responde desde el Inbox y, cuando termina, le devuelve el control a MAI.",
  },
  {
    q: "¿Cómo se define qué automatizar?",
    a: "Empezamos conversando sobre cómo trabaja tu negocio hoy y qué tareas se repiten. Con eso te proponemos qué automatizar, con qué herramientas y cómo se verá en el día a día, antes de empezar a construir.",
  },
  {
    q: "¿Cómo se cotiza?",
    a: "Cada proyecto se cotiza según su alcance. Si la solución usa herramientas o proveedores externos con costo propio, te lo indicamos en la propuesta, y en el panel puedes ver la actividad y los costos de IA.",
  },
  {
    q: "¿Qué acompañamiento existe después de implementar?",
    a: "Te mostramos cómo usar la solución, ajustamos lo necesario en las primeras semanas y revisamos juntos cómo está funcionando.",
  },
];

export type CaseStudy = {
  business: string;
  context: string;
  problem: string;
  solution: string;
  screenshots: { src: string; alt: string }[];
  testimonial?: { quote: string; author: string; role: string };
  results?: { value: string; label: string; period: string }[];
};

/**
 * Casos reales. Vacío a propósito: el bloque "Lo que hemos construido" no se
 * muestra hasta tener un caso autorizado con material real.
 */
export const caseStudies: CaseStudy[] = [];
