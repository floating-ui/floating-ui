import {waitFor} from '@testing-library/vue';
import {afterEach} from 'vitest';
import {effectScope, ref, shallowRef} from 'vue';

import {useFloating} from '../src';
import type {
  Middleware,
  Placement,
  ReferenceElement,
  Strategy,
  UseFloatingOptions,
} from '../src/types';

// Let computePosition finish its Promise chain after releasing real middleware.
const flush = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

describe('async positioning', () => {
  const scopes: ReturnType<typeof effectScope>[] = [];

  afterEach(() => {
    scopes.splice(0).forEach((scope) => scope.stop());
  });

  function setup(options: UseFloatingOptions = {}) {
    const pending: Array<() => void> = [];
    const middleware: Middleware = {
      name: 'async',
      async fn() {
        const value = pending.length + 1;
        await new Promise<void>((resolve) => pending.push(resolve));
        return {x: value, y: value * 2, data: {value}};
      },
    };
    const scope = effectScope();
    scopes.push(scope);
    const middlewareOption = shallowRef([middleware]);
    const reference = shallowRef<ReferenceElement | null>(null);
    const floating = shallowRef<HTMLElement | null>(null);
    const open = ref(true);
    const api = scope.run(() =>
      useFloating(reference, floating, {
        open,
        middleware: middlewareOption,
        ...options,
      }),
    )!;
    reference.value = document.createElement('button');
    floating.value = document.createElement('div');

    async function started(count: number) {
      await waitFor(() => expect(pending).toHaveLength(count));
    }

    async function finish(index: number) {
      pending[index]();
      await flush();
    }

    function snapshot() {
      return {
        x: api.x.value,
        y: api.y.value,
        strategy: api.strategy.value,
        placement: api.placement.value,
        middlewareData: api.middlewareData.value,
        isPositioned: api.isPositioned.value,
      };
    }

    return {
      scope,
      reference,
      floating,
      open,
      middleware: middlewareOption,
      api,
      started,
      finish,
      snapshot,
    };
  }

  test('applies an ordinary async result and subsequent manual update', async () => {
    const s = setup();
    await s.started(1);
    expect(s.api.isPositioned.value).toBe(false);
    await s.finish(0);
    expect(s.snapshot()).toEqual({
      x: 1,
      y: 2,
      strategy: 'absolute',
      placement: 'bottom',
      middlewareData: {async: {value: 1}},
      isPositioned: true,
    });
    s.api.update();
    await s.started(2);
    await s.finish(1);
    expect(s.api.x.value).toBe(2);
  });

  test('keeps the latest placement, strategy, coordinates and middleware data', async () => {
    const placement = ref<Placement>('bottom');
    const strategy = ref<Strategy>('absolute');
    const s = setup({placement, strategy});
    await s.started(1);
    placement.value = 'right';
    strategy.value = 'fixed';
    await s.started(3);
    await s.finish(2);
    const latest = s.snapshot();
    expect(latest).toMatchObject({placement: 'right', strategy: 'fixed', x: 3});
    await s.finish(1);
    await s.finish(0);
    expect(s.snapshot()).toEqual(latest);
  });

  test('ignores an older manual update even while the latest is pending', async () => {
    const s = setup();
    await s.started(1);
    s.api.update();
    await s.started(2);
    const initial = s.snapshot();
    await s.finish(0);
    expect(s.snapshot()).toEqual(initial);
    await s.finish(1);
    expect(s.api.x.value).toBe(2);
    expect(s.api.isPositioned.value).toBe(true);
  });

  test('does not let a pending open result position a closed floating element', async () => {
    const s = setup();
    await s.started(1);
    s.open.value = false;
    await s.started(2);
    await s.finish(1);
    const closed = s.snapshot();
    expect(closed.isPositioned).toBe(false);
    // Closed elements may still be positioned for an exit transition.
    expect(closed.x).toBe(2);
    await s.finish(0);
    expect(s.snapshot()).toEqual(closed);
  });

  test('requires a fresh result on reopen and ignores the old closed result', async () => {
    const s = setup();
    await s.started(1);
    await s.finish(0);
    s.open.value = false;
    await s.started(2);
    s.open.value = true;
    await s.started(3);
    expect(s.api.isPositioned.value).toBe(false);
    await s.finish(2);
    const reopened = s.snapshot();
    expect(reopened.isPositioned).toBe(true);
    await s.finish(1);
    expect(s.snapshot()).toEqual(reopened);
  });

  test('ignores an open result from before a close and reopen', async () => {
    const s = setup();
    await s.started(1);
    s.open.value = false;
    s.open.value = true;
    await s.started(3);
    await s.finish(0);
    expect(s.api.isPositioned.value).toBe(false);
    await s.finish(2);
    const latest = s.snapshot();
    await s.finish(1);
    expect(s.snapshot()).toEqual(latest);
  });

  test('ignores a result from replaced middleware', async () => {
    const s = setup();
    await s.started(1);
    s.middleware.value = [{name: 'replacement', fn: () => ({x: 42})}];
    await waitFor(() => expect(s.api.x.value).toBe(42));
    const latest = s.snapshot();
    await s.finish(0);
    expect(s.snapshot()).toEqual(latest);
  });

  test.each(['reference', 'floating'] as const)(
    'ignores results after the %s element is replaced',
    async (element) => {
      const s = setup();
      await s.started(1);
      s[element].value = document.createElement('div');
      await s.started(2);
      await s.finish(1);
      const latest = s.snapshot();
      await s.finish(0);
      expect(s.snapshot()).toEqual(latest);
    },
  );

  test.each(['reference', 'floating'] as const)(
    'ignores results after the %s element is cleared',
    async (element) => {
      const s = setup();
      await s.started(1);
      s[element].value = null;
      const initial = s.snapshot();
      await s.finish(0);
      expect(s.snapshot()).toEqual(initial);
    },
  );

  test('invalidates results when an element callback does not request another update', async () => {
    let mounted = 0;
    let cleaned = 0;
    const s = setup({
      whileElementsMounted(_reference, _floating, update) {
        if (++mounted === 1) update();
        return () => cleaned++;
      },
    });
    await s.started(1);
    s.reference.value = document.createElement('button');
    expect(mounted).toBe(2);
    expect(cleaned).toBe(1);
    const initial = s.snapshot();
    await s.finish(0);
    expect(s.snapshot()).toEqual(initial);
    // A later update for the replacement is still valid.
    s.api.update();
    await s.started(2);
    await s.finish(1);
    expect(s.api.isPositioned.value).toBe(true);
  });

  test('ignores pending results and manual updates after scope disposal', async () => {
    const s = setup();
    await s.started(1);
    const initial = s.snapshot();
    s.scope.stop();
    await s.finish(0);
    expect(s.snapshot()).toEqual(initial);
    s.api.update();
    await flush();
    expect(s.snapshot()).toEqual(initial);
    await s.started(1);
  });
});
