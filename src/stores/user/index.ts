import { flow, Instance, SnapshotOut, types } from 'mobx-state-tree';
import instance from '../../helper/instance';

export const UserModel = types.model({
  _id: types.optional(types.string, ''),
  fullname: types.optional(types.string, ''),
  password: types.optional(types.string, ''),
  giftbox: types.optional(types.string, ''),
})
  .volatile<{ loading: boolean }>(() => ({ loading: false }));

export const UserModels = types.model({
  auth: types.optional(UserModel, {}),
  detailUser: types.optional(UserModel, {}),
  listUser: types.array(UserModel),
})
  .volatile<{ loading: boolean }>(() => ({ loading: false }))
  .actions((self) => ({
    setLoading: (value: boolean) => {
      self.loading = value;
    },
    getUsers: flow(function* () {
      try {
        const response = yield instance.get('/user');
        self.listUser = response.data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }),
    openGiftBoxByUser: ({ id, userId }) => {
      try {
        const idx = self.listUser.findIndex(({ _id }) => _id === userId);
        if (idx >= 0) {
          self.listUser[idx].giftbox = id;
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  })).views((self) => ({
    getUserById: (id: string) => {
      return self.listUser.find((item) => item._id === id);
    },
  }));
export interface IUserModel extends Instance<typeof UserModel> { }
export interface IUserModelOut extends SnapshotOut<typeof UserModel> { }

export interface IUserModels extends Instance<typeof UserModels> { }
export interface IUserModelsOut extends SnapshotOut<typeof UserModels> { }
