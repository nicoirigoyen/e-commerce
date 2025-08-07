import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';

export default function SuccessScreen() {
  return (
    <Container
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: '80vh' }}
    >
      <Helmet>
        <title>Pago exitoso</title>
      </Helmet>

      <div
        className="p-4 shadow-sm text-center"
        style={{
          backgroundColor: 'rgba(0, 230, 118, 0.05)', // verde suave translúcido
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '400px',
          color: '#00e676', // verde neón
          animation: 'fadeIn 0.6s ease-in-out',
        }}
      >
        <h2 className="mb-3">¡Gracias por tu compra!</h2>
        <p style={{ color: '#eee' }}>
          Tu pago fue procesado exitosamente. Pronto recibirás la confirmación por WhatsApp o correo electrónico.
        </p>

        <div className="d-grid gap-2 mt-4">
          <Link to="/">
            <Button variant="success">Volver al inicio</Button>
          </Link>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Container>
  );
}
