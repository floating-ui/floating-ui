import devtoolsPackageJSON from '@floating-ui/devtools/package.json';
import * as React from 'react';
import type {FallbackProps} from 'react-error-boundary';
import {RotateCcw, XOctagon} from 'react-feather';

import type {
  ChromeEvaluationError,
  ChromeEvaluationException,
} from '../contexts/devtools';
import {
  isChromeEvaluationError,
  isChromeEvaluationException,
  useDevtools,
} from '../contexts/devtools';
import {useSerializedData} from '../contexts/serializedData';
import JsonView from '../views/common/components/JsonView';
import styles from './SomethingWentWrong.module.css';

export type SomethingWentWrongProps = FallbackProps;

export const SomethingWentWrong = (props: SomethingWentWrongProps) => {
  const [currentSerializedData] = useSerializedData();
  const {inspectDocument: resetInspection} = useDevtools();

  const handleReload = React.useCallback(
    () => resetInspection().then(props.resetErrorBoundary),
    [resetInspection, props.resetErrorBoundary],
  );
  const {type, error} = getErrorData(props.error);

  const jsonViewDependencies = (
    <JsonView
      name="⚠️ Check expected dependencies version"
      collapsed
      src={{
        [devtoolsPackageJSON.name]: devtoolsPackageJSON.version,
      }}
    />
  );
  return (
    <div className={styles.root}>
      <u aria-hidden className={styles.icon}>
        <XOctagon />
      </u>
      <div className={styles.content}>
        <span>
          Something went wrong with &apos;
          {type.startsWith('Chrome')
            ? 'chrome.devtools'
            : currentSerializedData.type}
          &apos; module
        </span>
        <span>{type}: </span>
        <span className={styles.errorBox}>
          {type === 'Error' && error.message}
          {type === 'ChromeEvaluationError' && error.description}
          {type === 'ChromeEvaluationException' && error.value}
          {type === 'Unknown' && JSON.stringify(error, null, 2)}
        </span>
        {jsonViewDependencies}
        <button className={styles.reloadButton} onClick={handleReload}>
          Reload <RotateCcw />
        </button>
        <span className={styles.row}>
          Report this error on
          <a
            className={styles.link}
            href="https://github.com/floating-ui/floating-ui"
            target="_blank"
            rel="noreferrer"
          >
            Github
          </a>
        </span>
      </div>
    </div>
  );
};

type ErrorData =
  | {
      type: 'ChromeEvaluationError';
      error: ChromeEvaluationError;
    }
  | {
      type: 'ChromeEvaluationException';
      error: ChromeEvaluationException;
    }
  | {
      type: 'Error';
      error: Error;
    }
  | {
      type: 'Unknown';
      error: unknown;
    };

function getErrorData(error: unknown): ErrorData {
  if (isChromeEvaluationError(error)) {
    return {
      type: 'ChromeEvaluationError',
      error,
    };
  }
  if (isChromeEvaluationException(error)) {
    return {
      type: 'ChromeEvaluationException',
      error,
    };
  }
  if (error instanceof Error) {
    return {
      type: 'Error',
      error,
    };
  }
  return {
    type: 'Unknown',
    error,
  };
}

export default SomethingWentWrong;
