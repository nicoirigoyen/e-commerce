import express from 'express';
import { MercadoPagoConfig } from 'mercadopago';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

router.post('/create_preference', async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    const preference = {
      items: items.map((item) => ({
        title: item.name,
        quantity: item.quantity,
        unit_price: Number(item.price),
        currency_id: 'ARS',
      })),
      back_urls: {
        success: `http://localhost:3000/success`,
        failure: `http://localhost:3000/failure`,
        pending: `http://localhost:3000/pending`,
      },
      auto_return: 'approved',
      payer: {
        name: shippingAddress.fullName,
      },
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear la preferencia');
  }
});

export default router;
