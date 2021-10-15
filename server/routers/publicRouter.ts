import Router from 'koa-router';
import {
  getArticle,
  getArticleByQuery,
} from '../controllers/ArticleController';
import { register, login } from '../controllers/UserController';
import { getCategories } from '../controllers/CategoryController';
import { getTags } from '../controllers/TagController';
import { getImages, getImage } from '../controllers/LibraryController';

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
categoryRouter.get('/', getCategories);
router.use('/category', categoryRouter.routes());

// Tag
const tagRouter = new Router();
tagRouter.get('/', getTags);
router.use('/tag', tagRouter.routes());

// Library
const libraryRouter = new Router();
libraryRouter.get('/', getImages);
libraryRouter.get('/:id', getImage);
router.use('/library', libraryRouter.routes());

export default router;
