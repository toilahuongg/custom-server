import Router from 'koa-router';
import {
  getGiftBox,
  getGiftBoxs,
  openGiftBox,
  postGiftBox,
} from '../controllers/GiftBoxController';

import {
  getUser,
  getUsers,
  postUser,
  checkUser,
} from '../controllers/UserController';

const router = new Router();

router.prefix('/api');

const giftboxRouter = new Router();
giftboxRouter.get('/', getGiftBoxs);
giftboxRouter.post('/', postGiftBox);
giftboxRouter.get('/:id', getGiftBox);
giftboxRouter.post('/open', openGiftBox);
router.use('/gift-box', giftboxRouter.routes());

const userRouter = new Router();
userRouter.get('/', getUsers);
userRouter.post('/', postUser);
userRouter.post('/check', checkUser);
userRouter.get('/:id', getUser);
router.use('/user', userRouter.routes());
export default router;
