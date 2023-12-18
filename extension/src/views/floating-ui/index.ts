import React from 'react';

export type * from './data-types';

export const FloatingUIMiddleware = React.lazy(
  () => import('./FloatingUIMiddleware'),
);

export const views = {
  FloatingUIMiddleware,
};
