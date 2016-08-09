import getScrollParent from './getScrollParent';

/**
 * Remove event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
export default function removeEventListeners(reference, state, options) {
    // NOTE: 1 DOM access here
    window.removeEventListener('resize', state.updateBound);
    if (options.boundariesElement !== 'window') {
        let target = getScrollParent(reference);
        // here it could be both `body` or `documentElement` thanks to Firefox, we then check both
        if (target === window.document.body || target === window.document.documentElement) {
            target = window;
        }
        target.removeEventListener('scroll', state.updateBound);
    }
    state.updateBound = null;
    return state;
}
