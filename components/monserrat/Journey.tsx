"use client";

import Image from "next/image";
import { useRef, useState, type ReactNode } from "react";
import { ArrowRight, Bell, CalendarDays, Check, UserRound } from "lucide-react";
import { journey } from "@/lib/site-content";
import { track } from "@/lib/analytics";
import { Eyebrow } from "./Eyebrow";
import { MaiMark } from "./MaiMark";

const NAV = ["Inbox", "Agenda", "Pipeline", "Ventas", "Clientes"];
const NAV_FOR_STEP = [0, 0, 1, 2, 3, 4];
const PIPE = ["Contacto", "Reserva", "Asistencia", "Pago"];

function Pipe({ at }: { at: number }) {
  return (
    <div className="jx-pipe" aria-hidden="true">
      {PIPE.map((p, i) => (
        <span key={p} className={i < at ? "is-done" : i === at ? "is-now" : ""}>
          {i < at && <Check size={11} />}
          {p}
        </span>
      ))}
    </div>
  );
}

function ContactHead({ tag, sub }: { tag?: ReactNode; sub: ReactNode }) {
  return (
    <div className="jx-chat-head">
      <span className="jx-avatar">LM</span>
      <div>
        <strong>Laura M.</strong>
        <small>{sub}</small>
      </div>
      {tag}
    </div>
  );
}

const whatsapp = (
  <>
    <Image src="/channels/whatsapp.svg" alt="" width={11} height={11} />
    WhatsApp
  </>
);

