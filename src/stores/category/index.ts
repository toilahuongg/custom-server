import {
  applySnapshot, flow, getSnapshot, Instance, SnapshotOut, types,
} from 'mobx-state-tree';
import instance from '../../helper/instance';

const CategoryModel = types.model({
  _id: types.optional(types.string, ''),
  title: types.optional(types.string, ''),
  description: types.optional(types.string, ''),
  type: types.optional(types.string, ''),
  createdAt: types.optional(types.string, ''),
  updatedAt: types.optional(types.string, ''),
})
  .volatile<{ loading: boolean }>(() => ({ loading: false }))
  .actions((self) => ({
    setLoading: (value: boolean) => { self.loading = value; },
    setTitle: (value: string) => { self.title = value; },
    setDescription: (value: string) => { self.description = value; },
    setType: (value: string) => { self.type = value; },
  }));
export const CategoryModels = types.model({
  detailCategory: types.optional(CategoryModel, {}),
  listCategory: types.array(CategoryModel),
})
  .volatile<{ loading: boolean }>(() => ({ loading: false }))
  .actions((self) => ({
    setLoading: (value: boolean) => {
      self.loading = value;
    },
    actionCategory: flow(function* (type?: string) {
      try {
        const data = getSnapshot(self.detailCategory);
        if (type === 'edit') {
          yield instance.put(`/category/${data._id}`, data);
          const idx = self.listCategory.findIndex((item) => item._id === data._id);
          if (idx !== -1) applySnapshot(self.listCategory[idx], data);
        } else {
          const response = yield instance.post('/category', data);
          if (self.listCategory.length) applySnapshot(self.listCategory, [response.data, ...self.listArticle]);
        }
      } catch (error) {
        console.error(error);
        if (error.response) throw error.response.data;
        else throw error;
      }
    }),
  }));

export interface ICategoryModel extends Instance<typeof CategoryModel> {}
export interface ICategoryModelOut extends SnapshotOut<typeof CategoryModel> {}

export interface ICategoryModels extends Instance<typeof CategoryModels> {}
export interface ICategoryModelsOut extends SnapshotOut<typeof CategoryModels> {}
