import { Instance, types } from 'mobx-state-tree';
import { createContext, useContext } from 'react';
import { GiftBoxModels } from './giftbox';
import { UserModels } from './user';

const StoreModel = types.model({
  giftbox: types.optional(GiftBoxModels, {}),
  userId: types.string,
  user: types.optional(UserModels, {}),
})
  .actions((self) => ({
    setUserId(id: string) {
      self.userId = id;
    },
  }));
let userId = '';
if (typeof window !== 'undefined') {
  if (window.localStorage.getItem('user_id')) userId = window.localStorage.getItem('user_id');
}
export const StoreContext = createContext<IStoreModel>(StoreModel.create({ giftbox: {}, userId }));
const useStore = () => useContext(StoreContext);

export interface IStoreModel extends Instance<typeof StoreModel> { }
export default useStore;
