import { createContext, useContext } from 'react';
import { IUserModel, UserModel } from '../../stores/user';

export const userContext = createContext<IUserModel>(UserModel.create());
export const useUser = () => useContext(userContext);
