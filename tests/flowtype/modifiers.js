// @flow
import { createPopper } from '../../src/';

// $FlowExpectError: valid elements must be provided
createPopper(null, null);

const reference = document.createElement('button');
const popper = document.createElement('div');

createPopper(reference, popper, {});
