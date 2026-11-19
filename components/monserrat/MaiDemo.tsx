"use client";

/**
 * Demo animada de MAI (hero).
 *
 * Port fiel del prototipo `Landing MONSERRAT_AI.html` (componente DemoProducto):
 * un único reloj con requestAnimationFrame que escribe estilos directamente en
 * refs, sin re-render por frame. Escenario fijo (1200×675 escritorio,
 * 390×720 móvil) escalado al ancho del contenedor.
 *
 * Todos los datos son ficticios (DEMO).
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import {
  siWhatsapp,
  siInstagram,
  siTelegram,
  siMessenger,
  siGmail,
  type SimpleIcon,
} from "simple-icons";
import { track } from "@/lib/analytics";

type Layout = "desktop" | "mobile";
type Rect = [number, number, number, number];

/* ───────────────────────── Datos ───────────────────────── */

const DUR = 35.64;
const BRAND = "MONTSERRAT_AI";
const WM = BRAND.split("");
/** Letras que se quedan al cerrar: M · A · I. */
const KEEP_IDX = [0, BRAND.length - 2, BRAND.length - 1];
const KEEP: Record<number, number> = Object.fromEntries(KEEP_IDX.map((k, i) => [k, i]));
/** "_AI" en rojo. */
const RED_FROM = BRAND.length - 3;
const WM_MID = (BRAND.length - 1) / 2;
const NOISE_T = ["Hola", "¿Precio?", "Info porfa", "¿Hay stock?", "???", "Buenas", "¿Horario?", "¿Me ayudan?", "¿Envían?", "Urgente", "¿Sigue disponible?", "Ok", "¿Cuánto?", "Necesito ayuda", "¿Abren hoy?", "Hola??", "¿Tienen cita?", "Quiero info"];
const NOISE_B = ["+99", "12", "37", "8", "24"];
const NOISE_P = ["3 mensajes nuevos", "5 sin leer", "Llamada perdida"];

type Noise = {
  t: string; bg: string; fg: string; rad: string; pad: string; fs: number; fw: number;
  x: number; y: number; at: number; rot: number; sc: number; op: number; ph: number;
};
const noiseCache: Partial<Record<Layout, Noise[]>> = {};
function noiseFor(lay: Layout, W: number, H: number): Noise[] {
  const cached = noiseCache[lay];
  if (cached) return cached;
  let s = lay === "mobile" ? 7 : 3;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const N = lay === "mobile" ? 20 : 34;
  const out: Noise[] = [];
  for (let k = 0; k < N; k++) {
    const r = rnd();
    const kind = r < 0.16 ? "b" : r < 0.26 ? "p" : "m";
    const x = 10 + rnd() * (W - (kind === "p" ? 170 : 150));
    const y = 10 + rnd() * (H - 60);
    const base =
      kind === "b" ? { t: NOISE_B[k % NOISE_B.length], bg: "#E60A2F", fg: "#FFFFFF", rad: "999px", pad: "3px 9px", fs: 12, fw: 700 }
      : kind === "p" ? { t: NOISE_P[k % NOISE_P.length], bg: "rgba(255,255,255,0.14)", fg: "#FFFFFF", rad: "999px", pad: "6px 12px", fs: 12, fw: 500 }
      : { t: NOISE_T[k % NOISE_T.length], bg: "rgba(255,255,255,0.92)", fg: "#12151B", rad: "14px 14px 14px 4px", pad: "7px 11px", fs: 13, fw: 400 };
    out.push({
      ...base, x: Math.round(x), y: Math.round(y), at: 2.6 * Math.sqrt((k + 1) / N),
      rot: (rnd() - 0.5) * 12, sc: 0.8 + rnd() * 0.25, op: 0.55 + rnd() * 0.4, ph: rnd() * 6.28,
    });
  }
  return (noiseCache[lay] = out);
}

type ChannelKey = "whatsapp" | "instagram" | "telegram" | "messenger" | "gmail" | "web";
const CH: Record<ChannelKey, { name: string; color: string; icon: SimpleIcon | null }> = {
  whatsapp: { name: "WhatsApp", color: "#25D366", icon: siWhatsapp },
  instagram: { name: "Instagram", color: "#E4405F", icon: siInstagram },
  telegram: { name: "Telegram", color: "#26A5E4", icon: siTelegram },
  messenger: { name: "Messenger", color: "#0866FF", icon: siMessenger },
  gmail: { name: "Correo", color: "#EA4335", icon: siGmail },
  web: { name: "Web", color: "#12151B", icon: null },
};
const ORBIT: ChannelKey[] = ["whatsapp", "instagram", "telegram", "messenger", "gmail", "web"];
const MSGS: [ChannelKey, string][] = [
  ["whatsapp", "¿Tienen esta chaqueta en talla M?"],
  ["instagram", "¿Hacen envíos a Medellín?"],
  ["web", "Quiero reservar para el sábado"],
  ["telegram", "¿Dónde queda la tienda?"],
  ["whatsapp", "¿Ya salió mi pedido #1042?"],
  ["gmail", "Necesito la factura de mi compra"],
  ["messenger", "¿Cuánto cuesta el corte?"],
];
const ITEM_MSG = [0, 2, 4];
const ITEMS = [
  { reply: "Sí, hay talla M. Ya registré tu compra.", who: "Laura M. · Venta", name: "Laura M.", meta: "WhatsApp · Venta", kl: "Ventas por chat · esta semana", kd: "▲ 18% vs. semana anterior", val: 2410000, money: true, value: "$189.000", avBg: "#FCE9EB", avFg: "#B0102A", tools: [["DB", "Inventario · talla M", "3 disponibles"], ["$", "Ventas · registro", "Venta registrada"]] },
  { reply: "Listo, tu reserva quedó el sábado a las 10:00.", who: "Camilo R. · Reserva", name: "Camilo R.", meta: "Web · Reserva", kl: "Reservas creadas · esta semana", kd: "▲ 9 más que la anterior", val: 48, money: false, value: "$100.000", avBg: "#E7EEFA", avFg: "#2B5EA8", tools: [["◷", "Agenda · sábado", "10:00 libre"], ["◷", "Agenda · crear reserva", "Reserva #R-218"]] },
  { reply: "Tu pedido #1042 va en camino. Llega mañana.", who: "Ana P. · Pedido", name: "Ana P.", meta: "WhatsApp · Pedido", kl: "Clientes avisados de su envío", kd: "▲ Sin llamadas al equipo", val: 32, money: false, value: "$245.000", avBg: "#E3F4E6", avFg: "#1E6B34", tools: [["DB", "Pedidos · #1042", "Despachado"], ["↗", "Transportadora · rastreo", "Llega mañana"]] },
];
const STAGES = [
  ["Nuevo", "#EFF0F3", "#6E7075"],
  ["En conversación", "#E7EEFA", "#2B5EA8"],
];
const FINAL_STAGE = [
  ["Cliente", "#E3F4E6", "#1E6B34"],
  ["Agendado", "#FCE9EB", "#B0102A"],
  ["Cliente", "#E3F4E6", "#1E6B34"],
];
const BARS = [38, 52, 46, 64, 58, 80, 72];
const PIPE = ["Lead", "Calificado", "Reservó", "Asistió", "Pagó"];
const PIPE_BASE = [64, 41, 28, 19, 112];
const PIPE_FINAL = [4, 2, 4];
const PIPE_VALUE = [189000, 0, 245000];
const PIPE_DOT = ["#B0102A", "#2B5EA8", "#1E6B34"];
const DAYS = ["L", "M", "M", "J", "V", "S", "D"];
const CAPS: [string, string][] = [
  ["", "Demasiadas conversaciones al mismo tiempo"],
  ["01", "MAI revisa tus sistemas y resuelve cada caso"],
  ["02", "Cada cliente avanza solo en tu pipeline"],
  ["03", "Y lo convierte en datos para decidir"],
  ["", "Menos tareas manuales. Más negocio."],
];

