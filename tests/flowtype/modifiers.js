// @flow
import { createPopper } from '../../src/';

// $FlowExpectError: valid elements must be provided
createPopper(null, null);

const reference = document.createElement('button');
const popper = document.createElement('div');

createPopper(reference, popper, {});

// $FlowExpectError: should validate modifier options
createPopper(reference, popper, {
  modifiers: [{ name: 'flip', options: { fallbackPlacements: ['not-valid'] } }],
});

createPopper(reference, popper, {
  modifiers: [{ name: 'custom', options: { foo: 'bar' } }],
});
