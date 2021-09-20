import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { ChevronLeft } from 'react-bootstrap-icons';
import useStore from '../../stores';
import styles from './sidebar.module.scss';
import Sub from './Sub';

const Sidebar: React.FC = () => {
  const [active, setActive] = useState(false);
  const toggleActive = () => setActive(!active);
  const { user } = useStore();
  const { listUser } = user;
  return (
    <div className={`${styles.sidebar} ${active ? styles.active : ''}`}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}> Gold Board </h1>
        {
          listUser.map((item) => item.giftbox && (
            <div key={item._id} className={styles.list}>
              <Sub item={item} />
            </div>
          ))
        }
        <button type="button" className={styles.control} onClick={toggleActive}>
          <ChevronLeft />
        </button>
      </div>
    </div>
  );
};
export default observer(Sidebar);
