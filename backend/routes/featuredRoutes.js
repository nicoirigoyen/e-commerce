import express from 'express';
import FeaturedItem from '../models/featured.js';
import { isAuth, isAdmin } from '../utils.js';

const router = express.Router();

/**
 * GET /api/featured
 * Obtener ítems destacados activos (público)
 */
router.get('/', async (req, res) => {
  try {
    const items = await FeaturedItem.find({ active: true }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('Error al obtener ítems destacados:', error);
    res.status(500).json({ message: 'Error al obtener ítems destacados' });
  }
});

/**
 * POST /api/featured
 * Crear nuevo ítem destacado (privado, admin)
 */
router.post('/', isAuth, isAdmin, async (req, res) => {
  const { title, description, imageUrl, link, active } = req.body;

  if (!title || !imageUrl) {
    return res.status(400).json({ message: 'Título e imagen son obligatorios' });
  }

  try {
    const newItem = new FeaturedItem({
      title,
      description,
      imageUrl,
      link,
      active: active ?? true,
    });

    const saved = await newItem.save();
    res.status(201).send(saved);
  } catch (error) {
    console.error('Error al crear ítem destacado:', error);
    res.status(500).json({ message: 'Error al crear ítem destacado' });
  }
});

/**
 * DELETE /api/featured/:id
 * Eliminar ítem destacado por ID (privado, admin)
 */
router.delete('/:id', isAuth, isAdmin, async (req, res) => {
  try {
    const item = await FeaturedItem.findById(req.params.id);
    if (item) {
      await item.remove();
      res.send({ message: 'Ítem eliminado' });
    } else {
      res.status(404).send({ message: 'Ítem no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar ítem destacado:', error);
    res.status(500).json({ message: 'Error al eliminar ítem destacado' });
  }
});

export default router;
