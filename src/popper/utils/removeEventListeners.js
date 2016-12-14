/**
 * Remove event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
export default function removeEventListeners(reference, state) {
    // NOTE: 1 DOM access here
    window.removeEventListener('resize', state.updateBound);
    if (state.scrollElement) {
        state.scrollElement.removeEventListener('scroll', state.updateBound);
    }
    state.updateBound = null;
    state.scrollElement = null;
    return state;
}
