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
    const match = arr.find((obj) => (obj[prop] === value));
    return arr.indexOf(match);
}
