import {
  applySnapshot, cast, flow, getSnapshot, Instance, SnapshotOut, types,
} from 'mobx-state-tree';
import instance from '../../helper/instance';

export const ArticleModel = types.model({
  _id: types.optional(types.string, ''),
  title: types.optional(types.string, ''),
  featuredImage: types.optional(types.string, ''),
  description: types.optional(types.string, ''),
  content: types.optional(types.string, ''),
  index: types.optional(types.string, ''),
  slug: types.optional(types.string, ''),
  categories: types.array(types.optional(types.string, '')),
  tags: types.array(types.optional(types.string, '')),
  createdAt: types.optional(types.string, ''),
  updatedAt: types.optional(types.string, ''),
})
  .volatile<{ loading: boolean }>(() => ({ loading: false }))
  .actions((self) => ({
    setLoading: (value: boolean) => {
      self.loading = value;
    },
    setTitle: (value: string) => { self.title = value; },
    setFeaturedImage: (value: string) => { self.featuredImage = value; },
    setDescription: (value: string) => { self.description = value; },
    setContent: (value: string) => { self.content = value; },
    selectCategory(id: string) {
      const idx = self.categories.indexOf(id);
      if (idx >= 0) self.categories.splice(idx, 1);
      else self.categories.push(id);
    },
    setTags(ids: string[]) {
      self.tags = cast(ids);
    },
  }))
  .views((self) => ({
    checkCategory(id: string) {
      return self.categories.includes(id);
    },
  }));

export const ArticleModels = types.model({
  detailArticle: types.optional(ArticleModel, {}),
  listArticle: types.array(ArticleModel),
  selectArticles: types.array(types.optional(types.string, '')),
})
  .volatile<{ loading: boolean }>(() => ({ loading: false }))
  .actions((self) => ({
    setLoading: (value: boolean) => {
      self.loading = value;
    },
    getArticles: flow(function* (params) {
      try {
        const response = yield instance.get('/article', { params });
        self.listArticle = response.data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }),
    actionArticle: flow(function* (type?: string) {
      try {
        const data = { ...getSnapshot(self.detailArticle) };
        if (type === 'edit') {
          yield instance.put(`/article/${data._id}`, data);
          const idx = self.listArticle.findIndex((item) => item._id === data._id);
          if (idx !== -1) applySnapshot(self.listArticle[idx], data);
        } else {
          const response = yield instance.post('/article', data);
          self.listArticle.unshift(response.data);
        }
      } catch (error) {
        console.error(error);
        if (error.response) throw error.response.data;
        else throw error;
      }
    }),
    deleteArticle: flow(function* () {
      try {
        const data = getSnapshot(self.detailArticle);
        yield instance.delete(`/article/${data._id}`);
        self.listArticle = cast(self.listArticle.filter((article) => article._id !== data._id));
      } catch (error) {
        console.log(error);
        throw (error);
      }
    }),
    deleteArticles: flow(function* () {
      try {
        const data = getSnapshot(self.selectArticles);
        yield instance.delete('/article/', { data });
        self.listArticle = cast(self.listArticle.filter((article) => !data.includes(article._id)));
        self.selectArticles = cast([]);
      } catch (error) {
        console.log(error);
        throw (error);
      }
    }),
    cloneArticle: flow(function* (id: string) {
      try {
        const data = { ...self.listArticle.find((item) => item._id === id) };
        data.title += ' (Sao chép)';
        const response = yield instance.post('/article', data);
        self.listArticle.unshift(response.data);
      } catch (error) {
        console.error(error);
        if (error.response) throw error.response.data;
        else throw error;
      }
    }),
    sortArticle: flow(function* (oldIndex: number, newIndex: number) {
      try {
        const articleOne = getSnapshot(self.listArticle[oldIndex]);
        const articleTwo = getSnapshot(self.listArticle[newIndex]);
        self.listArticle[oldIndex].index = articleTwo.index;
        self.listArticle[newIndex].index = articleOne.index;
        yield instance.post('/article/swap', {
          articleOne: { _id: articleOne._id, index: articleOne.index },
          articleTwo: { _id: articleTwo._id, index: articleTwo.index },
        });
      } catch (error) {
        console.error(error);
        if (error.response) throw error.response.data;
        else throw error;
      }
    }),
    actionSelectArticles: (type: string, id?: string) => {
      if (type === 'select-all') {
        const listId = self.listArticle.map((item) => item._id);
        if (self.selectArticles.length === listId.length) self.selectArticles = cast([]);
        else self.selectArticles = cast(listId);
      } else {
        const index = self.selectArticles.indexOf(id);
        if (index === -1) self.selectArticles.push(id);
        else self.selectArticles.splice(index, 1);
      }
    },
  })).views((self) => ({
    getArticleById: (id: string) => {
      return self.listArticle.find((item) => item._id === id);
    },
    checkSelectArticle: (id: string) => {
      return self.selectArticles.includes(id);
    },
    checkSelectAll: () => {
      const listId = self.listArticle.map((item) => item._id);
      return self.selectArticles.length > 0 && self.selectArticles.length === listId.length;
    },
  }));
export interface IArticleModel extends Instance<typeof ArticleModel> {}
export interface IArticleModelOut extends SnapshotOut<typeof ArticleModel> {}

export interface IArticleModels extends Instance<typeof ArticleModels> {}
export interface IArticleModelsOut extends SnapshotOut<typeof ArticleModels> {}
