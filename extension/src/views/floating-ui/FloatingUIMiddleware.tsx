import * as React from 'react';

import {useDevtools} from '../../contexts/devtools';
import {useSerializedData} from '../../contexts/serializedData';
import JsonView from '../common/components/JsonView';
import styles from './FloatingUIMiddleware.module.css';

export const FloatingUIMiddleware = React.memo(function FloatingUIMiddleware() {
  const devtools = useDevtools();
  const serializedData = useSerializedData('FloatingUIMiddleware');
  const [index, setIndex] = React.useState(serializedData.length - 1);
  const handleIndexChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setIndex(Number(event.target.value));
    },
    [],
  );

  const {
    elements,
    initialPlacement,
    middlewareData,
    y,
    x,
    strategy,
    rects,
    placement,
  } = serializedData[serializedData.length - 1 - index];

  React.useEffect(() => {
    setIndex(serializedData.length - 1);
  }, [serializedData.length]);

  return (
    <div className={styles.root}>
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
            <span className={styles.string}>&quot;{value}&quot;</span>
          </div>
        );
      })}
      <div className={styles.buttonGroup}>
        <div>
          <span className={styles.propertyKey}>floating :</span>{' '}
          <button
            title={`Inspect floating`}
            onClick={() => devtools.inspectByReferenceId(elements.floating)}
          >
            HTMLElement
          </button>
        </div>
        <div>
          <span className={styles.propertyKey}>reference :</span>{' '}
          <button
            title={`Inspect reference`}
            onClick={() => devtools.inspectByReferenceId(elements.reference)}
          >
            HTMLElement
          </button>
        </div>
      </div>
      {serializedData.length > 1 && (
        <div className={styles.buttonGroup}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <label className={styles.propertyKey} htmlFor="serializedDataIndex">
              history:{' '}
            </label>
            <input
              title={(index - (serializedData.length - 1)).toString()}
              type="range"
              id="serializedDataIndex"
              name="serializedDataIndex"
              min={0}
              max={serializedData.length - 1}
              value={index}
              onChange={handleIndexChange}
            />
          </div>
        </div>
      )}
    </div>
  );
});

export default FloatingUIMiddleware;
