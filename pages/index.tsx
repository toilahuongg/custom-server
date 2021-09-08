import React, { useEffect } from 'react';

const HomePage: React.FC = () => {
  useEffect(() => {
    console.log('Home loaded');
    return () => console.log('didmount');
  }, []);
  return (
    <>
      hii
    </>
  );
};

export default HomePage;
