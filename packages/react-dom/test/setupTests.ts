import * as matchers from '@testing-library/jest-dom/matchers';
import {expect, vi} from 'vitest';

expect.extend(matchers);

vi.spyOn(window, 'requestAnimationFrame').mockImplementation(
  (callback: FrameRequestCallback): number => {
    callback(0);
    return 0;
  },
);
