import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { CartItem } from '@/store/cart';

const styles = StyleSheet.create({
  page: { padding: 50 },
  header: { marginBottom: 10 },
  title: { fontSize: 24, marginBottom: 10 },
  title1: { fontSize: 30, marginBottom: 10, fontWeight: 'extrabold' },
  text: { fontSize: 12 },
  textFooter: { fontSize: 12, marginTop: 20, marginBottom: 20 },
  textGracias: {
    fontWeight: 'bold', textAlign: 'center'
  },
  containerDetails: { 
    marginBottom: 20, 
    display: 'flex', 
    flexDirection: 'row', 
    justifyContent: 'space-between' },
  orderDetails: { fontSize: 14},
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
  // Función para generar un número de pedido aleatorio
  const generateOrderId = (): string => {
    return Math.random().toString(36).slice(2, 11); // Genera un string alfanumérico de 9 caracteres
  };

  // Función para formatear la fecha
  const formatDate = (): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const formatter = new Intl.DateTimeFormat('es-AR', options);
    return formatter.format(new Date());
  };

  // Generar número de pedido y fecha
  const orderId = generateOrderId();
  const date = formatDate();

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
          <Text style={styles.text}>Email: simplex.parana@gmail.com</Text>
          <Text style={styles.text}>Web: https://simplex.ar</Text>
        </View>

        <view style={styles.containerDetails}>
        {/* Detalles del pedido */}
        <Text style={styles.orderDetails}>
          Pedido Id: {orderId.toUpperCase()}
        </Text>
        <Text style={styles.orderDetails}>
          {date}
        </Text>
        </view>

        {/* Items del carrito */}
        {cartItems.map((item) => {
          const itemSavings = (item.listPrice - item.discountedPrice) * item.quantity;
          return (
            <View key={item.id} style={styles.item}>
              <Text>
                Art: {item.item} - {item.name} - {item.size} - {' '}
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
        {/* Totales */}
        <Text style={styles.listTotal}>Total Precio Lista: ${totalListPrice.toFixed(2)}</Text>
        {totalSavings > 0 && (
          <Text style={styles.savings}>Tu Ahorro: ${totalSavings.toFixed(2)}</Text>
        )}
        <Text style={styles.total}>Total a abonar: ${total.toFixed(2)}</Text>

        <Text style={styles.textFooter}>Envianos este pedido por WhatsApp, Telegram o Email 
          para coordinar el pago y la entrega.
        </Text>

        <Text style={styles.textGracias}>Gracias por tu pedido!</Text>
      </Page>
    </Document>
  );
};

export default PDFDocument;