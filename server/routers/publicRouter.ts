import Router from 'koa-router';
import {
  getArticle,
  getArticleByQuery,
} from '../controllers/ArticleController';
import { register, login } from '../controllers/UserController';
import { getCategoryByQuery, getListCategoryParent } from '../controllers/CategoryController';

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

// Category
const categoryRouter = new Router();
categoryRouter.get('/', getCategoryByQuery);
categoryRouter.get('/parent', getListCategoryParent);
router.use('/category', categoryRouter.routes());

export default router;
