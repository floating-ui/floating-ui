import {expect, test, vi} from 'vitest';
import {effectScope, shallowRef} from 'vue';

import {useFloating} from '../src';

test('ordinary disposal after initial attachment releases its cleanup exactly once', () => {
  const scope = effectScope();
  const reference = shallowRef(document.createElement('div'));
  const floating = shallowRef(document.createElement('div'));
  const cleanup = vi.fn();
  scope.run(() => {
    useFloating(reference, floating, {whileElementsMounted: () => cleanup});
  });
  expect(cleanup).not.toHaveBeenCalled();
  scope.stop();
  scope.stop();
  expect(cleanup).toHaveBeenCalledTimes(1);
});

test('null refs do not invoke a disposing callback and the owner can stop normally', () => {
  const scope = effectScope();
  const attach = vi.fn(() => {
    scope.stop();
    return vi.fn();
  });
  scope.run(() => {
    useFloating(shallowRef(null), shallowRef(null), {
      whileElementsMounted: attach,
    });
  });
  expect(attach).not.toHaveBeenCalled();
  expect(scope.active).toBe(true);
  scope.stop();
  expect(scope.active).toBe(false);
});

test('initial attachment releases resources when its callback disposes the owner synchronously', () => {
  const scope = effectScope();
  const referenceElement = document.createElement('div');
  const floatingElement = document.createElement('div');
  document.body.append(referenceElement, floatingElement);
  const reference = shallowRef<HTMLElement | null>(referenceElement);
  const floating = shallowRef<HTMLElement | null>(floatingElement);
  const cleanup = vi.fn();
  const attach = vi.fn(() => {
    scope.stop();
    return cleanup;
  });
  try {
    scope.run(() => {
      useFloating(reference, floating, {whileElementsMounted: attach});
    });
    expect(scope.active).toBe(false);
    expect(attach).toHaveBeenCalledTimes(1);
    reference.value = null;
    floating.value = null;
    scope.stop();
    expect(cleanup).toHaveBeenCalledTimes(1);
  } finally {
    scope.stop();
    referenceElement.remove();
    floatingElement.remove();
  }
});

// A pending initial update is allowed to settle after disposal. Changing open
// afterward must not trigger a reset watcher created outside the stopped owner.
test('synchronous owner cancellation leaves no live option, reset or element watchers', async () => {
  const scope = effectScope();
  const reference = shallowRef<HTMLElement | null>(
    document.createElement('div'),
  );
  const floating = shallowRef<HTMLElement | null>(
    document.createElement('div'),
  );
  const open = shallowRef(true);
  const placement = shallowRef<'bottom' | 'top'>('bottom');
  const measure = vi.fn(() => ({}));
  const cleanup = vi.fn();
  const attach = vi.fn((_reference, _floating, update) => {
    update();
    scope.stop();
    return cleanup;
  });
  let position!: ReturnType<typeof useFloating>;
  scope.run(() => {
    position = useFloating(reference, floating, {
      open,
      placement,
      middleware: [{name: 'measure', fn: measure}],
      whileElementsMounted: attach,
    });
  });
  await vi.waitFor(() => expect(position.isPositioned.value).toBe(true));
  const calls = measure.mock.calls.length;
  expect(calls).toBe(1);
  open.value = false;
  placement.value = 'top';
  reference.value = document.createElement('div');
  floating.value = null;
  expect(position.isPositioned.value).toBe(true);
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(measure).toHaveBeenCalledTimes(calls);
  expect(attach).toHaveBeenCalledTimes(1);
  expect(cleanup).toHaveBeenCalledTimes(1);
});

test('the reset watcher still responds while its owner is active', async () => {
  const scope = effectScope();
  const open = shallowRef(true);
  let position!: ReturnType<typeof useFloating>;
  try {
    scope.run(() => {
      position = useFloating(
        shallowRef(document.createElement('div')),
        shallowRef(document.createElement('div')),
        {open},
      );
      position.update();
    });
    await vi.waitFor(() => expect(position.isPositioned.value).toBe(true));
    open.value = false;
    expect(position.isPositioned.value).toBe(false);
  } finally {
    scope.stop();
  }
});

