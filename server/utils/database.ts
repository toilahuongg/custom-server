import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const { M_CONNECT, M_USER, M_PWD } = process.env;
const database = async () => {
  const db = await mongoose.connect(M_CONNECT, {
    user: M_USER,
    pass: M_PWD,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  return db;
};
export default database;
