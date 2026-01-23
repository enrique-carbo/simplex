import type { APIRoute } from "astro";
import { z } from 'zod';

// Esquema de validación solo para email
const forgotPasswordSchema = z.object({
  email: z.string().email().max(255)
});

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // 1. Validación de entrada
    const formData = await request.formData();
    const data = {
      email: formData.get("email")?.toString().trim()
    };

    const validation = forgotPasswordSchema.safeParse(data);
    if (!validation.success) {
      return new Response(JSON.stringify({
        error: "Datos inválidos",
        details: validation.error.errors.map(e => e.message)
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { email } = validation.data;

    // 2. Solicitar reseteo de contraseña en PocketBase
    // Esto automáticamente enviará el email usando tu plantilla configurada
    await locals.pb.collection('users').requestPasswordReset(email);

    // 3. Éxito - Respuesta genérica por seguridad
    return new Response(JSON.stringify({
      success: true,
      message: "Si existe una cuenta con este email, recibirás un enlace de recuperación."
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    // 4. Manejo de errores específicos
    console.error("Forgot password error:", error);

    // Rate limit de PocketBase
    if (error.status === 429) {
      return new Response(JSON.stringify({
        error: "Demasiadas solicitudes. Por favor, espera unos minutos."
      }), { 
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Email no encontrado (PocketBase devuelve 404 en este caso)
    if (error.status === 404) {
      // Respuesta genérica por seguridad, no revelar si el email existe
      return new Response(JSON.stringify({
        success: true,
        message: "Si existe una cuenta con este email, recibirás un enlace de recuperación."
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Errores de validación de PocketBase
    if (error.status === 400) {
      return new Response(JSON.stringify({
        error: "Dirección de email inválida"
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Errores desconocidos
    return new Response(JSON.stringify({
      error: "Error del servidor. Intente más tarde."
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};