import mongoose, { Schema } from 'mongoose';
import TArticle from './type';

const ArticleSchema = new Schema<TArticle>({
  title: {
    type: String,
    required: true,
  },
  featuredImage: { type: mongoose.Types.ObjectId, ref: 'Library' },
  description: { type: String },
  content: { type: String },
  categories: [{ type: mongoose.Types.ObjectId, ref: 'Category' }],
  index: { type: Date, default: Date.now },
  slug: {
    type: String,
    index: true,
    unique: true,
  },
}, { timestamps: true });

const ArticleModel = mongoose.model<TArticle>('Article', ArticleSchema);
export default ArticleModel;
