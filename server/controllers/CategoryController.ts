import { Context } from 'koa';
import CategoryModel from '../models/category';
import TCategory from '../models/category/type';

export const postCategory = async (ctx: Context) => {
  try {
    const { title, description, parentId, type } = ctx.request.body as TCategory;
    const result = await CategoryModel.create({ title, description, parentId, type });
    ctx.body = result;
  } catch (error) {
    console.log(error);
    ctx.status = 400;
    ctx.body = error;
  }
};
