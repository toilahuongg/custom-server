import mongoose, { Schema } from 'mongoose';
import TCategory from './type';

const CategorySchema = new Schema<TCategory>({
  title: {
    type: String,
    required: true,
  },
  description: { type: String },
  type: { type: String },
}, { timestamps: true });
const CategoryModel = mongoose.models.category || mongoose.model('category', CategorySchema);
export default CategoryModel;
