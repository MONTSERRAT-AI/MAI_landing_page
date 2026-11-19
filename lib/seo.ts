// Datos de SEO y datos estructurados (schema.org) del sitio.

/**
 * URL pública usada en canonical, Open Graph, sitemap y JSON-LD.
 * Prioridad:
 * 1. NEXT_PUBLIC_SITE_URL (definirla cuando el dominio propio sirva la landing).
 * 2. RAILWAY_PUBLIC_DOMAIN (dominio que Railway asigna al servicio).
 * 3. Dominio propio por defecto.
 * Así la canonical no apunta a un dominio que todavía no responde.
 */
const fromRailway = process.env.RAILWAY_PUBLIC_DOMAIN
  ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
  : "";
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  fromRailway ||
  "https://montserratai.com.co"
).replace(/\/$/, "");

export const SITE_NAME = "MONTSERRAT_AI";
export const SITE_TITLE =
  "MONTSERRAT_AI · Automatización con IA para atención, reservas y seguimiento";
export const SITE_DESCRIPTION =
  "La IA hace lo repetitivo y tu equipo, lo importante. Conectamos tus mensajes, tu agenda y tus herramientas con soluciones de IA adaptadas a tu operación.";

const ORG_ID = `${SITE_URL}/#organization`;

const SERVICES = [
  {
    name: "Automatizaciones con IA",
    serviceType: "Automatización de procesos con inteligencia artificial",
    description:
      "Atención automática por WhatsApp, Instagram, web y correo; reservas, pedidos, pagos y seguimiento conectados a tu CRM.",
  },
  {
    name: "Desarrollo web",
    serviceType: "Desarrollo de sitios web y landing pages",
    description:
      "Landing pages y sitios web para explicar lo que ofreces, generar consultas o recibir reservas.",
  },
  {
    name: "Visibilidad en buscadores y respuestas de IA",
    serviceType: "Optimización de presencia digital (SEO)",
    description:
      "Optimizamos tu presencia digital para que te encuentren y entiendan qué haces. No garantizamos posiciones ni apariciones.",
  },
  {
    name: "Soluciones a medida",
    serviceType: "Desarrollo de software e integraciones a medida",
    description:
      "Desarrollos e integraciones para una necesidad concreta, cuando una herramienta estándar no alcanza.",
  },
];

export function structuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/icon.svg`,
        image: `${SITE_URL}/opengraph-image`,
        description: SITE_DESCRIPTION,
        email: "jpcardozo@montserratai.com.co",
        telephone: "+57 304 390 6303",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bogotá D.C.",
          addressCountry: "CO",
        },
        areaServed: { "@type": "Country", name: "Colombia" },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          email: "jpcardozo@montserratai.com.co",
          telephone: "+57 304 390 6303",
          availableLanguage: ["es"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: "es-CO",
        publisher: { "@id": ORG_ID },
      },
      ...SERVICES.map((s, i) => ({
        "@type": "Service",
        "@id": `${SITE_URL}/#service-${i + 1}`,
        name: s.name,
        serviceType: s.serviceType,
        description: s.description,
        provider: { "@id": ORG_ID },
        areaServed: { "@type": "Country", name: "Colombia" },
        availableLanguage: "es",
        url: `${SITE_URL}/#contacto`,
      })),
    ],
  };
}
