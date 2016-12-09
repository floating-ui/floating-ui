import isNumeric from '../utils/isNumeric';
import getPopperClientRect from '../utils/getPopperClientRect';

/**
 * Modifier used to add an offset to the popper, useful if you more granularity positioning your popper.
 * The offsets will shift the popper on the side of its reference element.
 * @method
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @argument {Number|String} options.offset=0
 *      Basic usage allows a number used to nudge the popper by the given amount of pixels.
 *      You can pass a percentage value as string (eg. `20%`) to nudge by the given percentage (relative to reference element size)
 *      Other supported units are `vh` and `vw` (relative to viewport)
 *      Additionally, you can pass a pair of values (eg. `10 20` or `2vh 20%`) to nudge the popper
 *      on both axis.
 *      A note about percentage values, if you want to refer a percentage to the popper size instead of the reference element size,
 *      use `%p` instead of `%` (eg: `20%p`). To make it clearer, you can replace `%` with `%r` and use eg.`10%p 25%r`.
 *      > **Heads up!** The order of the axis is relative to the popper placement: `bottom` or `top` are `X,Y`, the other are `Y,X`
 * @returns {Object} The data object, properly modified
 */
export default function offset(data, options) {
    const placement = data.placement;
    const popper  = data.offsets.popper;

    let offsets;
    if (isNumeric(options.offset)) {
        offsets = [options.offset, 0];
    } else {
        // split the offset in case we are providing a pair of offsets separated
        // by a blank space
        offsets = options.offset.split(' ');

        // iterate through each offset to compute them in case they are percentages
        offsets = offsets.map((offset, index) => {
            // separate value from unit
            const split = offset.match(/(\d*\.?\d*)(.*)/);
            const value = +split[1];
            const unit = split[2];

            // use height if placement is left or right and index is 0
            // otherwise use height
            // in this way the first offset will use an axis and the second one
            // will use the other one
            let useHeight = placement.indexOf('right') !== -1 || placement.indexOf('left') !== -1;

            if (index === 1) {
                useHeight = !useHeight;
            }

            // if is a percentage, we calculate the value of it using as base the
            // sizes of the reference element
            if (unit === '%' || unit === '%r') {
                const referenceRect = getPopperClientRect(data.offsets.reference);
                let len;
                if (useHeight) {
                    len = referenceRect.height;
                } else {
                    len = referenceRect.width;
                }
                return (len / 100) * value;
            }
            // if is a percentage relative to the popper, we calculate the value of it using
            // as base the sizes of the popper
            else if (unit === '%p') {
                const popperRect = getPopperClientRect(data.offsets.popper);
                let len;
                if (useHeight) {
                    len = popperRect.height;
                } else {
                    len = popperRect.width;
                }
                return (len / 100) * value;
            }
            // if is a vh or vw, we calculate the size based on the viewport
            else if (unit === 'vh' || unit === 'vw') {
                let size;
                if (unit === 'vh') {
                    size = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
                } else {
                    size = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                }
                return (size / 100) * value;
            }
            // if is an explicit pixel unit, we get rid of the unit and keep the value
            else if (unit === 'px') {
                return +value;
            }
            // if is an implicit unit, it's px, and we return just the value
            else {
                return +offset;
            }
        });
    }

    if (data.placement.indexOf('left') !== -1) {
        popper.top += offsets[0];
        popper.left -= offsets[1] || 0;
    }
    else if (data.placement.indexOf('right') !== -1) {
        popper.top += offsets[0];
        popper.left += offsets[1] || 0;
    }
    else if (data.placement.indexOf('top') !== -1) {
        popper.left += offsets[0];
        popper.top -= offsets[1] || 0;
    }
    else if (data.placement.indexOf('bottom') !== -1) {
        popper.left += offsets[0];
        popper.top += offsets[1] || 0;
    }
    return data;
}
