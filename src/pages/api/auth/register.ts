import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const formData = await request.formData();
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return new Response("Email y contraseña requeridos", { status: 400 });
  }

  // ✅ VALIDACIÓN DE CONTRASEÑA ANTES DE ENVIAR
  if (password.length < 8) {
    return new Response("La contraseña debe tener al menos 8 caracteres", { status: 400 });
  }

  try {
    console.log("🔍 Intentando crear usuario:", { email, name });
    
    await locals.pb.collection('users').create({
      name: name || "",
      email,
      password,
      passwordConfirm: password
    });
    
    console.log("✅ Usuario creado");
    await locals.pb.collection('users').authWithPassword(email, password);
    
    return redirect("/perfil");
  } catch (error) {
    // ✅ MOSTRAR ERROR ESPECÍFICO DE POCKETBASE
    const pbError = error as { 
      data?: { 
        message?: string;
        data?: { [key: string]: any }; // Detalles del campo que falla
      } 
    };
    
    console.error("❌ Error completo:", JSON.stringify(pbError, null, 2));
    
    const fieldErrors = pbError.data?.data;
    if (fieldErrors) {
      const firstError = Object.values(fieldErrors)[0]?.message;
      return new Response(firstError || "Error de validación", { status: 400 });
    }
    
    const message = pbError.data?.message || "Error en el registro";
    return new Response(message, { status: 500 });
  }
};