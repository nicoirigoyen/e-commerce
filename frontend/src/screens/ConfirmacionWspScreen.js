import React, { useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';
import { Button } from 'react-bootstrap';

export default function ConfirmacionWspScreen() {
  const { state } = useContext(Store);
  const {
    cart: { shippingAddress, cartItems },
  } = state;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const productList = cartItems
    .map((item) => `- ${item.quantity}x ${item.name}`)
    .join('%0A');

  const total = cartItems
    .reduce((a, c) => a + c.price * c.quantity, 0)
    .toFixed(2);

  const mensaje = `Hola, quiero coordinar el pago de mi pedido:%0A${productList}%0A%0ATotal: $${total}%0A%0ADatos:%0ANombre: ${shippingAddress.fullName}%0ADirección: ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}`;
  const whatsappURL = `https://wa.me/5493518684217?text=${mensaje}`;

  return (
    <div
      className="p-4"
      style={{
        backgroundColor: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(8px)',
        borderRadius: '12px',
        color: '#eee',
        boxShadow: '0 0 10px rgba(0,255,255,0.1)',
        textAlign: 'center',
      }}
    >
      <Helmet>
        <title>Confirmar por WhatsApp</title>
      </Helmet>
      <h2 style={{ color: '#00c2ff', marginBottom: '20px' }}>
        ¡Tu pedido está casi listo!
      </h2>
      <p>
        Para finalizar, contactanos por WhatsApp y coordinamos el pago y envío.
      </p>
      <Button
        variant="success"
        onClick={() => window.open(whatsappURL, '_blank')}
        style={{
          backgroundColor: '#25D366',
          border: 'none',
          fontSize: '1.1rem',
          padding: '12px 24px',
          borderRadius: '10px',
          marginTop: '20px',
        }}
      >
        Enviar mensaje por WhatsApp
      </Button>
    </div>
  );
}
