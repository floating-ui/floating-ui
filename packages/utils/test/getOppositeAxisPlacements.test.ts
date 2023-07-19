import {getOppositeAxisPlacements} from '../src';

describe('side', () => {
  test('top', () => {
    expect(getOppositeAxisPlacements('top', true, 'start')).toEqual([
      'left',
      'right',
    ]);
    expect(getOppositeAxisPlacements('top', true, 'end')).toEqual([
      'right',
      'left',
    ]);
  });

  test('bottom', () => {
    expect(getOppositeAxisPlacements('bottom', true, 'start')).toEqual([
      'left',
      'right',
    ]);
    expect(getOppositeAxisPlacements('bottom', true, 'end')).toEqual([
      'right',
      'left',
    ]);
  });

  test('left', () => {
    expect(getOppositeAxisPlacements('left', true, 'start')).toEqual([
      'top',
      'bottom',
    ]);
    expect(getOppositeAxisPlacements('left', true, 'end')).toEqual([
      'bottom',
      'top',
    ]);
  });

  test('right', () => {
    expect(getOppositeAxisPlacements('right', true, 'start')).toEqual([
      'top',
      'bottom',
    ]);
    expect(getOppositeAxisPlacements('right', true, 'end')).toEqual([
      'bottom',
      'top',
    ]);
  });
});

describe('start alignment', () => {
  test('top-start', () => {
    expect(getOppositeAxisPlacements('top-start', false, 'start')).toEqual([
      'left-start',
      'right-start',
    ]);
    expect(getOppositeAxisPlacements('top-start', false, 'end')).toEqual([
      'right-start',
      'left-start',
    ]);
    expect(getOppositeAxisPlacements('top-start', true, 'start')).toEqual([
      'left-start',
      'right-start',
      'left-end',
      'right-end',
    ]);
    expect(getOppositeAxisPlacements('top-start', true, 'end')).toEqual([
      'right-start',
      'left-start',
      'right-end',
      'left-end',
    ]);
  });

  test('bottom-start', () => {
    expect(getOppositeAxisPlacements('bottom-start', false, 'start')).toEqual([
      'left-start',
      'right-start',
    ]);
    expect(getOppositeAxisPlacements('bottom-start', false, 'end')).toEqual([
      'right-start',
      'left-start',
    ]);
    expect(getOppositeAxisPlacements('bottom-start', true, 'start')).toEqual([
      'left-start',
      'right-start',
      'left-end',
      'right-end',
    ]);
    expect(getOppositeAxisPlacements('bottom-start', true, 'end')).toEqual([
      'right-start',
      'left-start',
      'right-end',
      'left-end',
    ]);
  });

  test('left-start', () => {
    expect(getOppositeAxisPlacements('left-start', false, 'start')).toEqual([
      'top-start',
      'bottom-start',
    ]);
    expect(getOppositeAxisPlacements('left-start', false, 'end')).toEqual([
      'bottom-start',
      'top-start',
    ]);
    expect(getOppositeAxisPlacements('left-start', true, 'start')).toEqual([
      'top-start',
      'bottom-start',
      'top-end',
      'bottom-end',
    ]);
    expect(getOppositeAxisPlacements('left-start', true, 'end')).toEqual([
      'bottom-start',
      'top-start',
      'bottom-end',
      'top-end',
    ]);
  });

  test('right-start', () => {
    expect(getOppositeAxisPlacements('right-start', false, 'start')).toEqual([
      'top-start',
      'bottom-start',
    ]);
    expect(getOppositeAxisPlacements('right-start', false, 'end')).toEqual([
      'bottom-start',
      'top-start',
    ]);
    expect(getOppositeAxisPlacements('right-start', true, 'start')).toEqual([
      'top-start',
      'bottom-start',
      'top-end',
      'bottom-end',
    ]);
    expect(getOppositeAxisPlacements('right-start', true, 'end')).toEqual([
      'bottom-start',
      'top-start',
      'bottom-end',
      'top-end',
    ]);
  });
});

