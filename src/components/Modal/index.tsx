import { observer } from 'mobx-react';
import { getSnapshot } from 'mobx-state-tree';
import React, { useEffect, useRef, useState } from 'react';
import instance from '../../helper/instance';
import useStore from '../../stores';
import styles from './modal.module.scss';

type TProps = {
  active: boolean,
  toggleActive: () => void
};
const listAudio = [
  '/VOTAY.mp3',
  '/VICTORY.mp3',
  '/YAY.mp3',
];
type TGiftBox = {
  _id?: string,
  content?: string,
  price?: string,
  status?: boolean,
  users?: string,
  createdAt?: string,
  updatedAt?: string,
};

const Modal: React.FC<TProps> = ({ active, toggleActive }) => {
  const audio = useRef(null);
  const { giftbox, user } = useStore();
  const { detailGiftBox } = giftbox;
  const { getUserById } = user;
  const [data, setData] = useState<TGiftBox>({});
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    audio.current = new Audio();
    audio.current.src = listAudio[Math.floor(Math.random() * 3)];
    const run = async () => {
      try {
        setLoading(true);
        const response = await instance.get(`/gift-box/${detailGiftBox._id}`);
        console.log(response.data);
        setData(response.data);
        audio.current.currentTime = 0;
        audio.current.play();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (active) {
      run();
    } else {
      audio.current.pause();
    }
  }, [active]);
  return (
    <div onClick={toggleActive} className={`${styles.modal} ${active ? styles.active : ''}`}>
      <div className={styles.tooltip}> Click everywhere to close </div>
      <div className={styles.body}>
        {loading ? 'Loading ...' : (
          <>
            <div className={styles.title}> Xin chúc mừng {detailGiftBox.user && getSnapshot(getUserById(detailGiftBox.user)).fullname}</div>
            <div className={styles.content}>
              Bạn đã nhận được một phần quà là <b> {data.content} </b> trị giá <b>{data.price}</b>
            </div>
          </>
        )}
      </div>
      { active && <iframe title=" " src="silence.mp3" allow="autoplay" id="audio" />}
    </div>
  );
};
export default observer(Modal);
