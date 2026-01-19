import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ locals, redirect }) => {
  // 1. Limpia el store local
  locals.pb.authStore.clear();

  // 2. Crea respuesta de redirección
  const response = redirect('/auth/login', 302);

  // 3. Sobrescribe la cookie con una fecha de expiración pasada (borrado total)
  response.headers.append('set-cookie', locals.pb.authStore.exportToCookie({ expires: new Date(0) }));

  return response;
};