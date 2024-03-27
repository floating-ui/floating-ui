import type {SliderOnChangeData} from '@fluentui/react-components';
import {
  Button,
  Label,
  makeStyles,
  shorthands,
  Slider,
  Tooltip,
} from '@fluentui/react-components';
import {Eye20Filled} from '@fluentui/react-icons';
import React from 'react';

import {useDevtools} from '../../../contexts/devtools';
import {useSerializedData} from '../../../contexts/serializedData';
import type {Serialized} from '../../../types';
import JsonView from '../../common/components/JsonView';
import type {FluentUIMiddlewareData} from '../utils/data-types';
import {tokens} from '../utils/tokens';
import FluentProvider from './FluentProvider';

const useStyles = makeStyles({
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    ...shorthands.paddingBlock('4px'),
    ...shorthands.paddingInline('calc(1rem + 2px)'),
    rowGap: '2px',
  },
  propertyKey: {
    cursor: 'default',
    fontFamily: 'monospace',
    color: tokens.propertyColor,
    letterSpacing: '0.5px',
    opacity: '0.85',
  },
  keyValueContainer: {
    cursor: 'default',
    ...shorthands.paddingBlock('4px'),
    ...shorthands.paddingInline('calc(1rem + 2px)'),
  },
  string: {
    fontFamily: 'monospace',
    color: tokens.stringColor,
    opacity: 'unset',
    letterSpacing: 'unset',
  },
  center: {
    display: 'flex',
    alignItems: 'center',
  },
});

export const FluentUIMiddleware = React.memo(() => {
  const serializedData = useSerializedData('FluentUIMiddleware');
  const devtools = useDevtools();
  const styles = useStyles();
  const [index, setIndex] = React.useState(serializedData.length - 1);
  const handleIndexChange = React.useCallback(
    (_: React.ChangeEvent, {value}: SliderOnChangeData) => {
      setIndex(value);
    },
    [],
  );
  const selectedSerializedDataIndex = serializedData.length - 1 - index;
  const selectedSerializedData = serializedData[selectedSerializedDataIndex];
  const {
    middlewareState: {middlewareData, y, x, strategy, rects},
    initialPlacement,
    options,
    placement,
  } = selectedSerializedData;

  React.useEffect(() => {
    setIndex(serializedData.length - 1);
  }, [serializedData.length]);

  return (
    <FluentProvider>
      {Object.entries({
        strategy,
        coords: {x, y},
        initialPlacement,
        placement,
        middlewareData,
        options,
        rects,
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
        {getReferences(selectedSerializedData).map(([name, reference]) => (
          <div key={reference}>
            <span className={styles.propertyKey}>{name} :</span>{' '}
            <Tooltip relationship="label" content={`Inspect ${name}`}>
              <Button
                icon={<Eye20Filled />}
                iconPosition="after"
                appearance="subtle"
                onClick={() => devtools.inspectByReferenceId(reference)}
              >
                {'<HTMLElement/>'}
              </Button>
            </Tooltip>
          </div>
        ))}
      </div>
      {serializedData.length > 1 && (
        <div className={styles.buttonGroup}>
          <div className={styles.center}>
            <Label className={styles.propertyKey} htmlFor="serializedDataIndex">
              history:{' '}
            </Label>
            <Tooltip
              relationship="description"
              content={index - (serializedData.length - 1)}
            >
              <Slider
                id="serializedDataIndex"
                min={0}
                max={serializedData.length - 1}
                value={index}
                onChange={handleIndexChange}
              />
            </Tooltip>
          </div>
        </div>
      )}
    </FluentProvider>
  );
});

FluentUIMiddleware.displayName = 'FluentUIMiddleware';

export default FluentUIMiddleware;

const getReferences = ({
  flipBoundaries,
  overflowBoundaries,
  scrollParents,
  middlewareState: {elements},
}: Serialized<FluentUIMiddlewareData>) =>
  Object.entries({
    floating: elements.floating,
    reference: elements.reference,
    overflowBoundary: overflowBoundaries,
    flipBoundary: flipBoundaries,
    scrollParent: scrollParents,
  }).flatMap(([key, value]) => {
    if (typeof value === 'string') {
      return [[key, value]] as const;
    }
    if (value.length === 0) {
      return [] as const;
    }
    if (value.length === 1) {
      return [[key, value[0]]] as const;
    }
    return value.map(
      (element, index) => [`${key}[${index}]`, element] as const,
    );
  });
