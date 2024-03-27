import * as React from 'react';
import {Navigation} from 'react-feather';

import styles from './Unknown.module.css';

export const Unknown = React.memo(function Unknown() {
  return (
    <div className={styles.root}>
      <u aria-hidden className={styles.icon}>
        <Navigation />
      </u>
      <div>
        Select a{' '}
        <a
          className={styles.link}
          href="https://floating-ui.com/"
          target="_blank"
          rel="noreferrer"
        >
          Floating UI
        </a>{' '}
        element
      </div>
    </div>
  );
});

export default Unknown;
