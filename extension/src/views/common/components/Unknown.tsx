import {mergeClasses} from '@griffel/react';
import * as React from 'react';
import {Navigation} from 'react-feather';

import {useDevtools} from '../../../contexts/devtools';
import styles from './Unknown.module.css';

export const Unknown = React.memo(() => (
  <div
    className={mergeClasses(
      styles.root,
      useDevtools().theme === 'dark' ? styles.darkTheme : styles.lightTheme,
    )}
  >
    <u aria-hidden className={styles.icon}>
      <Navigation />
    </u>
    <div>
      Select a{' '}
      <a
        className={styles.link}
        href="https://floating-ui.com/"
        target="_blank"
      >
        Floating UI
      </a>{' '}
      element
    </div>
  </div>
));

Unknown.displayName = 'NoData';

export default Unknown;
