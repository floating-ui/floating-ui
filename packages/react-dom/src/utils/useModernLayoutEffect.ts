import * as React from 'react';

export const useModernLayoutEffect =
  typeof document !== 'undefined' ? React.useLayoutEffect : React.useEffect;
