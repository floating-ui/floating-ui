import {rectToClientRect} from '../../src';
import {getRectsByLine} from '../../src/middleware/inline';

describe('getRectsByLine', () => {
  test('single line', () => {
    expect(
      getRectsByLine([
        rectToClientRect({x: 0, y: 0, width: 10, height: 10}),
        rectToClientRect({x: 10, y: 0, width: 10, height: 10}),
        rectToClientRect({x: 20, y: 0, width: 10, height: 10}),
      ]),
    ).toEqual([rectToClientRect({x: 0, y: 0, width: 30, height: 10})]);
  });

  test('multiple lines', () => {
    expect(
      getRectsByLine([
        rectToClientRect({x: 0, y: 0, width: 10, height: 10}),
        rectToClientRect({x: 10, y: 0, width: 10, height: 10}),
        rectToClientRect({x: 20, y: 0, width: 10, height: 10}),
        rectToClientRect({x: 20, y: 10, width: 100, height: 10}),
      ]),
    ).toEqual([
      rectToClientRect({x: 0, y: 0, width: 30, height: 10}),
      rectToClientRect({x: 20, y: 10, width: 100, height: 10}),
    ]);
  });

  test('multiple lines, different heights and y coords', () => {
    expect(
      getRectsByLine([
        rectToClientRect({x: 0, y: 0, width: 10, height: 10}),
        rectToClientRect({x: 10, y: 3, width: 10, height: 8}),
        rectToClientRect({x: 20, y: 1, width: 10, height: 5}),
      ]),
    ).toEqual([rectToClientRect({x: 0, y: 0, width: 30, height: 11})]);
  });

  test('multiple lines, different heights and y coords, with a gap', () => {
    expect(
      getRectsByLine([
        rectToClientRect({x: 0, y: 0, width: 10, height: 10}),
        rectToClientRect({x: 10, y: 3, width: 10, height: 8}),
        rectToClientRect({x: 20, y: 1, width: 10, height: 5}),
        rectToClientRect({x: 20, y: 20, width: 10, height: 5}),
      ]),
    ).toEqual([
      rectToClientRect({x: 0, y: 0, width: 30, height: 11}),
      rectToClientRect({x: 20, y: 20, width: 10, height: 5}),
    ]);
  });

  test('short rect in group should not truncate line-height threshold', () => {
    // When a short rect (e.g. a small superscript/subscript) appears after a tall rect
    // in the same group, prevRect.height becomes small. Subsequent rects that are still
    // within the tall rect's vertical extent must NOT be split into a new group.
    expect(
      getRectsByLine([
        rectToClientRect({x: 0, y: 0, width: 10, height: 20}), // tall – line 1
        rectToClientRect({x: 10, y: 5, width: 10, height: 3}), // short inline – line 1
        rectToClientRect({x: 20, y: 7, width: 10, height: 5}), // within tall rect – line 1
        rectToClientRect({x: 0, y: 30, width: 30, height: 10}), // clearly line 2
      ]),
    ).toEqual([
      rectToClientRect({x: 0, y: 0, width: 30, height: 20}),
      rectToClientRect({x: 0, y: 30, width: 30, height: 10}),
    ]);
  });
});