/** Pantalla de la plataforma para cada paso (datos ficticios). */
function StepScreen({ step }: { step: number }) {
  if (step <= 1) {
    return (
      <div className="jx-chat">
        <ContactHead
          sub={whatsapp}
          tag={step === 1 ? <span className="jx-tag">Atendido por MAI</span> : undefined}
        />
        <div className="jx-thread">
          <span className="jx-in">Hola, ¿tienen cita el sábado en la mañana?</span>
          {step === 1 ? (
            <>
              <span className="jx-out">
                ¡Hola, Laura! El sábado tengo libre a las 10:00 o a las 11:30.
                ¿Cuál prefieres?
              </span>
              <span className="jx-in">10:00, por favor.</span>
            </>
          ) : (
            <span className="jx-typing" aria-hidden="true">
              <MaiMark width={16} height={16} /> MAI está leyendo…
            </span>
          )}
        </div>
        <div className="jx-composer">
          <span>Escribe un mensaje…</span>
          <span className="jx-takeover">Tomar conversación</span>
        </div>
        {step === 1 && (
          <small className="jx-note">
            Si la tomas, se la devuelves a MAI cuando termines.
          </small>
        )}
      </div>
    );
  }
  if (step === 2) {
    return (
      <div className="jx-agenda">
        <div className="jx-agenda-head">
          <CalendarDays size={16} aria-hidden="true" />
          <strong>Sábado</strong>
          <small>Sede Chapinero · Sofía</small>
        </div>
        {[
          ["9:00", "Libre", ""],
          ["10:00", "Laura M. · Limpieza facial", "new"],
          ["11:30", "Libre", ""],
          ["12:00", "Andrés G. · Masaje", "busy"],
        ].map(([h, t, k]) => (
          <div className={`jx-slot ${k ? `is-${k}` : ""}`} key={h}>
            <span>{h}</span>
            <span>{t}</span>
            {k === "new" && (
              <span className="jx-tag jx-tag-green">
                <Check size={11} aria-hidden="true" /> Confirmada
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }
  if (step === 3) {
    return (
      <div className="jx-contact">
        <ContactHead
          sub="Sábado 10:00 · Limpieza facial"
          tag={<span className="jx-stage jx-stage-green">Asistió</span>}
        />
        <Pipe at={2} />
        <ul className="jx-tasks">
          <li className="is-done">
            <Check size={14} aria-hidden="true" />
            Recordatorio enviado el viernes
          </li>
          <li className="is-done">
            <Check size={14} aria-hidden="true" />
            Asistencia marcada por el equipo
          </li>
        </ul>
      </div>
    );
  }
  if (step === 4) {
    return (
      <div className="jx-contact">
        <ContactHead
          sub="Venta registrada"
          tag={<span className="jx-stage jx-stage-green">Pagado</span>}
        />
        <Pipe at={4} />
        <div className="jx-sale">
          <span>Limpieza facial</span>
          <strong>$85.000</strong>
          <small>Método: tarjeta · Registrado hoy</small>
        </div>
      </div>
    );
  }
  return (
    <div className="jx-contact">
      <ContactHead sub="Cliente · 1 visita" tag={<span className="jx-stage">Cliente</span>} />
      <ul className="jx-tasks">
        <li className="is-done">
          <Check size={14} aria-hidden="true" />
          Nota: prefiere sábados en la mañana
        </li>
        <li>
          <Bell size={14} aria-hidden="true" />
          Seguimiento · mensaje después de la visita
        </li>
        <li>
          <UserRound size={14} aria-hidden="true" />
          Próximo paso · ofrecer nueva cita en 30 días
        </li>
      </ul>
    </div>
  );
}

/** `children`: bloque de plataforma (servidor) que se muestra debajo del recorrido. */
export default function Journey({ children }: { children?: ReactNode }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const step = journey[active];
  const go = (i: number, focus = false) => {
    setActive(i);
    track("journey_step", { step: journey[i].id });
    if (focus) tabs.current[i]?.focus();
  };
  return (
    <section
      className="section journey-section"
      id="como-funciona"
      aria-labelledby="journey-heading"
    >
      <div className="container section-stack">
        <div className="section-intro">
          <div>
            <Eyebrow>CÓMO FUNCIONA</Eyebrow>
            <h2 id="journey-heading">
              No reemplazamos a tu equipo. Le devolvemos su tiempo.
            </h2>
          </div>
          <p>
            MAI hace los pasos repetitivos. Cuando necesita ayuda te avisa, tu
            equipo responde y le devuelve el control. Así se ve un caso típico
            en nuestra plataforma.
          </p>
        </div>

        <div className="journey">
          <div className="journey-steps" role="tablist" aria-label="Pasos del recorrido">
            {journey.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                id={`journey-tab-${s.id}`}
                aria-selected={i === active}
                aria-controls="journey-panel"
                tabIndex={i === active ? 0 : -1}
                className={i === active ? "is-active" : i < active ? "is-done" : ""}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                onClick={() => go(i)}
                onKeyDown={(e) => {
                  const n = journey.length;
                  let next = i;
                  if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % n;
                  else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i + n - 1) % n;
                  else if (e.key === "Home") next = 0;
                  else if (e.key === "End") next = n - 1;
                  else return;
                  e.preventDefault();
                  go(next, true);
                }}
              >
                <span className="eyebrow">0{i + 1}</span>
                {s.label}
              </button>
            ))}
          </div>

          <div
            className="journey-panel"
            id="journey-panel"
            role="tabpanel"
            aria-labelledby={`journey-tab-${step.id}`}
          >
            <div className="journey-copy">
              <h3>{step.title}</h3>
              <dl>
                <div>
                  <dt>
                    <MaiMark width={16} height={16} /> Lo que hace el sistema
                  </dt>
                  <dd>{step.system}</dd>
                </div>
                <div>
                  <dt>
                    <UserRound size={15} aria-hidden="true" /> Tu equipo
                  </dt>
                  <dd>{step.team}</dd>
                </div>
              </dl>
              {active < journey.length - 1 ? (
                <button type="button" className="button button-outline" onClick={() => go(active + 1)}>
                  Siguiente: {journey[active + 1].label} <ArrowRight size={16} aria-hidden="true" />
                </button>
              ) : (
                <button type="button" className="button button-outline" onClick={() => go(0)}>
                  Ver desde el inicio <ArrowRight size={16} aria-hidden="true" />
                </button>
              )}
            </div>

            <div className="journey-app" aria-label={`Pantalla de ejemplo: ${step.title}. Datos ficticios.`} role="img">
              <div className="journey-app-bar">
                <span className="dashboard-brand">
                  <MaiMark width={16} height={16} />
                  MONTSERRAT_AI
                </span>
                <span className="demo-tag">DATOS DEMO</span>
              </div>
              <div className="journey-app-body">
                <nav className="journey-app-nav" aria-hidden="true">
                  {NAV.map((t, i) => (
                    <span key={t} className={NAV_FOR_STEP[active] === i ? "selected" : ""}>
                      {t}
                    </span>
                  ))}
                </nav>
                <div className="journey-app-main" key={active}>
                  <p className="journey-mai">
                    <MaiMark width={18} height={18} />
                    {step.mai}
                  </p>
                  <StepScreen step={active} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {children}
      </div>
    </section>
  );
}
