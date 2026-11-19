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

/** Contacto directo por WhatsApp (mismo número del pie de página). */
export const WHATSAPP_URL = "https://wa.me/573043906303";

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
      "Atención por mensajes para consultas frecuentes sobre productos, precios, horarios y envíos, y registro de cada oportunidad con su estado y su próximo paso.",
    change:
      "Tu equipo atiende lo que necesita criterio humano y sabe en qué va cada cliente sin depender de la memoria.",
  },
  {
    id: "reservar",
    label: "RESERVAR Y COORDINAR",
    title: "Reservas que se agendan, confirman y recuerdan solas",
    situation:
      "Agendar, confirmar y reprogramar citas te quita horas, y los mensajes que llegan de noche esperan hasta el día siguiente.",
    automate:
      "Tus clientes consultan disponibilidad y reservan; la cita queda en la agenda y reciben confirmación y recordatorio.",
    change:
      "El equipo ve la agenda al día y dedica su tiempo a atender, no a coordinar por chat.",
  },
  {
    id: "conectar",
    label: "CONECTAR LA OPERACIÓN",
    title: "Tus herramientas compartiendo datos, sin copiar y pegar",
    situation:
      "Copias datos a mano entre herramientas que no se hablan entre sí y tus clientes preguntan todo el día dónde está su pedido.",
    automate:
      "Según el alcance de cada proyecto: pedidos que avisan al cliente, datos que pasan entre tienda, planillas, CRM y facturación, y reportes de lo que hace cada automatización.",
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

/** Recorrido de la demostración: mensaje → respuesta → reserva → seguimiento → resultado. */
export const journey: JourneyStep[] = [
  {
    id: "mensaje",
    label: "Mensaje",
    title: "Llega una consulta",
    system:
      "La conversación entra a la bandeja junto con las de tus otros canales.",
    team: "Ve todas las conversaciones en un solo lugar.",
    mai: "Llegó un mensaje nuevo por WhatsApp.",
  },
  {
    id: "respuesta",
    label: "Respuesta",
    title: "MAI responde",
    system:
      "Responde con la información y las reglas de tu negocio y ofrece los horarios disponibles.",
    team: "Puede leer la conversación y continuarla cuando lo necesite.",
    mai: "Le ofrezco los horarios libres del sábado.",
  },
  {
    id: "reserva",
    label: "Reserva",
    title: "La cita queda agendada",
    system: "Crea la reserva en la agenda y envía la confirmación.",
    team: "Ve la cita en la agenda y puede moverla si hace falta.",
    mai: "Reserva creada y confirmada.",
  },
  {
    id: "seguimiento",
    label: "Seguimiento",
    title: "Nada queda pendiente",
    system:
      "Actualiza el contacto, programa el recordatorio y deja el próximo paso registrado.",
    team: "Sabe en qué etapa está cada cliente.",
    mai: "Recordatorio programado para el viernes.",
  },
  {
    id: "resultado",
    label: "Resultado",
    title: "Ves qué está funcionando",
    system:
      "Registra reservas, conversaciones atendidas y de qué canal llega cada cliente.",
    team: "Revisa los resultados para decidir dónde enfocar el esfuerzo.",
    mai: "Así va tu semana.",
  },
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
    text: "La plataforma de MONSERRAT_AI: mensajes, agenda, contactos, seguimiento y resultados en un solo panel.",
  },
  weDo: {
    title: "Lo que hacemos nosotros",
    items: [
      "Configuramos la plataforma para tu negocio.",
      "Construimos las automatizaciones que acordamos.",
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
    a: "Conectamos la solución con tus canales y herramientas, como tu tienda, planillas, CRM o facturación. Qué se integra y cómo se revisa con cada herramienta al definir el alcance.",
  },
  {
    q: "¿Mi equipo puede intervenir en las conversaciones?",
    a: "Sí. Las conversaciones quedan en la bandeja de la plataforma y tu equipo puede revisarlas y continuarlas cuando lo necesite.",
  },
  {
    q: "¿Cómo se define qué automatizar?",
    a: "Empezamos conversando sobre cómo trabaja tu negocio hoy y qué tareas se repiten. Con eso te proponemos qué automatizar, con qué herramientas y cómo se verá en el día a día, antes de empezar a construir.",
  },
  {
    q: "¿Cómo se cotiza?",
    a: "Cada proyecto se cotiza según su alcance. Si la solución usa herramientas o proveedores externos con costo propio, te lo indicamos en la propuesta.",
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
