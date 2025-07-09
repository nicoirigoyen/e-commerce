import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';

export default function FailureScreen() {
  return (
    <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <Helmet>
        <title>Pago fallido</title>
      </Helmet>

      <div
        className="p-4 shadow-sm text-center"
        style={{
          backgroundColor: 'rgba(255, 0, 0, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '400px',
          color: '#ff4d4d',
          animation: 'fadeIn 0.6s ease-in-out',
        }}
      >
        <h2 className="mb-3">¡Pago fallido!</h2>
        <p style={{ color: '#eee' }}>
          No se pudo procesar el pago. Podés intentar nuevamente o elegir otro método de pago.
        </p>

        <div className="d-grid gap-2 mt-4">
          <Link to="/payment">
            <Button variant="danger">Volver a métodos de pago</Button>
          </Link>
          <Link to="/">
            <Button variant="outline-light">Volver al inicio</Button>
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
