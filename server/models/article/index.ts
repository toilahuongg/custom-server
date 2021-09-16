import mongoose, { Schema } from 'mongoose';
import TArticle from './type';

const ArticleSchema = new Schema<TArticle>({
  title: {
    type: String,
    required: true,
  },
  description: { type: String },
  content: { type: String },
  categories: [{ type: mongoose.Types.ObjectId, ref: 'categories' }],
  index: { type: Date, default: Date.now },
  slug: {
    type: String,
    index: true,
    unique: true,
  },
}, { timestamps: true });

const ArticleModel = mongoose.models.article || mongoose.model<TArticle>('article', ArticleSchema);
export default ArticleModel;
