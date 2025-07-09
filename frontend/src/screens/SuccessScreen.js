import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import Axios from 'axios';

export default function SuccessScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  useEffect(() => {
    const crearOrden = async () => {
      try {
        const { data } = await Axios.post(
          '/api/orders',
          {
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: 'MercadoPago',
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
          },
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        ctxDispatch({ type: 'CART_CLEAR' });
        localStorage.removeItem('cartItems');

        // WhatsApp con número de orden
        const mensaje = encodeURIComponent(
          `Hola, realicé una compra desde la web NiTecno. Mi número de orden es: ${data.order._id}. Gracias!`
        );
        window.open(`https://wa.me/543512278898?text=${mensaje}`, '_blank');

        toast.success('¡Orden creada correctamente!');
      } catch (err) {
        toast.error('Error al registrar la orden.');
        console.error(err);
      }
    };

    if (cart.cartItems.length > 0) {
      crearOrden();
    } else {
      navigate('/');
    }
  }, [cart, userInfo, navigate, ctxDispatch]);

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{
        minHeight: '80vh',
        padding: '2rem',
        backgroundColor: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(8px)',
        borderRadius: '16px',
        color: '#eee',
        boxShadow: '0 0 20px rgba(0,255,255,0.1)',
        animation: 'fadeIn 0.8s ease-in-out',
      }}
    >
      <Helmet>
        <title>Pago exitoso</title>
      </Helmet>
      <h1 style={{ color: '#00e676' }}>¡Gracias por tu compra!</h1>
      <p className="text-center mb-4" style={{ color: '#ccc', maxWidth: '500px' }}>
        Tu pago fue procesado exitosamente. Pronto recibirás la confirmación por WhatsApp o correo electrónico.
      </p>
      <Link
        to="/"
        className="btn"
        style={{
          backgroundColor: '#00c2ff',
          color: '#000',
          fontWeight: 'bold',
          borderRadius: '12px',
          padding: '10px 24px',
          textDecoration: 'none',
        }}
      >
        Volver al inicio
      </Link>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
