import { Instance, SnapshotOut, types } from 'mobx-state-tree';

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
  }));

export interface ICategoryModel extends Instance<typeof CategoryModel> {}
export interface ICategoryModelOut extends SnapshotOut<typeof CategoryModel> {}

export interface ICategoryModels extends Instance<typeof CategoryModels> {}
export interface ICategoryModelsOut extends SnapshotOut<typeof CategoryModels> {}
