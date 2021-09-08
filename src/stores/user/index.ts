import { flow, Instance, types } from 'mobx-state-tree';
import instance from '../../helper/instance';

export const UserModel = types.model({
  _id: types.optional(types.string, ''),
  username: types.optional(types.string, ''),
  password: types.optional(types.string, ''),
  email: types.optional(types.string, ''),
})
  .volatile<{ loading: boolean }>(() => ({ loading: false }))
  .actions((self) => ({
    setLoading: (value: boolean) => { self.loading = value; },
    setUsername: (value: string) => { self.username = value; },
    setPassword: (value: string) => { self.password = value; },
    setEmail: (value: string) => { self.email = value; },
    addUser: flow(function* () {
      try {
        const data = {
          username: self.username,
          password: self.password,
        };
        yield instance.post('/user/register', data);
      } catch (error) {
        console.error(error);
        if (error.response) throw error.response.data;
        else throw error;
      }
    }),
    login: flow(function* () {
      try {
        const data = {
          username: self.username,
          password: self.password,
        };
        const response = yield instance.post('/user/login', data);
        const accessToken = response.data;
        window.localStorage.setItem('access-token', accessToken);
      } catch (error) {
        console.error(error);
        if (error.response) throw error.response.data;
        else throw error;
      }
    }),
  }));
export interface IUserModel extends Instance<typeof UserModel> {}
