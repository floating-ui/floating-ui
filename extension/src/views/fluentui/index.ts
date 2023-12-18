import React from 'react';

export type * from './utils/data-types';

export const FluentUIMiddleware = React.lazy(
  () => import('./components/FluentUIMiddleware'),
);

export const views = {
  FluentUIMiddleware,
};
