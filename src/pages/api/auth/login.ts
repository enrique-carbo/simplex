import type { APIRoute } from "astro";
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128)
});

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  try {
    // 1. Validación de entrada (siempre en backend)
    const formData = await request.formData();
    const data = {
      email: formData.get("email")?.toString().trim(),
      password: formData.get("password")?.toString()
    };

    const validation = loginSchema.safeParse(data);
    if (!validation.success) {
      return new Response(JSON.stringify({
        error: "Datos inválidos",
        details: validation.error.errors.map(e => e.message)
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. Autenticación (PocketBase maneja el rate limit automáticamente)
    await locals.pb.collection('users').authWithPassword(data.email!, data.password!);
    
    // 3. Éxito - Redirección
    return redirect("/perfil", 302);

  } catch (error) {
    // 3. Manejo de errores específicos
    console.error("Login error:", error);

    // Rate limit alcanzado (429 viene automático de PocketBase)
    if (error.status === 429) {
      return new Response(JSON.stringify({
        error: "Demasiados intentos. Espera 15 minutos."
      }), { 
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Credenciales inválidas
    if (error.status === 400) {
      return new Response(JSON.stringify({
        error: "Credenciales inválidas"
      }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Errores desconocidos (no exponer detalles)
    return new Response(JSON.stringify({
      error: "Error del servidor. Intente más tarde."
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};