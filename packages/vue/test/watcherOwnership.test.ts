import {expect, test, vi} from 'vitest';
import {effectScope, shallowRef, watch} from 'vue';

import {useFloating} from '../src';

// Forward to Vue's real watcher implementation while observing creation. In
// Vue 3.4, a watcher created after scope.stop() can read a stopped computed ref
// without reacting later, so reactive output alone cannot detect that watcher.
vi.mock('vue', async (importOriginal) => {
  const vue = await importOriginal<typeof import('vue')>();
  return {...vue, watch: vi.fn(vue.watch)};
});

test('does not create watchers after the initial callback stops its owner', () => {
  const watchCalls = vi.mocked(watch);
  watchCalls.mockClear();
  const scope = effectScope();
  let watchesAtStop = 0;
  const attach = vi.fn(() => {
    watchesAtStop = watchCalls.mock.calls.length;
    scope.stop();
    return vi.fn();
  });
  try {
    scope.run(() => {
      useFloating(
        shallowRef(document.createElement('div')),
        shallowRef(document.createElement('div')),
        {whileElementsMounted: attach},
      );
    });
    expect(attach).toHaveBeenCalledTimes(1);
    expect(watchesAtStop).toBeGreaterThan(0);
    expect(watchCalls).toHaveBeenCalledTimes(watchesAtStop);
  } finally {
    scope.stop();
    watchCalls.mockClear();
  }
});
