// Polyfills
import './polyfills/objectAssign';
import './polyfills/requestAnimationFrame';

// Utils
import Utils from './utils/index';
import setStyle from './utils/setStyle';
import isTransformed from './utils/isTransformed';
import getSupportedPropertyName from './utils/getSupportedPropertyName';
import getPosition from './utils/getPosition';
import getOffsets from './utils/getOffsets';
import isFunction from './utils/isFunction';
import setupEventListeners from './utils/setupEventListeners';
import removeEventListeners from './utils/removeEventListeners';
import runModifiers from './utils/runModifiers';
import sortModifiers from './utils/sortModifiers';
import getBoundaries from './utils/getBoundaries';

// Modifiers
import modifiersFunctions from './modifiers/index';
import { modifiersOnLoad as modifiersOnLoadFunctions } from './modifiers/index';

// default options
var DEFAULTS = {
    // placement of the popper
    placement: 'bottom',

    // if true, it uses the CSS 3d transformation to position the popper
    gpuAcceleration: true,

    // the element which will act as boundary of the popper
    boundariesElement: 'viewport',

    // amount of pixel used to define a minimum distance between the boundaries and the popper
    boundariesPadding: 5,

    // list of functions used to modify the offsets before they are applied to the popper
    modifiers: {
        autoPlacement: {
            order: 100,
            enabled: true,
            function: modifiersFunctions.autoPlacement,
        },
        getPopperOffsets: {
            order: 200,
            enabled: true,
            function: modifiersFunctions.getPopperOffsets,
        },
        shift: {
            order: 300,
            enabled: true,
            function: modifiersFunctions.shift,
        },
        offset: {
            order: 400,
            enabled: true,
            function: modifiersFunctions.offset,
            // nudges popper from its origin by the given amount of pixels (can be negative)
            offset: 0,
        },
        preventOverflow: {
            order: 500,
            enabled: true,
            function: modifiersFunctions.preventOverflow,
            // popper will try to prevent overflow following these priorities
            //  by default, then, it could overflow on the left and on top of the boundariesElement
            priority: ['left', 'right', 'top', 'bottom'],
        },
        keepTogether: {
            order: 600,
            enabled: true,
            function: modifiersFunctions.keepTogether
        },
        arrow: {
            order: 700,
            enabled: true,
            function: modifiersFunctions.arrow,
            // selector or node used as arrow
            element: '[x-arrow]'
        },
        flip: {
            order: 800,
            enabled: true,
            function: modifiersFunctions.flip,
            // the behavior used to change the popper's placement
            behavior: 'flip'
        },
        hide: {
            order: 900,
            enabled: true,
            function: modifiersFunctions.hide
        },
        applyStyle: {
            order: 1000,
            enabled: true,
            function: modifiersFunctions.applyStyle,
            onLoad: modifiersOnLoadFunctions.applyStyleOnLoad
        }
    },
};

