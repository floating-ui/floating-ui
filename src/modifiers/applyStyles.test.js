// @flow
import { createPopper } from '../../src/popper';

it('does not remove inline style properties from the reference', () => {
  const reference = document.createElement('div');
  const popper = document.createElement('div');

  reference.style.position = 'absolute';
  reference.style.margin = '10px';

  createPopper(reference, popper).destroy();

  expect(reference.style.position).toBe('absolute');
  expect(reference.style.margin).toBe('10px');
});
