/**
 * Get the opposite placement variation of the given one/
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement variation
 * @returns {String} flipped placement variation
 */
export default function getOppositeVariation(variation) {
    const hash = {start: 'end', end: 'start'};
    return variation.replace(/start|end/g, (matched) => hash[matched]);
}
