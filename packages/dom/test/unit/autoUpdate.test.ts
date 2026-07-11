import {afterEach, beforeEach, expect, test, vi} from 'vitest';

import {autoUpdate} from '../../src/autoUpdate';

// `autoUpdate` depends on real `IntersectionObserver`/`ResizeObserver` and
// layout, so these assertions only run in the browser test environment
// (`pnpm test:browser`). Under jsdom they are skipped rather than mocked.
const inBrowser = typeof IntersectionObserver === 'function';

let reference: HTMLElement;
let floating: HTMLElement;

beforeEach(() => {
  reference = document.createElement('div');
  floating = document.createElement('div');
  // Real, non-empty layout so `observeMove` builds its observer instead of
  // bailing on a zero-sized element.
  reference.style.cssText = 'width: 100px; height: 100px;';
  floating.style.cssText = 'width: 50px; height: 50px;';
  document.body.append(reference, floating);
});

afterEach(() => {
  reference.remove();
  floating.remove();
});

test.runIf(inBrowser)(
  'runs the update callback once per window resize with default options',
  () => {
    const update = vi.fn();
    const cleanup = autoUpdate(reference, floating, update);
    // Ignore the immediate update performed on setup. The assertion runs
    // synchronously, before any async `IntersectionObserver` callback, so it
    // observes only the synchronous resize listeners.
    update.mockClear();

    window.dispatchEvent(new Event('resize'));

    // The window is a resize ancestor, so its listener runs the update. The
    // `layoutShift` observer also listens for resize but must only rebuild its
    // observer, not fire a second, redundant update.
    expect(update).toHaveBeenCalledTimes(1);

    cleanup();
  },
);

test.runIf(inBrowser)(
  'runs the update callback once per window resize when ancestorResize is disabled',
  () => {
    const update = vi.fn();
    const cleanup = autoUpdate(reference, floating, update, {
      ancestorResize: false,
    });
    update.mockClear();

    window.dispatchEvent(new Event('resize'));

    // No ancestor resize listener is registered, so the `layoutShift`
    // observer's resize handler is the sole update.
    expect(update).toHaveBeenCalledTimes(1);

    cleanup();
  },
);
