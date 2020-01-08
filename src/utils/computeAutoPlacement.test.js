// @flow
import { createPopper } from '../';
import computeAutoPlacement from './computeAutoPlacement';

const div = () => document.createElement('div');

const sharedOptions = {
  boundary: 'clippingParents',
  rootBoundary: 'viewport',
  padding: 0,
  flipVariations: true,
};

const { state } = createPopper(div(), div());

describe('auto', () => {
  it('produces correct array of computed placements', () => {
    expect(
      computeAutoPlacement(state, {
        ...sharedOptions,
        placement: 'auto',
      })
    ).toMatchSnapshot();
  });
});

describe('auto-start', () => {
  it('produces correct array of computed placements', () => {
    expect(
      computeAutoPlacement(state, {
        ...sharedOptions,
        placement: 'auto-start',
      })
    ).toMatchSnapshot();
  });

  it('produces correct array of computed placements when flipVariations: false', () => {
    expect(
      computeAutoPlacement(state, {
        ...sharedOptions,
        placement: 'auto-start',
        flipVariations: false,
      })
    ).toMatchSnapshot();
  });
});

describe('auto-end', () => {
  it('produces correct array of computed placements', () => {
    expect(
      computeAutoPlacement(state, {
        ...sharedOptions,
        placement: 'auto-end',
      })
    ).toMatchSnapshot();
  });

  it('produces correct array of computed placements when flipVariations: false', () => {
    expect(
      computeAutoPlacement(state, {
        ...sharedOptions,
        placement: 'auto-end',
        flipVariations: false,
      })
    ).toMatchSnapshot();
  });
});
