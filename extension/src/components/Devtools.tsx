import React from 'react';
import {ErrorBoundary} from 'react-error-boundary';

import {
  DevtoolsProvider,
  useChromeDevtoolsContextValue,
} from '../contexts/devtools';
import {views} from '../views';
import {SidePanel} from './SidePanel';

export const Devtools = () => {
  const devtools = useChromeDevtoolsContextValue();
  const View = views[devtools.serializedData.type];
  return (
    <DevtoolsProvider value={devtools}>
      <ErrorBoundary
        fallback={
          <>
            <p>
              ⚠️Something went wrong with '{devtools.serializedData.type}'
              module{' '}
            </p>
            <button onClick={devtools.reload} autoFocus>
              Reload
            </button>
          </>
        }
      >
        <React.Suspense fallback={null}>
          <View />
        </React.Suspense>
      </ErrorBoundary>
      <SidePanel />
    </DevtoolsProvider>
  );
};
