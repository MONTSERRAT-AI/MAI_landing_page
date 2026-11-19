"use client";

import { useEffect, useState } from "react";
import { Menu, MessageCircle, X } from "lucide-react";
import { MaiMark } from "./MaiMark";
import { track } from "@/lib/analytics";
import { PRIMARY_CTA, WHATSAPP_URL } from "@/lib/site-content";

const links = [
  ["Soluciones", "soluciones"],
  ["Cómo funciona", "como-funciona"],
  ["Cómo trabajamos", "como-trabajamos"],
  ["Servicios", "mas-soluciones"],
  ["Preguntas", "preguntas"],
];

/**
 * El botón de la navegación cambia según el scroll para no duplicar el CTA:
 * mientras el CTA del inicio está a la vista muestra WhatsApp, y cuando sale
 * de la pantalla pasa a "Cuéntanos qué necesitas".
 */
function useHeroCtaVisible(innerPage: boolean) {
  const [visible, setVisible] = useState(!innerPage);
  useEffect(() => {
    if (innerPage) return;
    const target = document.querySelector(".hero-actions");
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "-96px 0px 0px 0px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [innerPage]);
  return visible;
}

export default function Header({ innerPage = false }: { innerPage?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const heroCtaVisible = useHeroCtaVisible(innerPage);
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
  const ctaClick = (location: string) =>
    track("cta_click", { location, subject: "Automatización" });
  const whatsappClick = (location: string) =>
    track("whatsapp_click", { location });
  return (
    <header
      className={`site-header ${scrolled || innerPage || open ? "is-scrolled" : ""}`}
    >
      <nav className="header-inner" aria-label="Navegación principal">
        <a
          href={`${prefix}#inicio`}
          className="wordmark"
          aria-label="MONSERRAT_AI, inicio"
        >
          <MaiMark width={28} height={28} />
          <span>MONSERRAT_AI</span>
        </a>
        <div className="desktop-nav">
          {links.map(([label, id]) => (
            <a key={id} href={`${prefix}#${id}`}>
              {label}
            </a>
          ))}
          <span className="nav-action">
            {heroCtaVisible ? (
              <a
                key="whatsapp"
                className="nav-whatsapp"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => whatsappClick("header")}
              >
                <MessageCircle size={16} aria-hidden="true" />
                Escríbenos por WhatsApp
              </a>
            ) : (
              <a
                key="cta"
                className="nav-contact"
                href={`${prefix}#contacto`}
                onClick={() => ctaClick("header")}
              >
                {PRIMARY_CTA}
              </a>
            )}
          </span>
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
            <a key={id} href={`${prefix}#${id}`} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <a
            className="mobile-whatsapp"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              setOpen(false);
              whatsappClick("header_mobile");
            }}
          >
            <MessageCircle size={16} aria-hidden="true" />
            Escríbenos por WhatsApp
          </a>
          <a
            href={`${prefix}#contacto`}
            onClick={() => {
              setOpen(false);
              ctaClick("header_mobile");
            }}
          >
            {PRIMARY_CTA}
          </a>
        </div>
      )}
    </header>
  );
}
