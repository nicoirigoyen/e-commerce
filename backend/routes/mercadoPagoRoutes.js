import express from 'express';
import dotenv from 'dotenv';

const router = express.Router();
dotenv.config();

// Usamos fetch nativo en Node.js 18+
const isProd = process.env.NODE_ENV === 'production';

const ACCESS_TOKEN = isProd 
  ? process.env.MERCADOPAGO_ACCESS_TOKEN_PROD
  : process.env.MERCADOPAGO_ACCESS_TOKEN_SANDBOX;

router.post('/create_preference', async (req, res) => {
  try {
    const formattedItems = req.body.items.map((item) => ({
      title: item.name || item.title || 'Producto',
      quantity: Number(item.quantity) || 1,
      unit_price: Number(item.price) || Number(item.unit_price) || 0,
      currency_id: item.currency_id || 'ARS',
    }));

    const payload = {
      items: formattedItems,
      back_urls: {
        success: 'http://localhost:3000/success',
        failure: 'http://localhost:3000/failure',
        pending: 'http://localhost:3000/pending',
      },
      //auto_return: 'approved',
      notification_url: 'http://localhost:5001/api/payments/webhook',
    };

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error MP API:', data);
      return res.status(response.status).json(data);
    }

    res.json(data); // Enviamos `init_point` al frontend
  } catch (error) {
    console.error('Error creando preferencia Mercado Pago:', error);
    res.status(500).json({ error: 'Error interno al crear preferencia' });
  }
});

export default router;
