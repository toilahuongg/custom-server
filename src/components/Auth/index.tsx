import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import instance from '../../helper/instance';
import Loading from '../Layout/Loading';

type TProps = {
  children?:
  | React.ReactChild
  | React.ReactChild[]
};
const Auth: React.FC<TProps> = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  useEffect(() => {
    const run = async () => {
      try {
        await instance.get('/user/get-info');
        setIsAuth(true);
      } catch (error) {
        console.log(error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);
  return !isAuth || loading ? <Loading /> : (
    <>
      {children}
    </>
  );
};
export default observer(Auth);
