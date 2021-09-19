import { observer } from 'mobx-react';
import { applySnapshot, getSnapshot } from 'mobx-state-tree';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import Modal from '../src/components/Modal';
import instance from '../src/helper/instance';
import useStore from '../src/stores';
import GiftBox from '../styles/giftbox.svg';
import OpenGiftBox from '../styles/open-gift-box.svg';

const socket = io('/');
const HomePage: React.FC = () => {
  const [active, setActive] = useState<boolean>(false);
  const { giftbox, userId, setUserId, user } = useStore();
  const {
    detailGiftBox, listGiftBox, getGiftBoxs, openGiftBox, getGiftBoxById,
  } = giftbox;
  const { auth, getUsers } = user;
  useEffect(() => {
    const run = async () => {
      try {
        if (!userId) {
          let password = '';
          while (!password) {
            password = prompt('Nhập mật khẩu', '');
          }
          const response = await instance.post('/user/check', { password });

          window.localStorage.setItem('user_id', response.data._id);
          setUserId(response.data._id);
        }
        const response = await instance.get(`/user/${userId}`);
        applySnapshot(auth, response.data);
        await getGiftBoxs();
        await getUsers();
      } catch (error) {
        // window.location.href = '/';
        console.log(error);
      }
    };
    run();
    socket.on('open-gift', ({ id, userId }) => {
      openGiftBox({ id, userId });
      setActive(true);
      applySnapshot(detailGiftBox, getSnapshot(getGiftBoxById(id)));
    });
    socket.on('error', (msg) => {
      toast(msg, { position: 'top-center' });
    });
  }, []);
  const fnChooseGiftbox = (id: string) => async () => {
    try {
      const currentGiftBox = getSnapshot(getGiftBoxById(id));
      if (currentGiftBox.status || currentGiftBox.user) throw new Error('Quà này đã được người khác mở mất rồi :v');
      if (auth.giftbox) throw new Error('Bạn tham lam thế nhỉ :v');
      await instance.post('/gift-box/open', { id, userId });
      openGiftBox({ id, userId });
      applySnapshot(detailGiftBox, getSnapshot(getGiftBoxById(id)));
      setActive(true);
      socket.emit('open-gift', { id, userId });
    } catch (error) {
      if (error.message) {
        socket.emit('error', error.message);
        toast(`${auth.fullname}: ${error.message}`, { position: 'top-center' });
      }
    }
  };
  const toggleActive = () => setActive(!active);
  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', padding: '50px' }}>
      { listGiftBox.map((item) => (
        <div key={item._id}>
          {item.status ? (
            <OpenGiftBox style={{ width: '144px', height: '144px', cursor: 'pointer' }} onClick={fnChooseGiftbox(item._id)} />
          ) : (
            <GiftBox
              style={{ width: '144px', height: '144px', cursor: 'pointer' }}
              onClick={fnChooseGiftbox(item._id)}
            />
          )}
        </div>
      ))}
      <Modal active={active} toggleActive={toggleActive} />
    </div>
  );
};

export default observer(HomePage);
