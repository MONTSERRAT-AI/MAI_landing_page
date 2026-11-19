# MONTSERRAT_AI

Landing en español implementada con Next.js App Router, React y TypeScript, a partir del prototipo entregado en `Landing Monserrat AI.zip`.

## Desarrollo

```bash
npm ci
npm run dev
```

Abre http://localhost:3000. Para verificar la versión de producción:

```bash
npm run build
npm start
```

## Estructura de la página

1. **Inicio** (`Hero.tsx`): frase de marca, propuesta, explicación, CTA principal y secundario, y después la demo de MAI.
2. **Casos reales** (`CaseStudies`): oculto mientras `caseStudies` esté vacío en `lib/site-content.ts`.
3. **Soluciones** (`Solutions`): Atender y vender · Reservar y coordinar · Conectar la operación.
4. **Cómo funciona** (`Journey.tsx` + `PlatformBlock`): recorrido mensaje → respuesta → reserva → seguimiento → resultado, y panel con canales.
5. **Cómo trabajamos** (`Process`): proceso en 4 pasos y “Qué contratas”.
6. **Presencia y marketing** (`Marketing.tsx`): pestañas compactas.
7. **Servicios complementarios** (`ServicesBento`): cada botón preselecciona su tema en el formulario.
8. **Preguntas frecuentes** (`Faq`), con datos estructurados `FAQPage`.
9. **Contacto** (`ContactForm.tsx`).

## Editar diseño y contenido

- `lib/site-content.ts`: **todos los textos comerciales** (hero, soluciones, recorrido, proceso, qué contratas, marketing, preguntas frecuentes y casos reales). `PRIMARY_CTA` es el texto del CTA principal en todas las secciones.
- `styles/tokens.css`: colores y radios de la marca.
- `app/globals.css`: estilos; el bloque “Landing v2” al final contiene las secciones nuevas.
- `components/monserrat/`: cabecera, hero, secciones, recorrido, marketing y formulario.
- `components/monserrat/MaiDemo.tsx`: datos ficticios y línea de tiempo de la animación (~36 s).
- `public/channels/*.svg`: iconos de canales (generados desde `simple-icons`). Los usa la sección Plataforma.
- `app/layout.tsx`, `app/opengraph-image.tsx` y `app/icon.svg`: metadatos e identidad para compartir.

Para publicar un caso real, agrega un objeto a `caseStudies` con negocio, contexto, problema, solución, capturas y, si existen, testimonio identificado y resultados medidos con su periodo. Usa solo material autorizado.

La demo se carga en cliente al acercarse al viewport, se pausa al salir de pantalla y respeta la preferencia de movimiento reducido. Las cifras, personas, conversaciones y negocios de las maquetas son ficticios e identificados como DEMO.

## Dominio y URLs públicas

`lib/seo.ts` decide la URL usada en canonical, Open Graph, `sitemap.xml`, `robots.txt` y JSON-LD:

1. `NEXT_PUBLIC_SITE_URL`, si está definida.
2. Si no, `RAILWAY_PUBLIC_DOMAIN` (Railway la define automáticamente).
3. Si no, `https://montserratai.com.co`.

Mientras `montserratai.com.co` no sirva la landing, **no** definas `NEXT_PUBLIC_SITE_URL` en Railway con ese dominio. Cuando el dominio apunte a Railway y responda, defínela como `https://montserratai.com.co` y vuelve a desplegar.

## Formulario y Supabase

Crea `.env.local` con los valores del proyecto existente:

```dotenv
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-clave-publica-de-supabase
```

También se reconocen `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`, usados por la versión anterior. No uses una clave de servicio en variables `NEXT_PUBLIC_*`.

`POST /api/contact` valida los campos en servidor, exige consentimiento y escribe en la tabla existente `demo_requests` con las columnas `name`, `email` y `message`. El tema, el contacto y la autorización se incluyen en `message`. Para conservar el esquema anterior, `email` recibe el email o WhatsApp proporcionado: debe ser una columna de texto que admita ambos. La política de inserción de Supabase debe permitir la operación con la clave configurada. No se ejecutan migraciones ni se modifican políticas automáticamente.

Si no hay configuración o el servicio falla, el formulario muestra un error y conserva los datos; no simula un envío exitoso. WhatsApp y email siguen disponibles como contacto directo. La verificación local no envía registros reales.

Los botones de servicios preseleccionan el tema mediante el evento `monserrat:contact`. También puedes enlazar a `/?tema=Desarrollo%20web#contacto`.

## Analítica

Todos los eventos pasan por `track()` en `lib/analytics.ts`, que los envía a GA4/GTM (`gtag` o `dataLayer`), Plausible o Vercel Analytics si están cargados, y además emite `monserrat:analytics` en `document`. No se envían datos personales.

| Evento | Parámetros | Cuándo |
| --- | --- | --- |
| `cta_click` | `location` (`hero`, `header`, `header_mobile`, `solucion-*`, `como-trabajamos`, `faq`), `subject` | CTA principal “Cuéntanos qué necesitas” |
| `secondary_cta_click` | `location` | “Ver cómo funciona” |
| `journey_step` | `step` | Pasos del recorrido “Cómo funciona” |
| `service_inquiry` | `subject` | Botones “Consultar por…” |
| `contact_submit` | `subject` | Formulario enviado con éxito |
| `contact_submit_error` | `subject`, `reason` | El envío falló |
| `demo_control` | `action` (`pause`, `play`, `restart`, `fullscreen`) | Controles de la demo |

Para activar Google Analytics 4 define `NEXT_PUBLIC_GA_ID=G-XXXXXXX`. Sin esa variable no se carga ningún script externo. En desarrollo los eventos se muestran en la consola (`[analytics]`).

## SEO

- Metadatos, Open Graph y canonical en `app/layout.tsx` (textos en `lib/seo.ts`).
- Datos estructurados JSON-LD (`Organization`, `WebSite` y un `Service` por servicio) en `lib/seo.ts`, insertados en `app/page.tsx`.
- `robots.txt` y `sitemap.xml` generados por `app/robots.ts` y `app/sitemap.ts` a partir de `NEXT_PUBLIC_SITE_URL`.

## Publicación

El repositorio conserva su despliegue de Next.js: configura las variables anteriores en el proveedor de hosting y ejecuta el build habitual. Esta actualización no publica ni cambia el sitio en producción.
