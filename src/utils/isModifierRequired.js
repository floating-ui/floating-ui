/**
 * Helper used to know if the given modifier depends from another one.
 * @method
 * @memberof Popper.Utils
 * @returns {Boolean}
 */
export default function isModifierRequired(modifiers, requesting, requested) {
    return !!modifiers.filter(modifier => {
        if (modifier.name === requested) {
            return true;
        } else if (modifier.name === requesting) {
            return false;
        }
        return false;
    }).length;
}
