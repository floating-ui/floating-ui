/**
 * Tells if a given input is a number
 * @param {anything} input to check
 * @return {Boolean}
 */
export default function isNumeric(n) {
    return (n !== '' && !isNaN(parseFloat(n)) && isFinite(n));
}
