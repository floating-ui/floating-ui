import {platform} from '../../src';

test('polyfill', () => {
  const element = document.createElement('div');
  expect(
    platform.getOffsetParent?.(element, (element) => {
      expect(element).toBe(element);
      return document.body;
    })
  ).toBe(document.body);
});

test('polyfill table element branch', () => {
  const element = document.createElement('table');
  expect(
    platform.getOffsetParent?.(element, (element) => {
      expect(element).toBe(element);
      return document.body;
    })
  ).toBe(document.body);
});
