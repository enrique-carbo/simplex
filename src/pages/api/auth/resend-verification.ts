import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ locals }) => {
  if (!locals.pb.authStore.isValid) {
    return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
  }

  try {
    const email = locals.pb.authStore.record?.email;
    if (email) {
      await locals.pb.collection('users').requestVerification(email);
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }
    return new Response(JSON.stringify({ error: "Email no encontrado" }), { status: 404 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error al procesar la solicitud" }), { status: 500 });
  }
};