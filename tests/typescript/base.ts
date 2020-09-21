import { createPopper, Options, createPopperLite, hide } from '@popperjs/core';

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

const popper2 = createPopperLite(
  document.createElement('div'),
  document.createElement('span'),
  { modifiers: [hide] }
);
