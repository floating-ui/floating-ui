import type {ClientRectObject} from '@floating-ui/utils';

import {computePosition, inline, rectToClientRect} from '../../src';
import {getRectsByLine} from '../../src/middleware/inline';
import type {Platform} from '../../src/types';

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
});

describe('inline', () => {
  function createPlatform(clientRects: Array<ClientRectObject>): Platform {
    return {
      getElementRects: ({reference}: any) => {
        const rect = reference.getBoundingClientRect?.() ?? {
          x: 0,
          y: 0,
          width: 100,
          height: 100,
        };
        return {
          reference: {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
          },
          floating: {x: 0, y: 0, width: 50, height: 50},
        };
      },
      getDimensions: () => ({width: 50, height: 50}),
      getClientRects: () => clientRects,
    } as unknown as Platform;
  }

  test('no-ops when there are no client rects', async () => {
    const {x, y} = await computePosition(
      {},
      {},
      {
        platform: createPlatform([]),
        middleware: [inline()],
      },
    );

    // The original reference rect is kept instead of resetting to one with
    // non-finite values.
    expect(x).toBe(25);
    expect(y).toBe(100);
  });

  test('chooses the disjoined rect containing the point (LTR)', async () => {
    // Top fragment sits to the right of the bottom fragment.
    const {x, y} = await computePosition(
      {},
      {},
      {
        platform: createPlatform([
          rectToClientRect({x: 200, y: 0, width: 100, height: 20}),
          rectToClientRect({x: 0, y: 20, width: 100, height: 20}),
        ]),
        middleware: [inline({x: 250, y: 10})],
      },
    );

    expect(x).toBe(225);
    expect(y).toBe(20);
  });

  test('chooses the disjoined rect containing the point (RTL)', async () => {
    // Top fragment sits to the left of the bottom fragment.
    const {x, y} = await computePosition(
      {},
      {},
      {
        platform: createPlatform([
          rectToClientRect({x: 0, y: 0, width: 100, height: 20}),
          rectToClientRect({x: 200, y: 20, width: 100, height: 20}),
        ]),
        middleware: [inline({x: 50, y: 10})],
      },
    );

    expect(x).toBe(25);
    expect(y).toBe(20);
  });
});
