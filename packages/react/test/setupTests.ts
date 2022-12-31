import '@testing-library/jest-dom';

import ResizeObserverPolyfill from 'resize-observer-polyfill';

jest
  .spyOn(window, 'requestAnimationFrame')
  .mockImplementation((callback: FrameRequestCallback): number => {
    callback(0);
    return 0;
  });

global.ResizeObserver = ResizeObserverPolyfill;
