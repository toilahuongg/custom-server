import { types, flow, cast } from 'mobx-state-tree';
import { createContext } from 'react';
import instance from '../../helper/instance';

const LibaryModel = types.model({
  _id: types.optional(types.identifier, ''),
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
const PaginationModel = types.model({
  page: types.optional(types.number, 0),
  limit: types.optional(types.number, 18),
}).actions((self) => ({
  setPage(value: number) {
    self.page = value;
  },
  setLimit(value: number) {
    self.limit = value;
  },
}));

const LibaryModels = types.model({ 
  images: types.array(LibaryModel),
  pagination: types.optional(PaginationModel, {}),
  countImage: types.optional(types.number, 0),
})
  .volatile<{ loading: boolean, isShowModalInfo: boolean }>(() => ({ loading: true, isShowModalInfo: false }))
  .actions((self) => ({
    setLoading(value: boolean) {
      self.loading = value;
    },
    setShowModalInfo(value: boolean) {
      self.isShowModalInfo = value;
    },
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
    getImages: flow(function * () {
      try {
        const response = yield instance.get('/library', { params: { page: self.pagination.page, limit: self.pagination.limit } });
        const [data, count] = response.data;
        self.countImage = count;
        if (self.images.length < count) {
          self.images = cast([...self.images, ...data]);
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    }),
  }));
const StoreLibrary = LibaryModels.create();
export const LibraryContext = createContext(StoreLibrary);
export default LibraryContext;