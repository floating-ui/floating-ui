import {Button, makeStyles, shorthands} from '@fluentui/react-components';
import {Eye20Filled} from '@fluentui/react-icons';
import React from 'react';
import JsonView, {type ThemeKeys} from 'react-json-view';

import {useDevtools} from '../../../contexts/devtools';
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
  htmlElement: {
    color: tokens.htmlElementColor,
    letterSpacing: 'unset',
    opacity: 'unset',
  },
  buttonContainer: {},
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
});

export const FluentUIMiddleware = React.memo(() => {
  const devtools = useDevtools('FluentUIMiddleware');
  const {
    middlewareState: {elements, middlewareData, y, x, strategy, rects},
    flipBoundaries,
    initialPlacement,
    options,
    overflowBoundaries,
    placement,
    scrollParents,
  } = devtools.serializedData;
  const styles = useStyles();
  const theme: ThemeKeys =
    devtools.theme === 'dark' ? 'monokai' : 'rjv-default';
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
          <Button
            title={`Inspect floating`}
            icon={<Eye20Filled />}
            iconPosition="after"
            appearance="subtle"
            onClick={() => devtools.inspect(elements.floating)}
          >
            {'<HTMLElement/>'}
          </Button>
        </div>
        <div className={styles.buttonContainer}>
          <span className={styles.propertyKey}>reference :</span>{' '}
          <Button
            title={`Inspect reference`}
            icon={<Eye20Filled />}
            iconPosition="after"
            appearance="subtle"
            onClick={() => devtools.inspect(elements.reference)}
          >
            {'<HTMLElement/>'}
          </Button>
        </div>
        {overflowBoundaries.map((overflowBoundary, index) => {
          return (
            <div key={index} className={styles.buttonContainer}>
              <span className={styles.propertyKey}>
                overflowBoundary[{index}] :
              </span>{' '}
              <Button
                title={`Inspect overflowBoundary ${index}`}
                icon={<Eye20Filled />}
                iconPosition="after"
                appearance="subtle"
                onClick={() => devtools.inspect(overflowBoundary)}
              >
                {'<HTMLElement/>'}
              </Button>
            </div>
          );
        })}
        {flipBoundaries.map((flipBoundary, index) => {
          return (
            <div key={index} className={styles.buttonContainer}>
              <span className={styles.propertyKey}>
                flipBoundary[{index}] :
              </span>{' '}
              <Button
                title={`Inspect flipBoundary ${index}`}
                icon={<Eye20Filled />}
                iconPosition="after"
                appearance="subtle"
                onClick={() => devtools.inspect(flipBoundary)}
              >
                {'<HTMLElement/>'}
              </Button>
            </div>
          );
        })}
        {scrollParents.map((scrollParent, index) => {
          return (
            <div key={index} className={styles.buttonContainer}>
              <span className={styles.propertyKey}>
                scrollParent[{index}] :
              </span>{' '}
              <Button
                title={`Inspect scrollParent ${index}`}
                icon={<Eye20Filled />}
                iconPosition="after"
                appearance="subtle"
                onClick={() => devtools.inspect(scrollParent)}
              >
                {'<HTMLElement/>'}
              </Button>
            </div>
          );
        })}
      </div>
    </FluentProvider>
  );
});

FluentUIMiddleware.displayName = 'FluentUIMiddleware';

export default FluentUIMiddleware;
