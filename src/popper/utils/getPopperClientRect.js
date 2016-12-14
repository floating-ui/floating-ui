/**
 * Given the popper offsets, generate an output similar to getBoundingClientRect
 * @method
 * @memberof Popper.Utils
 * @argument {Object} popperOffsets
 * @returns {Object} ClientRect like output
 */
export default function getPopperClientRect(popperOffsets) {
    return Object.assign({}, popperOffsets,
        {
            right: popperOffsets.left + popperOffsets.width,
            bottom: popperOffsets.top + popperOffsets.height
        }
    );
}
