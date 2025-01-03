import type {FluentProviderProps as FluentProviderInternalProps} from '@fluentui/react-components';
import {
  FluentProvider as FluentProviderInternal,
  webDarkTheme,
  webLightTheme,
} from '@fluentui/react-components';
import {makeStyles, mergeClasses, tokens} from '@fluentui/react-components';
import React from 'react';

import {useDevtools} from '../../../contexts/devtools';

const useStyles = makeStyles({
  common: {
    color: tokens.colorNeutralForeground1,
    backgroundColor: tokens.colorNeutralBackground1,
    height: 'inherit',
    width: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
});

export type FluentProviderProps = FluentProviderInternalProps;

export const FluentProvider = React.memo((props: FluentProviderProps) => {
  const devtools = useDevtools();
  const styles = useStyles();
  return (
    <FluentProviderInternal
      className={mergeClasses(styles.common, props.className)}
      applyStylesToPortals={false}
      theme={
        props.theme ?? devtools.theme === 'dark' ? webDarkTheme : webLightTheme
      }
      {...props}
    />
  );
});

FluentProvider.displayName = 'FluentProvider';

export default FluentProvider;
