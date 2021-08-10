import React from 'react';
import styles from './card.module.scss';

type TProps = React.HTMLAttributes<HTMLElement>;
const Card: React.FC<TProps> = ({ children, className, ...props }) => {
  return (
    <div {...props} className={`${styles.card} ${className}`}>
      {children}
    </div>
  );
};
export default Card;
