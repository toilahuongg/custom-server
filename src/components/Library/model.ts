import { types, flow } from 'mobx-state-tree';
import { createContext } from 'react';
import instance from '../../helper/instance';

const LibaryModel = types.model({
  _id: types.optional(types.string, ''),
  url: types.optional(types.string, ''),
  size: types.optional(types.string, ''),
  type: types.optional(types.string, ''),
  width: types.optional(types.number, 0),
  height: types.optional(types.number, 0),
  articles: types.array(types.optional(types.string, '')),
  categories: types.array(types.optional(types.string, '')),
  status: types.optional(types.string, ''),
  progress: types.optional(types.number, 0),
});

const LibaryModels = types.model({ images: types.array(LibaryModel) }).actions((self) => ({
  addToWait(data) {
    self.images.unshift(data);
  },
  updateProgress(id: string, progress: number) {
    const idx = self.images.findIndex((item) => item._id === id);
    if (idx >= 0) {
      self.images[idx].progress = progress;
    }
  },
  updateFromWaitToImage(id: string, data) {
    const idx = self.images.findIndex((item) => item._id === id);
    if (idx >= 0) {
      self.images[idx] = data;
    }
  },
  getImages: flow(function * ({ page, limit }) {
    try {
      const response = yield instance.get('/library', { params: { page, limit } });
      self.images = response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }),
}));
const StoreLibrary = LibaryModels.create();
export const LibraryContext = createContext(StoreLibrary);
export default LibraryContext;