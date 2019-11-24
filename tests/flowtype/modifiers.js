// @flow
import Popper from '../../src/';

// $FlowExpectError: valid elements must be provided
new Popper(null, null);

const reference = document.createElement('button');
const popper = document.createElement('div');

new Popper(reference, popper, {});
