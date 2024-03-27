import '@testing-library/jest-dom';

import * as matchers from '@testing-library/jest-dom/matchers';
import {expect, vi} from 'vitest';

expect.extend(matchers);

import ResizeObserverPolyfill from 'resize-observer-polyfill';

vi.spyOn(window, 'requestAnimationFrame').mockImplementation(
  (callback: FrameRequestCallback): number => {
    callback(0);
    return 0;
  },
);

HTMLElement.prototype.inert = true;
global.ResizeObserver = ResizeObserverPolyfill;

function isNullOrUndefined(a: unknown) {
  return a == null;
}