type Cfg = {
  W: number; H: number; capInset: number; capSize: number;
  msgs: [number, number][]; core: [number, number]; coreD: [number, number, number]; coreSize: number;
  rc: Rect[]; more: [number, number] | null; panel: Rect; rows: Rect[]; kpi: Rect[]; kpi2: Rect[];
  chart: Rect; chart2: Rect; cam: [number, number, number, number][];
  wmSize: number; wmSub: number;
};
const CFG: Record<Layout, Cfg> = {
  desktop: {
    W: 1200, H: 675, capInset: 24, capSize: 19,
    msgs: [[70, 64], [470, 36], [850, 86], [110, 290], [820, 300], [190, 500], [790, 500]],
    core: [600, 300], coreD: [96, 70, 0.5], coreSize: 120,
    rc: [[50, 62, 340, 214], [810, 62, 340, 214], [810, 392, 340, 214]],
    more: [90, 470],
    panel: [220, 140, 760, 400],
    rows: [[236, 222, 728, 62], [236, 292, 728, 62], [236, 362, 728, 62]],
    kpi: [[120, 140, 300, 170], [450, 140, 300, 170], [780, 140, 300, 170]],
    kpi2: [[120, 84, 300, 132], [450, 84, 300, 132], [780, 84, 300, 132]],
    chart: [120, 334, 960, 220],
    chart2: [120, 236, 960, 340],
    cam: [[0, 600, 337, 1], [3.2, 600, 337, 1.02], [4.6, 600, 325, 1.03], [8.4, 600, 330, 1.02], [9.6, 600, 330, 1.03], [12.2, 600, 345, 1.0], [16.4, 600, 345, 1.03], [18, 600, 337, 1]],
    wmSize: 138, wmSub: 20,
  },
  mobile: {
    W: 390, H: 720, capInset: 14, capSize: 14,
    msgs: [[16, 26], [104, 102], [16, 178], [104, 254], [16, 330], [104, 406], [16, 482]],
    core: [195, 220], coreD: [40, 36, 0.4], coreSize: 96,
    rc: [[16, 290, 358, 118], [16, 414, 358, 118], [16, 538, 358, 118]],
    more: null,
    panel: [16, 76, 358, 420],
    rows: [[24, 140, 342, 64], [24, 214, 342, 64], [24, 288, 342, 64]],
    kpi: [[16, 76, 358, 112], [16, 198, 358, 112], [16, 320, 358, 112]],
    kpi2: [[16, 60, 358, 88], [16, 156, 358, 88], [16, 252, 358, 88]],
    chart: [16, 446, 358, 196],
    chart2: [16, 352, 358, 300],
    cam: [[0, 195, 360, 1], [4.6, 195, 360, 1.02], [8.4, 195, 360, 1.0], [18, 195, 360, 1]],
    wmSize: 44, wmSub: 14,
  },
};

/* ───────────────────────── Easing / forma ───────────────────────── */

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const io = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const seg = (t: number, a: number, b: number) => io(clamp((t - a) / (b - a)));
const win = (t: number, a: number, b: number, r: number) => Math.min(seg(t, a, a + r), 1 - seg(t, b - r, b));
const lerp = (a: number, b: number, e: number) => a + (b - a) * e;

type ShapeKey = "circle" | "spark" | "blobA" | "squ";
const SHK: [number, ShapeKey][] = [[0, "circle"], [2.6, "circle"], [3.1, "spark"], [3.5, "circle"], [4.8, "circle"], [5.3, "spark"], [8.2, "spark"], [8.9, "squ"], [12.0, "squ"], [12.6, "blobA"], [16.2, "blobA"], [16.9, "circle"], [25.5, "circle"]];
const RS: Record<ShapeKey, (a: number, t: number) => number> = {
  circle: () => 1,
  spark: (a) => 0.84 + 0.2 * Math.pow(0.5 + 0.5 * Math.cos(6 * a), 1.6),
  blobA: (a, t) => 1 + 0.14 * Math.sin(3 * a + t * 2) + 0.06 * Math.sin(5 * a - t * 3),
  squ: (a) => { const c = Math.abs(Math.cos(a)), s = Math.abs(Math.sin(a)); return 0.9 / Math.pow(Math.pow(c, 4) + Math.pow(s, 4), 0.25); },
};
const shapeMix = (t: number): [ShapeKey, ShapeKey, number] => {
  let i = 0;
  while (i < SHK.length - 2 && t >= SHK[i + 1][0]) i++;
  const a = SHK[i], b = SHK[i + 1];
  return [a[1], b[1], io(clamp((t - a[0]) / (b[0] - a[0])))];
};
const keyAt = (K: number[][], t: number) => {
  let i = 0;
  while (i < K.length - 2 && t >= K[i + 1][0]) i++;
  const a = K[i], b = K[i + 1];
  const e = io(clamp((t - a[0]) / (b[0] - a[0])));
  return a.map((v, j) => lerp(v, b[j], e));
};
const glow = (g: number) =>
  g > 0.01
    ? `0 0 0 2px rgba(230,10,47,${(0.7 * g).toFixed(3)}), 0 0 36px rgba(230,10,47,${(0.45 * g).toFixed(3)}), 0 20px 44px -18px rgba(0,0,0,0.6)`
    : "0 20px 44px -18px rgba(0,0,0,0.6)";
const fmt = (v: number, money: boolean) => (money ? "$" + Math.round(v).toLocaleString("es-CO") : String(Math.round(v)));

/* ───────────────────────── Frame ───────────────────────── */

type Els = Record<string, HTMLElement | null>;
type FrameCtx = {
  els: Els;
  layout: Layout;
  rootWidth: number;
  wm: { pos: Record<number, number> | null; layout: Layout | null };
};

