import express from 'express';
import Featured from '../models/featured.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await Featured.find({ active: true }).sort({ order: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener elementos destacados' });
  }
});

export default router;
