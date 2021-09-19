import mongoose, { Schema } from 'mongoose';
import TGiftBox from './type';

const GiftBoxSchema = new Schema<TGiftBox>({
  desc: { type: String },
  image: { type: String },
  status: { type: Boolean },
  user: { type: mongoose.Types.ObjectId },
}, { timestamps: true });

const GiftBox = mongoose.models.giftbox || mongoose.model<TGiftBox>('giftbox', GiftBoxSchema);
export default GiftBox;
