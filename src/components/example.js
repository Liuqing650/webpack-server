import React from 'react';
import styles from './index.less';

const Example = () => {
  const onClick = () => {
    console.log(56665);
  };
  return (
    <div>
      <p className={styles.text}>Example</p>
      <button onClick={onClick}>Click Button 555</button>
    </div>
  );
};
export default Example;
