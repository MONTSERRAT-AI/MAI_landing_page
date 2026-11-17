export const CONTACT_TOPICS = [
  "Automatización",
  "Desarrollo web",
  "Visibilidad en buscadores e IA",
  "Solución a medida",
  "Aún no lo sé",
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number];
export type ContactField =
  "name" | "contact" | "subject" | "message" | "consent";
export type ContactErrors = Partial<Record<ContactField, string>>;

export interface ContactPayload {
  name: string;
  contact: string;
  subject: ContactTopic;
  message: string;
  consent: boolean;
  website: string;
}

const clean = (value: unknown) =>
  typeof value === "string" ? value.replace(/\u0000/g, "").trim() : "";

export function isContactTopic(value: unknown): value is ContactTopic {
  return CONTACT_TOPICS.some((topic) => topic === value);
}

export function validateContact(input: unknown): {
  data: ContactPayload;
  errors: ContactErrors;
} {
  const raw =
    input && typeof input === "object"
      ? (input as Record<string, unknown>)
      : {};
  const name = clean(raw.name);
  const contact = clean(raw.contact);
  const message = clean(raw.message);
  const subject = isContactTopic(raw.subject) ? raw.subject : CONTACT_TOPICS[0];
  const consent = raw.consent === true;
  const errors: ContactErrors = {};
  if (name.length < 2 || name.length > 100) {
    errors.name = "Escribe tu nombre (entre 2 y 100 caracteres).";
  }
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
  const digits = contact.replace(/\D/g, "");
  const isPhone =
    /^\+?[\d\s().-]+$/.test(contact) &&
    digits.length >= 7 &&
    digits.length <= 15;
  if (contact.length > 200 || (!isEmail && !isPhone)) {
    errors.contact =
      "Escribe un email válido o tu WhatsApp con código de país.";
  }
  if (!isContactTopic(raw.subject)) {
    errors.subject = "Selecciona un tema para tu mensaje.";
  }
  if (message.length < 10 || message.length > 4000) {
    errors.message = "Cuéntanos qué necesitas en entre 10 y 4000 caracteres.";
  }
  if (!consent)
    errors.consent = "Necesitamos tu autorización para responderte.";
  return {
    data: {
      name,
      contact,
      subject,
      message,
      consent,
      website: clean(raw.website),
    },
    errors,
  };
}
