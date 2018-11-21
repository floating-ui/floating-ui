/*
 * Use a TypeScript definition file to property support all the possible
 * overloads of the `getStyleComputedProperty(…)` function which can't be
 * written using the JSDoc syntax.
 */

/**
 * Get all CSS computed properties of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {CSSStyleDeclaration}
 */
export default function getStyleComputedProperty(element: Element): CSSStyleDeclaration;

/**
 * Get CSS computed property of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {String} property
 * @returns {String}
 */
export default function getStyleComputedProperty(element: Element, property: string): string;
