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

export const fluentDecorator = (props?: FluentProviderProps) =>
  function Wrapper(Story: React.ElementType) {
    return (
      <FluentProvider theme={webLightTheme} {...props}>
        <Story />
      </FluentProvider>
    );
  };

export const serializedDataDecorator = (
  serializedData = defaultSerializedDataContextValue.serializedData,
) =>
  function Wrapper(Story: React.ElementType) {
    return (
      <SerializedDataProvider
        value={{...defaultSerializedDataContextValue, serializedData}}
      >
        <Story />
      </SerializedDataProvider>
    );
  };

export const devtoolsDecorator = (value = devtoolsDefaultContextValue) =>
  function Wrapper(Story: React.ElementType) {
    return (
      <DevtoolsProvider value={value}>
        <Story />
      </DevtoolsProvider>
    );
  };
