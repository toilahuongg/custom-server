import mongoose, { Schema } from 'mongoose';
import TLibrary from './type';

const LibrarySchema = new Schema<TLibrary>({
  url: {
    type: String,
    required: true,
  },
  type: { type: String },
  size: { type: String },
  width: {
    type: Number,
    defaultValue: 0,
  },
  height: {
    type: Number,
    defaultValue: 0,
  },
  articles: [{ type: mongoose.Types.ObjectId, ref: 'articles' }],
  categories: [{ type: mongoose.Types.ObjectId, ref: 'categories' }],
}, { timestamps: true });
const LibraryModel = mongoose.models.library || mongoose.model('library', LibrarySchema);
export default LibraryModel;