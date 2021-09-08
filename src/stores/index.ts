import { Instance, types } from 'mobx-state-tree';
import { createContext, useContext } from 'react';
import { ArticleModels } from './article';
import { CategoryModels } from './category';

const StoreModel = types.model({
  article: types.optional(ArticleModels, {}),
  category: types.optional(CategoryModels, {}),
});

export const StoreContext = createContext<IStoreModel>(StoreModel.create());
const useStore = () => useContext(StoreContext);

export interface IStoreModel extends Instance<typeof StoreModel> { }
export default useStore;
