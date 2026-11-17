import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Code2,
  CreditCard,
  Globe2,
  MessageCircle,
  Search,
  UserRound,
} from "lucide-react";
import { audience, problems, process, useCases } from "@/lib/site-content";
import { MaiMark } from "./MaiMark";
import { ContactLink } from "./ContactLink";
import { Eyebrow } from "./Eyebrow";

export function AudienceMarquee() {
  return (
    <section
      className="audience-section"
      id="para-quien"
      aria-labelledby="audience-heading"
    >
      <div className="container section-intro">
        <div>
          <Eyebrow>PARA QUIÉN ES</Eyebrow>
          <h2 id="audience-heading" className="heading-medium">
            Para negocios que atienden clientes todos los días
          </h2>
        </div>
        <p>
          Si tu negocio recibe mensajes, agenda citas o vende en línea, hay
          tareas que se pueden automatizar.
        </p>
      </div>
      <div className="audience-window">
        <div className="audience-track">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="audience-group"
              aria-hidden={copy === 1 ? true : undefined}
            >
              {audience.map((item) => (
                <article className="audience-card" key={item.id}>
                  <Image
                    src={`/audience/${item.id}.webp`}
                    alt=""
                    fill
                    sizes="230px"
                    loading="lazy"
                  />
                  <span className="audience-result">
                    <span>
                      <Check size={11} />
                    </span>
                    {item.result}
                  </span>
                  <h3>{item.name}</h3>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
      <p className="audience-note container">
        Escenarios ilustrativos de automatización.
      </p>
    </section>
  );
}

export function Problems() {
  return (
    <section
      className="section"
      id="problemas"
      aria-labelledby="problems-heading"
    >
      <div className="container problems-layout">
        <div className="problems-intro">
          <Eyebrow>PROBLEMAS QUE RESOLVEMOS</Eyebrow>
          <h2 id="problems-heading">¿Te suena alguna de estas situaciones?</h2>
          <p>
            Son tareas que se repiten todos los días y que, bien automatizadas,
            dejan de depender de que alguien se acuerde.
          </p>
        </div>
        <div className="problems-list">
          {problems.map(([quote, answer]) => (
            <div className="problem" key={quote}>
              <p>“{quote}”</p>
              <span>
                <ArrowRight size={14} />
                {answer}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AutomationFlow() {
  return (
    <section
      className="automation-section"
      id="soluciones"
      aria-labelledby="automation-heading"
    >
      <div className="container section-stack">
        <div className="section-intro">
          <div>
            <Eyebrow>NUESTRA ESPECIALIDAD</Eyebrow>
            <h2 id="automation-heading">
              Automatizaciones hechas a la medida de tu operación
            </h2>
          </div>
          <p>
            Diseñamos flujos que conectan tus canales, tus herramientas y tu
            equipo. Algo pasa, la IA lo entiende y cada paso siguiente ocurre
            solo.
          </p>
        </div>
        <div className="flow-canvas">
          <div className="flow-caption">
            <span className="status-pill">
              <i />
              Flujo activo · ejemplo
            </span>
            <span className="eyebrow">MENSAJE → RESERVA → SEGUIMIENTO</span>
          </div>
          <div className="flow-diagram">
            <svg
              className="flow-lines"
              viewBox="0 0 1000 300"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M285 150H355M645 150H715M645 150C685 150 675 48 715 48M645 150C685 150 675 252 715 252" />
              <path
                className="flow-line-active"
                d="M285 150H355M645 150C685 150 675 48 715 48"
              />
            </svg>
            <div className="flow-start">
              <div className="flow-node">
                <span className="node-icon whatsapp">
                  <MessageCircle size={22} />
                </span>
                <div>
                  <strong>Mensaje nuevo</strong>
                  <small>WhatsApp · hace un momento</small>
                </div>
              </div>
              <span className="flow-message">“¿Tienen hora el sábado?”</span>
            </div>
            <div className="flow-mai">
              <MaiMark width={52} height={52} />
              <div>
                <strong>MAI entiende y actúa</strong>
                <small>Según las reglas de tu negocio</small>
              </div>
              <span className="mai-status">
                <span />
                Procesando solicitud
              </span>
            </div>
            <div className="flow-actions">
              {[
                [CalendarDays, "Crear reserva", "Sábado · 10:00", true],
                [
                  CreditCard,
                  "Enviar enlace de pago",
                  "Cuando corresponda",
                  false,
                ],
                [UserRound, "Actualizar contacto", "Historial al día", false],
              ].map(([Icon, title, subtitle, active]) => {
                const NodeIcon = Icon as typeof CalendarDays;
                return (
                  <div
                    className={`flow-node ${active ? "is-active" : ""}`}
                    key={String(title)}
                  >
                    <span className="node-icon">
                      <NodeIcon size={20} />
                    </span>
                    <div>
                      <strong>{String(title)}</strong>
                      <small>{String(subtitle)}</small>
                    </div>
                    {active && <Check size={16} className="node-check" />}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flow-footnote">
            <span>Un mensaje. Varios pasos resueltos.</span>
            <span>Ejemplo de flujo · Configurable para tu negocio</span>
          </div>
        </div>
        <div className="use-cases">
          {useCases.map(([title, description], i) => (
            <article key={title}>
              <span className="eyebrow">0{i + 1}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
        <PlatformBlock />
      </div>
    </section>
  );
}

export function PlatformBlock() {
  return (
    <div className="platform-block" id="plataforma">
      <div className="platform-copy">
        <span className="status-pill status-dark">
          <i />
          TODO CONECTADO
        </span>
        <h2 className="heading-medium">
          Cuando tus procesos se conectan, ves tu negocio en un solo lugar
        </h2>
        <p>
          Trabajamos en una plataforma propia que reúne mensajes, agenda,
          contactos, seguimiento de ventas y resultados. Así sabes qué está
          pasando sin saltar entre aplicaciones, y puedes medir qué está
          haciendo cada automatización.
        </p>
        <div className="platform-features">
          {[
            "Mensajes",
            "Agenda",
            "Contactos",
            "Seguimiento de ventas",
            "Resultados",
          ].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <div className="platform-channels">
          <span>Todos tus canales en un solo lugar</span>
          <div>
            {[
              ["whatsapp", "WhatsApp"],
              ["instagram", "Instagram"],
              ["telegram", "Telegram"],
              ["messenger", "Messenger"],
              ["mail", "Correo"],
            ].map(([id, title]) => (
              <span key={id} title={title}>
                <Image
                  src={`/channels/${id}.svg`}
                  alt={title}
                  width={22}
                  height={22}
                />
              </span>
            ))}
            <span title="Página web">
              <Globe2 size={22} aria-label="Página web" />
            </span>
          </div>
        </div>
      </div>
      <div
        className="dashboard-preview"
        role="img"
        aria-label="Ejemplo de plataforma con datos ficticios: 48 reservas y 312 conversaciones atendidas"
      >
        <div className="dashboard-sidebar">
          <span className="dashboard-brand">
            <MaiMark width={18} height={18} />
            MONSERRAT_AI
          </span>
          {["Inbox", "Contactos", "Agenda", "Seguimiento", "Resultados"].map(
            (t, i) => (
              <span className={i === 4 ? "selected" : ""} key={t}>
                {t}
                {i === 0 && <b>3</b>}
              </span>
            ),
          )}
        </div>
        <div className="dashboard-main">
          <div className="dashboard-heading">
            <strong>Resultados del mes</strong>
            <span className="demo-tag">DATOS DEMO</span>
          </div>
          <div className="dashboard-metrics">
            <div>
              <span>Reservas creadas por automatización</span>
              <strong>48</strong>
              <small>● Medido</small>
            </div>
            <div>
              <span>Conversaciones atendidas</span>
              <strong>312</strong>
              <small>● Medido</small>
            </div>
          </div>
          <div className="dashboard-chart">
            <span>Origen de las reservas</span>
            {[
              ["WhatsApp", 72, 26],
              ["Página web", 52, 18],
              ["Instagram", 14, 4],
            ].map(([title, percent, number]) => (
              <div key={title}>
                <span>{title}</span>
                <span className="chart-track">
                  <i
                    style={{ transform: `scaleX(${Number(percent) / 100})` }}
                  />
                </span>
                <span>{number}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Process() {
  return (
    <section
      className="section process-section"
      id="como-trabajamos"
      aria-labelledby="process-heading"
    >
      <div className="container section-stack">
        <div className="process-intro">
          <Eyebrow>CÓMO TRABAJAMOS</Eyebrow>
          <h2 id="process-heading">
            De la primera conversación a una solución funcionando
          </h2>
        </div>
        <ol className="process-timeline">
          {process.map(([title, description], i) => (
            <li key={title}>
              <div className="process-number">
                <span>0{i + 1}</span>
                <i />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ServicesBento() {
  return (
    <section
      className="section services-section"
      id="mas-soluciones"
      aria-labelledby="services-heading"
    >
      <div className="container section-stack">
        <div className="section-intro">
          <div>
            <Eyebrow>SERVICIOS COMPLEMENTARIOS</Eyebrow>
            <h2 className="heading-medium" id="services-heading">
              Más soluciones para tu negocio
            </h2>
          </div>
          <p>
            Puedes contratarlas de forma independiente o sumarlas a una
            automatización. Cada una se cotiza por separado según lo que
            necesites.
          </p>
        </div>
        <div className="services-bento">
          <article className="service-web">
            <div className="service-visual browser-mock" aria-hidden="true">
              <div className="browser-bar">
                <i />
                <i />
                <i />
                <span>tunegocio.com</span>
              </div>
              <div className="browser-body">
                <div>
                  <b />
                  <span />
                  <span />
                  <em>Reservar</em>
                </div>
                <div className="browser-illustration">
                  <MaiMark width={54} height={54} />
                </div>
              </div>
            </div>
            <h3>Desarrollo web</h3>
            <p>
              Landing pages y sitios web pensados para los objetivos de tu
              negocio: explicar lo que ofreces, generar consultas o recibir
              reservas.
            </p>
            <small>Se puede conectar con tus automatizaciones.</small>
            <ContactLink
              subject="Desarrollo web"
              kind="service"
              className="button button-outline"
            >
              Consultar por desarrollo web <ArrowRight size={16} />
            </ContactLink>
          </article>
          <article className="service-visibility">
            <div className="service-visual search-mock" aria-hidden="true">
              <span>
                <Search size={16} />
                spa cerca de mí
              </span>
              <span>
                <MaiMark width={17} height={17} />
                Respuesta de IA
              </span>
            </div>
            <h3>Visibilidad en buscadores y respuestas de IA</h3>
            <p>
              Optimizamos tu presencia digital para que te encuentren y
              entiendan qué haces.
            </p>
            <small>No garantizamos posiciones ni apariciones.</small>
            <ContactLink
              subject="Visibilidad en buscadores e IA"
              kind="service"
              className="button button-outline-light"
            >
              Consultar por visibilidad <ArrowRight size={16} />
            </ContactLink>
          </article>
          <article className="service-custom">
            <div className="service-visual code-mock" aria-hidden="true">
              <Code2 size={26} />
            </div>
            <h3>Soluciones a medida</h3>
            <p>
              Desarrollos e integraciones para una necesidad concreta, cuando
              una herramienta estándar no alcanza.
            </p>
            <small>Partimos de una conversación para definir el alcance.</small>
            <ContactLink
              subject="Solución a medida"
              kind="service"
              className="button button-outline"
            >
              Consultar por una solución <ArrowRight size={16} />
            </ContactLink>
          </article>
        </div>
      </div>
    </section>
  );
}
