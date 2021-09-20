import { useEffect, useState } from 'react';
import instance from '../../helper/instance';

type TGiftBox = {
  _id?: string,
  content?: string,
  price?: string,
  status?: boolean,
  users?: string,
  createdAt?: string,
  updatedAt?: string,
};
const Sub = ({ item }) => {
  const [data, setData] = useState<TGiftBox>({});
  useEffect(() => {
    const run = async () => {
      const response = await instance.get(`/gift-box/${item.giftbox}`);
      setData(response.data);
    };
    if (item.giftbox) run();
  }, [item.giftbox]);
  return (
    <div>
      <b>{item.fullname}:</b> {data.content}
    </div>
  );
};
export default Sub;
