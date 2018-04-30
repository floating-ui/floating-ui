// @flow
import type { EventListeners } from '../types';

// Expands the eventListeners value to an object containing the
// `scroll` and `resize` booleans
//
// true => true, true
// false => false, false
// true, false => true, false
// false, false => false, false
export default (
  eventListeners: boolean | { scroll?: boolean, resize?: boolean }
): EventListeners => {
  const fallbackValue =
    typeof eventListeners === 'boolean' ? eventListeners : false;

  return {
    scroll:
      typeof eventListeners.scroll === 'boolean'
        ? eventListeners.scroll
        : fallbackValue,
    resize:
      typeof eventListeners.resize === 'boolean'
        ? eventListeners.resize
        : fallbackValue,
  };
};