test('a deferred attachment also releases cleanup returned after owner cancellation', () => {
  const scope = effectScope();
  const reference = shallowRef<HTMLElement | null>(null);
  const floating = shallowRef<HTMLElement | null>(null);
  const cleanup = vi.fn();
  const attach = vi.fn(() => {
    scope.stop();
    return cleanup;
  });
  scope.run(() => {
    useFloating(reference, floating, {whileElementsMounted: attach});
  });
  reference.value = document.createElement('div');
  floating.value = document.createElement('div');
  expect(attach).toHaveBeenCalledTimes(1);
  expect(cleanup).toHaveBeenCalledTimes(1);
  reference.value = null;
  scope.stop();
  expect(cleanup).toHaveBeenCalledTimes(1);
});

test('owner cancellation during replacement cleanup prevents another attachment', () => {
  const scope = effectScope();
  const reference = shallowRef(document.createElement('div'));
  const floating = shallowRef(document.createElement('div'));
  let stopping = false;
  const cleanup = vi.fn(() => {
    // Bound the rejected implementation's reentrant cleanup for comparison.
    if (!stopping) {
      stopping = true;
      scope.stop();
    }
  });
  const attach = vi.fn(() => cleanup);
  scope.run(() => {
    useFloating(reference, floating, {whileElementsMounted: attach});
  });
  reference.value = document.createElement('div');
  expect(scope.active).toBe(false);
  expect(attach).toHaveBeenCalledTimes(1);
  expect(cleanup).toHaveBeenCalledTimes(1);
  scope.stop();
  expect(cleanup).toHaveBeenCalledTimes(1);
});

test('reentrant attachment cleans the superseded callback and retains the latest cleanup', () => {
  const scope = effectScope();
  const reference = shallowRef(document.createElement('div'));
  const floating = shallowRef(document.createElement('div'));
  const nextReference = document.createElement('div');
  const firstCleanup = vi.fn();
  const nextCleanup = vi.fn();
  const attach = vi.fn((currentReference) => {
    if (currentReference !== nextReference) {
      reference.value = nextReference;
      return firstCleanup;
    }
    return nextCleanup;
  });
  try {
    scope.run(() => {
      useFloating(reference, floating, {whileElementsMounted: attach});
    });
    expect(attach).toHaveBeenCalledTimes(2);
    expect(firstCleanup).toHaveBeenCalledTimes(1);
    expect(nextCleanup).not.toHaveBeenCalled();
  } finally {
    scope.stop();
  }
  expect(firstCleanup).toHaveBeenCalledTimes(1);
  expect(nextCleanup).toHaveBeenCalledTimes(1);
});

test('reentrant replacement cleanup attaches the latest pair only once', () => {
  const scope = effectScope();
  const reference = shallowRef(document.createElement('div'));
  const floating = shallowRef(document.createElement('div'));
  const initialReference = reference.value;
  const nextReference = document.createElement('div');
  const nextCleanup = vi.fn();
  const initialCleanup = vi.fn(() => {
    reference.value = nextReference;
  });
  const attach = vi.fn((currentReference) =>
    currentReference === initialReference ? initialCleanup : nextCleanup,
  );
  try {
    scope.run(() => {
      useFloating(reference, floating, {whileElementsMounted: attach});
    });
    reference.value = document.createElement('div');
    expect(attach).toHaveBeenCalledTimes(2);
    expect(attach.mock.calls[1][0]).toBe(nextReference);
    expect(initialCleanup).toHaveBeenCalledTimes(1);
    expect(nextCleanup).not.toHaveBeenCalled();
  } finally {
    scope.stop();
  }
  expect(initialCleanup).toHaveBeenCalledTimes(1);
  expect(nextCleanup).toHaveBeenCalledTimes(1);
});
