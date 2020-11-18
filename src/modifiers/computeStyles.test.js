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
