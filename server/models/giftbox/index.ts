import mongoose, { Schema } from 'mongoose';
import TGiftBox from './type';

const GiftBoxSchema = new Schema<TGiftBox>({
  content: { type: String },
  price: { type: String },
  status: { type: Boolean },
  user: { type: mongoose.Types.ObjectId, ref: 'users' },
}, { timestamps: true });

const GiftBox = mongoose.models.giftbox || mongoose.model<TGiftBox>('giftbox', GiftBoxSchema);
export default GiftBox;
