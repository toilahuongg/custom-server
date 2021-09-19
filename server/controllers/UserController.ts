import { Context } from 'koa';
import UserModel from '../models/user';

export const postUser = async (ctx: Context) => {
  try {
    if (ctx.request.header.toilahuong !== 'tt') throw new Error('Ban khong co quyen');
    const { fullname, password } = ctx.request.body;
    const result = await UserModel.create({ fullname, password });
    ctx.body = result;
  } catch (error) {
    console.log(error);
    ctx.status = 500;
    ctx.body = error;
  }
};

export const getUsers = async (ctx: Context) => {
  try {
    const result = await UserModel.find().lean();
    ctx.body = result;
  } catch (error) {
    console.log(error);
    ctx.status = 500;
    ctx.body = error;
  }
};

export const getUser = async (ctx: Context) => {
  try {
    const { id } = ctx.params;
    const result = await UserModel.findById(id).lean();
    ctx.body = result;
  } catch (error) {
    console.log(error);
    ctx.status = 500;
    ctx.body = error;
  }
};

export const checkUser = async (ctx: Context) => {
  try {
    const { password } = ctx.request.body;
    const result = await UserModel.findOne({ password });
    if (!result) throw new Error('Sai Ma');
    ctx.body = result;
  } catch (error) {
    console.log(error);
    ctx.status = 500;
    ctx.body = error;
  }
};
