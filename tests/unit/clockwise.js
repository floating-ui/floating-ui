import clockwise from 'src/popper/utils/clockwise';

describe('utils/clockwise', () => {
  it('returns a clockwise ordered list of placements', () => {
    const arr = clockwise('bottom');
    expect(arr[0]).toBe('bottom-start');
    expect(arr.slice(-1)[0]).toBe('bottom-end');
  });

  it('returns a counterclockwise ordered list of placements', () => {
    const arr = clockwise('bottom', true);
    expect(arr[0]).toBe('bottom-end');
    expect(arr.slice(-1)[0]).toBe('bottom-start');
  });
});
