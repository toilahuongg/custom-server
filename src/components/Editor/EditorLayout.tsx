import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { Button } from 'react-bootstrap';
import { GearFill } from 'react-bootstrap-icons';
import CustomHead from '@src/components/Layout/CustomHead';
import Auth from '@src/components/Auth';
import SidebarContext from '@src/components/Layout/Sidebar/models';
import styles from './editor.module.scss';

type TProps = {
  children:
  | React.ReactChild
  | React.ReactChild[],
  sidebar:
  | React.ReactChild
  | React.ReactChild[],
  action:
  | React.ReactChild
  | React.ReactChild[],
  title: string,
};
const EditorLayout:React.FC<TProps> = ({ children, title, sidebar, action }) => {
  const { isShowSidebar, toggleIsShowSidebar } = useContext(SidebarContext);
  return (
    <Auth>
      <CustomHead title={title} />
      <div className={styles.flex}>
        { sidebar }
        { isShowSidebar && (
        <div
          className={styles.background}
          onClick={toggleIsShowSidebar}
        />
        )}
        <div className={styles.root}>
          <div className={styles.navbar}>
            <Button variant="dark" onClick={toggleIsShowSidebar}>
              <GearFill size="24" />
            </Button>
            <div>
              {action}
            </div>
          </div>
          <div className={styles.wrapper}>
            {children}
          </div>
        </div>
      </div>
    </Auth>
  );
};
export default observer(EditorLayout);
