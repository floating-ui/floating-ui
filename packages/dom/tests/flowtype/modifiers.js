// @flow
import { type Modifier } from '@popperjs/core/src/types';
import { position } from '../../src';

position(document.createElement('div'), document.createElement('div'));
position(document.createElement('div'), document.createElement('div'), {
  placement: 'top',
});
