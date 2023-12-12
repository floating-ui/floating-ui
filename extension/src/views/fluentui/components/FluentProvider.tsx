import type {GriffelStyle} from '@fluentui/react-components';
import {
  type FluentProviderProps as FluentProviderInternalProps,
  FluentProvider as FluentProviderInternal,
  webDarkTheme,
  webLightTheme,
} from '@fluentui/react-components';
import {makeStyles, mergeClasses, tokens} from '@fluentui/react-components';
import React from 'react';

import {useDevtools} from '../../../contexts/devtools';
import {type LocalTokens} from '../utils/tokens';

const themeToCSSVariables = (theme: LocalTokens): GriffelStyle =>
  Object.fromEntries(
    Object.entries(theme).map(([token, value]) => [`--fuidt-${token}`, value]),
  );

export const lightTheme = themeToCSSVariables({
  htmlElementColor: 'rgb(133, 153, 0)',
  stringColor: 'rgb(203, 75, 22)',
  propertyColor: 'rgb(0, 43, 54)',
});

export const darkTheme = themeToCSSVariables({
  htmlElementColor: 'rgb(166, 226, 46)',
  stringColor: 'rgb(253, 151, 31)',
  propertyColor: 'rgb(249, 248, 245)',
});

const useStyles = makeStyles({
  light: lightTheme,
  dark: darkTheme,
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
      className={mergeClasses(
        devtools.theme === 'dark' ? styles.dark : styles.light,
        styles.common,
        props.className,
      )}
      theme={
        props.theme ?? devtools.theme === 'dark' ? webDarkTheme : webLightTheme
      }
      {...props}
    />
  );
});

FluentProvider.displayName = 'FluentProvider';

export default FluentProvider;
