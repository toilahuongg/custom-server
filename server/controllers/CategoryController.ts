import { Context } from 'koa';
import { Types } from 'mongoose';
import slug from 'slug';
import CategoryModel from '../models/category';
import TCategory from '../models/category/type';

const treeCategories = async (parentId: string | null) => {
  const result = await CategoryModel.find({ parentId: parentId === 'parent' ? null : new Types.ObjectId(parentId as string) })
    .sort({ index: -1 })
    .lean();
  console.log(result);
  const data = await Promise.all(result.map(async (res: TCategory) => {
    const childrens = await treeCategories(res.parentId);
    return {
      ...res,
      childrens,
    };
  }));
  return data;
};

export const getCategoryByQuery = async (ctx: Context) => {
  try {
    const { page, limit, s, parentId } = ctx.query;
    const search: string = s as string || '';
    const l = parseInt(limit as string, 10) || 15;
    const p = parseInt(page as string, 10) > 0 ? parseInt(page as string, 10) - 1 : 0;
    // Neu parentId === null thì lấy tất cả ParentId = null (Category cha)
    // Nguoc lai thì lấy category theo parentId
    let result: TCategory[];
    if (!parentId) {
      result = await CategoryModel.find({ title: { $regex: `.*${search}.*` } })
        .sort({ index: -1 })
        .skip(p * l)
        .limit(l)
        .lean();
    } else {
      result = await CategoryModel.find({
        title: { $regex: `.*${search}.*` },
        parentId: parentId === 'parent' ? null : new Types.ObjectId(parentId as string),
      })
        .sort({ index: -1 })
        .skip(p * l)
        .limit(l)
        .lean();
    }

    ctx.body = result;
  } catch (error) {
    console.log(error);
    ctx.status = 400;
    ctx.body = error;
  }
};
export const getListCategoryParent = async (ctx: Context) => {
  try {
    const result = await treeCategories('parent');
    console.log(result);
    ctx.body = result;
  } catch (error) {
    console.log(error);
    ctx.status = 400;
    ctx.body = error;
  }
};
export const postCategory = async (ctx: Context) => {
  try {
    const { title, description, parentId, type } = ctx.request.body as TCategory;
    const result = await CategoryModel.create({
      title,
      description,
      parentId: new Types.ObjectId(parentId) || null,
      type,
      slug: slug(title),
    });
    ctx.body = result;
  } catch (error) {
    console.log(error);
    ctx.status = 400;
    ctx.body = error;
  }
};
