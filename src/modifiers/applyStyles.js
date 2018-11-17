// @flow
import type { State, PositioningStrategy } from '../types';

// This modifier takes the styles prepared by the `computeStyles` modifier
// and applies them to the HTMLElements such as popper and arrow

export function applyStyles(state: State) {
  Object.keys(state.elements).forEach(name => {
    const style = state.styles.hasOwnProperty(name) ? state.styles[name] : null;

    // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElemen
    // $FlowIgnore
    Object.assign(state.elements[name].style, style);
  });

  return state;
}

export default {
  name: 'applyStyles',
  enabled: true,
  phase: 'write',
  fn: applyStyles,
  requires: ['computeStyles'],
};
