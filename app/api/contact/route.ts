import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { validateContact } from "@/lib/contact";

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json(
      { error: "El formato del mensaje no es válido." },
      { status: 415 },
    );
  }

  let input: unknown;
  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).length > 16_384) {
      return NextResponse.json(
        { error: "El mensaje es demasiado largo." },
        { status: 413 },
      );
    }
    input = JSON.parse(body);
  } catch {
    return NextResponse.json(
      { error: "No pudimos leer el mensaje. Inténtalo de nuevo." },
      { status: 400 },
    );
  }

  const { data, errors } = validateContact(input);
  if (data.website) {
    return NextResponse.json(
      { error: "No pudimos enviar el mensaje. Inténtalo de nuevo." },
      { status: 400 },
    );
  }
  if (Object.keys(errors).length) {
    return NextResponse.json(
      { error: "Revisa los campos indicados.", errors },
      { status: 400 },
    );
  }

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json(
      {
        error:
          "El formulario no está disponible por ahora. Escríbenos por WhatsApp o email.",
      },
      { status: 503 },
    );
  }

  try {
    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { error } = await supabase.from("demo_requests").insert({
      name: data.name,
      // Keep compatibility with the existing table: this text column stores
      // either email or WhatsApp; the complete contact is also in the message.
      email: data.contact,
      message: `Tema: ${data.subject}\nContacto: ${data.contact}\nAutorizó el tratamiento de datos para recibir respuesta.\n\n${data.message}`,
    });
    if (error) throw error;
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      {
        error:
          "No pudimos enviar tu mensaje. Tus datos siguen aquí; inténtalo otra vez o escríbenos por WhatsApp.",
      },
      { status: 502 },
    );
  }
}
