import type { APIRoute } from 'astro';

interface CustomerData {
  id: string;
  user: string;
  nombre: string;
  apellido: string;
  documento: number; // En tu JSON es tipo 'number'
  direccionCalle: string;
  direccionNumero: string;
  ciudad: string;
  provincia: string;
  phone: string;
  created: string;
  updated: string;
}

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const pb = locals.pb;

  // 1. Verificación de Seguridad: ¿Está logueado?
  if (!pb.authStore.isValid || !pb.authStore.record) {
    return new Response('No autorizado', { status: 401 });
  }

  const userId = pb.authStore.record.id;
  const formData = await request.formData();

  // 2. Mapeo de datos del formulario
  // Los nombres de las propiedades coinciden con los campos de tu colección PocketBase
  const data = {
    nombre: formData.get('nombre'),
    apellido: formData.get('apellido'),
    documento: Number(formData.get('documento')),
    direccionCalle: formData.get('direccionCalle'),
    direccionNumero: formData.get('direccionNumero'),
    ciudad: formData.get('ciudad'),
    provincia: formData.get('provincia'),
    phone: formData.get('phone'),
    user: userId, // Forzamos que el dueño sea el usuario autenticado
  };

  try {
    // 3. Buscar si ya existe un registro para este usuario
    let existingRecord: CustomerData | null = null;
    try {
      existingRecord = await pb.collection('customer_data').getFirstListItem<CustomerData>(`user = "${userId}"`);
    } catch (e) {
      // Si no existe, getFirstListItem lanza un error, simplemente lo ignoramos
      existingRecord = null;
    }

    if (existingRecord) {
      // 4. MODO EDICIÓN: Actualizar registro existente
      await pb.collection('customer_data').update(existingRecord.id, data);
    } else {
      // 5. MODO CREACIÓN: Crear registro por primera vez
      await pb.collection('customer_data').create(data);
    }

    // 6. Redirigir al dashboard usuario con un parámetro de éxito
    return redirect('/dashboard?success=true');
    
  } catch (error) {
    console.error('Error al procesar el usuario:', error);
    
    // Si hay un error de validación en PocketBase (ej: campo requerido vacío)
    return new Response(JSON.stringify({
      message: 'Error al guardar los datos',
      details: error.data
    }), { status: 400 });
  }
};