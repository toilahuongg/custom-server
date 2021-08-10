import { Context } from 'koa';
import slug from 'slug';
import Article from '../models/article';
import TArticle from '../models/article/type';

export const getArticleByQuery = async (ctx: Context) => {
  try {
    const { page, limit, s } = ctx.query;
    const l = parseInt(limit as string, 10) || 15;
    const p = parseInt(page as string, 10) > 0 ? parseInt(page as string, 10) - 1 : 0;
    const result = await Article.find({ title: { $regex: `.*${s}.*` } }).sort({ index: -1 }).skip(p * l).limit(l)
      .lean();
    ctx.body = result;
  } catch (error) {
    console.log(error);
    ctx.status = 400;
    ctx.body = error;
  }
};

export const getArticle = async (ctx: Context) => {
  try {
    const { id } = ctx.params;
    const result = await Article.findById(id).lean();
    ctx.body = result;
  } catch (error) {
    console.log(error);
    ctx.status = 400;
    ctx.body = error;
  }
};

export const postArticle = async (ctx: Context) => {
  try {
    const { title, description, content } = ctx.request.body as TArticle;
    const result = await Article.create({
      title: title || '',
      description: description || '',
      content: content || '',
      slug: slug(title),
    });
    ctx.body = result;
  } catch (error) {
    console.log(error);
    ctx.status = 400;
    ctx.body = error;
  }
};

export const putArticle = async (ctx: Context) => {
  try {
    const { id } = ctx.params;
    const { title, description, content } = ctx.request.body as TArticle;
    const result = await Article.updateOne({ _id: id }, {
      title: title || '',
      description: description || '',
      content: content || '',
      slug: slug(title),
    });
    ctx.body = result;
  } catch (error) {
    console.log(error);
    ctx.status = 400;
    ctx.body = error;
  }
};

export const deleteArticle = async (ctx: Context) => {
  try {
    const { id } = ctx.params;
    const result = await Article.deleteOne({ _id: id });
    ctx.body = result;
  } catch (error) {
    console.log(error);
    ctx.status = 400;
    ctx.body = error;
  }
};

export const deleteArticles = async (ctx: Context) => {
  try {
    const listId = ctx.request.body as any;
    console.log(listId);
    await Promise.all(listId.map(async (id: string) => {
      await Article.deleteOne({ _id: id });
    }));
    ctx.body = 'ok';
  } catch (error) {
    console.log(error);
    ctx.status = 400;
    ctx.body = error;
  }
};

export const swapArticle = async (ctx: Context) => {
  try {
    const { articleOne, articleTwo } = ctx.request.body as any;

    await Article.updateOne({ _id: articleOne._id }, { index: articleTwo.index });
    await Article.updateOne({ _id: articleTwo._id }, { index: articleOne.index });

    ctx.body = true;
  } catch (error) {
    ctx.status = 400;
    ctx.body = error;
  }
};
