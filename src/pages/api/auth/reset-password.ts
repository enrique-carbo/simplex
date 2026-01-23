// src/pages/api/auth/reset-password.ts
import type { APIRoute } from "astro";
import { z } from 'zod';

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(128),
  passwordConfirm: z.string().min(8).max(128)
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Las contraseñas no coinciden",
  path: ["passwordConfirm"]
});

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const formData = await request.formData();
    const data = {
      token: formData.get("token")?.toString(),
      password: formData.get("password")?.toString(),
      passwordConfirm: formData.get("passwordConfirm")?.toString()
    };

    const validation = resetPasswordSchema.safeParse(data);
    if (!validation.success) {
      return new Response(JSON.stringify({
        error: "Datos inválidos",
        details: validation.error.errors.map(e => e.message)
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { token, password, passwordConfirm } = validation.data;

    // PocketBase solo necesita el token, NO el userId
    await locals.pb.collection('users').confirmPasswordReset(
      token,
      password,
      passwordConfirm
    );

    return new Response(JSON.stringify({
      success: true,
      message: "Contraseña restablecida exitosamente"
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Reset password error:", error);

    if (error.status === 400) {
      return new Response(JSON.stringify({
        error: "Token inválido o expirado. Solicita un nuevo enlace."
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      error: "Error del servidor. Intente más tarde."
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};