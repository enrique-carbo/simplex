import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { CartItem } from '@/store/cart';

const styles = StyleSheet.create({
  page: { padding: 50 },
  title: { fontSize: 24, marginBottom: 10 },
  title1: { fontSize: 30, marginBottom: 10, fontWeight: 'extrabold' },
  item: {
    marginBottom: 5,
    padding: 5,
    borderTop: '1px solid #000000',
    display: 'flex',
  },
  total: {
    marginTop: 20,
    fontSize: 18,
    padding: 5,
    border: '1px solid #000000'
  },
});

interface PDFDocumentProps {
  cartItems: CartItem[];
  total: number;
}

const PDFDocument: React.FC<PDFDocumentProps> = ({ cartItems, total }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title1}>Simplex</Text>
      <Text style={styles.title}>Resumen de Compra</Text>
      {cartItems.map((item) => (
        <View key={item.id} style={styles.item}>
          <Text>
            Art:{item.item} - {item.name}- {item.size} - ${item.price} x {item.quantity}. 
            Subtotal: ${(item.price * item.quantity)}
          </Text>
        </View>
      ))}
      <Text style={styles.total}>Total: ${total}</Text>
    </Page>
  </Document>
);

export default PDFDocument;
