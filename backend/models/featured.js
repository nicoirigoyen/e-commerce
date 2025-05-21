// models/Featured.js
import mongoose from 'mongoose';

const featuredSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String, required: true },
    link: { type: String },  // Puede ser interno o externo
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },  // Para ordenar si querés
  },
  {
    timestamps: true,
  }
);

const Featured = mongoose.model('Featured', featuredSchema);
export default Featured;
