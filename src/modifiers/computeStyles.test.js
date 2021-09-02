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
    })
  ).toMatchSnapshot();

  // customize roundOffsets impls
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
        y: Math.round(y + 2)
      })
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
      roundOffsets: false
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
    })
  ).toMatchSnapshot();
});
