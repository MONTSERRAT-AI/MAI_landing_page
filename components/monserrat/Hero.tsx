"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { hero } from "@/lib/site-content";
import { track } from "@/lib/analytics";
import { MaiMark } from "./MaiMark";
import { ContactLink } from "./ContactLink";

const MaiDemo = dynamic(() => import("./MaiDemo"), {
  ssr: false,
  loading: () => <DemoPlaceholder />,
});

/** Mismo tamaño que la demo para que nada se mueva al cargarla. */
function DemoPlaceholder() {
  return (
    <div className="demo-placeholder" aria-label="Cargando demostración de MAI">
      <MaiMark width={100} height={100} />
      <span>Conoce a MAI. Tu operación, conectada.</span>
    </div>
  );
}

export default function Hero() {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    if (host.current) observer.observe(host.current);
    return () => observer.disconnect();
  }, []);

  // "montserrat" se expande en horizontal al bajar (--wm-p de 0 a 1).
  // Un listener pasivo + requestAnimationFrame; solo escribe una variable CSS.
  const watermark = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = watermark.current;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (media.matches) {
        el.style.setProperty("--wm-p", "0");
        return;
      }
      const range = Math.max(1, window.innerHeight * 0.9);
      const p = Math.min(1, Math.max(0, window.scrollY / range));
      el.style.setProperty("--wm-p", p.toFixed(4));
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    media.addEventListener("change", request);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      media.removeEventListener("change", request);
    };
  }, []);
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-heading">
      <div className="hero-inner">
        <div className="hero-intro">
          <div className="hero-copy">
            <p className="hero-brand">
              {hero.brand[0]} <span>{hero.brand[1]}</span>
            </p>
            <h1 id="hero-heading">{hero.title}</h1>
          </div>
          <div className="hero-side">
            <p className="hero-description">{hero.description}</p>
            <div className="hero-actions">
              <ContactLink className="button button-red" location="hero">
                {hero.primaryCta} <ArrowUpRight size={18} aria-hidden="true" />
              </ContactLink>
              <a
                className="button button-glass"
                href="#como-funciona"
                onClick={() => track("secondary_cta_click", { location: "hero" })}
              >
                {hero.secondaryCta} <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
        <div className="hero-demo" ref={host}>
          <span className="hero-watermark" aria-hidden="true" ref={watermark}>
            montserrat
          </span>
          <div className="hero-demo-inner">
            {visible ? <MaiDemo /> : <DemoPlaceholder />}
          </div>
          <p className="hero-demo-label eyebrow">
            DEMO DE PRODUCTO · DATOS FICTICIOS
          </p>
        </div>
      </div>
    </section>
  );
}
