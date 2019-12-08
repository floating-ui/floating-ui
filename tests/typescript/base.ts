import { createPopper, Options } from '@popperjs/core';

const options: Options = {
  strategy: 'fixed',
  placement: 'auto-start',
  modifiers: [{ name: 'preventOverflow', enabled: false }],
};

const popper = createPopper(
  document.createElement('div'),
  document.createElement('span')
);
const popperWithOptions = createPopper(
  document.createElement('div'),
  document.createElement('span'),
  options
);
