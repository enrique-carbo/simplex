import React from 'react';
import { useStore } from '@nanostores/react';
import { $cartItems, $cartTotal } from '@/store/cart';
import { Button } from '@/components/ui/button';

// Importación dinámica de pdfMake y fuentes
const loadPdfMake = async () => {
  const pdfMake = await import('pdfmake/build/pdfmake');
  const pdfFonts = await import('pdfmake/build/vfs_fonts');
  pdfMake.default.vfs = pdfFonts.default.pdfMake.vfs;
  return pdfMake.default;
};

const PDFDownloadButton: React.FC = () => {
  const cartItems = useStore($cartItems);
  const total = useStore($cartTotal);

  const generatePDF = async () => {
    const pdfMake = await loadPdfMake();

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

    pdfMake.createPdf(docDefinition).download('resumen_carrito.pdf');
  };

  return (
    <Button variant="outline" onClick={generatePDF} disabled={cartItems.length === 0}>
      Descargar PDF del Carrito
    </Button>
  );
};

export default PDFDownloadButton;