describe('end alignment', () => {
  test('top-end', () => {
    expect(getOppositeAxisPlacements('top-end', false, 'start')).toEqual([
      'left-end',
      'right-end',
    ]);
    expect(getOppositeAxisPlacements('top-end', false, 'end')).toEqual([
      'right-end',
      'left-end',
    ]);
    expect(getOppositeAxisPlacements('top-end', true, 'start')).toEqual([
      'left-end',
      'right-end',
      'left-start',
      'right-start',
    ]);
    expect(getOppositeAxisPlacements('top-end', true, 'end')).toEqual([
      'right-end',
      'left-end',
      'right-start',
      'left-start',
    ]);
  });

  test('bottom-end', () => {
    expect(getOppositeAxisPlacements('bottom-end', false, 'start')).toEqual([
      'left-end',
      'right-end',
    ]);
    expect(getOppositeAxisPlacements('bottom-end', false, 'end')).toEqual([
      'right-end',
      'left-end',
    ]);
    expect(getOppositeAxisPlacements('bottom-end', true, 'start')).toEqual([
      'left-end',
      'right-end',
      'left-start',
      'right-start',
    ]);
    expect(getOppositeAxisPlacements('bottom-end', true, 'end')).toEqual([
      'right-end',
      'left-end',
      'right-start',
      'left-start',
    ]);
  });

  test('left-end', () => {
    expect(getOppositeAxisPlacements('left-end', false, 'start')).toEqual([
      'top-end',
      'bottom-end',
    ]);
    expect(getOppositeAxisPlacements('left-end', false, 'end')).toEqual([
      'bottom-end',
      'top-end',
    ]);
    expect(getOppositeAxisPlacements('left-start', true, 'start')).toEqual([
      'top-start',
      'bottom-start',
      'top-end',
      'bottom-end',
    ]);
    expect(getOppositeAxisPlacements('left-start', true, 'end')).toEqual([
      'bottom-start',
      'top-start',
      'bottom-end',
      'top-end',
    ]);
  });

  test('right-end', () => {
    expect(getOppositeAxisPlacements('right-end', false, 'start')).toEqual([
      'top-end',
      'bottom-end',
    ]);
    expect(getOppositeAxisPlacements('right-end', false, 'end')).toEqual([
      'bottom-end',
      'top-end',
    ]);
    expect(getOppositeAxisPlacements('right-end', true, 'start')).toEqual([
      'top-end',
      'bottom-end',
      'top-start',
      'bottom-start',
    ]);
    expect(getOppositeAxisPlacements('right-end', true, 'end')).toEqual([
      'bottom-end',
      'top-end',
      'bottom-start',
      'top-start',
    ]);
  });
});

describe('rtl', () => {
  test('top', () => {
    expect(getOppositeAxisPlacements('top', true, 'start', true)).toEqual([
      'right',
      'left',
    ]);
    expect(getOppositeAxisPlacements('top', true, 'end', true)).toEqual([
      'left',
      'right',
    ]);
  });

  test('bottom', () => {
    expect(getOppositeAxisPlacements('bottom', true, 'start', true)).toEqual([
      'right',
      'left',
    ]);
    expect(getOppositeAxisPlacements('bottom', true, 'end', true)).toEqual([
      'left',
      'right',
    ]);
  });

  test('left', () => {
    expect(getOppositeAxisPlacements('left', true, 'start', true)).toEqual([
      'top',
      'bottom',
    ]);
    expect(getOppositeAxisPlacements('left', true, 'end', true)).toEqual([
      'bottom',
      'top',
    ]);
  });

  test('right', () => {
    expect(getOppositeAxisPlacements('right', true, 'start', true)).toEqual([
      'top',
      'bottom',
    ]);
    expect(getOppositeAxisPlacements('right', true, 'end', true)).toEqual([
      'bottom',
      'top',
    ]);
  });
});
