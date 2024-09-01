import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { CartItem } from '@/store/cart';

const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 24, marginBottom: 10 },
  item: { marginBottom: 5 },
  total: { marginTop: 20, fontSize: 18 }
});

interface PDFDocumentProps {
  cartItems: CartItem[];
  total: number;
}

const PDFDocument: React.FC<PDFDocumentProps> = ({ cartItems, total }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Resumen de Compra</Text>
      {cartItems.map((item) => (
        <View key={item.id} style={styles.item}>
          <Text>{item.name} - ${item.price} x {item.quantity}</Text>
        </View>
      ))}
      <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
    </Page>
  </Document>
);

export default PDFDocument;