import React, { useState } from 'react';
import Header from './Header';
import styles from './admin.module.scss';
import Sidebar from './Sidebar';
import CustomHead from '../CustomHead';
import Auth from '../Auth';

type TProps = {
  children?:
  | React.ReactChild
  | React.ReactChild[],
  title?: string,
};
const AdminLayout:React.FC<TProps> = ({ children, title }) => {
  const [active, setActive] = useState<boolean>(false);
  const toggleActive = () => setActive(!active);
  return (
    <Auth>
      <CustomHead title={title} />
      <div className={styles.flex}>
        <Sidebar active={active} />
        { active && (
        <div
          className={styles.background}
          onClick={toggleActive}
        />
        )}
        <div className={styles.root}>
          <Header action={toggleActive} />
          <div className={styles.wrapper}>
            {children}
          </div>
        </div>
      </div>
    </Auth>
  );
};
export default AdminLayout;
