// @flow
import {
  mapStrategyToPosition,
  computePopperStyles,
  computeArrowStyles,
} from './computeStyles';

it('returns the expected position value', () => {
  expect(mapStrategyToPosition('fixed')).toBe('fixed');
  expect(mapStrategyToPosition('absolute')).toBe('absolute');
});

it('computes the popper styles', () => {
  window.devicePixelRatio = 2;
  expect(
    computePopperStyles({
      offsets: { x: 10, y: 5 },
      strategy: 'absolute',
      gpuAcceleration: true,
    })
  ).toMatchSnapshot();

  expect(
    computePopperStyles({
      offsets: { x: 10, y: 5 },
      strategy: 'absolute',
      gpuAcceleration: false,
    })
  ).toMatchSnapshot();
  window.devicePixelRatio = 1;
});

it('computes the arrow styles', () => {
  expect(
    computeArrowStyles({
      offsets: { x: 10, y: 5 },
      gpuAcceleration: true,
    })
  ).toMatchSnapshot();
});
