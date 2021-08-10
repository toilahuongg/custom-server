import Router from 'koa-router';
import {
  getArticle,
  getArticleByQuery,
  postArticle,
  putArticle,
  deleteArticle,
  deleteArticles,
  swapArticle,
} from '../controllers/ArticleController';
import { postCategory } from '../controllers/CategoryController';

const router = new Router();

router.prefix('/api');

const articleRouter = new Router();
articleRouter.get('/', getArticleByQuery);
articleRouter.post('/', postArticle);
articleRouter.get('/:id', getArticle);
articleRouter.put('/:id', putArticle);
articleRouter.delete('/:id', deleteArticle);
articleRouter.delete('/', deleteArticles);
articleRouter.post('/swap', swapArticle);
router.use('/article', articleRouter.routes());

const categoryRouter = new Router();
categoryRouter.post('/', postCategory);
router.use('/category', categoryRouter.routes());

export default router;