function applyFrame(real: number, ctx: FrameCtx) {
  const { els, layout } = ctx;
  const mob = layout === "mobile";
  const g = (k: string) => els[k] ?? null;
  const C = CFG[layout];

  // Remapeo de tiempo (mismas curvas que el prototipo).
  const b0 = real < 2.0 ? real : real < 3.6 ? 2.0 + (real - 2.0) * 0.5 : real - 0.8;
  const SL = 1.35, SPAN = 12.4;
  const t1r = b0 <= 4.6 ? b0 : b0 < 4.6 + SPAN * SL ? 4.6 + (b0 - 4.6) / SL : b0 - SPAN * (SL - 1);
  // Las respuestas (4.8 s → 8.4 s) van 1.7× más lento para leer las herramientas.
  const KS = 1.7, tA = 4.8, tB = 8.4;
  const t1 = t1r < tA ? t1r : t1r < tA + (tB - tA) * KS ? tA + (t1r - tA) / KS : t1r - (tB - tA) * (KS - 1);
  const t = t1 < 14.6 ? t1 : t1 < 17.0 ? 14.6 + (t1 - 14.6) * 0.02 : t1 - 2.4 + 0.048;
  const ti = t1;

  // Escena 1: ruido + onda roja
  const NZ = noiseFor(layout, C.W, C.H);
  const R = seg(real, 3.3, 4.4) * Math.hypot(C.W, C.H);
  const wv = g("wave");
  if (wv) {
    const rr = Math.max(1, R);
    wv.style.left = C.core[0] - rr + "px";
    wv.style.top = C.core[1] - rr + "px";
    wv.style.width = 2 * rr + "px";
    wv.style.height = 2 * rr + "px";
    wv.style.opacity = (win(real, 3.3, 4.4, 0.15) * 0.9).toFixed(3);
  }
  const shake = seg(real, 0.4, 2.8);
  NZ.forEach((n, k) => {
    const el = g("n" + k);
    if (!el) return;
    const ap = seg(real, n.at, n.at + 0.25);
    const d = Math.hypot(n.x + 50 - C.core[0], n.y + 15 - C.core[1]);
    const cl = clamp((R - d) / 90);
    const jx = Math.sin(real * 13 + n.ph) * 3 * shake, jy = Math.cos(real * 11 + n.ph) * 2.5 * shake;
    const ox = ((n.x + 50 - C.core[0]) / (d || 1)) * 40 * cl, oy = ((n.y + 15 - C.core[1]) / (d || 1)) * 40 * cl;
    el.style.opacity = (ap * n.op * (1 - cl) * (real < 18.5 ? 1 : 0)).toFixed(3);
    el.style.transform = `translate(${(jx + ox).toFixed(1)}px,${(jy + oy + (1 - ap) * 10).toFixed(1)}px) rotate(${n.rot.toFixed(1)}deg) scale(${(n.sc * lerp(0.85, 1, ap) * (1 - 0.3 * cl)).toFixed(3)})`;
  });
  const calm = 1 - seg(real, 3.3, 3.9);

  const box = (el: HTMLElement, x: number, y: number, w?: number, h?: number) => {
    el.style.left = x.toFixed(1) + "px";
    el.style.top = y.toFixed(1) + "px";
    if (w != null && h != null) {
      el.style.width = w.toFixed(1) + "px";
      el.style.height = h.toFixed(1) + "px";
    }
  };
  const world = g("world"), core = g("core");
  if (!world || !core) return;
  const G = 1 - seg(t, 16.2, 16.9);
  const FIN = 1 - seg(t, 23.9, 24.5);

  // Cámara
  const [, px, py, z] = keyAt(C.cam, t);
  world.style.transform = `translate(${C.W / 2}px,${C.H / 2}px) scale(${z.toFixed(4)}) translate(${(-px).toFixed(1)}px,${(-py).toFixed(1)}px)`;

  // MAI
  const cs = C.coreSize;
  const back = seg(t, 16.4, 17.3);
  const cd = seg(t, 8.4, 9.2) * (1 - back);
  const finY = mob ? -70 : -95;
  const cx = lerp(C.core[0], C.coreD[0], cd), cy = lerp(C.core[1], C.coreD[1], cd) + finY * back;
  const hop =
    Math.abs(Math.sin(Math.PI * clamp((t - 2.6) / 0.5))) * (t > 2.6 && t < 3.1 ? 1 : 0) +
    Math.abs(Math.sin(Math.PI * clamp((t - 19.3) / 0.5))) * (t > 19.3 && t < 19.8 ? 1 : 0);
  const pulse = 1 + 0.04 * Math.sin(Math.PI * clamp((t - 3.3) / 1.3)) * (t > 3.3 && t < 4.6 ? 1 : 0);
  const kick = Math.max(win(t, 9.9, 10.3, 0.15), win(t, 10.2, 10.6, 0.15), win(t, 10.5, 10.9, 0.15), win(t, 12.3, 12.8, 0.15));
  const csc = lerp(1, C.coreD[2], cd) * lerp(0.8, 1, seg(t, 2.6, 3.1)) * pulse * (1 + 0.14 * kick);
  core.style.width = cs + "px";
  core.style.height = cs + "px";
  box(core, cx - cs / 2, cy - cs / 2);
  core.style.transform = `translateY(${(-14 * hop).toFixed(1)}px) scale(${csc.toFixed(4)})`;
  core.style.opacity = (seg(t, 2.6, 3.1) * FIN).toFixed(3);
  const st = g("status");
  if (st) {
    const v = t < 3.3 ? "Hola, soy MAI" : t < 4.6 ? "MAI está pensando…" : t < 6.4 ? "MAI consulta tus sistemas…" : t < 8.4 ? "MAI resuelve cada caso…" : "MAI guarda los datos…";
    if (st.textContent !== v) st.textContent = v;
    // En móvil las tarjetas ocupan esa zona: el estado se oculta mientras se ven.
    const mobHide = mob ? 1 - seg(t, 4.6, 4.9) : 1;
    st.style.opacity = ((1 - seg(t, 8.4, 9.2)) * (t < 3.3 ? 1 : seg(t, 4.9, 5.2)) * mobHide).toFixed(3);
  }
  const ring = g("ring");
  if (ring) {
    ring.style.opacity = (win(t, 3.2, 12.2, 0.4) * (1 - 0.6 * cd)).toFixed(3);
    ring.style.transform = `rotate(${(t * 300) % 360}deg)`;
  }

  // Mensajes reales
  let absorbed = 0;
  MSGS.forEach((_, i) => {
    const el = g("m" + i);
    if (!el) return;
    const [x, y] = C.msgs[i];
    const pop = seg(t, 0.2 + 0.28 * i, 0.6 + 0.28 * i);
    const a0 = 3.2 + 0.12 * i, fly = seg(t, a0, a0 + 0.85);
    if (fly > 0.92) absorbed++;
    const w = el.offsetWidth || 220, h = el.offsetHeight || 60;
    const dx = (C.core[0] - (x + w / 2)) * fly, dy = (C.core[1] - (y + h / 2)) * fly;
    const bob = Math.sin(t * 1.6 + i * 1.3) * 4 * (1 - fly) + Math.sin(real * 12 + i * 2.1) * 3 * shake * calm;
    box(el, x, y);
    el.style.transform = `translate(${dx.toFixed(1)}px,${(dy + bob + (1 - pop) * 14).toFixed(1)}px) scale(${(lerp(0.92, 1, pop) * lerp(1, 0.2, fly)).toFixed(4)})`;
    el.style.opacity = (pop * (1 - seg(t, a0 + 0.45, a0 + 0.85))).toFixed(3);
  });

  // Iconos en órbita
  const orbR = mob ? 118 : 150;
  const orbO = seg(t, 2.8, 3.3) * (1 - seg(t, 4.5, 4.9));
  ORBIT.forEach((k, i) => {
    const el = g("o" + i);
    if (!el) return;
    const ang = ((-90 + i * 60 + t * 10) * Math.PI) / 180;
    const pop = seg(t, 2.8 + 0.06 * i, 3.3 + 0.06 * i);
    const rr = orbR * lerp(0.6, 1, pop);
    el.style.left = (cx + Math.cos(ang) * rr).toFixed(1) + "px";
    el.style.top = (cy + Math.sin(ang) * rr).toFixed(1) + "px";
    let hit = 0;
    MSGS.forEach(([mk], j) => {
      if (mk === k) { const a0 = 3.2 + 0.12 * j; hit = Math.max(hit, win(t, a0 + 0.3, a0 + 1.1, 0.2)); }
    });
    el.style.transform = `scale(${(lerp(0.5, 1, pop) * (1 + 0.15 * hit)).toFixed(3)})`;
    el.style.boxShadow = hit > 0.01 ? `0 0 0 3px rgba(255,255,255,${(0.25 * hit).toFixed(3)}), 0 0 24px ${CH[k].color}` : "0 12px 26px -10px rgba(0,0,0,0.7)";
    el.style.opacity = (orbO * pop).toFixed(3);
  });

  // Cuerpo de MAI en canvas
  const cv = g("dots") as HTMLCanvasElement | null;
  if (cv) {
    const sc = (ctx.rootWidth / C.W) * (window.devicePixelRatio || 1) * 1.15;
    const box0 = cs * 1.8, pxW = Math.max(1, Math.round(box0 * sc));
    if (cv.width !== pxW) { cv.width = pxW; cv.height = pxW; }
    const c2 = cv.getContext("2d");
    if (c2) {
      c2.setTransform(sc, 0, 0, sc, 0, 0);
      c2.clearRect(0, 0, box0, box0);
      const calmS = clamp(seg(t, 16.7, 17.2) + win(t, 3.4, 4.6, 0.2) * 0.5);
      const act = 1 - 0.85 * calmS;
      const [sa, sb, se] = shapeMix(t);
      const spin = (t * 0.35 + 1.4 * seg(t, 4.8, 5.4) + 1.0 * seg(t, 8.3, 8.9)) * (1 - seg(t, 16.4, 17.0));
      const rad = cs * 0.48, c0 = box0 / 2, N = 160;
      const breathe = 1 + 0.04 * Math.sin(real * 1.8) * act;
      c2.beginPath();
      for (let q = 0; q <= N; q++) {
        const a = (q / N) * Math.PI * 2;
        const loc = a - spin;
        const S = RS[sa](loc, t) * (1 - se) + RS[sb](loc, t) * se;
        const n = 0.07 * Math.sin(2 * a + real * 1.3) + 0.05 * Math.sin(3 * a - real * 1.7 + 1) + 0.03 * Math.sin(5 * a + real * 2.1);
        const r = rad * S * breathe * (1 + n * act);
        const x = c0 + Math.cos(a) * r, y = c0 + Math.sin(a) * r;
        if (q) c2.lineTo(x, y); else c2.moveTo(x, y);
      }
      c2.closePath();
      c2.fillStyle = "#E60A2F";
      c2.fill();
    }
  }

  // Ojos y expresiones (siguen a las filas y KPI durante el CRM)
  const ey = g("eyes");
  if (ey) {
    const eo = seg(t, 2.7, 3.0) * (t < 24.6 ? 1 : 0) * (1 - seg(t, 23.9, 24.4));
    const think = win(t, 3.4, 4.9, 0.2);
    const reply = win(t, 4.9, 8.4, 0.2);
    const wow = Math.max(win(t, 4.85, 5.35, 0.12), win(t, 5.55, 6.05, 0.12), win(t, 6.25, 6.75, 0.12), win(t, 10.95, 11.4, 0.12), win(t, 11.55, 12.0, 0.12), win(t, 14.2, 14.7, 0.12));
    let lookX = lerp(lerp(-3, 0, think), Math.sin(t * 1.6) * 5, reply * (1 - think));
    let lookY = -5 * think;
    const crm = win(t, 9.0, 16.3, 0.3);
    if (crm > 0.01) {
      let tg: [number, number];
      if (t < 12.2) {
        const ri = clamp(Math.floor((t - 9.5) / 0.3), 0, 2), Wr = C.rows[ri];
        tg = t < 10.6
          ? [Wr[0] + Wr[2] * 0.6, Wr[1] + Wr[3] / 2]
          : [C.panel[0] + C.panel[2] * (0.3 + 0.6 * seg(t, 10.6, 11.8)), C.panel[1] + C.panel[3] - 40];
      } else {
        const sw = 0.5 + 0.5 * Math.sin(t * 1.4);
        tg = [lerp(C.kpi[0][0], C.kpi[2][0] + C.kpi[2][2], sw), C.kpi[0][1] + C.kpi[0][3]];
      }
      const dx = tg[0] - cx, dy = tg[1] - cy, dd = Math.hypot(dx, dy) || 1;
      lookX += (dx / dd) * 9 * crm;
      lookY += (dy / dd) * 9 * crm;
    }
    ey.style.opacity = clamp(eo).toFixed(3);
    ey.style.gap = (14 - 5 * think + 3 * wow).toFixed(1) + "px";
    ey.style.transform = `translate(calc(-50% + ${lookX.toFixed(1)}px), calc(-50% + ${lookY.toFixed(1)}px)) rotate(${(6 * think * Math.sin(t * 9)).toFixed(1)}deg)`;
    const blinkT = t > 9 && t < 16.3 ? t % 2.7 < 0.12 : t > 19.3 && t < 23 ? t % 3.1 < 0.14 : (t > 7.2 && t < 7.34) || (t > 3.05 && t < 3.18);
    const blink = blinkT ? 0.12 : 1;
    const wink = seg(t, 18.2, 18.3) * (1 - seg(t, 18.62, 18.84));
    const th = g("thk");
    if (th) {
      th.style.opacity = (think * (0.6 + 0.4 * Math.sin(t * 8))).toFixed(3);
      th.style.transform = `translateY(${(-4 * Math.sin(t * 5)).toFixed(1)}px)`;
    }
    const e1 = g("eyeL"), e2 = g("eyeR");
    const squint = 1 - 0.62 * think;
    const big = 1 + 0.45 * wow;
    const shape = think > 0.5 ? "35% 35% 50% 50% / 25% 25% 75% 75%" : "50%";
    if (e1) {
      e1.style.transform = `scale(${(big * (1 + 0.03 * wink)).toFixed(3)}, ${(blink * squint * big * (1 - 0.1 * wink)).toFixed(3)}) rotate(${(14 * think).toFixed(1)}deg)`;
      e1.style.borderRadius = shape;
    }
    if (e2) {
      e2.style.transform = `translateY(${(1.5 * wink).toFixed(1)}px) rotate(${(-14 * think).toFixed(1)}deg) scale(${(big * (1 + 0.12 * wink)).toFixed(3)}, ${Math.max(0.12, blink * squint * big * (1 - 0.9 * wink)).toFixed(3)})`;
      e2.style.borderRadius = shape;
    }
  }
  const bd = g("badge");
  if (bd) {
    const v = String(absorbed);
    if (bd.textContent !== v) bd.textContent = v;
    bd.style.opacity = (win(t, 3.3, 8.6, 0.25) * (absorbed > 0 ? 1 : 0)).toFixed(3);
  }

  // Líneas punteadas de MAI a cada fila mientras ordena el CRM
  ITEMS.forEach((_, i) => {
    const l = g("l" + i);
    if (!l) return;
    if (t > 8.8 && t < 12) {
      const W2 = C.rows[i], s0 = 9.45 + 0.3 * i, q = seg(t, s0, s0 + 0.75);
      const tx = W2[0] - 2, tyy = W2[1] + W2[3] / 2;
      const ddx = tx - cx, ddy = tyy - cy, dl = Math.hypot(ddx, ddy) || 1;
      const sx2 = cx + (ddx / dl) * 36, sy2 = cy + (ddy / dl) * 36;
      l.setAttribute("d", `M${sx2.toFixed(1)} ${sy2.toFixed(1)} C ${sx2.toFixed(1)} ${(sy2 + (tyy - sy2) * 0.6).toFixed(1)}, ${(tx - (tx - sx2) * 0.6).toFixed(1)} ${tyy.toFixed(1)}, ${tx.toFixed(1)} ${tyy.toFixed(1)}`);
      l.style.display = "";
      l.style.strokeDasharray = "0.3 2";
      l.style.strokeDashoffset = (0.3 - 1.3 * q).toFixed(4);
      l.style.opacity = (0.5 * win(t, s0, s0 + 0.75, 0.15)).toFixed(3);
    } else l.style.display = "none";
  });

  // Tarjetas: respuesta (con herramientas consultadas) → fila CRM → KPI
  ITEMS.forEach((it, i) => {
    const el = g("rc" + i);
    if (!el) return;
    const Rr = C.rc[i], Wr = C.rows[i], K = C.kpi[i];
    const a0 = 4.8 + 0.7 * i, out = seg(t, a0, a0 + 0.6);
    const d0 = 8.6 + 0.15 * i, toRow = seg(t, d0, d0 + 0.8);
    const e0 = 12.3 + 0.15 * i, toK = seg(t, e0, e0 + 0.8);
    const start = [C.core[0] - 20, C.core[1] - 20, 40, 40];
    let p = start.map((v, j) => lerp(v, Rr[j], out));
    p = p.map((v, j) => lerp(v, Wr[j], toRow));
    p = p.map((v, j) => lerp(v, K[j], toK));
    const cp = seg(ti, 14.6, 15.3) * (1 - seg(ti, 16.9, 17.3));
    p = p.map((v, j) => lerp(v, C.kpi2[i][j], cp));
    box(el, p[0], p[1], p[2], p[3]);
    el.style.borderRadius = lerp(lerp(18, 14, toRow), 20, toK).toFixed(1) + "px";
    el.style.opacity = (seg(t, a0, a0 + 0.25) * G).toFixed(3);
    const mv = Math.max(Math.sin(Math.PI * out), Math.sin(Math.PI * toRow), Math.sin(Math.PI * toK));
    const ov = Math.sin(Math.PI * clamp((t - a0 - 0.35) / 0.45)) * (t > a0 + 0.35 && t < a0 + 0.8 ? 1 : 0);
    el.style.transform = `scale(${(1 + 0.03 * mv + 0.06 * ov).toFixed(4)})`;
    const ty = g("ty" + i), an = g("an" + i), ok = g("ok" + i);
    if (ty && an) {
      const ts = a0 + 1.5, te = ts + 0.6;
      it.tools.forEach((tl, j) => {
        const row = g(`tw${i}_${j}`), stt = g(`ts${i}_${j}`);
        if (!row || !stt) return;
        const s0 = a0 + 0.6 + 0.45 * j, done = t >= s0 + 0.5;
        const ap = seg(t, s0 - 0.1, s0 + 0.1);
        row.style.opacity = ap.toFixed(3);
        row.style.transform = `translateY(${((1 - ap) * 6).toFixed(1)}px)`;
        row.style.borderColor = t >= s0 && !done ? "#E60A2F" : "#E1E4E9";
        const v = done ? "✓ " + tl[2] : "consultando" + ".".repeat(1 + Math.floor((t * 6) % 3));
        if (stt.textContent !== v) stt.textContent = v;
        stt.style.color = done ? "#2F7D3C" : "#8A8D93";
      });
      const n = Math.round(clamp((t - ts) / (te - ts)) * it.reply.length);
      const txt = it.reply.slice(0, n);
      if (an.textContent !== txt) an.textContent = txt;
      ty.style.display = n > 0 ? "none" : "inline";
      ty.style.opacity = (0.45 + 0.55 * Math.abs(Math.sin(t * 6))).toFixed(3);
      if (ok) {
        const op = seg(t, te, te + 0.25);
        ok.style.opacity = op.toFixed(3);
        ok.style.transform = `scale(${lerp(0.6, 1, op).toFixed(3)})`;
      }
    }
    el.style.boxShadow = glow(Math.max(win(t, a0, a0 + 2.2, 0.3), win(t, d0 + 0.6, d0 + 1.8, 0.3) * 0.6, win(t, e0 + 0.6, e0 + 2.0, 0.3)));
    const lB = seg(t, d0 + 0.2, d0 + 0.6), lC = seg(t, e0 + 0.2, e0 + 0.6);
    const ra = g("ra" + i), rb = g("rb" + i), rk = g("rk" + i);
    if (ra) ra.style.opacity = (1 - lB).toFixed(3);
    if (rb) rb.style.opacity = (lB * (1 - lC)).toFixed(3);
    if (rk) rk.style.opacity = lC.toFixed(3);
    const tk = g("rt" + i);
    if (tk) {
      const tp = seg(t, 9.9 + 0.3 * i, 10.2 + 0.3 * i);
      tk.style.opacity = tp.toFixed(3);
      tk.style.transform = `scale(${lerp(0.4, 1, tp).toFixed(3)})`;
    }
    const sg = g("st" + i);
    if (sg) {
      const k = t < 9.6 + 0.3 * i ? 0 : t < 10.15 + 0.3 * i ? 1 : 2;
      const [label, bg, fg] = k < 2 ? STAGES[k] : FINAL_STAGE[i];
      if (sg.textContent !== label) sg.textContent = label;
      sg.style.background = bg;
      sg.style.color = fg;
      const popS = win(t, 10.15 + 0.3 * i, 10.7 + 0.3 * i, 0.12);
      sg.style.transform = `scale(${(1 + 0.15 * popS).toFixed(3)})`;
    }
    const nEl = g("rn" + i);
    if (nEl) {
      const v = fmt(it.val * seg(t, 13.2 + 0.15 * i, 14.6 + 0.15 * i), it.money);
      if (nEl.textContent !== v) nEl.textContent = v;
    }
  });

  // Onda de salida de cada respuesta
  const pu = g("pulse");
  if (pu) {
    let best = 0, rr = 0;
    ITEMS.forEach((_, i) => {
      const a0 = 4.8 + 0.7 * i;
      const pp = clamp((t - a0) / 0.7);
      if (pp > 0 && pp < 1) { best = 1 - pp; rr = lerp(C.coreSize * 0.5, C.coreSize * 1.6, io(pp)); }
    });
    const r0 = Math.max(1, rr);
    pu.style.left = C.core[0] - r0 + "px";
    pu.style.top = C.core[1] - r0 + "px";
    pu.style.width = 2 * r0 + "px";
    pu.style.height = 2 * r0 + "px";
    pu.style.opacity = (best * 0.8).toFixed(3);
  }
  const more = g("more");
  if (more) {
    if (C.more) {
      box(more, C.more[0], C.more[1]);
      more.style.opacity = (seg(t, 6.9, 7.3) * (1 - seg(t, 8.4, 8.8))).toFixed(3);
    } else more.style.opacity = "0";
  }

  // Panel CRM
  const pa = g("panel");
  if (pa) {
    const [ppx, ppy, ppw, pph] = C.panel;
    box(pa, ppx, ppy, ppw, pph);
    pa.style.opacity = (seg(t, 8.4, 8.9) * (1 - seg(t, 12.0, 12.4))).toFixed(3);
    pa.style.transform = `scale(${lerp(0.96, 1, seg(t, 8.4, 8.9)).toFixed(4)})`;
  }
  const pf = g("pfoot");
  if (pf) pf.style.opacity = seg(t, 9.2, 9.6).toFixed(3);
  {
    // Cada cliente avanza por las etapas del pipeline; los contadores se actualizan.
    const cnt = PIPE_BASE.slice(), lit = [0, 0, 0, 0, 0];
    let cash = 18450000;
    PIPE_FINAL.forEach((fin, i) => {
      const a0 = 9.6 + 0.3 * i, a1 = a0 + 0.35 * fin, p = seg(t, a0, a1), sp = fin * p, k = Math.round(sp);
      cnt[k]++;
      const mv = seg(t, a0 - 0.2, a0);
      lit[k] = Math.max(lit[k], mv * (p < 1 ? 1 : 1 - seg(t, a1 + 0.3, a1 + 0.7) * 0.4));
      cash += PIPE_VALUE[i] * seg(t, a1 - 0.1, a1 + 0.4);
      const d = g("pd" + i);
      if (d) {
        d.style.left = (((sp + 0.5) / 5) * 100).toFixed(2) + "%";
        d.style.opacity = mv.toFixed(3);
        d.style.transform = `translateX(${([-9, 0, 9][i] * p).toFixed(1)}px) translateY(${(-5 * Math.abs(Math.sin(Math.PI * sp))).toFixed(1)}px) scale(${(1 + 0.25 * win(t, a1 - 0.1, a1 + 0.5, 0.2)).toFixed(3)})`;
      }
    });
    cnt.forEach((v, k) => {
      const n = g("pn" + k), c = g("pk" + k);
      if (n && n.textContent !== String(v)) n.textContent = String(v);
      if (c) {
        c.style.borderColor = lit[k] > 0.01 ? (k === 4 ? `rgba(47,158,88,${lit[k].toFixed(3)})` : `rgba(230,10,47,${(0.7 * lit[k]).toFixed(3)})`) : "transparent";
        c.style.background = k === 4 && lit[k] > 0.01 ? "#E3F4E6" : "#F4F5F7";
      }
    });
    const pc = g("pcash");
    if (pc) {
      const v = "$" + Math.round(cash).toLocaleString("es-CO");
      if (pc.textContent !== v) pc.textContent = v;
    }
    const cn = g("crmN");
    if (cn) {
      const v = String(125 + Math.min(3, Math.floor(seg(t, 9.8, 10.9) * 3.999)));
      if (cn.textContent !== v) cn.textContent = v;
    }
  }

  // Gráfico
  const ch = g("chart");
  if (ch) {
    const [chx, chy, chw, chh] = C.chart;
    ch.style.opacity = (seg(t, 13.0, 13.4) * G).toFixed(3);
    ch.style.transform = `translateY(${((1 - seg(t, 13.0, 13.5)) * 16).toFixed(1)}px)`;
    BARS.forEach((v, i) => { const b = g("b" + i); if (b) b.style.height = (v * seg(t, 13.4 + 0.1 * i, 14.2 + 0.1 * i)).toFixed(2) + "%"; });
    const ex = seg(ti, 14.6, 15.3) * (1 - seg(ti, 16.9, 17.3));
    const cb = [chx, chy, chw, chh].map((v, j) => lerp(v, C.chart2[j], ex));
    box(ch, cb[0], cb[1], cb[2], cb[3]);
    const row = g("chRow");
    if (row) {
      const ro = seg(ti, 15.2, 15.6) * (1 - seg(ti, 16.9, 17.2));
      row.style.opacity = ro.toFixed(3);
      row.style.maxHeight = (ro * 70).toFixed(1) + "px";
    }
    [58, 24, 18].forEach((w, k) => { const e = g("cw" + k); if (e) e.style.width = (w * seg(ti, 15.4 + 0.15 * k, 16.0 + 0.15 * k)).toFixed(2) + "%"; });
    const tp = g("tip");
    if (tp) {
      const to = seg(ti, 15.0, 15.3) * (1 - seg(ti, 16.9, 17.2));
      const bx = 20 + (cb[2] - 40) * (5.5 / 7);
      tp.style.left = (bx - (tp.offsetWidth || 220) / 2).toFixed(1) + "px";
      tp.style.top = (cb[3] * 0.14).toFixed(1) + "px";
      tp.style.opacity = to.toFixed(3);
      tp.style.transform = `translateY(${((1 - to) * 8).toFixed(1)}px) scale(${lerp(0.9, 1, to).toFixed(3)})`;
    }
    const sat = g("b5");
    if (sat) sat.style.boxShadow = ex > 0.01 ? `0 0 0 2px rgba(230,10,47,${(0.6 * ex).toFixed(3)}), 0 0 24px rgba(230,10,47,${(0.45 * ex).toFixed(3)})` : "none";
  }

  // Cierre: MONTSERRAT_AI → M·A·I
  const wm = g("wm"), sub = g("wmSub");
  const wmY = C.core[1] + (mob ? 30 : 50);
  if (wm) {
    wm.style.top = wmY + "px";
    wm.style.opacity = (seg(t, 17.0, 17.7) * FIN).toFixed(3);
    wm.style.transform = `translateY(${((1 - seg(t, 17.0, 17.7)) * 20).toFixed(1)}px)`;
    // Se mide de nuevo en cada ciclo, justo antes de que se junten M·A·I
    // (17.2 s → 18.2 s), para no usar posiciones de otro tamaño de letra.
    if (!ctx.wm.pos || ctx.wm.layout !== layout || (t > 17.2 && t < 18.2)) {
      const ws = WM.map((_, i) => g("w" + i));
      if (ws.every(Boolean) && ws[0]!.offsetWidth) {
        const lefts = ws.map((e) => e!.offsetLeft), widths = ws.map((e) => e!.offsetWidth);
        const keepIdx = KEEP_IDX, gap = widths[0] * 0.08;
        const tot = keepIdx.reduce((s2, i) => s2 + widths[i], 0) + gap * 2;
        let x0 = wm.offsetWidth / 2 - tot / 2;
        const tgt: Record<number, number> = {};
        keepIdx.forEach((i) => { tgt[i] = x0 - lefts[i]; x0 += widths[i] + gap; });
        ctx.wm.pos = tgt;
        ctx.wm.layout = layout;
      }
    }
    const mvw = seg(t, 18.2, 19.1);
    WM.forEach((_, i) => {
      const el = g("w" + i);
      if (!el) return;
      if (i in KEEP) {
        const dx = ctx.wm.pos ? ctx.wm.pos[i] * mvw : 0;
        el.style.transform = `translateX(${dx.toFixed(1)}px)`;
        el.style.opacity = "1";
        el.style.color = i === 0 ? "#FFFFFF" : mvw > 0.5 ? "#FFFFFF" : "#E60A2F";
      } else {
        const f = seg(t, 18.0 + 0.03 * Math.abs(i - WM_MID), 18.6 + 0.03 * Math.abs(i - WM_MID));
        el.style.opacity = (1 - f).toFixed(3);
        el.style.transform = `translateY(${(f * 18).toFixed(1)}px) scale(${(1 - 0.4 * f).toFixed(3)})`;
      }
    });
  }
  if (sub) {
    sub.style.top = wmY + (mob ? 66 : 172) + "px";
    sub.style.opacity = (seg(t, 19.2, 19.7) * FIN).toFixed(3);
  }

  // Subtítulos
  const cps = [win(real, 0.2, 3.4, 0.3), win(real, 3.3, 12.6, 0.35), win(t, 8.4, 12.2, 0.35), win(ti, 12.2, 17.2, 0.35), win(ti, 17.3, 19.0, 0.35)];
  cps.forEach((o, j) => {
    const el = g("c" + j);
    if (el) {
      el.style.opacity = o.toFixed(3);
      el.style.transform = `translateY(${((1 - o) * 8).toFixed(1)}px)`;
    }
  });
}

