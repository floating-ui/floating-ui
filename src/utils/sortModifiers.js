/**
 * Sorts the modifiers based on their `order` property
 * @function
 * @ignore
 */
export default function sortModifiers(a, b) {
    if (a.order < b.order) {
        return -1;
    } else if (a.order > b.order) {
        return 1;
    }
    return 0;
}
