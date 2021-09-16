import { types } from 'mobx-state-tree';
import { createContext } from 'react';

const SidebarModel = types.model({ isShowSidebar: types.optional(types.boolean, true) }).actions((self) => ({
  setIsShowSidebar(value: boolean) {
    self.isShowSidebar = value;
  },
  toggleIsShowSidebar() {
    self.isShowSidebar = !self.isShowSidebar;
  },
}));
const SidebarContext = createContext(SidebarModel.create());
export default SidebarContext;