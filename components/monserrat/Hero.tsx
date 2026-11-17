"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { MaiMark } from "./MaiMark";
import { ContactLink } from "./ContactLink";

const MaiDemo = dynamic(() => import("./MaiDemo"), {
  ssr: false,
  loading: () => <DemoPlaceholder />,
});
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
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-heading">
      <div className="hero-inner">
        <div className="hero-heading">
          <h1 id="hero-heading">
            Menos tareas. <span>Más negocio.</span>
          </h1>
          <span className="eyebrow">
            AUTOMATIZACIONES CON IA · DEMO DE PRODUCTO
          </span>
        </div>
        <div className="hero-demo" ref={host}>
          <span className="hero-watermark" aria-hidden="true">
            monserrat
          </span>
          <div className="hero-demo-inner">
            {visible ? <MaiDemo /> : <DemoPlaceholder />}
          </div>
        </div>
        <div className="hero-bottom">
          <div>
            <h2>Automatizaciones con IA a la medida de tu operación</h2>
            <p>
              Ventas, atención, pedidos, logística, agenda o reportes:
              conectamos tus procesos para que tu equipo deje de hacerlo todo a
              mano.
            </p>
          </div>
          <div className="hero-actions">
            <ContactLink className="button button-red" location="hero">
              Cuéntanos qué necesitas <ArrowUpRight size={18} />
            </ContactLink>
            <a className="button button-glass" href="#soluciones">
              Ver ejemplos <ArrowDown size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
