import { Instance, types } from 'mobx-state-tree';
import { createContext, useContext } from 'react';
import { ArticleModels } from './article';
import { CategoryModels } from './category';
import { LibraryModels } from './library';

const StoreModel = types.model({
  article: types.optional(ArticleModels, {}),
  category: types.optional(CategoryModels, {}),
  library: types.optional(LibraryModels, {}),
});

export const StoreContext = createContext<IStoreModels>(StoreModel.create());
const useStore = () => useContext(StoreContext);

export interface IStoreModels extends Instance<typeof StoreModel> {}
export default useStore;