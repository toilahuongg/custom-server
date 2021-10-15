import ArticleModel from '../models/article';
import { Context } from 'koa';
import slug from '../utils/slug';
import CategoryModel from '../models/category';
import TCategory from '../models/category/type';

type TListSortable = {
  _id: string;
  index: number;
};

export const getCategories = async (ctx: Context) => {
  try {
    const result = await CategoryModel.find().lean();
    ctx.body = result;
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = { message: err.message };
  }
};

export const postCategory = async (ctx: Context) => {
  try {
    const { title, description, parent, type } = ctx.request.body as TCategory;
    const index = await CategoryModel.count();
    const data: TCategory = {
      title,
      description,
      type,
      index: index + 1,
      slug: slug(title),
    };
    if (parent) data.parent = parent;
    const result = await CategoryModel.create(data);
    if (parent) await CategoryModel.updateOne({ _id: parent }, { $addToSet: { children: result._id } });
    ctx.body = result;
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = { message: err.message };
  }
};

export const putCategory = async (ctx: Context) => {
  try {
    const { id } = ctx.params;
    const { title, description, parent } = ctx.request.body as TCategory;
    const result = await CategoryModel.updateOne({ _id: id }, {
      title,
      description,
      parent: !parent ? null :  parent,
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
    if (!category.parent) await CategoryModel.updateMany({ parent: id }, { $unset: { parent: 1 } });
    else await CategoryModel.updateMany({ parent: id }, { parent: category.parent });
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
      const category = await CategoryModel.findOne({ _id: id });
      await category.remove();
      if (!category.parent) await CategoryModel.updateMany({ parent: id }, { $unset: { parent: 1 } });
      else await CategoryModel.updateMany({ parent: id }, { parent: category.parent });
    }
    ctx.body = true;
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