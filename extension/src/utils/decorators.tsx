import React from 'react';
import type {FluentProviderProps} from '@fluentui/react-components';
import {FluentProvider, webLightTheme} from '@fluentui/react-components';

import {
  defaultSerializedDataContextValue,
  SerializedDataProvider,
} from '../contexts/serializedData';
import {
  devtoolsDefaultContextValue,
  DevtoolsProvider,
} from '../contexts/devtools';

export const fluentDecorator =
  (props?: FluentProviderProps) => (Story: React.ElementType) => (
    <FluentProvider theme={webLightTheme} {...props}>
      <Story />
    </FluentProvider>
  );

export const serializedDataDecorator =
  (serializedData = defaultSerializedDataContextValue.serializedData) =>
  (Story: React.ElementType) => (
    <SerializedDataProvider
      value={{...defaultSerializedDataContextValue, serializedData}}
    >
      <Story />
    </SerializedDataProvider>
  );

export const devtoolsDecorator =
  (value = devtoolsDefaultContextValue) =>
  (Story: React.ElementType) => (
    <DevtoolsProvider value={value}>
      <Story />
    </DevtoolsProvider>
  );
