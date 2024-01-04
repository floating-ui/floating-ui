import {mergeClasses} from '@griffel/react';
import * as React from 'react';

import {useDevtools} from '../../contexts/devtools';
import JsonView from '../common/components/JsonView';
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
              src={value}
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
        <div>
          <span className={styles.propertyKey}>floating :</span>{' '}
          <button
            title={`Inspect floating`}
            onClick={() => devtools.inspect(elements.floating)}
          >
            HTMLElement
          </button>
        </div>
        <div>
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
