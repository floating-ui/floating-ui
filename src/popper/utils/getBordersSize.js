/*
 * Helper to detect borders of a given element
 * @method
 * @memberof Popper.Utils
 * @param {CSSStyleDeclaration} styles - result of `getStyleComputedProperty` on the given element
 * @param {String} axis - `x` or `y`
 * @return {Number} borders - the borders size of the given axis
 */

export default function getBordersSize(styles, axis) {
    const sideA = axis === 'x' ? 'Left' : 'Top';
    const sideB = sideA === 'Left' ? 'Right' : 'Bottom';

    return Number(styles[`border${sideA}Width`].split('px')[0]) + Number(styles[`border${sideB}Width`].split('px')[0]);
}
