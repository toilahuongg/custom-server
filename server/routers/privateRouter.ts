import Router from 'koa-router';
import { verifyToken } from '../middlewares/verifyToken';
import { getInfo } from '../controllers/UserController';
import {
  postArticle,
  putArticle,
  deleteArticle,
  deleteArticles,
  swapArticle,
} from '../controllers/ArticleController';
import {
  deleteCategories,
  deleteCategory,
  postCategory,
  putCategory,
  swapCategory, 
} from '../controllers/CategoryController';

const router = new Router();
router.use(verifyToken);

// User
const userRouter = new Router();
userRouter.get('/get-info', getInfo);
router.use('/user', userRouter.routes());

// Article
const articleRouter = new Router();
articleRouter.post('/', postArticle);
articleRouter.put('/:id', putArticle);
articleRouter.delete('/:id', deleteArticle);
articleRouter.delete('/', deleteArticles);
articleRouter.post('/swap', swapArticle);
router.use('/article', articleRouter.routes());

// Category
const categoryRouter = new Router();
categoryRouter.post('/', postCategory);
categoryRouter.put('/:id', putCategory);
categoryRouter.delete('/:id', deleteCategory);
categoryRouter.delete('/', deleteCategories);
categoryRouter.post('/swap', swapCategory);
router.use('/category', categoryRouter.routes());

export default router;
