export const checkoutConfig = {
  shippingCosts: {
    correo: 10000,
    uber: 8000,
    retiro_local: 0
  },
  
  // Configuraciones adicionales
  maxFileSize: 1 * 1024 * 1024, // 1MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
} as const;