# MONSERRAT_AI

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

## Editar diseño y contenido

- `styles/tokens.css`: colores y radios de la marca.
- `app/globals.css`: estilos de la landing y puntos de quiebre.
- `lib/site-content.ts`: rubros, problemas, casos de uso, proceso y textos de marketing.
- `components/monserrat/`: cabecera, hero, secciones, marketing y formulario.
- `components/monserrat/MaiDemo.tsx`: datos ficticios y línea de tiempo de 32 segundos. `mai-demo.css` contiene sus estilos aislados.
- `app/layout.tsx`, `app/opengraph-image.tsx` y `app/icon.svg`: metadatos e identidad para compartir.

La demo se carga en cliente al acercarse al viewport, se pausa al salir de pantalla y respeta la preferencia de movimiento reducido. Se mide con ResizeObserver para elegir entre su composición de escritorio y móvil. Los controles permiten pausar, reiniciar y abrir pantalla completa.

Las cifras, personas, conversaciones y negocios de las maquetas son datos ficticios, identificados como DEMO. Las fotografías son ilustrativas; sus fuentes están en `public/audience/credits.json`. Las fuentes Geist y los iconos de canales están alojados localmente. La sección de proyectos está ausente hasta disponer de casos reales autorizados.

## Formulario y Supabase

Crea `.env.local` con los valores del proyecto existente:

```dotenv
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-clave-publica-de-supabase
NEXT_PUBLIC_SITE_URL=https://montserratai.com.co
```

También se reconocen `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`, usados por la versión anterior. No uses una clave de servicio en variables `NEXT_PUBLIC_*`.

`POST /api/contact` valida los campos en servidor, exige consentimiento y escribe en la tabla existente `demo_requests` con las columnas `name`, `email` y `message`. El tema, el contacto y la autorización se incluyen en `message`. Para conservar el esquema anterior, `email` recibe el email o WhatsApp proporcionado: debe ser una columna de texto que admita ambos. La política de inserción de Supabase debe permitir la operación con la clave configurada. No se ejecutan migraciones ni se modifican políticas automáticamente.

Si no hay configuración o el servicio falla, el formulario muestra un error y conserva los datos; no simula un envío exitoso. WhatsApp y email siguen disponibles como contacto directo. La verificación local no envía registros reales.

Los botones de servicios preseleccionan el tema mediante el evento `monserrat:contact`. También puedes enlazar a `/?tema=Desarrollo%20web#contacto`.

## Analítica

Todos los eventos pasan por `track()` en `lib/analytics.ts`, que los envía a GA4/GTM (`gtag` o `dataLayer`), Plausible o Vercel Analytics si están cargados, y además emite `monserrat:analytics` en `document`. No se envían datos personales.

| Evento | Parámetros | Cuándo |
| --- | --- | --- |
| `cta_click` | `location` (`hero`, `header`, `header_mobile`), `subject` | CTA principal y botón Contacto |
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
