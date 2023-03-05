import * as React from 'react';

export function useInstance<T>(value: T | (() => T)): T {
  return React.useState(value)[0];
}
