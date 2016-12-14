/**
 * Return the index of the matching object
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
export default function findIndex(arr, prop, value) {
    // use filter instead of find because find has less cross-browser support
    const match = arr.filter((obj) => (obj[prop] === value))[0];
    return arr.indexOf(match);
}
