import getScrollParent from './getScrollParent';

/**
 * Setup needed event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
export default function setupEventListeners(reference, options, state, updateBound) {
    // NOTE: 1 DOM access here
    state.updateBound = updateBound;
    window.addEventListener('resize', state.updateBound, { passive: true });
    // if the boundariesElement is window we don't need to listen for the scroll event
    if (options.boundariesElement !== 'window') {
        let target = getScrollParent(reference);
        // here it could be both `body` or `documentElement` thanks to Firefox, we then check both
        if (target === window.document.body || target === window.document.documentElement) {
            target = window;
        }
        target.addEventListener('scroll', state.updateBound, { passive: true });
    }
}
