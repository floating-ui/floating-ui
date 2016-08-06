/**
* @fileOverview Kickass library to create and place poppers near their reference elements.
* @version {{version}}
* @license
* Copyright (c) 2016 Federico Zivolo and contributors
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

import setStyle from './utils/setStyle';
import isTransformed from './utils/isTransformed';
import getSupportedPropertyName from './utils/getSupportedPropertyName';
import getPosition from './utils/getPosition';
import getOffsets from './utils/getOffsets';
import getBoundaries from './utils/getBoundaries';
import setupEventListeners from './utils/setupEventListeners';
import removeEventListeners from './utils/removeEventListeners';
import runModifiers from './utils/runModifiers';

import modifiersFunctions from './modifiers/index';

// default options
var DEFAULTS = {
    // placement of the popper
    placement: 'bottom',

    gpuAcceleration: true,

    // shift popper from its origin by the given amount of pixels (can be negative)
    offset: 0,

    // the element which will act as boundary of the popper
    boundariesElement: 'viewport',

    // amount of pixel used to define a minimum distance between the boundaries and the popper
    boundariesPadding: 5,

    // popper will try to prevent overflow following this order,
    // by default, then, it could overflow on the left and on top of the boundariesElement
    preventOverflowOrder: ['left', 'right', 'top', 'bottom'],

    // the behavior used by flip to change the placement of the popper
    flipBehavior: 'flip',

    arrowElement: '[x-arrow]',

    // list of functions used to modify the offsets before they are applied to the popper
    modifiers: [
        { name: 'shift', enabled: true },
        { name: 'offset', enabled: true},
        { name: 'preventOverflow', enabled: true},
        { name: 'keepTogether', enabled: true},
        { name: 'arrow', enabled: true},
        { name: 'flip', enabled: true},
        { name: 'applyStyle', enabled: true}
    ],

    modifiersIgnored: [],
};

/**
 * Create a new Popper.js instance
 * @constructor Popper
 * @param {HTMLElement} reference - The reference element used to position the popper
 * @param {HTMLElement} popper - The HTML element used as popper.
 * @param {Object} options
 * @param {String} [options.placement=bottom]
 *      Placement of the popper accepted values: `top(-start, -end), right(-start, -end), bottom(-start, -right),
 *      left(-start, -end)`
 *
 * @param {HTMLElement|String} [options.arrowElement='[x-arrow]']
 *      The DOM Node used as arrow for the popper, or a CSS selector used to get the DOM node. It must be child of
 *      its parent Popper. Popper.js will apply to the given element the style required to align the arrow with its
 *      reference element.
 *      By default, it will look for a child node of the popper with the `x-arrow` attribute.
 *
 * @param {Boolean} [options.gpuAcceleration=true]
 *      When this property is set to true, the popper position will be applied using CSS3 translate3d, allowing the
 *      browser to use the GPU to accelerate the rendering.
 *      If set to false, the popper will be placed using `top` and `left` properties, not using the GPU.
 *
 * @param {Number} [options.offset=0]
 *      Amount of pixels the popper will be shifted (can be negative).
 *
 * @param {String|Element} [options.boundariesElement='viewport']
 *      The element which will define the boundaries of the popper position, the popper will never be placed outside
 *      of the defined boundaries (except if `keepTogether` is enabled)
 *
 * @param {Number} [options.boundariesPadding=5]
 *      Additional padding for the boundaries
 *
 * @param {Array} [options.preventOverflowOrder=['left', 'right', 'top', 'bottom']]
 *      Order used when Popper.js tries to avoid overflows from the boundaries, they will be checked in order,
 *      this means that the last ones will never overflow
 *
 * @param {String|Array} [options.flipBehavior='flip']
 *      The behavior used by the `flip` modifier to change the placement of the popper when the latter is trying to
 *      overlap its reference element. Defining `flip` as value, the placement will be flipped on
 *      its axis (`right - left`, `top - bottom`).
 *      You can even pass an array of placements (eg: `['right', 'left', 'top']` ) to manually specify
 *      how alter the placement when a flip is needed. (eg. in the above example, it would first flip from right to left,
 *      then, if even in its new placement, the popper is overlapping its reference element, it will be moved to top)
 *
 * @param {Array} [options.modifiers=[{ modifier: 'shift', enabled: true }, { modifier: 'offset', enabled: true}, { modifier: 'preventOverflow', enabled: true}, { modifier: 'keepTogether', enabled: true}, { modifier: 'arrow', enabled: true}, { modifier: 'flip', enabled: true}, { modifier: 'applyStyle', enabled: true}]]
 *      List of functions used to modify the data before they are applied to the popper, add your custom modifier functions
 *      to the `Popper.modifiers` property, then add your modifier to this list to enable it.
 *      When `enabled` is set to `undefined`, it will use the default value (`true` for built-in modifiers, `false` for custom modifiers)
 *
 * @param {Boolean} [options.removeOnDestroy=false]
 *      Set to true if you want to automatically remove the popper when you call the `destroy` method.
 */
