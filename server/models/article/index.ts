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
  tags: [{ type: mongoose.Types.ObjectId, ref: 'Tag' }],
  index: { type: Date, default: Date.now },
  slug: {
    type: String,
    index: true,
    unique: true,
  },
  isPublish: { type: Boolean },
}, { timestamps: true });

const ArticleModel = mongoose.model('Article', ArticleSchema);
export default ArticleModel;
