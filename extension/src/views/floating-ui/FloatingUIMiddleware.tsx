import {mergeClasses} from '@griffel/react';
import * as React from 'react';
import JsonView, {type ThemeKeys} from 'react-json-view';

import {useDevtools} from '../../contexts/devtools';
import styles from './FloatingUIMiddleware.module.css';

export const FloatingUIMiddleware = React.memo(() => {
  const devtools = useDevtools('FloatingUIMiddleware');
  const {
    elements,
    initialPlacement,
    middlewareData,
    y,
    x,
    strategy,
    rects,
    placement,
  } = devtools.serializedData;
  const theme: ThemeKeys =
    devtools.theme === 'dark' ? 'monokai' : 'rjv-default';
  return (
    <div
      className={mergeClasses(
        styles.root,
        devtools.theme === 'dark' ? styles.darkTheme : styles.lightTheme,
      )}
    >
      {Object.entries({
        initialPlacement,
        middlewareData,
        y,
        x,
        strategy,
        rects,
        placement,
      }).map(([key, value]) => {
        if (value && typeof value === 'object') {
          return (
            <JsonView
              key={key}
              name={key}
              indentWidth={2}
              collapsed={true}
              enableClipboard={false}
              displayObjectSize={false}
              displayDataTypes={false}
              quotesOnKeys={false}
              style={{backgroundColor: 'unset'}}
              src={value}
              theme={theme}
            />
          );
        }
        return (
          <div key={key} className={styles.keyValueContainer}>
            <span className={styles.propertyKey}>{key} :</span>{' '}
            <span className={styles.string}>"{value}"</span>
          </div>
        );
      })}
      <div className={styles.buttonGroup}>
        <div className={styles.buttonContainer}>
          <span className={styles.propertyKey}>floating :</span>{' '}
          <button
            title={`Inspect floating`}
            onClick={() => devtools.inspect(elements.floating)}
          >
            HTMLElement
          </button>
        </div>
        <div className={styles.buttonContainer}>
          <span className={styles.propertyKey}>reference :</span>{' '}
          <button
            title={`Inspect reference`}
            onClick={() => devtools.inspect(elements.reference)}
          >
            HTMLElement
          </button>
        </div>
      </div>
    </div>
  );
});

export default FloatingUIMiddleware;
