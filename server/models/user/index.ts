import mongoose, { Schema } from 'mongoose';
import TUser from './type';

const UserSchema = new Schema<TUser>({
  fullname: { type: String },
  password: { type: String, unique: true },
  giftbox: { type: mongoose.Types.ObjectId, ref: 'giftboxes' },
}, { timestamps: true });

const UserModel = mongoose.models.user || mongoose.model<TUser>('user', UserSchema);
export default UserModel;