/**
 * Create a new Popper.js instance
 * @class Popper
 * @param {HTMLElement} reference - The reference element used to position the popper
 * @param {HTMLElement} popper - The HTML element used as popper.
 * @param {Object} options
 * @param {String} options.placement=bottom
 *      Placement of the popper accepted values: `top(-start, -end), right(-start, -end), bottom(-start, -right),
 *      left(-start, -end)`
 *
 * @param {Boolean} options.gpuAcceleration=true
 *      When this property is set to true, the popper position will be applied using CSS3 translate3d, allowing the
 *      browser to use the GPU to accelerate the rendering.
 *      If set to false, the popper will be placed using `top` and `left` properties, not using the GPU.
 *
 * @param {String|Element} options.boundariesElement='viewport'
 *      The element which will define the boundaries of the popper position, the popper will never be placed outside
 *      of the defined boundaries (except if `keepTogether` is enabled)
 *
 * @param {Number} options.boundariesPadding=5
 *      Additional padding for the boundaries
 *
 * @param {Boolean} options.removeOnDestroy=false
 *      Set to true if you want to automatically remove the popper when you call the `destroy` method.
 *
 * @param {Object} options.modifiers
 *      List of functions used to modify the data before they are applied to the popper (see source code for default values)
 *
 * @param {Object} options.modifiers.arrow - Arrow modifier configuration
 * @param {HTMLElement|String} options.modifiers.arrow.element='[x-arrow]'
 *      The DOM Node used as arrow for the popper, or a CSS selector used to get the DOM node. It must be child of
 *      its parent Popper. Popper.js will apply to the given element the style required to align the arrow with its
 *      reference element.
 *      By default, it will look for a child node of the popper with the `x-arrow` attribute.
 *
 * @param {Object} options.modifiers.offset - Offset modifier configuration
 * @param {Number} options.modifiers.offset.offset=0
 *      Amount of pixels the popper will be shifted (can be negative).
 *
 * @param {Object} options.modifiers.preventOverflow - PreventOverflow modifier configuration
 * @param {Array} [options.modifiers.preventOverflow.priority=['left', 'right', 'top', 'bottom']]
 *      Priority used when Popper.js tries to avoid overflows from the boundaries, they will be checked in order,
 *      this means that the last one will never overflow
 *
 * @param {Object} options.modifiers.flip - Flip modifier configuration
 * @param {String|Array} options.modifiers.flip.behavior='flip'
 *      The behavior used by the `flip` modifier to change the placement of the popper when the latter is trying to
 *      overlap its reference element. Defining `flip` as value, the placement will be flipped on
 *      its axis (`right - left`, `top - bottom`).
 *      You can even pass an array of placements (eg: `['right', 'left', 'top']` ) to manually specify
 *      how alter the placement when a flip is needed. (eg. in the above example, it would first flip from right to left,
 *      then, if even in its new placement, the popper is overlapping its reference element, it will be moved to top)
 *
 * @return {Object} instance - The generated Popper.js instance
 */
export default class Popper {
    constructor(reference, popper, options = {}) {
        // init state
        this.state = {
            isDestroyed: false
        };

        // get reference and popper elements (allow jQuery wrappers)
        this.reference = reference.jquery ? reference[0] : reference;
        this.popper = popper.jquery ? popper[0] : popper;

        // with {} we create a new object with the options inside it
        this.options = Object.assign({}, DEFAULTS, options);

        // refactoring modifiers' list (Object => Array)
        this.modifiers = Object.keys(DEFAULTS.modifiers)
                               .map((name) => Object.assign({ name }, DEFAULTS.modifiers[name]));

        // assign default values to modifiers, making sure to override them with
        // the ones defined by user
        this.modifiers = this.modifiers.map((defaultConfig) => {
            const userConfig = (options.modifiers && options.modifiers[defaultConfig.name]) || {};
            const finalConfig = Object.assign({}, defaultConfig, userConfig);
            return finalConfig;
        });

        // add custom modifiers to the modifiers list
        if (options.modifiers) {
            Object.keys(options.modifiers).forEach((name) => {
                // take in account only custom modifiers
                if (DEFAULTS.modifiers[name] === undefined) {
                    const modifier = options.modifiers[name];
                    modifier.name = name;
                    this.modifiers.push(modifier);
                }
            });
        }

        // sort the modifiers by order
        this.modifiers = this.modifiers.sort(sortModifiers)

        // modifiers have the ability to execute arbitrary code when Popper.js get inited
        // such code is executed in the same order of its modifier
        this.modifiers.forEach((modifier) => {
            if (modifier.enabled && isFunction(modifier.onLoad)) {
                modifier.onLoad(this.reference, this.popper, this.options);
            }
        });

        // get the popper position type
        this.state.position = getPosition(this.popper, this.reference);

        // determine how we should set the origin of offsets
        this.state.isParentTransformed = isTransformed(this.popper.parentNode);

        // fire the first update to position the popper in the right place
        this.update(true);

        // setup event listeners, they will take care of update the position in specific situations
        setupEventListeners(this.reference, this.options, this.state, () => this.update());

        // make it chainable
        return this;
    }

