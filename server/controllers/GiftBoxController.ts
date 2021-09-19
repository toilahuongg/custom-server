import { Context } from 'koa';
import GiftBoxModel from '../models/giftbox';
import UserModel from '../models/user';

export const getGiftBoxs = async (ctx: Context) => {
  try {
    const result = await GiftBoxModel.find({}, {
      status: 1,
      users: 1,
    }).lean();
    ctx.body = result;
  } catch (error) {
    console.log(error);
    ctx.status = 400;
    ctx.body = error;
  }
};

export const getGiftBox = async (ctx: Context) => {
  try {
    const { id } = ctx.params;
    const result = await GiftBoxModel.findById(id).lean();
    ctx.body = result;
  } catch (error) {
    console.log(error);
    ctx.status = 400;
    ctx.body = error;
  }
};

export const postGiftBox = async (ctx: Context) => {
  try {
    if (ctx.request.header.toilahuong !== 'tt') throw new Error('Ban khong co quyen');
    const { desc, image, status } = ctx.request.body;
    const result = await GiftBoxModel.create({ desc, image, status });
    ctx.body = result;
  } catch (error) {
    console.log(error);
    ctx.status = 400;
    ctx.body = error;
  }
};

export const openGiftBox = async (ctx: Context) => {
  try {
    const { id, userId } = ctx.request.body;
    console.log({ id, userId });
    const checkGiftbox = await GiftBoxModel.findById(id);
    if (checkGiftbox.status) throw new Error('Quà này đã mở mất rồi :v');
    const checkUser = await UserModel.findById(userId);
    console.log(checkUser);
    if (!checkUser) throw new Error('Bạn không có quyền');
    if (checkUser.giftbox) throw new Error('Ban đã mở quà rồi :)), tham lam thế');
    await UserModel.updateOne({ _id: userId }, { giftbox: id });
    const result = await GiftBoxModel.updateOne({ _id: id }, { status: true, user: userId });
    ctx.body = result;
  } catch (error) {
    console.log(error);
    ctx.status = 400;
    ctx.body = error;
  }
};
