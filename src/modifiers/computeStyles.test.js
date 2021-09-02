// @flow
import { mapToStyles } from './computeStyles';

it('computes the popper styles', () => {
  window.devicePixelRatio = 2;

  expect(
    mapToStyles({
      popper: document.createElement('div'),
      placement: 'bottom',
      popperRect: { x: 10, y: 10, width: 100, height: 100 },
      offsets: { x: 10, y: 5 },
      position: 'absolute',
      gpuAcceleration: true,
      adaptive: true,
      roundOffsets: true,
      variation: null,
    })
  ).toMatchSnapshot();

  expect(
    mapToStyles({
      popper: document.createElement('div'),
      placement: 'bottom',
      popperRect: { x: 10, y: 10, width: 100, height: 100 },
      offsets: { x: 10, y: 5 },
      position: 'absolute',
      gpuAcceleration: false,
      adaptive: true,
      roundOffsets: true,
      variation: null,
    })
  ).toMatchSnapshot();

  expect(
    mapToStyles({
      popper: document.createElement('div'),
      placement: 'top',
      popperRect: { x: 10, y: 10, width: 100, height: 100 },
      offsets: { x: 10, y: 5 },
      position: 'absolute',
      gpuAcceleration: false,
      adaptive: true,
      roundOffsets: true,
      variation: null,
    })
  ).toMatchSnapshot();

  expect(
    mapToStyles({
      popper: document.createElement('div'),
      placement: 'left',
      popperRect: { x: 10, y: 10, width: 100, height: 100 },
      offsets: { x: 10, y: 5 },
      position: 'absolute',
      gpuAcceleration: false,
      adaptive: true,
      roundOffsets: true,
      variation: null,
    })
  ).toMatchSnapshot();
});

it('uses the other direction with the end variation', () => {
  expect(
    mapToStyles({
      popper: document.createElement('div'),
      placement: 'left',
      variation: 'end',
      popperRect: { x: 10, y: 10, width: 100, height: 100 },
      offsets: { x: 10, y: 5 },
      position: 'absolute',
      gpuAcceleration: false,
      adaptive: true,
      roundOffsets: true,
    })
  ).toMatchSnapshot();

  expect(
    mapToStyles({
      popper: document.createElement('div'),
      placement: 'right',
      variation: 'end',
      popperRect: { x: 10, y: 10, width: 100, height: 100 },
      offsets: { x: 10, y: 5 },
      position: 'absolute',
      gpuAcceleration: false,
      adaptive: true,
      roundOffsets: true,
    })
  ).toMatchSnapshot();

  expect(
    mapToStyles({
      popper: document.createElement('div'),
      placement: 'top',
      variation: 'end',
      popperRect: { x: 10, y: 10, width: 100, height: 100 },
      offsets: { x: 10, y: 5 },
      position: 'absolute',
      gpuAcceleration: false,
      adaptive: true,
      roundOffsets: true,
    })
  ).toMatchSnapshot();

  expect(
    mapToStyles({
      popper: document.createElement('div'),
      placement: 'bottom',
      variation: 'end',
      popperRect: { x: 10, y: 10, width: 100, height: 100 },
      offsets: { x: 10, y: 5 },
      position: 'absolute',
      gpuAcceleration: false,
      adaptive: true,
      roundOffsets: true,
    })
  ).toMatchSnapshot();
});

it('customizes roundOffsets implementation', () => {
  expect(
    mapToStyles({
      popper: document.createElement('div'),
      placement: 'left',
      popperRect: { x: 10, y: 10, width: 100, height: 100 },
      offsets: { x: 10.3, y: 5.83 },
      position: 'absolute',
      gpuAcceleration: false,
      adaptive: true,
      roundOffsets: ({ x, y }) => ({
        x: Math.round(x + 2),
        y: Math.round(y + 2),
      }),
      variation: null,
    })
  ).toMatchSnapshot();

  // disabele builtin `roundOffsetsByDPR`
  expect(
    mapToStyles({
      popper: document.createElement('div'),
      placement: 'left',
      popperRect: { x: 10, y: 10, width: 100, height: 100 },
      offsets: { x: 10.3, y: 5.83 },
      position: 'absolute',
      gpuAcceleration: false,
      adaptive: true,
      roundOffsets: false,
      variation: null,
    })
  ).toMatchSnapshot();

  window.devicePixelRatio = 1;
});

it('computes the arrow styles', () => {
  expect(
    mapToStyles({
      popper: document.createElement('div'),
      placement: 'bottom',
      popperRect: { x: 10, y: 10, width: 100, height: 100 },
      offsets: { x: 10, y: 5 },
      position: 'absolute',
      gpuAcceleration: true,
      adaptive: false,
      roundOffsets: true,
      variation: null,
    })
  ).toMatchSnapshot();
});
