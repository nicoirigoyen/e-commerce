import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function PendingScreen() {
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
        <title>Pago pendiente</title>
      </Helmet>

      <h1 style={{ color: '#ffca28' }}>Tu pago está pendiente</h1>
      <p className="text-center mb-4" style={{ color: '#ccc', maxWidth: '500px' }}>
        Aún no hemos recibido la confirmación de tu pago. Ni bien se acredite, te avisaremos por WhatsApp o correo electrónico.
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
