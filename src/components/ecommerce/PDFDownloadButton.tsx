import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { $cartItems, $cartTotal } from '@/store/cart';
import { Button } from '@/components/ui/button';

const PDFDownloadButton: React.FC = () => {
  const cartItems = useStore($cartItems);
  const total = useStore($cartTotal);
  const [isLoading, setIsLoading] = useState(false);

  const generatePDF = async () => {
    setIsLoading(true);
    try {
      const pdfMake = await import('@/components/ecommerce/pdfFonts');

      const docDefinition = {
        content: [
          { text: 'Simplex', style: 'header' },
          { text: 'Resumen del Carrito', style: 'header' },
          { text: '\n' },
          { text: '\n' },
          {
            table: {
              headerRows: 1,
              widths: ['*', 'auto', 'auto', 'auto'],
              body: [
                ['Producto', 'Precio', 'Cantidad', 'Subtotal'],
                ...cartItems.map(item => [
                  item.name,
                  `$${item.price.toFixed(2)}`,
                  item.quantity.toString(),
                  `$${(item.price * item.quantity).toFixed(2)}`
                ]),
                ['', '', 'Total', `$${total.toFixed(2)}`]
              ]
            }
          }
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10]
          }
        },
        defaultStyle: {
          font: 'Roboto'
        }
      };

      pdfMake.default.createPdf(docDefinition).download('resumen_carrito.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="outline" onClick={generatePDF} disabled={cartItems.length === 0 || isLoading}>
      {isLoading ? 'Generando PDF...' : 'Descargar PDF del Carrito'}
    </Button>
  );
};

export default PDFDownloadButton;