"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, Play, Star } from "lucide-react";
import { marketing } from "@/lib/site-content";
import { Eyebrow } from "./Eyebrow";

/** Presencia y marketing, en formato compacto (pestañas, sin scroll fijo). */
export default function Marketing() {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const select = (i: number) => setActive(i);
  return (
    <section
      className="marketing-section"
      id="marketing"
      aria-labelledby="marketing-heading"
    >
      <div className="container section-stack">
        <div className="section-intro">
          <div>
            <Eyebrow>PRESENCIA Y MARKETING</Eyebrow>
            <h2 id="marketing-heading" className="heading-medium">
              Tu marketing, conectado con tus conversaciones
            </h2>
          </div>
          <p>
            Tu página de reservas, tus reseñas y tus campañas de Meta se
            conectan con la plataforma. Así sabes qué anuncio trae clientes y
            dónde terminan reservando.
          </p>
        </div>
        <div className="marketing-layout">
          <div
            className="marketing-tabs"
            role="tablist"
            aria-label="Soluciones de marketing"
          >
            {marketing.map(([title, description], i) => (
              <button
                type="button"
                role="tab"
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                tabIndex={i === active ? 0 : -1}
                aria-selected={i === active}
                aria-controls="marketing-preview"
                id={`marketing-tab-${i}`}
                className={i === active ? "is-active" : ""}
                key={title}
                onClick={() => select(i)}
                onKeyDown={(event) => {
                  let next = i;
                  if (event.key === "ArrowRight" || event.key === "ArrowDown")
                    next = (i + 1) % marketing.length;
                  else if (event.key === "ArrowLeft" || event.key === "ArrowUp")
                    next = (i + marketing.length - 1) % marketing.length;
                  else if (event.key === "Home") next = 0;
                  else if (event.key === "End") next = marketing.length - 1;
                  else return;
                  event.preventDefault();
                  select(next);
                  tabRefs.current[next]?.focus({ preventScroll: true });
                }}
              >
                <span className="marketing-tab-title">
                  <span className="eyebrow">0{i + 1}</span>
                  {title}
                  <ArrowUpRight size={17} />
                </span>
                <span className="marketing-description">{description}</span>
              </button>
            ))}
          </div>
          <div
            className="marketing-preview"
            id="marketing-preview"
            role="tabpanel"
            aria-labelledby={`marketing-tab-${active}`}
          >
            <span className="demo-tag marketing-demo-tag">
              EJEMPLO · DATOS DEMO
            </span>
            <div
              className={`booking-phone marketing-part ${active === 0 ? "highlighted" : ""}`}
            >
              <div className="phone-speaker" />
              <div className="booking-brand">
                <span>EL</span>
                <div>
                  <strong>Estudio Lía</strong>
                  <small>Calle 45 #12-30 · Bogotá</small>
                </div>
              </div>
              <div className="booking-title">
                <strong>Servicios</strong>
                <span>Elige y reserva en línea.</span>
              </div>
              {[
                ["Limpieza facial", "60 min", "$85.000"],
                ["Masaje relajante", "40 min", "$120.000"],
                ["Manicure", "40 min", "$45.000"],
              ].map(([name, duration, price]) => (
                <div className="booking-service" key={name}>
                  <span>
                    <strong>{name}</strong>
                    <small>{duration}</small>
                  </span>
                  <b>{price}</b>
                </div>
              ))}
              <span className="booking-button">Reservar</span>
              <span className="phone-home" />
            </div>
            <div className="marketing-widgets">
              <div
                className={`campaign-widget marketing-part ${active === 1 ? "highlighted" : ""}`}
              >
                <span className="campaign-label">
                  <b>∞</b>Campaña · Corte de temporada
                </span>
                {[
                  ["Antes y después", 128, "1 h", 72],
                  ["Promo de la semana", 42, "5 h", 26],
                ].map(([title, leads, last, percent], i) => (
                  <div className="campaign-card" key={title}>
                    <span className={`campaign-thumb campaign-thumb-${i}`}>
                      <Play size={16} fill="currentColor" />
                    </span>
                    <div>
                      <strong>Video · {title}</strong>
                      <span>
                        <b>{leads}</b> leads
                      </span>
                      <i>
                        <span
                          style={{
                            transform: `scaleX(${Number(percent) / 100})`,
                          }}
                        />
                      </i>
                      <small>Último lead hace {last}</small>
                    </div>
                  </div>
                ))}
              </div>
              <div
                className={`review-widget marketing-part ${active === 2 ? "highlighted" : ""}`}
              >
                <div>
                  <span className="review-stars">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </span>
                  <span>Nueva reseña</span>
                </div>
                <strong>Laura M. · hace 2 h</strong>
                <i />
                <i />
              </div>
            </div>
          </div>
        </div>
        <p className="marketing-scope">
          <strong>Qué incluye:</strong> conectar estas piezas con la plataforma
          para ver de dónde llegan tus clientes. Crear un sitio web completo o
          trabajar tu visibilidad en buscadores son{" "}
          <a href="#mas-soluciones">servicios complementarios</a> que se cotizan
          aparte.
        </p>
      </div>
    </section>
  );
}
