import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { CartItem } from '@/store/cart';

const styles = StyleSheet.create({
  page: { padding: 50 },
  title: { fontSize: 24, marginBottom: 10 },
  title1: { fontSize: 30, marginBottom: 10, fontWeight: 'extrabold' },
  text: { fontSize: 12 },
  header: { marginBottom: 10 },
  item: {
    marginBottom: 5,
    padding: 5,
    borderTop: '1px solid #000000',
    display: 'flex',
    flexDirection: 'column',
  },
  itemSubtotal: {
    fontSize: 12,
    marginTop: 3,
  },
  itemAhorro: {
    fontSize: 12,
    marginTop: 3,
  },
  listTotal: {
    marginTop: 10,
    fontSize: 16,
    padding: 5,
    border: '1px solid #000000',
    backgroundColor: '#f0f0f0',
  },
  total: {
    marginTop: 20,
    fontSize: 18,
    padding: 5,
    border: '1px solid #000000',
  },
  savings: {
    marginTop: 10,
    fontSize: 16,
    padding: 5,
    border: '1px solid #000000',
    backgroundColor: '#f0f0f0',
  },
  listPrice: {
    fontSize: 12,
    marginLeft: 4,
    textDecoration: 'line-through',
    color: '#999999',
  },

});

interface PDFDocumentProps {
  cartItems: CartItem[];
  total: number;
}

const PDFDocument: React.FC<PDFDocumentProps> = ({ cartItems, total }) => {
  // Calcular el ahorro total
  const totalSavings = cartItems.reduce((acc, item) => {
    const savings = (item.listPrice - item.discountedPrice) * item.quantity;
    return acc + savings;
  }, 0);

  // Calcular el precio total de lista
  const totalListPrice = cartItems.reduce((acc, item) => {
    return acc + item.listPrice * item.quantity;
  }, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title1}>Simplex</Text>
          <Text style={styles.title}>Resumen de Compra</Text>
          <Text style={styles.text}>Padre Grella 1515. Paraná. Entre Ríos</Text>
          <Text style={styles.text}>WhatsApp 3434 718183</Text>
          <Text style={styles.text}>Web: https://simplex.ar</Text>
        </View>
        {cartItems.map((item) => {
          const itemSavings = (item.listPrice - item.discountedPrice) * item.quantity;
          return (
            <View key={item.id} style={styles.item}>
              <Text>
                Art:{item.item} - {item.name} - {item.size} - {' '}
                <Text style={styles.listPrice}>
                  ${item.listPrice} 
                </Text> - ${item.discountedPrice} x {item.quantity}.
              </Text>
              <Text style={styles.itemSubtotal}>
                Subtotal: ${(item.discountedPrice * item.quantity).toFixed(2)}
              </Text>
              
              {itemSavings > 0 && (
                <Text style={styles.itemAhorro}>
                  Ahorro: ${itemSavings.toFixed(2)}
                </Text>
              )}
            </View>
          );
        })}

        <Text style={styles.listTotal}>Total Lista: ${totalListPrice.toFixed(2)}</Text>
        {totalSavings > 0 && (
        <Text style={styles.savings}>Ahorro Total: ${totalSavings.toFixed(2)}</Text>
        )}
        <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
      </Page>
    </Document>
  );
};

export default PDFDocument;