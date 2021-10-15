import ArticleModel from '../models/article';
import { Context } from 'koa';
import slug from '../utils/slug';
import TagModel from '../models/tag';
import TTag from '../models/tag/type';

export const getTags = async (ctx: Context) => {
  try {
    const result = await TagModel.find().lean();
    ctx.body = result;
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = { message: err.message };
  }
};
export const postTag = async (ctx: Context) => {
  try {
    const { title, type } = ctx.request.body as TTag;
    const result = await TagModel.create({
      title,
      type,
      slug: slug(title),
    });
    ctx.body = result;
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = { message: err.message };
  }
};

export const putTag = async (ctx: Context) => {
  try {
    const { id } = ctx.params;
    const { title, type } = ctx.request.body as TTag;
    const result = await TagModel.updateOne({ _id: id }, {
      title,
      type,
      slug: slug(title),
    });
    ctx.body = result;
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = { message: err.message };
  }
};

export const deleteTag = async (ctx: Context) => {
  try {
    const { id } = ctx.params;
    const tag = await TagModel.findOne({ _id: id });
    await tag.remove();
    await ArticleModel.updateMany({ _id: { $in: tag.articles } }, { $pull: { categories: id } });
    ctx.body = true;
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = { message: err.message };
  }
};

export const deleteTags = async (ctx: Context) => {
  try {
    const listId = ctx.request.body as any;
    for (const id of listId) {
      await TagModel.deleteOne({ _id: id });
    }
    ctx.body = 'ok';
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = { message: err.message };
  }
};
