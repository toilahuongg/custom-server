import mongoose, { Schema } from 'mongoose';
import TUser from './type';

const UserSchema = new Schema<TUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: { type: String },
}, { timestamps: true });
const UserModel = mongoose.models.users || mongoose.model('users', UserSchema);
export default UserModel;
