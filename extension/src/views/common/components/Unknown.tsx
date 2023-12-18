import {mergeClasses} from '@griffel/react';
import * as React from 'react';

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
      💡️
    </u>
    <div>
      Please select a{' '}
      <a
        className={styles.link}
        href="https://floating-ui.com/"
        target="_blank"
      >
        floating
      </a>{' '}
      element
    </div>
  </div>
));

Unknown.displayName = 'NoData';

export default Unknown;
