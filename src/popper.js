import setStyle from './utils/setStyle';
import isTransformed from './utils/isTransformed';
import getSupportedPropertyName from './utils/getSupportedPropertyName';
import getPosition from './utils/getPosition';
import getOffsets from './utils/getOffsets';
import getBoundaries from './utils/getBoundaries';
import setupEventListeners from './utils/setupEventListeners';
import removeEventListeners from './utils/removeEventListeners';
import runModifiers from './utils/runModifiers';
import isFunction from './utils/isFunction';

import modifiersFunctions from './modifiers/index';
import { modifiersOnLoad as modifiersOnLoadFunctions } from './modifiers/index';

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
    modifiers: {
        shift:              { order: 100, enabled: true, function: modifiersFunctions.shift },
        offset:             { order: 200, enabled: true, function: modifiersFunctions.offset },
        preventOverflow:    { order: 300, enabled: true, function: modifiersFunctions.preventOverflow },
        keepTogether:       { order: 400, enabled: true, function: modifiersFunctions.keepTogether },
        arrow:              { order: 500, enabled: true, function: modifiersFunctions.arrow },
        flip:               { order: 600, enabled: true, function: modifiersFunctions.flip },
        applyStyle:         { order: 700, enabled: true, function: modifiersFunctions.applyStyle, onLoad: modifiersOnLoadFunctions.applyStyleOnLoad }
    },
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
 * @param {Object} [options.modifiers={ foobar: { order: 100, enabled: true, function: fn, onLoad: fn }, ... }]
 *      List of functions used to modify the data before they are applied to the popper.
 *
 * @param {Boolean} [options.removeOnDestroy=false]
 *      Set to true if you want to automatically remove the popper when you call the `destroy` method.
 */
export default class Popper {
    constructor(reference, popper, options = {}) {
        this.reference = reference.jquery ? reference[0] : reference;
        this.state = { onCreateCalled: false };

        this.popper = popper.jquery ? popper[0] : popper;

        // with {} we create a new object with the options inside it
        this.options = Object.assign({}, DEFAULTS, options);
        this.options.modifiers = Object.assign({}, DEFAULTS.modifiers, options.modifiers);

        // refactoring modifiers' list

        this.modifiers = Object.keys(this.options.modifiers)
                               .map((name) => Object.assign({ name }, this.options.modifiers[name]))
                               .sort(sortModifiers);

        this.modifiers = this.modifiers.map((modifier) => {
            // Modifiers have the ability to execute arbitrary code when Popper.js get inited
            // such code is executed in the same order of its modifier
            if (modifier.enabled && isFunction(modifier.onLoad)) {
                modifier.onLoad(this.reference, this.popper, this.options);
            }

            // return the modifier
            return modifier;
        });

        // make sure to apply the popper position before any computation
        this.state.position = getPosition(this.popper, this.reference);
        setStyle(this.popper, { position: this.state.position});

        // determine how we should set the origin of offsets
        this.state.isParentTransformed = isTransformed(this.popper.parentNode);

        // fire the first update to position the popper in the right place
        this.update();

        // setup event listeners, they will take care of update the position in specific situations
        setupEventListeners(this.reference, this.options, this.state, () => this.update);
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

        // make sure to apply the popper position before any computation
        this.state.position = getPosition(this.popper, this.reference);
        setStyle(this.popper, { position: this.state.position});

        // to avoid useless computations we throttle the popper position refresh to 60fps
        window.requestAnimationFrame(() => {
            const now = window.performance.now();
            if (now - this.state.lastFrame <= 16) {
                // this update fired to early! drop it
                return;
            }
            this.state.lastFrame = now;

            // store placement inside the data object, modifiers will be able to edit `placement` if needed
            // and refer to _originalPlacement to know the original value
            data.placement = this.options.placement;
            data._originalPlacement = this.options.placement;

            // compute the popper and reference offsets and put them inside data.offsets
            data.offsets = getOffsets(this.state, this.popper, this.reference, data.placement);

            // get boundaries
            data.boundaries = getBoundaries(this.popper, data, this.options.boundariesPadding, this.options.boundariesElement);

            // run the modifiers
            data = runModifiers(this.modifiers, this.options, data);

            // the first `update` will call `onCreate` callback
            // the other ones will call `onUpdate` callback
            if (this.state.onCreateCalled === false && isFunction(this.state.createCalback)) {
                this.state.onCreateCalled = true;
                this.state.createCalback(data.instance);
            } else if (this.state.onCreateCalled === true && isFunction(this.state.updateCallback)) {
                this.state.updateCallback(data);
            } else {
                this.state.onCreateCalled = true;
            }
        });
    }

    /**
     * If a function is passed, it will be executed after the initialization of popper with as first argument the Popper instance.
     * @method
     * @memberof Popper
     * @param {Function} callback
     */
    onCreate(callback) {
        // the createCallbacks return as first argument the popper instance
        this.state.createCalback = callback;
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
        this.popper.removeAttribute('x-placement');
        this.popper.style.left = '';
        this.popper.style.position = '';
        this.popper.style.top = '';
        this.popper.style[getSupportedPropertyName('transform')] = '';
        this.state = removeEventListeners(this.reference, this.state, this.options);

        // remove the popper if user explicity asked for the deletion on destroy
        if (this.options.removeOnDestroy) {
            this.popper.remove();
        }
        return this;
    }
}

//
// Sorts the modifiers based on their order property
//
function sortModifiers(a, b) {
    if (a.order < b.order) {
        return -1;
    } else if (a.order > b.order) {
        return 1;
    }
    return 0;
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

if (!window.requestAnimationFrame) {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                                       timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}
