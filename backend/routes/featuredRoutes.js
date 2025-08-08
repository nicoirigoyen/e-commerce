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

    if (!Array.isArray(items)) {
      return res.status(500).json({ message: 'Formato inesperado de datos.' });
    }

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

  if (!title?.trim() || !imageUrl?.trim()) {
    return res.status(400).json({ message: 'Título e imagen son obligatorios' });
  }

  try {
    const newItem = new FeaturedItem({
      title: title.trim(),
      description: description?.trim() || '',
      imageUrl: imageUrl.trim(),
      link: link?.trim() || '',
      active: active !== false, // por defecto true si no es false
    });

    const saved = await newItem.save();
    res.status(201).json(saved);
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

    if (!item) {
      return res.status(404).json({ message: 'Ítem no encontrado' });
    }

    await item.remove();
    res.json({ message: 'Ítem eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar ítem destacado:', error);
    res.status(500).json({ message: 'Error al eliminar ítem destacado' });
  }
});

export default router;
