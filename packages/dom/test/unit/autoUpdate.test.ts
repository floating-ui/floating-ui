import {afterEach, beforeEach, describe, expect, test, vi} from 'vitest';

import {autoUpdate} from '../../src/autoUpdate';
import {computePosition, flip, size, type Middleware} from '../../src';

// `autoUpdate` depends on real `IntersectionObserver`/`ResizeObserver` and
// layout, so these assertions only run in the browser test environment
// (`pnpm test:browser`). Under warpdom (`pnpm test`) they are skipped rather
// than mocked.
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

test('cleans up when animation frames and observers are unavailable', () => {
  vi.stubGlobal('cancelAnimationFrame', undefined);
  const update = vi.fn();

  try {
    const cleanup = autoUpdate(reference, floating, update, {
      elementResize: false,
      layoutShift: false,
    });

    expect(update).toHaveBeenCalledTimes(1);
    expect(cleanup).not.toThrow();
  } finally {
    vi.unstubAllGlobals();
  }
});

test('tolerates ResizeObserver mocks whose entries lack `contentRect`', () => {
  // Shaped like the mock in Radix's test setup: it calls back synchronously
  // on `observe` with an entry that has neither `target` nor `contentRect`.
  class MockResizeObserver {
    constructor(private callback: ResizeObserverCallback) {}
    observe() {
      this.callback(
        [{borderBoxSize: [{inlineSize: 0, blockSize: 0}]}] as any,
        this as any,
      );
    }
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal('ResizeObserver', MockResizeObserver);
  const update = vi.fn();

  try {
    const cleanup = autoUpdate(reference, floating, update, {
      layoutShift: false,
    });

    // The setup update plus one per observed element.
    expect(update).toHaveBeenCalledTimes(3);
    cleanup();
  } finally {
    vi.unstubAllGlobals();
  }
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

describe.runIf(inBrowser)('elementResize', () => {
  const loopErrors: string[] = [];

  function onError(event: ErrorEvent) {
    if (event.message.includes('ResizeObserver loop')) {
      loopErrors.push(event.message);
      // Keep the test runner from reporting it as an unhandled error; the
      // assertions below check it instead.
      event.preventDefault();
    }
  }

  function nextFrames(count: number) {
    return new Promise<void>((resolve) => {
      function tick(remaining: number) {
        if (remaining === 0) {
          resolve();
        } else {
          requestAnimationFrame(() => tick(remaining - 1));
        }
      }
      tick(count);
    });
  }

  function computeWith(middleware: Middleware[]) {
    return vi.fn(() => {
      computePosition(reference, floating, {middleware}).then(({x, y}) => {
        Object.assign(floating.style, {left: `${x}px`, top: `${y}px`});
      });
    });
  }

  beforeEach(() => {
    loopErrors.length = 0;
    window.addEventListener('error', onError);
    floating.style.position = 'absolute';
  });

  afterEach(() => {
    window.removeEventListener('error', onError);
  });

  test('does not report a loop when an update resizes the floating element after the reference resized', async () => {
    const update = computeWith([
      size({
        apply({rects, elements}) {
          elements.floating.style.width = `${rects.reference.width}px`;
        },
      }),
    ]);
    const cleanup = autoUpdate(reference, floating, update);
    await nextFrames(3);
    expect(floating.style.width).toBe('100px');

    reference.style.width = '150px';
    await nextFrames(3);

    expect(floating.style.width).toBe('150px');
    expect(loopErrors).toEqual([]);

    cleanup();
  });

  test('does not report a loop when the floating element flips after it resized', async () => {
    Object.assign(reference.style, {
      position: 'absolute',
      top: `${window.innerHeight - 200}px`,
    });
    const update = computeWith([
      flip(),
      size({
        apply({placement, elements}) {
          elements.floating.style.width =
            placement === 'top' ? '120px' : '80px';
        },
      }),
    ]);
    const cleanup = autoUpdate(reference, floating, update);
    await nextFrames(3);
    expect(floating.style.width).toBe('80px');

    // Taller than the space below the reference, so it flips to the top,
    // where `size` applies a different width.
    floating.style.height = '150px';
    await nextFrames(3);

    expect(floating.style.width).toBe('120px');
    expect(loopErrors).toEqual([]);

    cleanup();
  });

  test('updates once more after the reference resized, even if the floating element kept its size', async () => {
    Object.assign(reference.style, {
      position: 'absolute',
      top: '200px',
      height: '20px',
    });
    floating.style.height = '80px';
    const update = vi.fn(() => {
      computePosition(reference, floating, {middleware: [flip()]}).then(
        ({x, y, placement}) => {
          // Changes the border box but not the observed content box.
          floating.style.paddingBottom = placement === 'top' ? '20px' : '0px';
          Object.assign(floating.style, {left: `${x}px`, top: `${y}px`});
        },
      );
    });
    const cleanup = autoUpdate(reference, floating, update, {
      layoutShift: false,
    });
    await nextFrames(3);

    // Too tall to leave room below, so it flips to the top, where the padding
    // makes the floating element taller than the update measured.
    reference.style.height = `${window.innerHeight - 220}px`;
    await nextFrames(5);

    expect(floating.getBoundingClientRect().bottom).toBe(
      reference.getBoundingClientRect().top,
    );
    expect(loopErrors).toEqual([]);

    cleanup();
  });

  test('does not update while neither element resizes', async () => {
    const update = computeWith([
      size({
        apply({rects, elements}) {
          elements.floating.style.width = `${rects.reference.width}px`;
        },
      }),
    ]);
    const cleanup = autoUpdate(reference, floating, update, {
      ancestorScroll: false,
      ancestorResize: false,
      layoutShift: false,
    });
    await nextFrames(5);
    update.mockClear();

    await nextFrames(10);

    expect(update).not.toHaveBeenCalled();

    cleanup();
  });
});
