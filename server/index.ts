import Koa, { Context } from 'koa';
import Router from 'koa-router';
import next from 'next';
import serve from 'koa-static';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'koa-bodyparser';
import routerApi from './routers';

dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 3000;
const { M_CONNECT, M_USER, M_PWD } = process.env;
const app = next({ dev });
const handle = app.getRequestHandler();

const run = async () => {
  try {
    await app.prepare();
    await mongoose.connect(M_CONNECT, {
      user: M_USER,
      pass: M_PWD,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });

    console.log('>> Mongodb Connected');
    const server = new Koa();
    const router = new Router();

    router.use(bodyParser());
    server.use(serve(`${__dirname}/public`));
    router.use('/api', routerApi.routes());
    console.log(router.stack.map((i) => i.path));
    router.all('(.*)', async (ctx: Context) => {
      await handle(ctx.req, ctx.res);
      ctx.respond = false;
    });

    server.use(router.allowedMethods());
    server.use(router.routes());

    server.listen(PORT, () => {
      console.log(`>> server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
run();
