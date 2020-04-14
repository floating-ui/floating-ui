// @flow
import { createPopper, type Modifier, type StrictModifiers } from '../../src/';

// $FlowExpectError: valid elements must be provided
createPopper(null, null);

const reference = document.createElement('button');
const popper = document.createElement('div');

createPopper(reference, popper, {});

// $FlowExpectError: '' is not a number
createPopper<StrictModifiers>(reference, popper, {
  modifiers: [{ name: 'offset', options: { offset: [0, ''] } }],
});

type CustomModifier = $Shape<Modifier<'custom', { customOption: boolean }>>;
type ExtendedModifiers = StrictModifiers | CustomModifier;

createPopper<ExtendedModifiers>(reference, popper, {
  modifiers: [
    { name: 'custom', options: { customOption: true } }, // no error
  ],
});
