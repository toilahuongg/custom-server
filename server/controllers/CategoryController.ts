import ArticleModel from '../models/article';
import { Context } from 'koa';
import { Types } from 'mongoose';
import slug from 'slug';
import CategoryModel from '../models/category';
import TCategory from '../models/category/type';
type TListSortable = {
  _id: string;
  index: number;
};
const treeCategories = async (parentId: string | null) => {
  const result = await CategoryModel.find({ parentId: parentId === 'parent' ? null : parentId })
    .sort({ index: -1 })
    .lean();
  const data = await Promise.all(result.map(async (res: TCategory) => {
    const childrens = await treeCategories(res._id);
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
    const pId = parentId as string;
    const l = parseInt(limit as string, 10) || 15;
    const p = parseInt(page as string, 10) > 0 ? parseInt(page as string, 10) - 1 : 0;
    // Neu parentId === null thì lấy tất cả ParentId = null (Category cha)
    // Nguoc lai thì lấy category theo parentId
    let result: TCategory[];
    if (parentId === 'all') {
      result = await CategoryModel.find({ title: { $regex: `.*${search}.*`, $options: 'i' } })
        .sort({ index: -1 })
        .skip(p * l)
        .limit(l)
        .lean();
    } else {
      result = await CategoryModel.find({
        title: { $regex: `.*${search}.*`, $options: 'i' },
        parentId: !pId ? null : pId,
      })
        .sort({ index: -1 })
        .skip(p * l)
        .limit(l)
        .lean();
    }

    ctx.body = result;
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = { message: err.message };
  }
};
export const getListCategoryParent = async (ctx: Context) => {
  try {
    const result = await treeCategories('parent');
    ctx.body = result;
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = { message: err.message };
  }
};
export const postCategory = async (ctx: Context) => {
  try {
    const { title, description, parentId, type } = ctx.request.body as TCategory;
    const index = await CategoryModel.count();
    const result = await CategoryModel.create({
      title,
      description,
      parentId: !parentId ? null :  new Types.ObjectId(parentId),
      type,
      index: index + 1,
      slug: slug(title),
    });
    ctx.body = result;
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = { message: err.message };
  }
};

export const putCategory = async (ctx: Context) => {
  try {
    const { id } = ctx.params;
    const { title, description, parentId } = ctx.request.body as TCategory;
    const result = await CategoryModel.updateOne({ _id: id }, {
      title,
      description,
      parentId: !parentId ? null :  parentId,
      slug: slug(title),
    });
    ctx.body = result;
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = { message: err.message };
  }
};

export const deleteCategory = async (ctx: Context) => {
  try {
    const { id } = ctx.params;
    const category = await CategoryModel.findOne({ _id: id });
    await category.remove();
    await ArticleModel.updateMany({ _id: { $in: category.articles } }, { $pull: { categories: id } });
    ctx.body = true;
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = { message: err.message };
  }
};

export const deleteCategories = async (ctx: Context) => {
  try {
    const listId = ctx.request.body as any;
    for (const id of listId) {
      await CategoryModel.deleteOne({ _id: id });
    }
    ctx.body = 'ok';
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = { message: err.message };
  }
};

export const swapCategory = async (ctx: Context) => {
  try {
    const list = ctx.request.body as TListSortable[];
    console.log(list);
    for (const items of list) {
      await CategoryModel.updateOne({ _id: items[0]._id }, { index: items[1].index });
      await CategoryModel.updateOne({ _id: items[1]._id }, { index: items[0].index });
    }
    ctx.body = true;
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = { message: err.message };
  }
};