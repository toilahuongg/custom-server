import { ElementType } from 'react';
import styles from './dashboard.module.scss';

type TProps = {
  background: string,
  count: string,
  process: string,
  icon: ElementType
};
const Box: React.FC<TProps> = ({ background, count, process, icon }) => {
  const Icon: React.ElementType = icon;
  const bg = {
    green: styles.green,
    blue: styles.blue,
    orange: styles.orange,
    red: styles.red,
  };
  const classList = [
    styles.box,
    bg[background],
  ];
  return (
    <div className={classList.join(' ')}>
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">{count}</h5>
        <Icon size="20" />
      </div>
      <div className={styles.process}>
        <div className={styles.processBar} style={{ width: `${process}%` }} />
      </div>
    </div>
  );
};
export default Box;
