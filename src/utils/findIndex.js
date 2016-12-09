/**
 * Return the first index of the item matching the function `fn`
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument {Function} function that will return true when the correct inde is found
 * @returns index or -1
 */
export default function findIndex(arr, fn) {
    // use filter instead of find because find has less cross-browser support
    const match = arr.filter(fn)[0];
    return arr.indexOf(match);
}
