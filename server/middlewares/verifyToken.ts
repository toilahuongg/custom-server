import { Context } from 'koa';
import jwt from 'jsonwebtoken';

export const verifyToken = async (ctx: Context, next) => {
  try {
    const authHeader = ctx.headers.authorization;
    if (!authHeader) throw Error('Unauthorized');
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    ctx.user = decoded.data.username;
    await next();
  } catch (err) {
    console.log(err);
    ctx.status = 401;
    ctx.body = err;
  }
};
