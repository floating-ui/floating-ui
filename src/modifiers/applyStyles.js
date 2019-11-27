// @flow
import type { Modifier, State, PositioningStrategy } from '../types';

// This modifier takes the styles prepared by the `computeStyles` modifier
// and applies them to the HTMLElements such as popper and arrow

export function applyStyles(state: State) {
  const data = state.modifiersData.computeStyles;

  Object.keys(state.elements).forEach(name => {
    const style = data.styles[name] || {};

    const attributes = data.attributes[name] || {};
    const element = state.elements[name];

    // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowIgnore
    Object.assign(element.style, style);

    Object.entries(attributes).forEach(args => element.setAttribute(...args));
  });

  return state;
}

export function onDestroy(state: State) {
  const data = state.modifiersData.computeStyles;

  Object.keys(state.elements).forEach(name => {
    const element = state.elements[name];
    const styleProperties = Object.keys(
      data.styles.hasOwnProperty(name) ? { ...data.styles[name] } : {}
    );
    const attributes = data.attributes[name] || {};

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
    Object.assign(element.style, style);

    Object.keys(attributes).forEach(attribute =>
      element.removeAttribute(attribute)
    );
  });
}

export default ({
  name: 'applyStyles',
  enabled: true,
  phase: 'write',
  fn: applyStyles,
  onDestroy,
  requires: ['computeStyles'],
}: Modifier<void>);