    //
    // Methods
    //

    /**
     * Updates the position of the popper, computing the new offsets and applying the new style
     * @method
     * @param {Boolean} isFirstCall
     *      When true, the onCreate callback is called, otherwise it calls the onUpdate callback
     * @memberof Popper
     */
    update(isFirstCall) {
        var data = { instance: this, styles: {} };

        // make sure to apply the popper position before any computation
        this.state.position = getPosition(this.popper, this.reference);
        setStyle(this.popper, { position: this.state.position});

        // to avoid useless computations we throttle the popper position refresh to 60fps
        window.requestAnimationFrame(() => {
            // if popper is destroyed, don't perform any further update
            if (this.state.isDestroyed) { return; }

            const now = window.performance.now();
            if (now - this.state.lastFrame <= 16) {
                // this update fired to early! drop it
                // but schedule a new one that will be ran at the end of the updates
                // chain to make sure everything is proper updated
                return this.update();
            }
            this.state.lastFrame = now;

            // store placement inside the data object, modifiers will be able to edit `placement` if needed
            // and refer to originalPlacement to know the original value
            data.placement = this.options.placement;
            data.originalPlacement = this.options.placement;

            // compute the popper and reference offsets and put them inside data.offsets
            data.offsets = getOffsets(this.state, this.popper, this.reference);

            // get boundaries
            data.boundaries = getBoundaries(data.instance.popper, data.instance.options.boundariesPadding, data.instance.options.boundariesElement);

            // run the modifiers
            data = runModifiers(this.modifiers, this.options, data);

            // the first `update` will call `onCreate` callback
            // the other ones will call `onUpdate` callback
            if (isFirstCall && isFunction(this.state.createCalback)) {
                this.state.createCalback(data);
            } else if (!isFirstCall && isFunction(this.state.updateCallback)) {
                this.state.updateCallback(data);
            }
        });
    }

    /**
     * If a function is passed, it will be executed after the initialization of popper with as first argument the Popper instance.
     * @method
     * @memberof Popper
     * @param {createCallback} callback
     */
    onCreate(callback) {
        // the createCallbacks return as first argument the popper instance
        this.state.createCalback = callback;
        return this;
    }

    /**
     * Callback called when the popper is created.
     * Access Popper.js instance with `data.instance`.
     * @callback createCallback
     * @static
     * @param {dataObject} data
     */

    /**
     * If a function is passed, it will be executed after each update of popper with as first argument the set of coordinates and informations
     * used to style popper and its arrow.
     * NOTE: it doesn't get fired on the first call of the `Popper.update()` method inside the `Popper` constructor!
     * @method
     * @memberof Popper
     * @param {updateCallback} callback
     */
    onUpdate(callback) {
        this.state.updateCallback = callback;
        return this;
    }

    /**
     * Callback called when the popper is updated, this callback is not called
     * on the initialization/creation of the popper, but only on subsequent
     * updates.
     * Access Popper.js instance with `data.instance`.
     * @callback updateCallback
     * @static
     * @param {dataObject} data
     */

    /**
     * Destroy the popper
     * @method
     * @memberof Popper
     */
    destroy() {
        this.state.isDestroyed = true;
        this.popper.removeAttribute('x-placement');
        this.popper.style.left = '';
        this.popper.style.position = '';
        this.popper.style.top = '';
        this.popper.style[getSupportedPropertyName('transform')] = '';
        this.state = removeEventListeners(this.reference, this.state, this.options);

        // remove the popper if user explicity asked for the deletion on destroy
        // do not use `remove` because IE11 doesn't support it
        if (this.options.removeOnDestroy) {
            this.popper.parentNode.removeChild(this.popper);
        }
        return this;
    }

    /**
     * Collection of utilities useful when writing custom modifiers
     * @memberof Popper
     */
    static Utils = Utils;

    /**
     * Default Popper.js options
     * @memberof Popper
     */
    Defaults = DEFAULTS;
}
