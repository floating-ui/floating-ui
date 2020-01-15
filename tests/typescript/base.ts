import { createPopper, Options } from '@popperjs/core';
import { createPopper as createPopperLite } from '@popperjs/core/lib/popper-lite';
import hideModifier from '@popperjs/core/lib/modifiers/hide';

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
  { modifiers: [hideModifier] }
);
