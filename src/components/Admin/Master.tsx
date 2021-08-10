import React, { useState } from 'react';
import Head from 'next/head';
import Header from './Header';
import styles from './master.module.scss';
import Sidebar from './Sidebar';

type TProps = {
  children?:
  | React.ReactChild
  | React.ReactChild[],
  title?: string,
};
const Master:React.FC<TProps> = ({ children, title }) => {
  const [active, setActive] = useState<boolean>(false);
  const toggleActive = () => setActive(!active);
  return (
    <>
      <Head>
        <link rel="icon" href="/images/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/images/favicon.ico" type="image/x-icon" />
        <title> {title} | Tôi Là Hướng </title>
      </Head>
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
    </>
  );
};
export default Master;
