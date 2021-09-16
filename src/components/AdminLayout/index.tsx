import React, { useContext } from 'react';
import Header from '../Layout/Header';
import styles from './admin.module.scss';
import Sidebar from '../Layout/Sidebar';
import CustomHead from '@src/components/Layout/CustomHead';
import Auth from '@src/components/Auth';
import SidebarContext from '@src/components/Layout/Sidebar/models';
import { observer } from 'mobx-react';

type TProps = {
  children?:
  | React.ReactChild
  | React.ReactChild[],
  title?: string,
};
const AdminLayout:React.FC<TProps> = ({ children, title }) => {
  const { isShowSidebar, toggleIsShowSidebar } = useContext(SidebarContext);
  return (
    <Auth>
      <CustomHead title={title} />
      <div className={styles.flex}>
        <Sidebar />
        { isShowSidebar && (
        <div
          className={styles.background}
          onClick={toggleIsShowSidebar}
        />
        )}
        <div className={styles.root}>
          <Header action={toggleIsShowSidebar} />
          <div className={styles.wrapper}>
            {children}
          </div>
        </div>
      </div>
    </Auth>
  );
};
export default observer(AdminLayout);
