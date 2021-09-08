import Router from 'koa-router';
import {
  getArticle,
  getArticleByQuery,
} from '../controllers/ArticleController';
import { register, login } from '../controllers/UserController';

const router = new Router();

// Article
const articleRouter = new Router();
articleRouter.get('/', getArticleByQuery);
articleRouter.get('/:id', getArticle);
router.use('/article', articleRouter.routes());

// User
const userRouter = new Router();
userRouter.post('/login', login);
userRouter.post('/register', register);
router.use('/user', userRouter.routes());

export default router;
