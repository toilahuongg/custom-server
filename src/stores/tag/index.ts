import {
  applySnapshot, cast, flow, getSnapshot, Instance, SnapshotOut, types,
} from 'mobx-state-tree';
import instance from '../../helper/instance';

const TagModel = types.model({
  _id: types.optional(types.string, ''),
  title: types.optional(types.string, ''),
  type: types.optional(types.string, ''),
  articles: types.array(types.optional(types.string, '')),
  slug: types.optional(types.string, ''),
  createdAt: types.optional(types.string, ''),
  updatedAt: types.optional(types.string, ''),
})
  .volatile<{ loading: boolean }>(() => ({ loading: false }))
  .actions((self) => ({
    setLoading: (value: boolean) => { self.loading = value; },
    setTitle: (value: string) => { self.title = value; },
    setType: (value: string) => { self.type = value; },
  }));
export const TagModels = types.model({
  detailTag: types.optional(TagModel, {}),
  listTag: types.array(TagModel),
  selectTags: types.array(types.optional(types.string, '')),
})
  .volatile<{ loading: boolean, showModal: boolean }>(() => ({ loading: false, showModal: false }))
  .actions((self) => ({
    setLoading: (value: boolean) => {
      self.loading = value;
    },
    setShowModal: (value: boolean) => {
      self.showModal = value;
    },
    setDetailTag: (item) => {
      self.detailTag = item;
    },
    getTags: flow(function* () {
      try {
        const response = yield instance.get('/tag');
        self.listTag = response.data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }),
    deleteTag: flow(function* () {
      try {
        const data = getSnapshot(self.detailTag);
        yield instance.delete(`/tag/${data._id}`);
        self.listTag = cast(self.listTag.filter((Tag) => Tag._id !== data._id));
      } catch (error) {
        console.log(error);
        throw (error);
      }
    }),
    deleteTags: flow(function* () {
      try {
        const data = getSnapshot(self.selectTags);
        yield instance.delete('/tag/', { data });
        self.listTag = cast(self.listTag.filter((Tag) => !data.includes(Tag._id)));
        self.selectTags = cast([]);
      } catch (error) {
        console.log(error);
        throw (error);
      }
    }),
    cloneTag: flow(function* (id: string) {
      try {
        const data = { ...self.listTag.find((item) => item._id === id) };
        data.title += ' (Sao chép)';
        const response = yield instance.post('/tag', data);
        self.listTag.unshift(response.data);
      } catch (error) {
        console.error(error);
        if (error.response) throw error.response.data;
        else throw error;
      }
    }),
    actionTag: flow(function* (type?: string) {
      try {
        const data = getSnapshot(self.detailTag);
        if (type === 'edit') {
          yield instance.put(`/tag/${data._id}`, data);
          const idx = self.listTag.findIndex((item) => item._id === data._id);
          if (idx !== -1) applySnapshot(self.listTag[idx], data);
        } else {
          const response = yield instance.post('/tag', data);
          self.listTag.unshift(response.data);
          return response.data;
        }
      } catch (error) {
        console.error(error);
        if (error.response) throw error.response.data;
        else throw error;
      }
    }),
    actionSelectTags: (type: string, id?: string) => {
      if (type === 'select-all') {
        const listId = self.listTag.map((item) => item._id);
        if (self.selectTags.length === listId.length) self.selectTags = cast([]);
        else self.selectTags = cast(listId);
      } else {
        const index = self.selectTags.indexOf(id);
        if (index === -1) self.selectTags.push(id);
        else self.selectTags.splice(index, 1);
      }
    },
  }))
  .views((self) => ({
    countTag: () => {
      return getSnapshot(self.listTag).length;
    },
    getTagById: (id: string) => {
      return getSnapshot(self.listTag).find((item) => item._id === id);
    },
    getTagByType: (type: string) => {
      return getSnapshot(self.listTag).filter((item) => item.type === type);
    },
    checkSelectTag: (id: string) => {
      return self.selectTags.includes(id);
    },
    checkSelectAll: () => {
      const listId = self.listTag.map((item) => item._id);
      return self.selectTags.length > 0 && self.selectTags.length === listId.length;
    },
  }));

export interface ITagModel extends Instance<typeof TagModel> {}
export interface ITagModelOut extends SnapshotOut<typeof TagModel> {}

export interface ITagModels extends Instance<typeof TagModels> {}
export interface ITagModelsOut extends SnapshotOut<typeof TagModels> {}
