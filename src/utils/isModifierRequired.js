/**
 * Helper used to know if the given modifier depends from another one.
 * @method
 * @memberof Popper
 * @returns {Boolean}
 */
export default function isModifierRequired(options, requesting, requested) {
    return !!options.modifiers.filter(modifier => {
        if (modifier.name === requested) {
            return true;
        } else if (modifier.name === requesting) {
            return false;
        }
        return false;
    }).length;
}
