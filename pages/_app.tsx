import React from 'react';
import { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';

import '../styles/style.scss';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
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
