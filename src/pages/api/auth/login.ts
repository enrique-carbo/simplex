import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return new Response("Email y contraseña requeridos", { status: 400 });
  }

  try {
    await locals.pb.collection('users').authWithPassword(email, password);
    return redirect("/perfil");
  } catch (error) {
    return new Response("Credenciales inválidas", { status: 401 });
  }
};