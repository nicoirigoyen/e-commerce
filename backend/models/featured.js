import mongoose from 'mongoose';

const featuredItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String, required: true },
    link: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const FeaturedItem = mongoose.model('FeaturedItem', featuredItemSchema);

export default FeaturedItem;
