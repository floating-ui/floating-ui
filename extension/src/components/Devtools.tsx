import * as React from 'react';
import {ErrorBoundary} from 'react-error-boundary';

import {
  DevtoolsProvider,
  useChromeDevtoolsContextValue,
} from '../contexts/devtools';
import {
  SerializedDataProvider,
  useSerializedDataContextValue,
} from '../contexts/serializedData';
import {MainPanel} from './MainPanel';
import {SidePanel} from './SidePanel';
import SomethingWentWrong from './SomethingWentWrong';

export const Devtools = () => {
  const devtools = useChromeDevtoolsContextValue();
  return (
    <DevtoolsProvider value={devtools}>
      <SerializedDataProvider value={useSerializedDataContextValue(devtools)}>
        <ErrorBoundary FallbackComponent={SomethingWentWrong}>
          <MainPanel />
          <SidePanel />
        </ErrorBoundary>
      </SerializedDataProvider>
    </DevtoolsProvider>
  );
};
