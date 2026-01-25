// migrate-products.mjs
import { readFileSync } from 'fs';
import PocketBase from 'pocketbase';
import { config } from 'dotenv';

// Configurar dotenv
config();

// ===== CONFIGURACIÓN =====
const POCKETBASE_URL = process.env.POCKETBASE_URL;
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

// ===== VALIDACIÓN =====
console.log('🔍 Verificando configuración...');
console.log('URL:', POCKETBASE_URL || '❌ FALTANTE');
console.log('Email:', ADMIN_EMAIL || '❌ FALTANTE');
console.log('Password:', ADMIN_PASSWORD ? '✅ (presente)' : '❌ FALTANTE');

if (!POCKETBASE_URL || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('\n❌ ERROR: Faltan variables en .env');
  console.error('   Ejemplo de .env:');
  console.error('   POCKETBASE_URL=https://tu-pb.com');
  console.error('   POCKETBASE_ADMIN_EMAIL=admin@email.com');
  console.error('   POCKETBASE_ADMIN_PASSWORD=tu-contraseña');
  process.exit(1);
}

const pb = new PocketBase(POCKETBASE_URL);

// ===== FUNCIÓN PRINCIPAL =====
async function migrateProducts() {
  try {
    console.log('\n🔐 Autenticando en PocketBase...');
    await pb._superusers.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('✅ Autenticación exitosa\n');

    // Leer productos
    const jsonPath = './src/assets/data/products/products.json';
    console.log(`📖 Leyendo ${jsonPath}...`);
    
    const productsData = JSON.parse(readFileSync(jsonPath, 'utf-8'));
    console.log(`📦 Encontrados ${productsData.length} productos\n`);

    // Migrar cada producto
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < productsData.length; i++) {
      const product = productsData[i];
      console.log(`[${i + 1}/${productsData.length}] ${product.name}`);

      try {
        // Preparar datos
        const productToCreate = {
          originalId: product.id,
          item: product.item,
          name: product.name,
          discountedPrice: product.discountedPrice,
          listPrice: product.listPrice,
          image: product.image,
          category: product.category,
          inStock: product.inStock,
          sizes: product.sizes  // Ya es array, PocketBase lo convierte a JSON
        };

        // Crear en PocketBase
        await pb.collection('products').create(productToCreate);
        successCount++;
        console.log(`   ✅ Creado`);
      } catch (error) {
        errorCount++;
        
        // Si ya existe, intentar actualizar
        if (error.status === 400) {
          try {
            const existing = await pb.collection('products')
              .getFirstListItem(`originalId = "${product.id}"`);
            
            await pb.collection('products').update(existing.id, {
              item: product.item,
              name: product.name,
              discountedPrice: product.discountedPrice,
              listPrice: product.listPrice,
              image: product.image,
              category: product.category,
              inStock: product.inStock,
              sizes: product.sizes
            });
            
            successCount++;
            console.log(`   🔄 Actualizado (ya existía)`);
          } catch (updateError) {
            console.log(`   ❌ Error al actualizar: ${updateError.message}`);
          }
        } else {
          console.log(`   ❌ Error: ${error.message}`);
        }
      }
    }

    // ===== RESULTADO =====
    console.log('\n' + '='.repeat(50));
    console.log('✅ MIGRACIÓN COMPLETADA');
    console.log('='.repeat(50));
    console.log(`📊 Productos migrados: ${successCount}`);
    console.log(`📊 Errores: ${errorCount}`);
    console.log(`📊 Total procesados: ${productsData.length}`);

  } catch (error) {
    console.error('\n🔥 ERROR CRÍTICO:', error.message);
    
    if (error.message.includes('fetch failed') || error.message.includes('Failed to fetch')) {
      console.error('\n🔗 Problema de conexión:');
      console.error(`   URL: ${POCKETBASE_URL}`);
      console.error('   Posibles causas:');
      console.error('   1. PocketBase no está corriendo');
      console.error('   2. Tu IP no tiene acceso al VPS');
      console.error('   3. URL incorrecta en .env');
    }
    
    process.exit(1);
  }
}

// ===== EJECUTAR =====
migrateProducts();