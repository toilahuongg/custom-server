import { flow, Instance, SnapshotOut, types } from 'mobx-state-tree';
import instance from '../../helper/instance';

export const GiftBoxModel = types.model({
  _id: types.optional(types.string, ''),
  status: types.optional(types.boolean, false),
  user: types.optional(types.string, ''),
})
  .volatile<{ loading: boolean }>(() => ({ loading: false }))
  .actions((self) => ({
    setId(id: string) {
      self._id = id;
    },
  }));

export const GiftBoxModels = types.model({
  detailGiftBox: types.optional(GiftBoxModel, {}),
  listGiftBox: types.array(GiftBoxModel),
})
  .volatile<{ loading: boolean }>(() => ({ loading: false }))
  .actions((self) => ({
    setLoading: (value: boolean) => {
      self.loading = value;
    },
    getGiftBoxs: flow(function* () {
      try {
        const response = yield instance.get('/gift-box');
        const data = response.data.sort(() => {
          return 0.5 - Math.random();
        });
        self.listGiftBox = data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }),
    openGiftBox: ({ id, userId }) => {
      try {
        const idx = self.listGiftBox.findIndex(({ _id }) => _id === id);
        if (idx >= 0) {
          self.listGiftBox[idx].status = true;
          self.listGiftBox[idx].user = userId;
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  })).views((self) => ({
    getGiftBoxById: (id: string) => {
      return self.listGiftBox.find((item) => item._id === id);
    },
  }));
export interface IGiftBoxModel extends Instance<typeof GiftBoxModel> { }
export interface IGiftBoxModelOut extends SnapshotOut<typeof GiftBoxModel> { }

export interface IGiftBoxModels extends Instance<typeof GiftBoxModels> { }
export interface IGiftBoxModelsOut extends SnapshotOut<typeof GiftBoxModels> { }
