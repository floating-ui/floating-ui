import * as React from 'react';
import {Bug24Filled} from '@fluentui/react-icons';

import {useDevtools} from '../contexts/devtools';
import styles from './SidePanel.module.css';

export const SidePanel = () => {
  const devtools = useDevtools();
  return (
    <aside className={styles.root}>
      <button title="Debug" className={styles.button} onClick={devtools.debug}>
        <Bug24Filled />
      </button>
    </aside>
  );
};
