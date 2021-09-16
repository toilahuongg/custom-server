import { Context } from 'koa';
import * as fs from 'fs/promises';
import path from 'path';
import LibraryModel from '../models/library';
export const uploadSingle = async (ctx: Context) => {
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
  ctx.body = result;
};

export const getImages = async (ctx: Context) => {
  try {
    const { page, limit } = ctx.query;
    const l = parseInt(limit as string, 10) || 15;
    const p = parseInt(page as string, 10) > 0 ? parseInt(page as string, 10) - 1 : 0;
    const result = await LibraryModel.find().sort({ createdAt: -1 }).skip(p * l).limit(l)
      .lean();
    ctx.body = result;
  } catch (error) {
    console.log(error);
    ctx.status = 400;
    ctx.body = error;
  }
};