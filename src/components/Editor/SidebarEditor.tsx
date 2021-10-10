import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { Accordion, useAccordionButton } from 'react-bootstrap';
import { ChevronDown } from 'react-bootstrap-icons';
import SidebarContext from '../Layout/Sidebar/models';
import styles from './sidebar.module.scss';

export type TMenu = {
  id: string;
  title: string;
  icon?: JSX.Element;
  render: 
  | string[]
  | React.ReactChild
  | React.ReactChild[];
};

type TProps = {
  back:
  | React.ReactChild
  | React.ReactChild[];
  menu: TMenu[]
};
const SidebarEditor: React.FC<TProps> = ({ back, menu }) => {
  const { isShowSidebar } = useContext(SidebarContext);

  const Toggle = ({ children, eventKey }) => {
    const decoratedOnClick = useAccordionButton(eventKey);

    return (
      <div
        className={styles.label}
        onClick={decoratedOnClick}
      >
        {children}
      </div>
    );
  };

  return (
    <div className={styles.sidebar + (isShowSidebar ? ` ${styles.active}` : '')}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          {back}
        </div>
        <Accordion>
          <ul className={styles.menu}>
            {
              menu.map(({ id, title, icon, render }) => (
                <li key={id}>
                  <Toggle eventKey={id}>
                    <div className={styles.title}>
                      <span className={styles.icon}> {icon} </span>
                      {title}
                    </div>
                    <button type="button" className={styles.btnToggle}>
                      <ChevronDown />
                    </button>
                  </Toggle>
                  <Accordion.Collapse eventKey={id}>
                    <div className={styles.render}>
                      {render}
                    </div>
                  </Accordion.Collapse>
                </li>
              ))
            }
          </ul>
        </Accordion>
      </div>
    </div>
  );
};
export default observer(SidebarEditor);
