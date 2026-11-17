/**
 * Analítica sin dependencias.
 *
 * `track()` envía cada evento a los proveedores que estén cargados en la página:
 * - Google Analytics 4 / Google Tag Manager (`gtag` o `dataLayer`)
 * - Plausible (`plausible`)
 * - Vercel Analytics (`va`)
 * Además emite `monserrat:analytics` en `document` para integraciones propias.
 *
 * Eventos usados en la landing:
 * - cta_click            { location, subject }   CTA principal y botones "Contacto"
 * - service_inquiry      { subject }             botones "Consultar por…"
 * - contact_submit       { subject }             formulario enviado con éxito
 * - contact_submit_error { subject, reason }     el envío falló
 * - demo_control         { action }              pausar / reproducir / reiniciar / pantalla completa
 */

export type AnalyticsParams = Record<string, string | number | boolean>;

type Gtag = (command: "event", name: string, params?: AnalyticsParams) => void;
type Plausible = (name: string, options?: { props?: AnalyticsParams }) => void;
type VercelQueue = (kind: "event", data: { name: string; data?: AnalyticsParams }) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
    plausible?: Plausible;
    va?: VercelQueue;
  }
}

export function track(event: string, params: AnalyticsParams = {}) {
  if (typeof window === "undefined") return;
  try {
    if (window.gtag) window.gtag("event", event, params);
    else if (window.dataLayer) window.dataLayer.push({ event, ...params });
    window.plausible?.(event, { props: params });
    window.va?.("event", { name: event, data: params });
    document.dispatchEvent(
      new CustomEvent("monserrat:analytics", { detail: { event, ...params } }),
    );
    if (process.env.NODE_ENV !== "production") {
      console.debug("[analytics]", event, params);
    }
  } catch {
    // La analítica nunca debe romper la página.
  }
}
