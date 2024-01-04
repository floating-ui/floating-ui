import devtoolsPackageJSON from '@floating-ui/devtools/package.json';
import {mergeClasses} from '@griffel/react';
import React from 'react';
import {RotateCcw, XOctagon} from 'react-feather';

import {
  isEvaluationError,
  isEvaluationException,
  useDevtools,
} from '../../../contexts/devtools';
import {useErrorBoundary} from '../utils/useErrorBoundary';
import JsonView from './JsonView';
import styles from './SomethingWentWrong.module.css';

export const SomethingWentWrong = React.memo(() => {
  const {serializedData, theme} = useDevtools();
  const {error, resetErrorBoundary} = useErrorBoundary();
  const handleReload = React.useCallback(() => {
    resetErrorBoundary();
  }, [resetErrorBoundary]);
  const jsonViewDependencies = (
    <JsonView
      name="⚠️ Check expected dependencies version"
      src={{
        [devtoolsPackageJSON.name]: devtoolsPackageJSON.version,
      }}
    />
  );
  return (
    <div
      className={mergeClasses(
        styles.root,
        theme === 'dark' ? styles.darkTheme : styles.lightTheme,
      )}
    >
      <u aria-hidden className={styles.icon}>
        <XOctagon />
      </u>
      <div className={styles.content}>
        {serializedData.type === 'Unknown' && (
          <span>Something went wrong with Floating UI Devtools</span>
        )}
        {serializedData.type !== 'Unknown' && (
          <span>Something went wrong with {serializedData.type} module</span>
        )}
        <span className={styles.errorBox}>
          {error instanceof Error && error.message}
          {isEvaluationError(error) && error.description}
          {isEvaluationException(error) && error.value}
        </span>
        {jsonViewDependencies}
        <button
          className={styles.reloadButton}
          onClick={handleReload}
          autoFocus
        >
          Reload <RotateCcw />
        </button>
        <span className={styles.row}>
          Report this error on
          <a
            className={styles.link}
            href="https://github.com/floating-ui/floating-ui"
            target="_blank"
          >
            Github
          </a>
        </span>
      </div>
    </div>
  );
});

export default SomethingWentWrong;
