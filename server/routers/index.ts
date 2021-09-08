import Router from 'koa-router';
import publicRouter from './publicRouter';
import privateRouter from './privateRouter';

const router = new Router();
router.use(publicRouter.routes());
router.use(privateRouter.routes());
export default router;
