import React from 'react';
import { Link } from 'dumi';
import styles from './index.less';
import config from '../../../config';

const ReactComponent = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapperbg} style={{ backgroundImage: `url(${config.bg})` }}></div>
      <div className={styles.content}>
        <p>一个写博客总结的地方</p>
        <div className={styles.btnGroup}>
          <Link to="/blog" className={styles.action}>
            进入查看
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReactComponent;