/* ───────────────────────── UI ───────────────────────── */

function ChannelGlyph({ k, size, color }: { k: ChannelKey; size: number; color: string }) {
  const icon = CH[k].icon;
  if (!icon) {
    return <span style={{ color, fontSize: Math.round(size * 0.72), fontWeight: 700, lineHeight: 1 }}>www</span>;
  }
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ display: "block" }}>
      <path d={icon.path} fill={color} />
    </svg>
  );
}

const SYS = "-apple-system,BlinkMacSystemFont,'SF Pro Display','Helvetica Neue',system-ui,sans-serif";
const MONO = "var(--font-geist-mono),'Geist Mono',ui-monospace,monospace";
const ctrlBtn: CSSProperties = {
  width: 38, height: 38, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(12,13,16,0.7)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
  color: "#FFFFFF", fontSize: 13, cursor: "pointer", display: "grid", placeItems: "center", padding: 0,
};
const abs: CSSProperties = { position: "absolute", left: 0, top: 0, opacity: 0 };

export default function MaiDemo({ controls = true, captions = true }: { controls?: boolean; captions?: boolean }) {
  const els = useRef<Els>({});
  const fsw = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout>("desktop");
  const [paused, setPaused] = useState(false);
  // iPhone (Safari iOS) no permite pantalla completa fuera de <video>.
  const [canFullscreen] = useState(
    () => typeof document !== "undefined" && document.fullscreenEnabled === true,
  );
  const clock = useRef({ acc: 0, paused: false, visible: true, reduce: false, layout: "desktop" as Layout, width: 1200 });
  const wmCache = useRef<FrameCtx["wm"]>({ pos: null, layout: null });

  // Acepta HTML y SVG: ambos tienen .style, que es lo único que escribe el reloj.
  const r = useCallback((k: string) => (el: Element | null) => { els.current[k] = el as HTMLElement | null; }, []);
  const C = CFG[layout];
  const mob = layout === "mobile";

  // Layout por ancho del contenedor + escala del escenario.
  // useLayoutEffect: se mide antes del primer pintado para no saltar de
  // escritorio a móvil (evita layout shift).
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const sync = () => {
      const w = root.clientWidth;
      const next: Layout = w < 560 ? "mobile" : "desktop";
      clock.current.width = w;
      if (next !== clock.current.layout) {
        clock.current.layout = next;
        wmCache.current = { pos: null, layout: null };
        setLayout(next);
      }
      const st = stageRef.current;
      if (st) st.style.transform = `scale(${w / CFG[clock.current.layout].W})`;
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(root);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    const st = stageRef.current, root = rootRef.current;
    if (st && root) st.style.transform = `scale(${root.clientWidth / C.W})`;
  }, [C.W]);

  // Reloj único
  useEffect(() => {
    const s = clock.current;
    s.reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const io = new IntersectionObserver((es) => { s.visible = es[0].isIntersecting; });
    if (rootRef.current) io.observe(rootRef.current);
    let last = performance.now();
    let raf = 0;
    const frame = (real: number) =>
      applyFrame(real, { els: els.current, layout: s.layout, rootWidth: s.width, wm: wmCache.current });
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const now = performance.now();
      const dt = Math.min(1.5, (now - last) / 1000);
      last = now;
      if (!s.visible) return;
      if (s.reduce) { frame(15); return; }
      if (!s.paused) s.acc = (s.acc + dt) % DUR;
      frame(s.acc);
    };
    frame(s.reduce ? 15 : s.acc);
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);

  // Pantalla completa
  useEffect(() => {
    const onFs = () => {
      const w = fsw.current, root = rootRef.current;
      if (!w || !root) return;
      const isFs = document.fullscreenElement === w;
      const cfg = CFG[clock.current.layout];
      w.style.height = isFs ? "100vh" : "";
      w.style.background = isFs ? "#0C0D10" : "";
      root.style.width = isFs ? `min(96vw, ${((96 * cfg.W) / cfg.H).toFixed(2)}vh)` : "100%";
    };
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const togglePlay = () => {
    clock.current.paused = !clock.current.paused;
    setPaused(clock.current.paused);
    track("demo_control", { action: clock.current.paused ? "pause" : "play" });
  };
  const restart = () => {
    clock.current.acc = 0;
    clock.current.paused = false;
    setPaused(false);
    track("demo_control", { action: "restart" });
  };
  const toggleFs = () => {
    const w = fsw.current;
    if (!w) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else {
      void w.requestFullscreen?.();
      track("demo_control", { action: "fullscreen" });
    }
  };

  const noise = noiseFor(layout, C.W, C.H);
  const rowCols = mob ? "minmax(0,1fr) auto 26px" : "minmax(0,1fr) 130px 110px 46px";

  return (
    <div ref={fsw} style={{ position: "relative", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div
        ref={rootRef}
        role="img"
        aria-label="Demostración (datos ficticios): llegan mensajes de WhatsApp, Instagram, web y correo; MAI consulta tus sistemas, responde cada caso, mueve a cada cliente por el pipeline y lo convierte en métricas de ventas, reservas y envíos."
        style={{ position: "relative", width: "100%", aspectRatio: mob ? "390 / 720" : "1200 / 675", fontFamily: "var(--font-geist),'Geist',system-ui,sans-serif", color: "#12151B" }}
      >
        <div
          ref={stageRef}
          aria-hidden="true"
          style={{
            position: "absolute", left: 0, top: 0, width: C.W, height: C.H, transformOrigin: "0 0", borderRadius: 28, overflow: "hidden",
            background: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1.3px) 0 0 / 22px 22px, rgba(15,16,19,0.72)",
            backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div ref={r("world")} style={{ position: "absolute", left: 0, top: 0, width: C.W, height: C.H, transformOrigin: "0 0", willChange: "transform" }}>
            <svg width={C.W} height={C.H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none", zIndex: 2 }}>
              {ITEMS.map((_, i) => (
                <path key={i} ref={r("l" + i)} pathLength={1} fill="none" stroke="#E60A2F" strokeWidth={2} strokeLinecap="round" style={{ display: "none" }} />
              ))}
            </svg>
            <span ref={r("pulse")} style={{ ...abs, borderRadius: "50%", border: "2px solid #E60A2F", pointerEvents: "none" }} />
            <span ref={r("wave")} style={{ ...abs, borderRadius: "50%", border: "2px solid rgba(230,10,47,0.7)", background: "radial-gradient(circle, rgba(230,10,47,0) 60%, rgba(230,10,47,0.12) 100%)", pointerEvents: "none" }} />

            {noise.map((n, k) => (
              <span
                key={`${layout}-n${k}`}
                ref={r("n" + k)}
                style={{ position: "absolute", left: n.x, top: n.y, opacity: 0, background: n.bg, color: n.fg, borderRadius: n.rad, padding: n.pad, fontSize: n.fs, fontWeight: n.fw, whiteSpace: "nowrap", boxShadow: "0 10px 24px -12px rgba(0,0,0,0.6)" }}
              >
                {n.t}
              </span>
            ))}

            {MSGS.map(([k, text], i) => (
              <div key={i} ref={r("m" + i)} style={{ ...abs, maxWidth: 270, background: "#FFFFFF", borderRadius: "18px 18px 18px 6px", padding: "10px 16px 12px", display: "grid", gap: 4, boxShadow: "0 18px 40px -18px rgba(0,0,0,0.6)", transformOrigin: "center" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#6E7075" }}>
                  <span style={{ width: 18, height: 18, borderRadius: "50%", background: CH[k].color, display: "grid", placeItems: "center", fontSize: 8 }}>
                    <ChannelGlyph k={k} size={11} color="#FFFFFF" />
                  </span>
                  {CH[k].name}
                </span>
                <span style={{ fontSize: 17, lineHeight: 1.3 }}>{text}</span>
              </div>
            ))}

            {/* CRM */}
            <div ref={r("panel")} style={{ ...abs, background: "#FFFFFF", borderRadius: 22, boxShadow: "0 30px 60px -24px rgba(0,0,0,0.6)", overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, padding: "14px 18px", borderBottom: "1px solid #EFF0F3" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 26, height: 26, borderRadius: 8, background: "#12151B", color: "#FFFFFF", display: "grid", placeItems: "center", fontSize: 12 }}>◎</span>
                  <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em" }}>CRM · Contactos</span>
                </span>
                <span style={{ display: "flex", gap: 4, background: "#EFF0F3", borderRadius: 999, padding: 3, fontSize: 11 }}>
                  <span style={{ background: "#12151B", color: "#FFFFFF", borderRadius: 999, padding: "4px 10px" }}>Todos <span ref={r("crmN")}>125</span></span>
                  {!mob && <span style={{ padding: "4px 8px", color: "#6E7075" }}>Nuevos</span>}
                  {!mob && <span style={{ padding: "4px 8px", color: "#6E7075" }}>Clientes</span>}
                </span>
              </div>
              {!mob && (
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 130px 110px 46px", gap: 10, padding: "8px 34px 0", fontFamily: MONO, fontSize: 10, letterSpacing: "0.06em", color: "#8A8D93" }}>
                  <span>CLIENTE</span><span>ETAPA</span><span>VALOR</span><span />
                </div>
              )}
              <div style={{ position: "absolute", left: 18, right: 18, bottom: 16, display: "grid", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 11, color: "#6E7075" }}>
                  <span style={{ fontFamily: MONO, letterSpacing: "0.06em" }}>PIPELINE</span>
                  <span ref={r("pfoot")} style={{ opacity: 0 }}>
                    Registrado este mes{" "}
                    <span ref={r("pcash")} style={{ fontSize: 14, fontWeight: 600, color: "#1E6B34" }}>$18.450.000</span>
                  </span>
                </div>
                <div style={{ position: "relative", display: "flex", gap: 4 }}>
                  {PIPE.map((label, i) => (
                    <div key={label} ref={r("pk" + i)} style={{ flex: 1, minWidth: 0, background: "#F4F5F7", border: "1.5px solid transparent", borderRadius: 10, padding: mob ? "7px 6px 5px" : "7px 12px", display: "flex", flexDirection: mob ? "column" : "row", justifyContent: "space-between", alignItems: mob ? "flex-start" : "baseline", gap: "0 6px" }}>
                      <span style={{ fontSize: mob ? 9 : 12, color: "#4A4D53", whiteSpace: "nowrap" }}>{label}</span>
                      <span ref={r("pn" + i)} style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.02em" }}>0</span>
                    </div>
                  ))}
                  {ITEMS.map((it, i) => (
                    <span key={i} ref={r("pd" + i)} style={{ position: "absolute", top: -11, left: 0, width: 16, height: 16, marginLeft: -8, borderRadius: "50%", background: PIPE_DOT[i], color: "#FFFFFF", border: "2px solid #FFFFFF", display: "grid", placeItems: "center", fontSize: 8, fontWeight: 700, opacity: 0, boxShadow: "0 4px 10px -4px rgba(0,0,0,0.5)" }}>
                      {it.name[0]}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Gráfico */}
            <div ref={r("chart")} style={{ ...abs, background: "#FFFFFF", borderRadius: 22, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 12, boxShadow: "0 30px 60px -24px rgba(0,0,0,0.6)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 15, fontWeight: 600 }}>Conversaciones atendidas · 7 días</span>
                <span style={{ fontFamily: MONO, fontSize: 10, color: "#6E7075", background: "#EFF0F3", borderRadius: 6, padding: "4px 8px" }}>DEMO</span>
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 10, minHeight: 0 }}>
                {BARS.map((_, i) => (
                  <div key={i} style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "stretch", gap: 6 }}>
                    <span ref={r("b" + i)} style={{ display: "block", height: "0%", borderRadius: 6, background: i === BARS.length - 2 ? "#E60A2F" : "#12151B" }} />
                    <span style={{ fontSize: 11, color: "#6E7075", textAlign: "center" }}>{DAYS[i]}</span>
                  </div>
                ))}
              </div>
              <span ref={r("tip")} style={{ ...abs, transformOrigin: "bottom center", background: "#12151B", color: "#FFFFFF", borderRadius: 10, padding: "7px 11px", fontSize: 12, fontWeight: 500, whiteSpace: "nowrap", boxShadow: "0 10px 24px -10px rgba(0,0,0,0.5)" }}>
                Sábado · día con más conversaciones
              </span>
              <div ref={r("chRow")} style={{ display: "grid", gap: 6, opacity: 0, maxHeight: 0, overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ fontWeight: 600 }}>Por canal</span>
                  <span style={{ color: "#6E7075" }}>Esta semana</span>
                </div>
                <div style={{ display: "flex", height: 12, borderRadius: 6, overflow: "hidden", gap: 2, background: "#EFF0F3" }}>
                  {["#25D366", "#E4405F", "#12151B"].map((c, k) => (
                    <span key={c} ref={r("cw" + k)} style={{ width: "0%", background: c }} />
                  ))}
                </div>
                <div style={{ display: "flex", gap: 14, fontSize: 11, color: "#4A4D53", flexWrap: "wrap" }}>
                  <span><span style={{ color: "#25D366" }}>●</span> WhatsApp 58%</span>
                  <span><span style={{ color: "#E4405F" }}>●</span> Instagram 24%</span>
                  <span><span style={{ color: "#12151B" }}>●</span> Web 18%</span>
                </div>
              </div>
            </div>

            {/* Respuesta → fila → KPI */}
            {ITEMS.map((it, i) => {
              const mk = MSGS[ITEM_MSG[i]][0];
              const cc = CH[mk].color;
              const ini = it.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
              return (
                <div key={i} ref={r("rc" + i)} style={{ ...abs, background: "#FFFFFF", borderRadius: 18, overflow: "hidden", boxShadow: "0 20px 44px -18px rgba(0,0,0,0.6)" }}>
                  <div ref={r("ra" + i)} style={{ position: "absolute", inset: 0, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 22, height: 22, borderRadius: "50%", background: cc, display: "grid", placeItems: "center", flex: "none", fontSize: 7 }}>
                        <ChannelGlyph k={mk} size={12} color="#FFFFFF" />
                      </span>
                      <span style={{ fontSize: 12, color: "#6E7075", flex: 1, whiteSpace: "nowrap" }}>{it.who}</span>
                      <span ref={r("ok" + i)} style={{ fontSize: 11, fontWeight: 500, color: "#2F7D3C", background: "#E3F4E6", borderRadius: 999, padding: "2px 8px", opacity: 0, whiteSpace: "nowrap" }}>✓ Respondido</span>
                    </div>
                    {!mob && (
                      <span style={{ alignSelf: "flex-start", maxWidth: "92%", background: "#EFF0F3", borderRadius: "12px 12px 12px 4px", padding: "6px 10px", fontSize: 13, color: "#4A4D53" }}>
                        {MSGS[ITEM_MSG[i]][1]}
                      </span>
                    )}
                    {it.tools.map((tl, j) => (
                      <div key={j} ref={r(`tw${i}_${j}`)} style={{ display: mob && j > 0 ? "none" : "flex", alignItems: "center", gap: 8, opacity: 0, fontFamily: MONO, fontSize: 11, color: "#4A4D53", background: "#F4F5F7", border: "1px solid #E1E4E9", borderRadius: 8, padding: "4px 8px", transition: "border-color .2s ease" }}>
                        <span style={{ width: 18, height: 16, borderRadius: 4, background: "#12151B", color: "#FFFFFF", display: "grid", placeItems: "center", fontSize: 9, flex: "none" }}>{tl[0]}</span>
                        <span style={{ flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tl[1]}</span>
                        <span ref={r(`ts${i}_${j}`)} style={{ whiteSpace: "nowrap", color: "#8A8D93" }} />
                      </div>
                    ))}
                    <span style={{ alignSelf: "flex-end", maxWidth: "94%", background: "#12151B", color: "#FFFFFF", borderRadius: "12px 12px 4px 12px", padding: mob ? "6px 10px" : "8px 12px", fontSize: mob ? 12.5 : 14, lineHeight: 1.35, minHeight: mob ? 28 : 34 }}>
                      <span ref={r("ty" + i)} style={{ letterSpacing: "0.15em" }}>●●●</span>
                      <span ref={r("an" + i)} />
                    </span>
                  </div>
                  <div ref={r("rb" + i)} style={{ position: "absolute", inset: 0, opacity: 0, padding: "0 16px", display: "grid", gridTemplateColumns: rowCols, alignItems: "center", gap: 10 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <span style={{ position: "relative", width: 34, height: 34, borderRadius: "50%", background: it.avBg, color: it.avFg, display: "grid", placeItems: "center", fontSize: 12, fontWeight: 600, flex: "none" }}>
                        {ini}
                        <span style={{ position: "absolute", right: -3, bottom: -3, width: 16, height: 16, borderRadius: "50%", background: cc, border: "2px solid #FFFFFF", display: "grid", placeItems: "center", fontSize: 5 }}>
                          <ChannelGlyph k={mk} size={8} color="#FFFFFF" />
                        </span>
                      </span>
                      <span style={{ display: "grid", gap: 1, minWidth: 0 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>{it.name}</span>
                        <span style={{ fontSize: 11, color: "#6E7075", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.meta}</span>
                      </span>
                    </span>
                    <span ref={r("st" + i)} style={{ justifySelf: "start", fontSize: 11, fontWeight: 500, borderRadius: 999, padding: "4px 10px", whiteSpace: "nowrap", background: "#EFF0F3", color: "#6E7075" }}>Nuevo</span>
                    {!mob && <span style={{ fontSize: 13, fontWeight: 600 }}>{it.value}</span>}
                    <span ref={r("rt" + i)} style={{ justifySelf: "end", width: 22, height: 22, borderRadius: "50%", background: "#2F9E58", color: "#FFFFFF", display: "grid", placeItems: "center", fontSize: 12, opacity: 0 }}>✓</span>
                  </div>
                  <div ref={r("rk" + i)} style={{ position: "absolute", inset: 0, opacity: 0, padding: "14px 18px", display: "grid", gap: 4, alignContent: "center" }}>
                    <span style={{ fontSize: 13, color: "#6E7075" }}>{it.kl}</span>
                    <span ref={r("rn" + i)} style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.1 }}>0</span>
                    <span style={{ fontSize: 12, color: "#2F7D3C" }}>{it.kd}</span>
                  </div>
                </div>
              );
            })}

            <span ref={r("more")} style={{ ...abs, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.22)", color: "#FFFFFF", borderRadius: 999, padding: "8px 14px", fontSize: 14, whiteSpace: "nowrap" }}>
              +4 conversaciones respondidas
            </span>

            {ORBIT.map((k, i) => (
              <div key={k} ref={r("o" + i)} style={{ ...abs, width: 48, height: 48, margin: "-24px 0 0 -24px", borderRadius: "50%", background: "#FFFFFF", boxShadow: "0 12px 26px -10px rgba(0,0,0,0.7)", display: "grid", placeItems: "center", fontSize: 11 }}>
                <ChannelGlyph k={k} size={24} color={CH[k].color} />
              </div>
            ))}

            {/* Cierre */}
            <div ref={r("wm")} style={{ position: "absolute", left: 0, right: 0, top: 0, opacity: 0, display: "flex", justifyContent: "center", fontFamily: SYS, fontWeight: 700, fontSize: C.wmSize, letterSpacing: "-0.04em", lineHeight: 1, color: "#FFFFFF", whiteSpace: "nowrap", pointerEvents: "none" }}>
              {WM.map((ch, i) => (
                <span key={`${layout}-w${i}`} ref={r("w" + i)} style={{ display: "inline-block", color: i >= RED_FROM ? "#E60A2F" : "#FFFFFF" }}>{ch}</span>
              ))}
            </div>
            <span ref={r("wmSub")} style={{ position: "absolute", left: 0, right: 0, top: 0, opacity: 0, textAlign: "center", fontSize: C.wmSub, color: "#C9CBD0" }}>
              Tu asistente de automatización · {BRAND}
            </span>

            {/* MAI */}
            <div ref={r("core")} style={{ ...abs, width: 120, height: 120, transformOrigin: "center" }}>
              <span ref={r("ring")} style={{ position: "absolute", inset: -26, borderRadius: "50%", border: "1.5px solid transparent", borderTopColor: "rgba(255,255,255,0.55)", opacity: 0 }} />
              <canvas ref={r("dots")} style={{ position: "absolute", left: "-40%", top: "-40%", width: "180%", height: "180%", pointerEvents: "none" }} />
              <span ref={r("thk")} style={{ position: "absolute", right: -30, top: -22, display: "flex", gap: 4, alignItems: "flex-end", opacity: 0 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FFFFFF" }} />
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#FFFFFF" }} />
                <span style={{ width: 13, height: 13, borderRadius: "50%", background: "#FFFFFF" }} />
              </span>
              <span ref={r("eyes")} style={{ position: "absolute", left: "50%", top: "50%", display: "flex", gap: 12, transform: "translate(-50%,-50%)", opacity: 0 }}>
                <span ref={r("eyeL")} style={{ width: 13, height: 19, borderRadius: "50%", background: "#FFFFFF", boxShadow: "0 0 10px rgba(255,255,255,0.7)" }} />
                <span ref={r("eyeR")} style={{ width: 13, height: 19, borderRadius: "50%", background: "#FFFFFF", boxShadow: "0 0 10px rgba(255,255,255,0.7)" }} />
              </span>
              <span ref={r("status")} style={{ position: "absolute", left: "50%", top: "calc(100% + 64px)", transform: "translateX(-50%)", whiteSpace: "nowrap", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", color: "#FFFFFF", borderRadius: 999, padding: "7px 14px", fontSize: 13, fontWeight: 500 }} />
              <span ref={r("badge")} style={{ position: "absolute", top: -10, right: -10, minWidth: 30, height: 30, padding: "0 8px", borderRadius: 999, background: "#FFFFFF", color: "#E60A2F", fontSize: 14, fontWeight: 600, display: "grid", placeItems: "center", opacity: 0, boxShadow: "0 6px 16px -6px rgba(0,0,0,0.5)" }}>0</span>
            </div>
          </div>

          {captions &&
            CAPS.map(([n, text], i) => (
              <div key={i} ref={r("c" + i)} style={{ position: "absolute", left: C.capInset, bottom: C.capInset, opacity: 0, background: "rgba(12,13,16,0.82)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 999, padding: "11px 20px", fontSize: C.capSize, fontWeight: 500, whiteSpace: "nowrap", display: "flex", gap: 10 }}>
                {n && <span style={{ fontFamily: MONO, color: "#FF2D4F" }}>{n}</span>}
                {text}
              </div>
            ))}
        </div>
      </div>

      {controls && (
        <div style={{ position: "absolute", right: 14, top: 14, zIndex: 5, display: "flex", gap: 6 }}>
          <button type="button" onClick={togglePlay} aria-label={paused ? "Reproducir" : "Pausar"} title={paused ? "Reproducir" : "Pausar"} style={ctrlBtn} className="mai-demo-btn">
            {paused ? "▶" : "❚❚"}
          </button>
          <button type="button" onClick={restart} aria-label="Reiniciar" title="Reiniciar" style={{ ...ctrlBtn, fontSize: 15 }} className="mai-demo-btn">↺</button>
          {canFullscreen && (
            <button type="button" onClick={toggleFs} aria-label="Pantalla completa" title="Pantalla completa" style={{ ...ctrlBtn, fontSize: 14 }} className="mai-demo-btn">⛶</button>
          )}
        </div>
      )}
    </div>
  );
}
