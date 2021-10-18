import React, { useEffect } from 'react';

const HomePage: React.FC = () => {
  useEffect(() => {
    console.log('Home loaded');
    return () => console.log('didmount');
  }, []);
  return (
    <>
      hiih1
    </>
  );
};

export default HomePage;
