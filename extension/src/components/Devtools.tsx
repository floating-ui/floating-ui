import React from 'react';

import {
  DevtoolsProvider,
  useChromeDevtoolsContextValue,
} from '../contexts/devtools';
import {views} from '../views';
import {SidePanel} from './SidePanel';

export const Devtools = () => {
  const devtools = useChromeDevtoolsContextValue();
  const View = views[devtools.serializedData.type];
  console.log(View, devtools.serializedData.type);
  return (
    <DevtoolsProvider value={devtools}>
      <React.Suspense fallback={null}>
        <View />
      </React.Suspense>
      <SidePanel />
    </DevtoolsProvider>
  );
};
