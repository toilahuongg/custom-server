import Koa, { Context } from 'koa';
import Router from 'koa-router';
import next from 'next';
import serve from 'koa-static';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'koa-bodyparser';
import { Server, Socket } from 'socket.io';
import http from 'http';
import publicRouter from './routers/publicRouter';

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
    const sv = new Koa();
    const server = http.createServer(sv.callback());
    const io = new Server(server);
    io.on('connection', (socket: Socket) => {
      socket.on('open-gift', (data) => {
        console.log(socket.id, '=id');
        io.emit('open-gift', data);
      });
      socket.on('error', (data) => {
        console.log(socket.id, '=id');
        io.emit('error', data);
      });
    });
    sv.context.io = io;
    const router = new Router();
    router.use(bodyParser());
    sv.use(serve(`${__dirname}/static`));
    router.use(publicRouter.routes());
    router.all('(.*)', async (ctx: Context) => {
      await handle(ctx.req, ctx.res);
      ctx.respond = false;
    });

    sv.use(router.allowedMethods());
    sv.use(router.routes());

    server.listen(PORT, () => {
      console.log(`>> server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
run();
