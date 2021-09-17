import { Context } from 'koa';
import * as fs from 'fs/promises';
import path from 'path';
import LibraryModel from '../models/library';
const getCountLibrary = async (data) => {
  const count = await LibraryModel.count();
  return [
    data, count,
  ];
};
export const uploadSingle = async (ctx: Context) => {
  try {
    const { width, height, size } = ctx.request.body as any;
    const d = new Date();
    const n = d.getTime();
    const fileName = n + '-' + ctx.file.originalname;
    const filePath = path.resolve(__dirname, `../public/images/${fileName}`);
    await fs.writeFile(filePath, ctx.file.buffer);
    const result = await LibraryModel.create({
      url: `${ctx.request.header.origin}/images/${fileName}`,
      width,
      height,
      size,
      type: ctx.file.mimeType,
    });
    ctx.body = await getCountLibrary(result);
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = { message: err.message };
  }
};

export const getImages = async (ctx: Context) => {
  try {
    const { page, limit } = ctx.query;
    const l = parseInt(limit as string, 10) || 15;
    const p = parseInt(page as string, 10) > 0 ? parseInt(page as string, 10) - 1 : 0;
    const result = await LibraryModel.find().sort({ createdAt: -1 }).skip(p * l).limit(l)
      .lean();
    ctx.body = await getCountLibrary(result);
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = { message: err.message };
  }
};

export const getImage = async (ctx: Context) => {
  try {
    const { id } = ctx.params;
    const result = await LibraryModel.findById(id).lean();
    ctx.body = await getCountLibrary(result);
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = { message: err.message };
  }
};

export const removeImage = async (ctx: Context) => {
  try {
    const { id } = ctx.params;
    const image = await LibraryModel.findById(id);
    const spl = image.url.split('/');
    const filePath = path.resolve(__dirname, `../public/images/${spl[spl.length - 1]}`);
    await fs.unlink(filePath);
    ctx.body = await getCountLibrary(true);
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = { message: err.message };
  }
};