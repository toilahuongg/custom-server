import CategoryModel from '../models/category';
import { Context } from 'koa';
import Article from '../models/article';
import TArticle from '../models/article/type';
import slug from '../utils/slug';
import TagModel from '../models/tag';

export const getArticleByQuery = async (ctx: Context) => {
  try {
    const { page, limit, s, category } = ctx.query;
    const search: string = s as string || '';
    const cat: string = category as string || '';
    const l = parseInt(limit as string, 10) || 15;
    const p = parseInt(page as string, 10) > 0 ? parseInt(page as string, 10) - 1 : 0;
    let result: TArticle[] = [];
    if (!cat) result = await Article.find({ title: { $regex: `.*${search}.*`, $options: 'i' } }).sort({ index: -1 }).skip(p * l).limit(l).lean();
    else result = await Article.find({ title: { $regex: `.*${search}.*`, $options: 'i' }, category: cat }).sort({ index: -1 }).skip(p * l).limit(l).lean();
    ctx.body = result;
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = { message: err.message };
  }
};

export const getArticle = async (ctx: Context) => {
  try {
    const { id } = ctx.params;
    const result = await Article.findById(id).lean();
    ctx.body = result;
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = { message: err.message };
  }
};

export const postArticle = async (ctx: Context) => {
  try {
    const {
      title, featuredImage, description, content, categories, tags, 
    } = ctx.request.body as TArticle;
    const result = await Article.create({
      title: title || '',
      featuredImage: featuredImage || null,
      description: description || '',
      content: content || '',
      categories: categories,
      tags: tags,
      slug: slug(title),
    });
    await CategoryModel.updateMany({ _id: { $in: categories } }, { $push: { articles: result._id } });
    ctx.body = result;
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = { message: err.message };
  }
};

export const putArticle = async (ctx: Context) => {
  try {
    const { id } = ctx.params;
    const {
      title, featuredImage, description, content, categories, tags,
    } = ctx.request.body as TArticle;
    const result = await Article.updateOne({ _id: id }, {
      title: title || '',
      featuredImage: featuredImage || null,
      description: description || '',
      content: content || '',
      slug: slug(title),
      categories: categories,
      tags: tags,
    });
    await CategoryModel.updateMany({ _id: { $in: categories } }, { $addToSet: { articles: id } });
    ctx.body = result;
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = { message: err.message };
  }
};

export const deleteArticle = async (ctx: Context) => {
  try {
    const { id } = ctx.params;
    const article = await Article.findOne({ _id: id });
    await article.remove();
    await CategoryModel.updateMany({ _id: { $in: article.categories } }, { $pull: { articles: article._id } });
    await TagModel.updateMany({ _id: { $in: article.tags } }, { $pull: { articles: article._id } });
    ctx.body = true;
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = { message: err.message };
  }
};

export const deleteArticles = async (ctx: Context) => {
  try {
    const listId = ctx.request.body as any;
    await Promise.all(listId.map(async (id: string) => {
      const article = await Article.findOne({ _id: id });
      await article.remove();
      await CategoryModel.updateMany({ _id: { $in: article.categories } }, { $pull: { articles: article._id } });
      await TagModel.updateMany({ _id: { $in: article.tags } }, { $pull: { articles: article._id } });
    }));
    ctx.body = true;
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = { message: err.message };
  }
};

export const swapArticle = async (ctx: Context) => {
  try {
    const { articleOne, articleTwo } = ctx.request.body as any;

    await Article.updateOne({ _id: articleOne._id }, { index: articleTwo.index });
    await Article.updateOne({ _id: articleTwo._id }, { index: articleOne.index });

    ctx.body = true;
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = { message: err.message };
  }
};
