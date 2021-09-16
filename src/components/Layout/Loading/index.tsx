import React from 'react';
import { Spinner } from 'react-bootstrap';
import styles from './loading.module.scss';

const Loading: React.FC = () => {
  return (
    <div className={styles.loading}>
      <Spinner animation="border" />
    </div>
  );
};
export default Loading;
