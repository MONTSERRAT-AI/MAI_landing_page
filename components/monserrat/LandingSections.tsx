import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  Globe2,
  Plus,
  Search,
} from "lucide-react";
import {
  PRIMARY_CTA,
  caseStudies,
  engagement,
  faqs,
  platformModules,
  process,
  sectors,
  solutions,
  type Solution,
} from "@/lib/site-content";
import { MaiMark } from "./MaiMark";
import { ContactLink } from "./ContactLink";
import { Eyebrow } from "./Eyebrow";

const CHANNELS = [
  ["whatsapp", "WhatsApp"],
  ["instagram", "Instagram"],
  ["telegram", "Telegram"],
  ["messenger", "Messenger"],
  ["mail", "Correo"],
] as const;

/* ───────────── B. Evidencia real (oculta mientras no haya casos) ───────────── */

export function CaseStudies() {
  if (caseStudies.length === 0) return null;
  return (
    <section className="section" id="casos" aria-labelledby="cases-heading">
      <div className="container section-stack">
        <div className="section-intro">
          <div>
            <Eyebrow>LO QUE HEMOS CONSTRUIDO</Eyebrow>
            <h2 id="cases-heading" className="heading-medium">
              Casos reales
            </h2>
          </div>
        </div>
        {caseStudies.map((c) => (
          <article className="case-card" key={c.business}>
            <div className="case-copy">
              <h3>{c.business}</h3>
              <p>{c.context}</p>
              <dl>
                <dt>Problema inicial</dt>
                <dd>{c.problem}</dd>
                <dt>Solución implementada</dt>
                <dd>{c.solution}</dd>
              </dl>
              {c.results && c.results.length > 0 && (
                <ul className="case-results">
                  {c.results.map((r) => (
                    <li key={r.label}>
                      <strong>{r.value}</strong>
                      <span>{r.label}</span>
                      <small>{r.period}</small>
                    </li>
                  ))}
                </ul>
              )}
              {c.testimonial && (
                <blockquote>
                  <p>“{c.testimonial.quote}”</p>
                  <footer>
                    {c.testimonial.author} · {c.testimonial.role}
                  </footer>
                </blockquote>
              )}
            </div>
            <div className="case-shots">
              {c.screenshots.map((s) => (
                <Image key={s.src} src={s.src} alt={s.alt} width={640} height={400} />
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ───────────── C. Tres soluciones principales ───────────── */

function SolutionVisual({ id }: { id: Solution["id"] }) {
  if (id === "atender") {
    return (
      <div className="solution-visual chat-visual" aria-hidden="true">
        <span className="sv-in">
          <Image src="/channels/instagram.svg" alt="" width={12} height={12} />
          ¿Hacen envíos a Medellín?
        </span>
        <span className="sv-out">
          <MaiMark width={14} height={14} />
          Sí. Te envío el enlace para completar tu pedido.
        </span>
        <span className="sv-chip sv-chip-blue">Oportunidad · En conversación</span>
      </div>
    );
  }
  if (id === "reservar") {
    return (
      <div className="solution-visual slots-visual" aria-hidden="true">
        <span className="sv-day">Sábado</span>
        <div className="sv-slots">
          <span>9:00</span>
          <span className="is-picked">10:00</span>
          <span>11:30</span>
          <span className="is-busy">12:00</span>
        </div>
        <span className="sv-chip sv-chip-green">
          <Check size={11} /> Confirmada · recordatorio programado
        </span>
      </div>
    );
  }
  return (
    <div className="solution-visual chain-visual" aria-hidden="true">
      {["Pedido #1042", "Envío en camino", "Aviso al cliente"].map((t, i) => (
        <span key={t} className={i === 2 ? "is-done" : ""}>
          {i === 2 ? <Check size={12} /> : <i />}
          {t}
        </span>
      ))}
    </div>
  );
}

export function Solutions() {
  return (
    <section
      className="section solutions-section"
      id="soluciones"
      aria-labelledby="solutions-heading"
    >
      <div className="container section-stack">
        <div className="section-intro">
          <div>
            <Eyebrow>QUÉ AUTOMATIZAMOS</Eyebrow>
            <h2 id="solutions-heading">
              Tres frentes donde la automatización se nota en el día a día
            </h2>
          </div>
          <p>
            Cada solución se adapta a cómo trabaja tu negocio. Empezamos por la
            tarea que más tiempo te quita y crecemos desde ahí.
          </p>
        </div>
        <div className="solutions-grid">
          {solutions.map((s) => (
            <article className="solution-card" key={s.id} id={`solucion-${s.id}`}>
              <span className="eyebrow solution-label">{s.label}</span>
              <h3>{s.title}</h3>
              <SolutionVisual id={s.id} />
              <dl>
                <div>
                  <dt>La situación</dt>
                  <dd>{s.situation}</dd>
                </div>
                <div>
                  <dt>Qué automatizamos</dt>
                  <dd>{s.automate}</dd>
                </div>
                <div>
                  <dt>Qué cambia para tu equipo</dt>
                  <dd>{s.change}</dd>
                </div>
              </dl>
              <ContactLink
                subject="Automatización"
                location={`solucion-${s.id}`}
                className="button button-dark"
              >
                {PRIMARY_CTA} <ArrowUpRight size={16} aria-hidden="true" />
              </ContactLink>
            </article>
          ))}
        </div>
        <p className="sectors-line">
          <span>Lo aplicamos en negocios que atienden clientes todos los días:</span>{" "}
          {sectors.join(" · ")}.
        </p>
      </div>
    </section>
  );
}

/* ───────────── D. Plataforma (canales + panel) ───────────── */

export function PlatformBlock() {
  return (
    <div className="platform-block" id="plataforma">
      <div className="platform-copy">
        <span className="status-pill status-dark">
          <i />
          TODO CONECTADO
        </span>
        <h3 className="heading-medium">
          Tus canales, tu agenda y tus resultados en un solo panel
        </h3>
        <p>
          Trabajamos en una plataforma propia que reúne tus conversaciones,
          clientes, pipeline, agenda, ventas y resultados. Así sabes qué está
          pasando sin saltar entre aplicaciones, y puedes medir qué está
          haciendo cada automatización.
        </p>
        <div className="platform-channels">
          <span>Canales que se conectan</span>
          <ul>
            {CHANNELS.map(([id, title]) => (
              <li key={id} title={title}>
                <Image src={`/channels/${id}.svg`} alt={title} width={22} height={22} />
              </li>
            ))}
            <li title="Página web">
              <Globe2 size={22} aria-label="Página web" role="img" />
            </li>
          </ul>
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
          {["Inbox", "Clientes", "Agenda", "Pipeline", "Resultados"].map(
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
            </div>
            <div>
              <span>Conversaciones atendidas</span>
              <strong>312</strong>
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
                  <i style={{ transform: `scaleX(${Number(percent) / 100})` }} />
                </span>
                <span>{number}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="platform-modules">
        <div className="platform-modules-head">
          <h4>Qué incluye la plataforma</h4>
          <span>Cada negocio accede según los módulos de su plan.</span>
        </div>
        <ul>
          {platformModules.map(([name, text]) => (
            <li key={name}>
              <strong>{name}</strong>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ───────────── E. Cómo trabajamos y qué contratas ───────────── */

export function Process() {
  return (
    <section
      className="section process-section"
      id="como-trabajamos"
      aria-labelledby="process-heading"
    >
      <div className="container section-stack">
        <div className="section-intro">
          <div>
            <Eyebrow>CÓMO TRABAJAMOS</Eyebrow>
            <h2 id="process-heading">
              De la primera conversación a una solución funcionando
            </h2>
          </div>
          <p>
            Usas nuestra plataforma y nosotros hacemos la implementación a la
            medida de tu operación.
          </p>
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
        <div className="engagement" aria-labelledby="engagement-heading">
          <h3 id="engagement-heading" className="engagement-heading">
            Qué contratas
          </h3>
          <div className="engagement-grid">
            <article>
              <span className="eyebrow">01</span>
              <h4>{engagement.uses.title}</h4>
              <p>{engagement.uses.text}</p>
            </article>
            <article>
              <span className="eyebrow">02</span>
              <h4>{engagement.weDo.title}</h4>
              <ul className="check-list">
                {engagement.weDo.items.map((t) => (
                  <li key={t}>
                    <Check size={14} aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </article>
            <article>
              <span className="eyebrow">03</span>
              <h4>{engagement.scope.title}</h4>
              <p>{engagement.scope.text}</p>
            </article>
          </div>
          <div className="engagement-footer">
            <div>
              <span className="engagement-sub">Un proyecto puede incluir</span>
              <ul className="deliverables">
                {engagement.deliverables.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="engagement-sub">Cómo empezamos</span>
              <ol className="start-steps">
                {engagement.start.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ol>
              <ContactLink location="como-trabajamos" className="button button-red">
                {PRIMARY_CTA} <ArrowUpRight size={16} aria-hidden="true" />
              </ContactLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── F. Servicios complementarios ───────────── */

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
              También te ayudamos con tu presencia digital
            </h2>
          </div>
          <p>
            Puedes contratarlos de forma independiente o sumarlos a una
            automatización. Cada proyecto se cotiza según su alcance.
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
            <ContactLink subject="Desarrollo web" kind="service" className="button button-outline">
              Consultar por desarrollo web <ArrowRight size={16} aria-hidden="true" />
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
              Trabajamos tu presencia digital para que las personas encuentren
              tu negocio y entiendan qué ofreces, en buscadores y en asistentes
              de IA.
            </p>
            <small>No garantizamos posiciones ni apariciones.</small>
            <ContactLink
              subject="Visibilidad en buscadores e IA"
              kind="service"
              className="button button-outline-light"
            >
              Consultar por visibilidad <ArrowRight size={16} aria-hidden="true" />
            </ContactLink>
          </article>
          <article className="service-custom">
            <div className="service-visual code-mock" aria-hidden="true">
              <Code2 size={26} />
            </div>
            <h3>Soluciones tecnológicas a medida</h3>
            <p>
              Desarrollos e integraciones para una necesidad concreta, cuando
              una herramienta estándar no alcanza.
            </p>
            <small>Partimos de una conversación para definir el alcance.</small>
            <ContactLink subject="Solución a medida" kind="service" className="button button-outline">
              Consultar por una solución <ArrowRight size={16} aria-hidden="true" />
            </ContactLink>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ───────────── G. Preguntas frecuentes ───────────── */

export function Faq() {
  return (
    <section className="section faq-section" id="preguntas" aria-labelledby="faq-heading">
      <div className="container faq-layout">
        <div className="faq-intro">
          <Eyebrow>PREGUNTAS FRECUENTES</Eyebrow>
          <h2 id="faq-heading" className="heading-medium">
            Lo que suelen preguntarnos antes de empezar
          </h2>
          <ContactLink location="faq" className="button button-dark">
            {PRIMARY_CTA} <ArrowUpRight size={16} aria-hidden="true" />
          </ContactLink>
        </div>
        <div className="faq-list">
          {faqs.map((f) => (
            <details key={f.q}>
              <summary>
                {f.q}
                <Plus size={18} aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }).replace(/</g, "\\u003c"),
        }}
      />
    </section>
  );
}
