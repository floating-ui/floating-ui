/**
 * Return the index of the matching object
 * @function
 * @ignore
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
export default function findIndex(arr, prop, value) {
    const match = arr.find((obj) => (obj[prop] === value));
    return arr.indexOf(match);
}
