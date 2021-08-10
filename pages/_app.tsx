import React, { useState } from 'react';
import Router from 'next/router';
import { AppProps } from 'next/app';
import TopBarProgress from 'react-topbar-progress-indicator';
import { ToastContainer } from 'react-toastify';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/style.scss';
import 'react-toastify/dist/ReactToastify.css';

TopBarProgress.config({
  barColors: {
    0: '#7C83FD',
    '1.0': '#7C83FD',
  },
  shadowBlur: 5,
});

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const [progress, setProgress] = useState(false);
  Router.events.on('routeChangeStart', () => {
    setProgress(true);
  });

  Router.events.on('routeChangeComplete', () => {
    setProgress(false);
  });
  return (
    <>
      {progress && <TopBarProgress />}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Component {...pageProps} />
    </>
  );
};
export default App;
