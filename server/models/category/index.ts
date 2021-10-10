import mongoose, { Schema } from 'mongoose';
import TCategory from './type';

const CategorySchema = new Schema<TCategory>({
  title: {
    type: String,
    required: true,
  },
  description: { type: String },
  parentId: { type: mongoose.Types.ObjectId, transform: (v: any) => (v == null ? '' : v) },
  slug: {
    type: String,
    index: true,
    unique: true,
  },
  articles: [{ type: mongoose.Types.ObjectId, ref: 'Article' }],
  index: { type: Number, unique: false },
  type: { type: String },
}, { timestamps: true });
const CategoryModel = mongoose.model('Category', CategorySchema);
export default CategoryModel;
