import mongoose, { Schema } from 'mongoose';
import TTag from './type';

const TagSchema = new Schema<TTag>({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    index: true,
    unique: true,
  },
  type: { type: String },
  articles: [{ type: mongoose.Types.ObjectId, ref: 'Article' }],
}, { timestamps: true });
const TagModel = mongoose.model('Tag', TagSchema);
export default TagModel;
