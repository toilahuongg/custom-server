import React, { useEffect } from 'react';
import Master from '../src/components/Admin/Master';

const HomePage: React.FC = () => {
  useEffect(() => {
    console.log('Home loaded');
    return () => console.log('didmount');
  }, []);
  return (
    <Master>
      hii
    </Master>
  );
};

export default HomePage;
