"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { MaiMark } from "./MaiMark";
import { track } from "@/lib/analytics";
import { PRIMARY_CTA } from "@/lib/site-content";

const links = [
  ["Soluciones", "soluciones"],
  ["Cómo funciona", "como-funciona"],
  ["Cómo trabajamos", "como-trabajamos"],
  ["Servicios", "mas-soluciones"],
  ["Preguntas", "preguntas"],
  [PRIMARY_CTA, "contacto"],
];

export default function Header({ innerPage = false }: { innerPage?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const resize = () => {
      if (window.innerWidth >= 860) setOpen(false);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("keydown", escape);
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("keydown", escape);
      window.removeEventListener("resize", resize);
    };
  }, []);
  const prefix = innerPage ? "/" : "";
  return (
    <header
      className={`site-header ${scrolled || innerPage || open ? "is-scrolled" : ""}`}
    >
      <nav className="header-inner" aria-label="Navegación principal">
        <a
          href={`${prefix}#inicio`}
          className="wordmark"
          aria-label="MONTSERRAT_AI, inicio"
        >
          <MaiMark width={28} height={28} />
          <span>MONTSERRAT_AI</span>
        </a>
        <div className="desktop-nav">
          {links.map(([label, id]) => (
            <a
              key={id}
              href={`${prefix}#${id}`}
              className={id === "contacto" ? "nav-contact" : ""}
              onClick={
                id === "contacto"
                  ? () => track("cta_click", { location: "header", subject: "Automatización" })
                  : undefined
              }
            >
              {label}
            </a>
          ))}
        </div>
        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
          <span>{open ? "Cerrar" : "Menú"}</span>
        </button>
      </nav>
      {open && (
        <div className="mobile-navigation" id="mobile-navigation">
          {links.map(([label, id]) => (
            <a
              key={id}
              href={`${prefix}#${id}`}
              onClick={() => {
                setOpen(false);
                if (id === "contacto")
                  track("cta_click", { location: "header_mobile", subject: "Automatización" });
              }}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
