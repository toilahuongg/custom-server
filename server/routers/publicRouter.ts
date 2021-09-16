import Router from 'koa-router';
import {
  getArticle,
  getArticleByQuery,
} from '../controllers/ArticleController';
import { register, login } from '../controllers/UserController';
import { getCategoryByQuery, getListCategoryParent } from '../controllers/CategoryController';
import { getImages } from '../controllers/LibraryController';

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
categoryRouter.get('/tree', getListCategoryParent);
router.use('/category', categoryRouter.routes());

// Library
const libraryRouter = new Router();
libraryRouter.get('/', getImages);
router.use('/library', libraryRouter.routes());

export default router;
