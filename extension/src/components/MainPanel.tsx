import React from 'react';

import {useDevtools} from '../contexts/devtools';
import {useSerializedData} from '../contexts/serializedData';
import {views} from '../views';

export const MainPanel = () => {
  const devtools = useDevtools();
  const [serializedData] = useSerializedData();
  if (devtools.error) {
    throw devtools.error;
  }
  const Component = views[serializedData.type];
  return (
    <React.Suspense fallback={null}>
      <Component />
    </React.Suspense>
  );
};
