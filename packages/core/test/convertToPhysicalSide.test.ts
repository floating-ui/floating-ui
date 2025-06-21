import {convertToPhysicalSide} from '../src/utils';

test('physical sides', () => {
  expect(convertToPhysicalSide('top', false)).toBe('top');
  expect(convertToPhysicalSide('top', true)).toBe('top');
  expect(convertToPhysicalSide('bottom', false)).toBe('bottom');
  expect(convertToPhysicalSide('bottom', true)).toBe('bottom');
  expect(convertToPhysicalSide('left', false)).toBe('left');
  expect(convertToPhysicalSide('left', true)).toBe('left');
  expect(convertToPhysicalSide('right', false)).toBe('right');
  expect(convertToPhysicalSide('right', true)).toBe('right');
});

test('inline-start', () => {
  expect(convertToPhysicalSide('inline-start', false)).toBe('left');
  expect(convertToPhysicalSide('inline-start', true)).toBe('right');
});

test('inline-end', () => {
  expect(convertToPhysicalSide('inline-end', false)).toBe('right');
  expect(convertToPhysicalSide('inline-end', true)).toBe('left');
});
