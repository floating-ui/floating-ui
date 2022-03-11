import {useReducer} from 'react';

export const useForceUpdate = () => useReducer(() => ({}), {})[1];
