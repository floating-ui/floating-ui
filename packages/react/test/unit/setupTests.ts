import '@testing-library/jest-dom';

import * as matchers from '@testing-library/jest-dom/matchers';
import {expect, vi} from 'vitest';

import ResizeObserverPolyfill from 'resize-observer-polyfill';

expect.extend(matchers);

// https://github.com/testing-library/react-testing-library/issues/1197#issuecomment-2619825237
(globalThis as any).jest = vi;

// Wait for https://github.com/vitest-dev/vitest/issues/7675
// Since we mock requestAnimationFrame to be sync to make testing easier,
// the guard to prevent the ResizeObserver error in the browser doesn't work
globalThis.addEventListener('error', (error) => {
  throw error;
});

vi.spyOn(window, 'requestAnimationFrame').mockImplementation(
  (callback: FrameRequestCallback): number => {
    callback(0);
    return 0;
  },
);

Object.defineProperty(HTMLElement.prototype, 'inert', {
  configurable: true,
  enumerable: false,
  writable: true,
  value: true,
});
globalThis.ResizeObserver = ResizeObserverPolyfill;

class PointerEvent extends MouseEvent {
  public isPrimary: boolean;
  public pointerId: number;
  public pointerType: string;
  public height: number;
  public width: number;
  public tiltX: number;
  public tiltY: number;
  public twist: number;
  public pressure: number;
  public tangentialPressure: number;

  constructor(type: string, params: PointerEventInit = {}) {
    super(type, params);

    // Using defaults from W3C specs:
    // https://w3c.github.io/pointerevents/#pointerevent-interface
    this.isPrimary = params.isPrimary ?? false;
    this.pointerId = params.pointerId ?? 0;
    this.pointerType = params.pointerType ?? '';
    this.width = params.width ?? 1;
    this.height = params.height ?? 1;
    this.tiltX = params.tiltX ?? 0;
    this.tiltY = params.tiltY ?? 0;
    this.twist = params.twist ?? 0;
    this.pressure = params.pressure ?? 0;
    this.tangentialPressure = params.tangentialPressure ?? 0;
  }
}

globalThis.PointerEvent =
  globalThis.PointerEvent ?? (PointerEvent as typeof globalThis.PointerEvent);
