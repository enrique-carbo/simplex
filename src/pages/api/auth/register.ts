import type { APIRoute } from "astro";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Formato de correo inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  passwordConfirm: z.string().min(8)
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Las contraseñas no coinciden",
  path: ["passwordConfirm"],
});

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  try {
    const formData = await request.formData();
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();
    const passwordConfirm = formData.get("passwordConfirm")?.toString();

    const validation = registerSchema.safeParse({ email, password, passwordConfirm });
    
    if (!validation.success) {
      return new Response(JSON.stringify({ 
        error: validation.error.errors[0].message 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 1. Crear el usuario en PocketBase
    // El campo passwordConfirm es obligatorio para la API de PocketBase
    await locals.pb.collection('users').create({
      email,
      password,
      passwordConfirm,
    });

    // 2. Autenticar inmediatamente para establecer la cookie de sesión
    await locals.pb.collection('users').authWithPassword(email!, password!);

    // 3. Redirigir al dashboard usuario (el middleware guardará la cookie)
    return redirect("/dashboard");

  } catch (error) {
    console.error("Register Error:", error);

    // Manejo de errores específicos de PocketBase (ej: email ya existe)
    const pbErrorData = error.data?.data;
    let message = "No se pudo crear la cuenta";

    if (pbErrorData?.email) {
      message = "Este correo electrónico ya está registrado";
    } else if (error.data?.message) {
      message = error.data.message;
    }

    return new Response(JSON.stringify({ error: message }), { 
      status: error.status || 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};