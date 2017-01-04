// Utils
import Utils from './utils/index';
import debounce from './utils/debounce';
import setStyles from './utils/setStyles';
import isTransformed from './utils/isTransformed';
import getSupportedPropertyName from './utils/getSupportedPropertyName';
import getPosition from './utils/getPosition';
import getReferenceOffsets from './utils/getReferenceOffsets';
import getPopperOffsets from './utils/getPopperOffsets';
import isFunction from './utils/isFunction';
import setupEventListeners from './utils/setupEventListeners';
import removeEventListeners from './utils/removeEventListeners';
import runModifiers from './utils/runModifiers';
import isModifierEnabled from './utils/isModifierEnabled';
import computeAutoPlacement from './utils/computeAutoPlacement';

// Modifiers
import modifiers from './modifiers/index';

// default options
const DEFAULTS = {
    // placement of the popper
    placement: 'bottom',

    // whether events (resize, scroll) are initially enabled
    eventsEnabled: true,

    /**
     * Callback called when the popper is created.
     * By default, is set to no-op.
     * Access Popper.js instance with `data.instance`.
     * @callback createCallback
     * @static
     * @param {dataObject} data
     */
    onCreate: () => {},

    /**
     * Callback called when the popper is updated, this callback is not called
     * on the initialization/creation of the popper, but only on subsequent
     * updates.
     * By default, is set to no-op.
     * Access Popper.js instance with `data.instance`.
     * @callback updateCallback
     * @static
     * @param {dataObject} data
     */
    onUpdate: () => {},

    // list of functions used to modify the offsets before they are applied to the popper
    modifiers,
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
 * @param {Boolean} options.eventsEnabled=true
 *      Whether events (resize, scroll) are initially enabled
 * @param {Boolean} options.gpuAcceleration=true
 *      When this property is set to true, the popper position will be applied using CSS3 translate3d, allowing the
 *      browser to use the GPU to accelerate the rendering.
 *      If set to false, the popper will be placed using `top` and `left` properties, not using the GPU.
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
 * @param {Number} options.modifiers.preventOverflow.boundariesElement='scrollParent'
 *      Boundaries used by the modifier, can be `scrollParent`, `window`, `viewport` or any DOM element.
 * @param {Number} options.modifiers.preventOverflow.padding=5
 *      Amount of pixel used to define a minimum distance between the boundaries and the popper
 *      this makes sure the popper has always a little padding between the edges of its container.
 *
 * @param {Object} options.modifiers.flip - Flip modifier configuration
 * @param {String|Array} options.modifiers.flip.behavior='flip'
 *      The behavior used by the `flip` modifier to change the placement of the popper when the latter is trying to
 *      overlap its reference element. Defining `flip` as value, the placement will be flipped on
 *      its axis (`right - left`, `top - bottom`).
 *      You can even pass an array of placements (eg: `['right', 'left', 'top']` ) to manually specify
 *      how alter the placement when a flip is needed. (eg. in the above example, it would first flip from right to left,
 *      then, if even in its new placement, the popper is overlapping its reference element, it will be moved to top)
 * @param {String|Element} options.modifiers.flip.boundariesElement='viewport'
 *      The element which will define the boundaries of the popper position, the popper will never be placed outside
 *      of the defined boundaries (except if `keepTogether` is enabled)
 *
 * @param {Object} options.modifiers.inner - Inner modifier configuration
 * @param {Number} options.modifiers.innner.enabled=false
 *      Set to `true` to make the popper flow toward the inner of the reference element.
 *
 * @param {Number} options.modifiers.flip.padding=5
 *      Amount of pixel used to define a minimum distance between the boundaries and the popper
 *      this makes sure the popper has always a little padding between the edges of its container.
 *
 * @param {createCallback} options.onCreate - onCreate callback
 *      Function called after the Popper has been instantiated.
 *
 * @param {updateCallback} options.onUpdate - onUpdate callback
 *      Function called on subsequent updates of Popper.
 *
 * @return {Object} instance - The generated Popper.js instance
 */
export default class Popper {
    constructor(reference, popper, options = {}) {
        // make update() debounced, so that it only runs at most once-per-tick
        this.update = debounce(this.update.bind(this));

        // with {} we create a new object with the options inside it
        this.options = {...Popper.Defaults, ...options};

        // init state
        this.state = {
            isDestroyed: false,
            isCreated: false,
        };

        // get reference and popper elements (allow jQuery wrappers)
        this.reference = reference.jquery ? reference[0] : reference;
        this.popper = popper.jquery ? popper[0] : popper;

        // refactoring modifiers' list (Object => Array)
        this.modifiers = Object.keys(Popper.Defaults.modifiers)
                               .map((name) => ({name, ...Popper.Defaults.modifiers[name]}));

        // assign default values to modifiers, making sure to override them with
        // the ones defined by user
        this.modifiers = this.modifiers.map((defaultConfig) => {
            const userConfig = (options.modifiers && options.modifiers[defaultConfig.name]) || {};
            return {...defaultConfig, ...userConfig};
        });

        // add custom modifiers to the modifiers list
        if (options.modifiers) {
            this.options.modifiers = {...{}, ...Popper.Defaults.modifiers, ...options.modifiers};
            Object.keys(options.modifiers).forEach((name) => {
                // take in account only custom modifiers
                if (Popper.Defaults.modifiers[name] === undefined) {
                    const modifier = options.modifiers[name];
                    modifier.name = name;
                    this.modifiers.push(modifier);
                }
            });
        }

        // get the popper position type
        this.state.position = getPosition(this.reference);

        // sort the modifiers by order
        this.modifiers = this.modifiers.sort((a, b) => a.order - b.order);

        // modifiers have the ability to execute arbitrary code when Popper.js get inited
        // such code is executed in the same order of its modifier
        // they could add new properties to their options configuration
        // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!
        this.modifiers.forEach((modifierOptions) => {
            if (modifierOptions.enabled && isFunction(modifierOptions.onLoad)) {
                modifierOptions.onLoad(
                    this.reference,
                    this.popper,
                    this.options,
                    modifierOptions,
                    this.state
                );
            }
        });

        // determine how we should set the origin of offsets
        this.state.isParentTransformed = isTransformed(this.popper.parentNode);

        // fire the first update to position the popper in the right place
        this.update();

        const eventsEnabled = this.options.eventsEnabled;
        if (eventsEnabled) {
            // setup event listeners, they will take care of update the position in specific situations
            this.enableEventListeners();
        }

        this.state.eventsEnabled = eventsEnabled;
    }

    //
    // Methods
    //

    /**
     * Updates the position of the popper, computing the new offsets and applying the new style
     * Prefer `scheduleUpdate` over `update` because of performance reasons
     * @method
     * @memberof Popper
     */
    update() {
        // if popper is destroyed, don't perform any further update
        if (this.state.isDestroyed) { return; }

        let data = {
            instance: this,
            styles: {},
            attributes: {},
            flipped: false,
            offsets: {},
        };

        // make sure to apply the popper position before any computation
        this.state.position = getPosition(this.reference);
        setStyles(this.popper, { position: this.state.position});

        // compute reference element offsets
        data.offsets.reference = getReferenceOffsets(this.state, this.popper, this.reference);

        // compute auto placement, store placement inside the data object,
        // modifiers will be able to edit `placement` if needed
        // and refer to originalPlacement to know the original value
        data.placement = computeAutoPlacement(
            this.options.placement,
            data.offsets.reference,
            this.popper
        );

        // store the computed placement inside `originalPlacement`
        data.originalPlacement = this.options.placement;

        // compute the popper offsets
        data.offsets.popper = getPopperOffsets(
            this.state,
            this.popper,
            data.offsets.reference,
            data.placement
        );

        // run the modifiers
        data = runModifiers(this.modifiers, data);

        // the first `update` will call `onCreate` callback
        // the other ones will call `onUpdate` callback
        if (!this.state.isCreated) {
            this.state.isCreated = true;
            this.options.onCreate(data);
        } else {
            this.options.onUpdate(data);
        }
    }

    /**
     * Schedule an update, it will run on the next UI update available
     * @method
     * @memberof Popper
     */
    scheduleUpdate = () => requestAnimationFrame(this.update);

    /**
     * Destroy the popper
     * @method
     * @memberof Popper
     */
    destroy() {
        this.state.isDestroyed = true;

        // touch DOM only if `applyStyle` modifier is enabled
        if (isModifierEnabled(this.modifiers, 'applyStyle')) {
            this.popper.removeAttribute('x-placement');
            this.popper.style.left = '';
            this.popper.style.position = '';
            this.popper.style.top = '';
            this.popper.style[getSupportedPropertyName('transform')] = '';
        }

        this.disableEventListeners();

        // remove the popper if user explicity asked for the deletion on destroy
        // do not use `remove` because IE11 doesn't support it
        if (this.options.removeOnDestroy) {
            this.popper.parentNode.removeChild(this.popper);
        }
        return this;
    }

    /**
     * it will add resize/scroll events and start recalculating
     * position of the popper element when they are triggered
     * @method
     * @memberof Popper
     */
    enableEventListeners() {
        if (!this.state.eventsEnabled) {
            this.state = setupEventListeners(this.reference, this.options, this.state, this.scheduleUpdate);
        }
    }

    /**
     * it will remove resize/scroll events and won't recalculate
     * popper position when they are triggered. It also won't trigger onUpdate callback anymore,
     * unless you call 'update' method manually.
     * @method
     * @memberof Popper
     */
    disableEventListeners() {
        if (this.state.eventsEnabled) {
            cancelAnimationFrame(this.scheduledUpdate);
            this.state = removeEventListeners(this.reference, this.state);
        }
    }

    /**
     * Collection of utilities useful when writing custom modifiers
     * @memberof Popper
     */
    static Utils = Utils;

    /**
     * List of accepted placements to use as values of the `placement` option
     * @memberof Popper
     */
     static placements = [
         'auto',
         'auto-start',
         'auto-end',
         'top',
         'top-start',
         'top-end',
         'right',
         'right-start',
         'right-end',
         'bottom',
         'bottom-start',
         'bottom-end',
         'left',
         'left-start',
         'left-end',
     ];

    /**
     * Default Popper.js options
     * @memberof Popper
     */
    static Defaults = DEFAULTS;
}
