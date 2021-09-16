import React, { useContext } from 'react';
import Link from 'next/link';
import { Accordion, Image, useAccordionButton } from 'react-bootstrap';
import {
  Book, BoxArrowInRight, ChevronDown, Images, Server, 
} from 'react-bootstrap-icons';
import styles from './sidebar.module.scss';
import SidebarContext from './models';
import { observer } from 'mobx-react';

const Sidebar: React.FC = () => {
  const { isShowSidebar } = useContext(SidebarContext);
  const menu = [
    {
      id: '0',
      title: 'Dashboard',
      url: '/dashboard',
      icon: <Server />,
      children: [],
    },
    {
      id: '1',
      title: 'Bài viết',
      url: '/article',
      icon: <Book />,
      children: [
        {
          id: '1.1',
          title: 'Danh sách bài viết',
          url: '/article',
        },
        {
          id: '1.2',
          title: 'Chuyên mục',
          url: '/category/article',
        },
      ],
    },
    {
      id: '2',
      title: 'Library',
      url: '/library',
      icon: <Images />,
      children: [],
    },
  ];

  const Toggle = ({ children, eventKey }) => {
    const decoratedOnClick = useAccordionButton(eventKey);

    return (
      <button
        type="button"
        className={styles.btnToggle}
        onClick={decoratedOnClick}
      >
        {children}
      </button>
    );
  };

  return (
    <div className={styles.sidebar + (isShowSidebar ? ` ${styles.active}` : '')}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className="d-flex">
            <Image src="/images/avatar.png" width="64" height="64" roundedCircle />
            <div className={styles.label}>
              <h5 className={styles.title}> Tôi là Hướng</h5>
              <Link href="/logout">
                <a className={styles.logout}><BoxArrowInRight /> Đăng xuất </a>
              </Link>
            </div>
          </div>
        </div>
        <Accordion>
          <ul className={styles.menu}>
            {
              menu.map((elm) => (
                <li key={elm.id}>
                  <div className={styles.label}>
                    <Link href={elm.url}>
                      <a>
                        <span className={styles.icon}> {elm.icon} </span>
                        {elm.title}
                      </a>
                    </Link>
                    {
                      elm.children.length
                        ? (
                          <Toggle eventKey={elm.id}>
                            <ChevronDown />
                          </Toggle>
                        )
                        : ''
                    }
                  </div>
                  {elm.children.length
                    ? (
                      <Accordion.Collapse eventKey={elm.id}>
                        <ul>
                          {elm.children.map((child) => (
                            <li key={child.id}>
                              <div className={styles.label}>
                                <Link href={child.url}>
                                  <a>
                                    {child.title}
                                  </a>
                                </Link>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </Accordion.Collapse>
                    )
                    : ''}
                </li>
              ))
            }
          </ul>
        </Accordion>
      </div>
    </div>
  );
};
export default observer(Sidebar);
