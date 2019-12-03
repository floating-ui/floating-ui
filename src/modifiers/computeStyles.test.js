// @flow
import { mapToStyles } from './computeStyles';

it('computes the popper styles', () => {
  window.devicePixelRatio = 2;
  expect(
    mapToStyles({
      offsets: { x: 10, y: 5 },
      position: 'absolute',
      gpuAcceleration: true,
    })
  ).toMatchSnapshot();

  expect(
    mapToStyles({
      offsets: { x: 10, y: 5 },
      position: 'absolute',
      gpuAcceleration: false,
    })
  ).toMatchSnapshot();
  window.devicePixelRatio = 1;
});

it('computes the arrow styles', () => {
  expect(
    mapToStyles({
      offsets: { x: 10, y: 5 },
      position: 'absolute',
      gpuAcceleration: true,
    })
  ).toMatchSnapshot();
});
