import {shouldAddVisualOffsets} from '../../src/utils/getVisualOffsets';

test('does not access window when the offset parent is missing', () => {
  const windowDescriptor = Object.getOwnPropertyDescriptor(
    globalThis,
    'window',
  );

  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    get() {
      throw new Error('window accessed');
    },
  });

  try {
    expect(shouldAddVisualOffsets(undefined, true)).toBe(false);
  } finally {
    if (windowDescriptor) {
      Object.defineProperty(globalThis, 'window', windowDescriptor);
    } else {
      delete (globalThis as {window?: Window}).window;
    }
  }
});
