import {waitFor} from '@testing-library/vue';
import {afterEach, describe, expect, test, vi} from 'vitest';
import {
  createApp,
  effectScope,
  h,
  nextTick,
  onMounted,
  ref,
  shallowRef,
} from 'vue';

import {offset, useFloating} from '../src';

const disposers: Array<() => void> = [];

afterEach(() => {
  disposers
    .splice(0)
    .reverse()
    .forEach((dispose) => dispose());
});

function element() {
  const el = document.createElement('div');
  document.body.append(el);
  disposers.push(() => el.remove());
  return el;
}

function own(owner: 'setup' | 'onMounted' | 'scope', setup: () => void) {
  if (owner === 'scope') {
    const scope = effectScope();
    scope.run(setup);
    const dispose = () => scope.stop();
    disposers.push(dispose);
    return dispose;
  }

  const app = createApp({
    setup() {
      if (owner === 'onMounted') {
        onMounted(setup);
      } else {
        setup();
      }
      return () => h('div');
    },
  });
  app.mount(element());
  let mounted = true;
  const dispose = () => {
    if (mounted) {
      app.unmount();
      mounted = false;
    }
  };
  disposers.push(dispose);
  return dispose;
}

describe.each(['setup', 'onMounted', 'scope'] as const)(
  'initial elements in %s',
  (owner) => {
    test('positions once, then responds to options, manual updates and reattachment', async () => {
      const reference = shallowRef<HTMLElement | null>(element());
      const floating = shallowRef<HTMLElement | null>(element());
      expect(reference.value?.isConnected).toBe(true);
      expect(floating.value?.isConnected).toBe(true);
      const placement = ref<'bottom' | 'right'>('bottom');
      let distance = 5;
      const measure = vi.fn(() => ({}));
      let position!: ReturnType<typeof useFloating>;
      own(owner, () => {
        position = useFloating(reference, floating, {
          placement,
          middleware: [offset(() => distance), {name: 'measure', fn: measure}],
        });
      });

      await waitFor(() => expect(position.y.value).toBe(5));
      expect(position.isPositioned.value).toBe(true);
      expect(measure).toHaveBeenCalledTimes(1);

      placement.value = 'right';
      await waitFor(() => expect(position.x.value).toBe(5));
      expect(measure).toHaveBeenCalledTimes(2);

      distance = 10;
      position.update();
      await waitFor(() => expect(position.x.value).toBe(10));
      expect(measure).toHaveBeenCalledTimes(3);

      floating.value = null;
      position.update();
      await nextTick();
      expect(measure).toHaveBeenCalledTimes(3);

      distance = 15;
      floating.value = element();
      await waitFor(() => expect(position.x.value).toBe(15));
      expect(measure).toHaveBeenCalledTimes(4);
    });

    test('attaches once, leaves updates to the callback and cleans up each pair once', async () => {
      const reference = shallowRef<HTMLElement | null>(element());
      const floating = shallowRef<HTMLElement | null>(element());
      const cleanups: Array<ReturnType<typeof vi.fn>> = [];
      const measure = vi.fn(() => ({}));
      const whileElementsMounted = vi.fn(() => {
        const cleanup = vi.fn();
        cleanups.push(cleanup);
        return cleanup;
      });
      let position!: ReturnType<typeof useFloating>;
      const dispose = own(owner, () => {
        position = useFloating(reference, floating, {
          whileElementsMounted,
          middleware: [{name: 'measure', fn: measure}],
        });
      });

      expect(whileElementsMounted).toHaveBeenCalledExactlyOnceWith(
        reference.value,
        floating.value,
        position.update,
      );
      // A callback that does not call update must not trigger positioning.
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(measure).not.toHaveBeenCalled();
      expect(position.isPositioned.value).toBe(false);

      position.update();
      await waitFor(() => expect(position.isPositioned.value).toBe(true));
      expect(measure).toHaveBeenCalledTimes(1);

      reference.value = element();
      expect(cleanups[0]).toHaveBeenCalledTimes(1);
      expect(whileElementsMounted).toHaveBeenCalledTimes(2);
      floating.value = element();
      expect(cleanups[1]).toHaveBeenCalledTimes(1);
      expect(whileElementsMounted).toHaveBeenCalledTimes(3);

      floating.value = null;
      expect(cleanups[2]).toHaveBeenCalledTimes(1);
      reference.value = null;
      expect(whileElementsMounted).toHaveBeenCalledTimes(3);
      reference.value = element();
      expect(whileElementsMounted).toHaveBeenCalledTimes(3);
      floating.value = element();
      expect(whileElementsMounted).toHaveBeenCalledTimes(4);

      dispose();
      expect(cleanups[3]).toHaveBeenCalledTimes(1);
      reference.value = element();
      floating.value = element();
      expect(whileElementsMounted).toHaveBeenCalledTimes(4);
      cleanups.forEach((cleanup) => expect(cleanup).toHaveBeenCalledTimes(1));
    });

    test('does not duplicate the initial update performed by the callback', async () => {
      const measure = vi.fn(() => ({}));
      const cleanup = vi.fn();
      const whileElementsMounted = vi.fn((_reference, _floating, update) => {
        update();
        return cleanup;
      });
      let position!: ReturnType<typeof useFloating>;
      const reference = shallowRef(element());
      const floating = shallowRef(element());
      const dispose = own(owner, () => {
        position = useFloating(reference, floating, {
          whileElementsMounted,
          middleware: [{name: 'measure', fn: measure}],
        });
      });
      await waitFor(() => expect(position.isPositioned.value).toBe(true));
      expect(whileElementsMounted).toHaveBeenCalledTimes(1);
      expect(measure).toHaveBeenCalledTimes(1);
      dispose();
      expect(cleanup).toHaveBeenCalledTimes(1);
    });
  },
);

test.each(['neither', 'reference', 'floating'] as const)(
  'defers attaching when initially populated refs are %s',
  (populated) => {
    const reference = shallowRef(populated === 'reference' ? element() : null);
    const floating = shallowRef(populated === 'floating' ? element() : null);
    const cleanup = vi.fn();
    const whileElementsMounted = vi.fn(() => cleanup);
    const dispose = own('scope', () => {
      useFloating(reference, floating, {whileElementsMounted});
    });
    expect(whileElementsMounted).not.toHaveBeenCalled();
    reference.value ??= element();
    floating.value ??= element();
    expect(whileElementsMounted).toHaveBeenCalledTimes(1);
    reference.value = null;
    expect(cleanup).toHaveBeenCalledTimes(1);
    dispose();
    expect(cleanup).toHaveBeenCalledTimes(1);
  },
);
