/**
 * Get the opposite placement of the given one/
 * @function
 * @ignore
 * @argument {String} placement
 * @returns {String} flipped placement
 */
export default function getOppositePlacement(placement) {
    const hash = {left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
    return placement.replace(/left|right|bottom|top/g, (matched) => hash[matched]);
}
