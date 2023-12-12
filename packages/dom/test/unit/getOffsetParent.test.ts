import {platform} from '../../src';

test('polyfill', () => {
  const element = document.createElement('div');
  const parent = document.createElement('div');
  expect(
    platform.getOffsetParent?.(element, (el) => {
      expect(el).toBe(element);
      return parent;
    }),
  ).toBe(parent);
});
