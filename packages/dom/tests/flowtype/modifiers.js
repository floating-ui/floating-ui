// @flow
import { type Modifier } from '@popperjs/core/src/types';
import { computePosition } from '../../src';

computePosition(document.createElement('div'), document.createElement('div'));
computePosition(document.createElement('div'), document.createElement('div'), {
  placement: 'top',
});
