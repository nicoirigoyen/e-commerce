import { useEffect } from 'react';
import { Wallet } from '@mercadopago/sdk-react';

export default function CheckoutMP({ preferenceId }) {
  useEffect(() => {
    // Esta línea es opcional si querés manejar algo cuando se monte
  }, [preferenceId]);

  return (
    <div>
      {preferenceId ? (
        <Wallet initialization={{ preferenceId }} customization={{ texts: { valueProp: 'smart_option' } }} />
      ) : (
        <p>Cargando botón de pago...</p>
      )}
    </div>
  );
}
