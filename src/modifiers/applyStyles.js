// @flow
import type { Modifier, ModifierArguments } from '../types';
import getNodeName from '../dom-utils/getNodeName';
import { isHTMLElement } from '../dom-utils/instanceOf';

// This modifier takes the styles prepared by the `computeStyles` modifier
// and applies them to the HTMLElements such as popper and arrow

function applyStyles({ state }: ModifierArguments<{||}>) {
  Object.keys(state.elements).forEach(name => {
    const style = state.styles[name] || {};

    const attributes = state.attributes[name] || {};
    const element = state.elements[name];

    // arrow is optional + virtual elements
    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    }

    // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowFixMe
    Object.assign(element.style, style);

    Object.entries(attributes).forEach(([name, value]: [string, any]) => {
      if (value === false) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value === true ? '' : value);
      }
    });
  });

  return state;
}

function onDestroy({ state }: ModifierArguments<{||}>) {
  Object.keys(state.elements).forEach(name => {
    const element = state.elements[name];
    const styleProperties = Object.keys(
      state.styles.hasOwnProperty(name) ? { ...state.styles[name] } : {}
    );
    const attributes = state.attributes[name] || {};

    // Set all values to an empty string to unset them
    const style = styleProperties.reduce(
      (style, property) => ({
        ...style,
        [String(property)]: '',
      }),
      {}
    );

    // arrow is optional + virtual elements
    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    }

    // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowFixMe
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
}: Modifier<{||}>);
