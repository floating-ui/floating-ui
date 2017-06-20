import isNative from '../../src/utils/isNative';

describe('utils/isNative', () => {
  it('should return true for Chrome native MutationObserver', () => {
    const fn = {
      toString: () => 'function MutationObserver() { [native code] }',
    };
    expect(isNative(fn)).toBe(true);
  });

  it('should return true for Safari native MutationObserver', () => {
    const fn = { toString: () => '[object MutationObserverConstructor]' };
    expect(isNative(fn)).toBe(true);
  });

  it('should return false for a non native function', () => {
    const fn = () => null;
    expect(isNative(fn)).toBe(false);
  });
});
