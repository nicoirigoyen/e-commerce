import React from 'react';
import { Wallet } from '@mercadopago/sdk-react';

export default function MercadoPagoButton({ preferenceId }) {
  if (!preferenceId) return null;

  return (
    <div
      style={{
        maxWidth: '340px',
        margin: '20px auto',
        padding: '12px',
        backgroundColor: '#111827',
        borderRadius: '16px',
        boxShadow: '0 0 12px #00d4ff88',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Wallet
        initialization={{ preferenceId }}
        customization={{
          locale: 'es-AR',
          buttonLabel: 'Pagar con Mercado Pago',
          buttonSize: 'large',
          buttonShape: 'pill',
          theme: 'dark',
        }}
      />
    </div>
  );
}
