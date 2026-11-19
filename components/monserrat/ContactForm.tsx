"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Mail, MessageCircle } from "lucide-react";
import {
  CONTACT_TOPICS,
  isContactTopic,
  validateContact,
  type ContactErrors,
  type ContactTopic,
} from "@/lib/contact";
import { MaiMark } from "./MaiMark";
import { track } from "@/lib/analytics";
import { WHATSAPP_URL } from "@/lib/site-content";

export default function ContactForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [subject, setSubject] = useState<ContactTopic>(CONTACT_TOPICS[0]);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        document.body.classList.toggle("contact-active", entry.isIntersecting);
      },
      { rootMargin: "0px 0px -35% 0px" },
    );
    observer.observe(section);
    return () => {
      observer.disconnect();
      document.body.classList.remove("contact-active");
    };
  }, []);

  useEffect(() => {
    const selectTopic = (value: unknown) => {
      if (!isContactTopic(value)) return;
      setSubject(value);
      setStatus("idle");
      setError("");
    };
    const fromLocation = () => {
      const query = new URLSearchParams(window.location.search);
      const hashQuery = new URLSearchParams(
        window.location.hash.split("?")[1] || "",
      );
      selectTopic(
        hashQuery.get("tema") ||
          hashQuery.get("subject") ||
          query.get("tema") ||
          query.get("subject"),
      );
    };
    const onContact = (event: Event) =>
      selectTopic(
        (event as CustomEvent<{ subject?: unknown }>).detail?.subject,
      );
    fromLocation();
    document.addEventListener("monserrat:contact", onContact);
    window.addEventListener("hashchange", fromLocation);
    return () => {
      document.removeEventListener("monserrat:contact", onContact);
      window.removeEventListener("hashchange", fromLocation);
    };
  }, []);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const checked = validateContact({
      name,
      contact,
      subject,
      message,
      consent,
      website,
    });
    setErrors(checked.errors);
    setError("");
    if (Object.keys(checked.errors).length) {
      const field = Object.keys(checked.errors)[0];
      document.getElementById(`contact-${field}`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checked.data),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) {
        setErrors(result.errors || {});
        throw new Error(
          result.error || "No pudimos enviar el mensaje. Inténtalo de nuevo.",
        );
      }
      setStatus("success");
      track("contact_submit", { subject });
    } catch (cause) {
      track("contact_submit_error", {
        subject,
        reason: cause instanceof Error ? cause.message.slice(0, 80) : "unknown",
      });
      setError(
        cause instanceof Error && cause.message !== "Failed to fetch"
          ? cause.message
          : "No pudimos conectar. Revisa tu conexión e inténtalo de nuevo.",
      );
      setStatus("idle");
    }
  }

  const fieldError = (field: keyof ContactErrors) =>
    errors[field] ? (
      <span className="contact-field-error" id={`contact-${field}-error`}>
        {errors[field]}
      </span>
    ) : null;

  return (
    <section
      id="contacto"
      className="contact-section"
      ref={sectionRef}
      aria-labelledby="contact-heading"
    >
      <div className="container contact-shell">
        <div className="contact-copy">
          <span className="eyebrow contact-eyebrow">
            <span className="status-dot" />
            HABLEMOS DE TU PROYECTO
          </span>
          <h2 id="contact-heading">Cuéntanos qué te quita tiempo hoy</h2>
          <p>
            No necesitas saber qué tecnología usar. Descríbenos la tarea o el
            problema con tus palabras y te responderemos para conversar sobre
            cómo resolverlo.
          </p>
          <div className="contact-next">
            <span className="eyebrow">QUÉ PASA DESPUÉS</span>
            <ol>
              <li>Leemos tu mensaje.</li>
              <li>Te contactamos por el medio que nos dejes para conversar.</li>
              <li>Si tiene sentido avanzar, te proponemos el alcance.</li>
            </ol>
          </div>
          <div className="contact-direct">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Prefiero WhatsApp
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <a href="mailto:jpcardozo@montserratai.com.co">
              <Mail size={18} aria-hidden="true" />
              jpcardozo@montserratai.com.co
            </a>
          </div>
        </div>
        <div className="contact-card">
          {status === "success" ? (
            <div className="contact-success" role="status">
              <MaiMark />
              <span className="contact-success-check">
                <Check size={18} aria-hidden="true" /> Mensaje enviado
              </span>
              <h3 tabIndex={-1} ref={successRef}>
                Gracias, {name.trim()}.
              </h3>
              <p>
                Recibimos tu mensaje sobre{" "}
                <strong>
                  {subject === "Aún no lo sé"
                    ? "tu proyecto"
                    : subject.toLowerCase()}
                </strong>
                . Te escribiremos a {contact.trim()} para coordinar una primera
                conversación.
              </p>
              <button
                className="contact-reset"
                type="button"
                onClick={() => {
                  setStatus("idle");
                  setMessage("");
                  setErrors({});
                }}
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form
              className="contact-form"
              onSubmit={submit}
              noValidate
              aria-busy={status === "sending"}
            >
              <label className="contact-field" htmlFor="contact-name">
                Nombre
                <input
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={100}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Tu nombre"
                  disabled={status === "sending"}
                  aria-invalid={!!errors.name}
                  aria-describedby={
                    errors.name ? "contact-name-error" : undefined
                  }
                />
                {fieldError("name")}
              </label>
              <label className="contact-field" htmlFor="contact-contact">
                Email o WhatsApp
                <input
                  id="contact-contact"
                  name="contact"
                  type="text"
                  autoComplete="off"
                  required
                  maxLength={200}
                  value={contact}
                  onChange={(event) => setContact(event.target.value)}
                  placeholder="Para poder responderte"
                  disabled={status === "sending"}
                  aria-invalid={!!errors.contact}
                  aria-describedby={
                    errors.contact
                      ? "contact-contact-error"
                      : "contact-contact-hint"
                  }
                />
                <span className="contact-hint" id="contact-contact-hint">
                  Si usas WhatsApp, incluye el código de país.
                </span>
                {fieldError("contact")}
              </label>
              <fieldset
                className="contact-topics"
                disabled={status === "sending"}
              >
                <legend>¿Sobre qué quieres hablar?</legend>
                <div className="contact-chips">
                  {CONTACT_TOPICS.map((topic) => (
                    <button
                      className={`contact-chip${subject === topic ? " is-selected" : ""}`}
                      type="button"
                      key={topic}
                      aria-pressed={subject === topic}
                      onClick={() => setSubject(topic)}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
                {fieldError("subject")}
              </fieldset>
              <label className="contact-field" htmlFor="contact-message">
                ¿Qué necesitas resolver?
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  required
                  minLength={10}
                  maxLength={4000}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Por ejemplo: respondemos a mano todas las consultas de horarios y se nos escapan reservas."
                  disabled={status === "sending"}
                  aria-invalid={!!errors.message}
                  aria-describedby={
                    errors.message ? "contact-message-error" : undefined
                  }
                />
                {fieldError("message")}
              </label>
              <div className="contact-honeypot" aria-hidden="true">
                <label htmlFor="contact-website">
                  Tu sitio web
                  <input
                    id="contact-website"
                    name="website"
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </label>
              </div>
              <div className="contact-consent-group">
                <label className="contact-consent" htmlFor="contact-consent">
                  <input
                    type="checkbox"
                    id="contact-consent"
                    name="consent"
                    required
                    checked={consent}
                    onChange={(event) => setConsent(event.target.checked)}
                    disabled={status === "sending"}
                    aria-invalid={!!errors.consent}
                    aria-describedby={
                      errors.consent ? "contact-consent-error" : undefined
                    }
                  />
                  <span>
                    Acepto la{" "}
                    <Link href="/privacidad">política de privacidad</Link> y
                    autorizo el tratamiento de mis datos para recibir una
                    respuesta.
                  </span>
                </label>
                {fieldError("consent")}
              </div>
              {error && (
                <p className="contact-error" role="alert">
                  {error}
                </p>
              )}
              <button
                className="contact-submit"
                type="submit"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Enviando mensaje…" : "Enviar mensaje"}
                <ArrowUpRight size={18} aria-hidden="true" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
