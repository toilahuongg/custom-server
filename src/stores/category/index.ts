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
  parentId: types.maybeNull(types.optional(types.string, '')),
  createdAt: types.optional(types.string, ''),
  updatedAt: types.optional(types.string, ''),
})
  .volatile<{ loading: boolean }>(() => ({ loading: false }))
  .actions((self) => ({
    setLoading: (value: boolean) => { self.loading = value; },
    setTitle: (value: string) => { self.title = value; },
    setDescription: (value: string) => { self.description = value; },
    setParentId: (value: string) => { self.parentId = value; },
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
    getCategories: flow(function* ({ page, limit, s, parentId }) {
      try {
        const response = yield instance.get('/category', { params: { page, limit, s, parentId } });
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
        self.listCategory = cast(self.listCategory.filter((category) => category._id !== data._id));
      } catch (error) {
        console.log(error);
        throw (error);
      }
    }),
    deleteCategories: flow(function* () {
      try {
        const data = getSnapshot(self.selectCategories);
        yield instance.delete('/category/', { data });
        self.listCategory = cast(self.listCategory.filter((category) => !data.includes(category._id)));
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
        if (type === 'edit') {
          yield instance.put(`/category/${data._id}`, data);
          const idx = self.listCategory.findIndex((item) => item._id === data._id);
          if (idx !== -1) {
            if (self.listCategory[idx].parentId !== data.parentId && data.parentId !== null)
              self.listCategory.splice(idx, 1);
            else
              applySnapshot(self.listCategory[idx], data);
          }
        } else {
          const response = yield instance.post('/category', data);
          if (!data.parentId) self.listCategory.unshift(response.data);
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
    getCategoryById: (id: string) => {
      return self.listCategory.find((item) => item._id === id);
    },
    checkSelectCategory: (id: string) => {
      return self.selectCategories.includes(id);
    },
    checkSelectAll: () => {
      const listId = self.listCategory.map((item) => item._id);
      return self.selectCategories.length > 0 && self.selectCategories.length === listId.length;
    },
    getTreeCategories: (type = 'option'): Promise<any[]> => new Promise(async (resolve, reject) => {
      try {
        const response = await instance.get('/category/tree');
        const options = [];
        const addOptionToArray = (categories: any[], prefix = '') => {
          categories.forEach(({ _id, title, childrens }) => {
            if (type === 'checkbox') {
              const option = {
                label: title,
                prefix,
                value: _id,
              };
              options.push(option);
              if (childrens.length > 0) addOptionToArray(childrens, `${parseInt(prefix || '0') + 1}`);
            } else {
              if (self.detailCategory._id !== _id) {
                const option = {
                  label: prefix + ' ' + title,
                  value: _id,
                };
                options.push(option);
                if (childrens.length > 0) addOptionToArray(childrens, `${prefix}--`);
              } 
            }
            
          });
        };
        addOptionToArray(response.data);
        resolve(options);
      } catch (error) {
        reject(error);
      }
    }),
  }));

export interface ICategoryModel extends Instance<typeof CategoryModel> {}
export interface ICategoryModelOut extends SnapshotOut<typeof CategoryModel> {}

export interface ICategoryModels extends Instance<typeof CategoryModels> {}
export interface ICategoryModelsOut extends SnapshotOut<typeof CategoryModels> {}
