import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CheckoutSteps from '../components/CheckoutSteps';
import { Store } from '../Store';

export default function PaymentMethodScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod, cartItems },
  } = state;

  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'MercadoPago'
  );

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);

    if (paymentMethodName === 'WhatsApp') {
      const productList = cartItems
        .map((item) => `- ${item.quantity}x ${item.name}`)
        .join('%0A');

      const total = cartItems
        .reduce((a, c) => a + c.price * c.quantity, 0)
        .toFixed(2);

      const mensaje = `Hola, quiero coordinar el pago de mi pedido:%0A${productList}%0A%0ATotal: $${total}%0A%0ADatos:%0ANombre: ${shippingAddress.fullName}%0ADirección: ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}`;

      const whatsappURL = `https://wa.me/5493512278898?text=${mensaje}`;
      window.open(whatsappURL, '_blank');
    }

    navigate('/placeorder');
  };

  return (
    <div
      className="p-4"
      style={{
        backgroundColor: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(8px)',
        borderRadius: '12px',
        color: '#eee',
        boxShadow: '0 0 10px rgba(0,255,255,0.1)',
      }}
    >
      <CheckoutSteps step1 step2 step3 />
      <Helmet>
        <title>Forma de pago</title>
      </Helmet>
      <div className="container small-container">
        <h1 className="my-3" style={{ color: '#58f0ff' }}>Forma de pago</h1>
        <Form onSubmit={submitHandler}>
          {/* MERCADO PAGO */}
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="MercadoPago"
              label="Mercado Pago"
              value="MercadoPago"
              checked={paymentMethodName === 'MercadoPago'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ color: '#eee' }}
            />
          </div>

          {/* OPCIONAL TARJETA - COMENTADO */}
          {/*
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="Tarjeta"
              label="Tarjeta de crédito/débito"
              value="Tarjeta"
              checked={paymentMethodName === 'Tarjeta'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ color: '#eee' }}
            />
          </div>
          */}

          {/* WHATSAPP */}
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="WhatsApp"
              label="Coordinar por WhatsApp"
              value="WhatsApp"
              checked={paymentMethodName === 'WhatsApp'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ color: '#eee' }}
            />
          </div>

          {/* BOTÓN */}
          <div className="mb-3">
            <Button
              type="submit"
              style={{
                backgroundColor: '#00c2ff',
                color: '#000',
                fontWeight: 'bold',
                borderRadius: '12px',
                padding: '10px 22px',
                fontSize: '1rem',
                transition: 'all 0.2s ease-in-out',
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.backgroundColor = '#00a8e0';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.backgroundColor = '#00c2ff';
              }}
            >
              Continuar
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
