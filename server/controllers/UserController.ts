import { Context } from 'koa';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user';
import TUser from '../models/user/type';

export const login = async (ctx: Context) => {
  try {
    const { username, password } = ctx.request.body as TUser;
    const result = await UserModel.findOne({ username });
    console.log(result);
    if (!result) throw new Error('Unauthorized');
    const match = bcrypt.compareSync(password, result.password);
    if (!match) throw new Error('Unauthorized');
    const token = jwt.sign({ data: { username } }, process.env.JWT_SECRET, { expiresIn: 24 * 60 * 60 });
    ctx.body = token;
  } catch (err) {
    ctx.status = err.statusCode || err.status || 401;
    ctx.body = { message: err.message };
  }
};

export const register = async (ctx: Context) => {
  try {
    const { username, password } = ctx.request.body as TUser;
    const hashPassword = bcrypt.hashSync(password, 10);
    const result = await UserModel.create({ username, password: hashPassword });
    ctx.body = result;
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = { message: err.message };
  }
};

export const getInfo = async (ctx: Context) => {
  try {
    const result = await UserModel.findOne({ username: ctx.user });
    const { _id, username } = result;
    ctx.body = { _id, username };
  } catch (err) {
    ctx.status = err.statusCode || err.status || 401;
    ctx.body = { message: err.message };
  }
};