export default class Popper {
    constructor(reference, popper, options) {
        this._reference = reference.jquery ? reference[0] : reference;
        this.state = {};

        this._popper = popper.jquery ? popper[0] : popper;

        this.modifiers = modifiersFunctions;

        // with {} we create a new object with the options inside it
        this._options = Object.assign({}, DEFAULTS, options);

        // refactoring modifiers' list
        this._options.modifiers = this._options.modifiers.map((modifier) => {
            // set the x-placement attribute before everything else because it could be used to add margins to the popper
            // margins needs to be calculated to get the correct popper offsets
            if (modifier === 'applyStyle') {
                this._popper.setAttribute('x-placement', this._options.placement);
            }

            // return the modifier
            return modifier;
        });

        // make sure to apply the popper position before any computation
        this.state.position = getPosition(this._popper, this._reference);
        setStyle(this._popper, { position: this.state.position});

        // determine how we should set the origin of offsets
        this.state.isParentTransformed = isTransformed(this._popper.parentNode);

        // fire the first update to position the popper in the right place
        this.update();

        // setup event listeners, they will take care of update the position in specific situations
        setupEventListeners(this._reference, this._options, this.state, () => this.update);
        return this;
    }

    //
    // Methods
    //

    /**
     * Updates the position of the popper, computing the new offsets and applying the new style
     * @method
     * @memberof Popper
     */
    update() {
        var data = { instance: this, styles: {} };

        // store placement inside the data object, modifiers will be able to edit `placement` if needed
        // and refer to _originalPlacement to know the original value
        data.placement = this._options.placement;
        data._originalPlacement = this._options.placement;

        // compute the popper and reference offsets and put them inside data.offsets
        data.offsets = getOffsets(this.state, this._popper, this._reference, data.placement);

        // get boundaries
        data.boundaries = getBoundaries(this._popper, data, this._options.boundariesPadding, this._options.boundariesElement);

        data = runModifiers(this._options, data, this.modifiers);

        if (typeof this.state.updateCallback === 'function') {
            this.state.updateCallback(data);
        }
    }

    /**
     * If a function is passed, it will be executed after the initialization of popper with as first argument the Popper instance.
     * @method
     * @memberof Popper
     * @param {Function} callback
     */
    onCreate(callback) {
        // the createCallbacks return as first argument the popper instance
        callback(this);
        return this;
    }

    /**
     * If a function is passed, it will be executed after each update of popper with as first argument the set of coordinates and informations
     * used to style popper and its arrow.
     * NOTE: it doesn't get fired on the first call of the `Popper.update()` method inside the `Popper` constructor!
     * @method
     * @memberof Popper
     * @param {Function} callback
     */
    onUpdate(callback) {
        this.state.updateCallback = callback;
        return this;
    }

    /**
     * Destroy the popper
     * @method
     * @memberof Popper
     */
    destroy() {
        this._popper.removeAttribute('x-placement');
        this._popper.style.left = '';
        this._popper.style.position = '';
        this._popper.style.top = '';
        this._popper.style[getSupportedPropertyName('transform')] = '';
        this.state = removeEventListeners(this._reference, this.state, this._options);

        // remove the popper if user explicity asked for the deletion on destroy
        if (this._options.removeOnDestroy) {
            this._popper.remove();
        }
        return this;
    }
}

/**
 * The Object.assign() method is used to copy the values of all enumerable own properties from one or more source
 * objects to a target object. It will return the target object.
 * This polyfill doesn't support symbol properties, since ES5 doesn't have symbols anyway
 * Source: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 * @function
 * @ignore
 */
if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function(target) {
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert first argument to object');
            }

            var to = Object(target);
            for (var i = 1; i < arguments.length; i++) {
                var nextSource = arguments[i];
                if (nextSource === undefined || nextSource === null) {
                    continue;
                }
                nextSource = Object(nextSource);

                var keysArray = Object.keys(nextSource);
                for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    var nextKey = keysArray[nextIndex];
                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
            return to;
        }
    });
}
