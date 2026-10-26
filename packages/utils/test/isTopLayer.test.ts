import {beforeEach, expect, test, vi} from 'vitest';

import type {isTopLayer as IsTopLayer} from '../src/dom';

let isTopLayer: typeof IsTopLayer;

beforeEach(async () => {
  vi.resetModules();
  ({isTopLayer} = await import('../src/dom'));
});

function fakeElement(matches: (selector: string) => boolean) {
  return {matches: vi.fn(matches)} as unknown as Element & {
    matches: ReturnType<typeof vi.fn>;
  };
}

test('stops querying a selector after it throws', () => {
  const unsupported = (selector: string) => {
    if (selector === ':popover-open') {
      throw new DOMException(selector, 'SyntaxError');
    }
    return true;
  };

  const first = fakeElement(unsupported);
  expect(isTopLayer(first)).toBe(true);
  expect(first.matches).toHaveBeenCalledWith(':popover-open');

  const second = fakeElement(unsupported);
  expect(isTopLayer(second)).toBe(true);
  expect(second.matches).not.toHaveBeenCalledWith(':popover-open');
});

test('ignores an element whose `matches` is shadowed', () => {
  // A form control named `matches` replaces the method on its <form>.
  const form = {matches: document.createElement('input')} as unknown as Element;
  expect(isTopLayer(form)).toBe(false);

  const popover = fakeElement((selector) => selector === ':popover-open');
  expect(isTopLayer(popover)).toBe(true);
});
