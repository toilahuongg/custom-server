import React, { useEffect } from 'react';
import Master from '../../src/components/Admin/Master';

const AdminPage: React.FC = () => {
  useEffect(() => {
    console.log('Home loaded');
    return () => console.log('didmount');
  }, []);
  return (
    <Master title="Trang chủ">
      Trang chủ
    </Master>
  );
};

export default AdminPage;
