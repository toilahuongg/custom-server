import {
  applySnapshot, cast, flow, getSnapshot, Instance, SnapshotOut, types,
} from 'mobx-state-tree';
import instance from '../../helper/instance';

const CategoryModel = types.model({
  _id: types.optional(types.string, ''),
  title: types.optional(types.string, ''),
  description: types.optional(types.string, ''),
  type: types.optional(types.string, ''),
  index: types.optional(types.number, 0),
  parent: types.maybeNull(types.optional(types.string, '')),
  articles: types.array(types.optional(types.string, '')),
  slug: types.optional(types.string, ''),
  createdAt: types.optional(types.string, ''),
  updatedAt: types.optional(types.string, ''),
})
  .volatile<{ loading: boolean }>(() => ({ loading: false }))
  .actions((self) => ({
    setLoading: (value: boolean) => { self.loading = value; },
    setTitle: (value: string) => { self.title = value; },
    setDescription: (value: string) => { self.description = value; },
    setParent: (value: string) => { self.parent = value; },
    setType: (value: string) => { self.type = value; },
  }));
export const CategoryModels = types.model({
  detailCategory: types.optional(CategoryModel, {}),
  listCategory: types.array(CategoryModel),
  selectCategories: types.array(types.optional(types.string, '')),
  listSortable: types.array(types.array(types.model({
    _id: types.optional(types.string, ''),
    index: types.optional(types.number, 0),
  }))),
})
  .volatile<{ loading: boolean, showModal: boolean }>(() => ({ loading: false, showModal: false }))
  .actions((self) => ({
    setLoading: (value: boolean) => {
      self.loading = value;
    },
    setShowModal: (value: boolean) => {
      self.showModal = value;
    },
    setDetailCategory: (item) => {
      self.detailCategory = item;
    },
    getCategories: flow(function* () {
      try {
        const response = yield instance.get('/category');
        self.listCategory = response.data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }),
    deleteCategory: flow(function* () {
      try {
        const data = getSnapshot(self.detailCategory);
        yield instance.delete(`/category/${data._id}`);
        self.listCategory = cast(self.listCategory.filter((category) => {
          if (category.parent === data._id) category.setParent(data.parent);
          return category._id !== data._id;
        }));
      } catch (error) {
        console.log(error);
        throw (error);
      }
    }),
    deleteCategories: flow(function* () {
      try {
        const data = getSnapshot(self.selectCategories);
        yield instance.delete('/category/', { data });
        self.listCategory = cast(self.listCategory.filter((category) => {
          const idx = data.findIndex((id) => id === category.parent);
          if (idx >= 0) {
            const current = self.listCategory.find(({ _id }) => _id === data[idx]);
            category.setParent(current.parent);
          }
          return !data.includes(category._id);
        }));
        self.selectCategories = cast([]);
      } catch (error) {
        console.log(error);
        throw (error);
      }
    }),
    cloneCategory: flow(function* (id: string) {
      try {
        const data = { ...self.listCategory.find((item) => item._id === id) };
        data.title += ' (Sao chép)';
        const response = yield instance.post('/category', data);
        self.listCategory.unshift(response.data);
      } catch (error) {
        console.error(error);
        if (error.response) throw error.response.data;
        else throw error;
      }
    }),
    actionCategory: flow(function* (type?: string) {
      try {
        const data = getSnapshot(self.detailCategory);
        const { title, description, type: t, parent  } = data;
        if (type === 'edit') {
          yield instance.put(`/category/${data._id}`, { title, description, type: t, parent  });
          const idx = self.listCategory.findIndex((item) => item._id === data._id);
          if (idx >= 0) applySnapshot(self.listCategory[idx], data);
        } else {
          const response = yield instance.post('/category', { title, description, type: t, parent  });
          self.listCategory.unshift(response.data);
        }
      } catch (error) {
        console.error(error);
        if (error.response) throw error.response.data;
        else throw error;
      }
    }),
    addIdToListSortable: ({ oldIndex, newIndex }) => {
      const oldCategory = { ...self.listCategory[oldIndex] };
      const newCategory = { ...self.listCategory[newIndex] };
      self.listCategory[oldIndex] = newCategory;
      self.listCategory[newIndex] = oldCategory;
      self.listSortable.push([
        {
          _id: oldCategory._id,
          index: oldCategory.index,
        },
        {
          _id: newCategory._id,
          index: newCategory.index,
        },
      ]);
    },
    sortCategory: flow(function* () {
      try {
        yield instance.post('/category/swap', self.listSortable);
      } catch (error) {
        console.error(error);
        if (error.response) throw error.response.data;
        else throw error;
      }
    }),
    actionSelectCategories: (type: string, id?: string) => {
      if (type === 'select-all') {
        const listId = self.listCategory.map((item) => item._id);
        if (self.selectCategories.length === listId.length) self.selectCategories = cast([]);
        else self.selectCategories = cast(listId);
      } else {
        const index = self.selectCategories.indexOf(id);
        if (index === -1) self.selectCategories.push(id);
        else self.selectCategories.splice(index, 1);
      }
    },
  }))
  .views((self) => ({
    getListCategory: () => {
      return getSnapshot(self.listCategory);
    },
    getCategoryById: (id: string) => {
      return getSnapshot(self.listCategory).find((item) => item._id === id);
    },
    getCategoryByType: (type: string) => {
      return getSnapshot(self.listCategory).filter((item) => item.type === type);
    },
    countCategory: () => {
      return getSnapshot(self.listCategory).length;
    },
    checkSelectCategory: (id: string) => {
      return self.selectCategories.includes(id);
    },
    checkSelectAll: () => {
      const listId = self.listCategory.map((item) => item._id);
      return self.selectCategories.length > 0 && self.selectCategories.length === listId.length;
    },
  }));

export interface ICategoryModel extends Instance<typeof CategoryModel> {}
export interface ICategoryModelOut extends SnapshotOut<typeof CategoryModel> {}

export interface ICategoryModels extends Instance<typeof CategoryModels> {}
export interface ICategoryModelsOut extends SnapshotOut<typeof CategoryModels> {}
