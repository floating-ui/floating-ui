// @flow
import type { Modifier, State, PositioningStrategy } from '../types';

// This modifier takes the styles prepared by the `computeStyles` modifier
// and applies them to the HTMLElements such as popper and arrow

export function applyStyles(state: State) {
  Object.keys(state.elements).forEach(name => {
    const style = state.styles.hasOwnProperty(name) ? state.styles[name] : {};

    // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowIgnore
    Object.assign(state.elements[name].style, style);
  });

  return state;
}

export function onDestroy(state: State) {
  Object.keys(state.elements).forEach(name => {
    const styleProperties = Object.keys(
      state.styles.hasOwnProperty(name) ? { ...state.styles[name] } : {}
    );

    // Set all values to an empty string to unset them
    const style = styleProperties.reduce(
      (style, property) => ({
        ...style,
        [String(property)]: '',
      }),
      {}
    );

    // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowIgnore
    Object.assign(state.elements[name].style, style);
  });
}

export default ({
  name: 'applyStyles',
  enabled: true,
  phase: 'write',
  fn: applyStyles,
  onDestroy,
  requires: ['computeStyles'],
}: Modifier);
