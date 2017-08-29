/**
 * Mimics the `find` method of Array
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
export default function find(arr, check) {
  // use native find if supported or use `filter` to obtain the same behavior of `find`
  return Array.prototype.find ? arr.find(check) : arr.filter(check)[0];
}
