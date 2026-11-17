"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/analytics";

/**
 * Enlace al formulario de contacto con el tema preseleccionado.
 * `kind="cta"` se mide como `cta_click`; `kind="service"` como `service_inquiry`.
 */
export function ContactLink({
  children,
  subject = "Automatización",
  className = "button button-dark",
  kind = "cta",
  location = "",
}: {
  children: ReactNode;
  subject?: string;
  className?: string;
  kind?: "cta" | "service";
  location?: string;
}) {
  return (
    <a
      className={className}
      href="#contacto"
      onClick={() => {
        document.dispatchEvent(
          new CustomEvent("monserrat:contact", { detail: { subject } }),
        );
        if (kind === "service") track("service_inquiry", { subject });
        else track("cta_click", { location: location || "unknown", subject });
      }}
    >
      {children}
    </a>
  );
}
