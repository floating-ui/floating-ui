// import Popper from 'popper.js';
/* globals Popper */
import isFunction from '../popper/utils/isFunction';

const DEFAULT_OPTIONS = {
    container: false,
    delay: 0,
    html: false,
    placement: 'top',
    title: '',
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    offset: 0,
};

export default class Tooltip {
    /**
     * @param {HTMLElement} target - The DOM node used as target of the tooltip (it can be a jQuery element).
     * @param {Object} options - Configuration of the tooltip
     * @param {HTMLElement|String|false} options.container=false - Append the tooltip to a specific element.
     * @param {Number|Object} options.delay=0
     *      Delay showing and hiding the tooltip (ms) - does not apply to manual trigger type.
     *      If a number is supplied, delay is applied to both hide/show.
     *      Object structure is: `{ show: 500, hide: 100 }`
     * @param {Boolean} options.html=false - Insert HTML into the tooltip. If false, the content will inserted with `innerText`.
     * @param {String|PlacementFunction} options.placement='top' - One of the allowed placements, or a function returning one of them.
     * @param {String} options.template='<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
     *      Base HTML to used when creating the tooltip.
     *      The tooltip's `title` will be injected into the `.tooltip-inner` or `.tooltip__inner`.
     *      `.tooltip-arrow` or `.tooltip__arrow` will become the tooltip's arrow.
     *      The outermost wrapper element should have the `.tooltip` class.
     * @param {String|HTMLElement|TitleFunction} options.title='' - Default title value if `title` attribute isn't present.
     * @param {String} options.trigger='hover focus'
     *      How tooltip is triggered - click | hover | focus | manual.
     *      You may pass multiple triggers; separate them with a space. `manual` cannot be combined with any other trigger.
     * @param {HTMLElement} options.boundariesElement
     *      The element used as boundaries for the tooltip. For more information refer to Popper.js'
     *      [boundariesElement docs](https://popper.js.org/documentation.html)
     * @param {Number|String} options.offset=0 - Offset of the tooltip relative to its target. For more information refer to Popper.js'
     *      [offset docs](https://popper.js.org/documentation.html)
     * @return {Object} instance - The generated tooltip instance
     */
    constructor(target, options = {}) {
        // apply user options over default ones
        options = Object.assign({}, DEFAULT_OPTIONS, options);

        target.jquery && (target = target[0]);

        // get events list
        const events = typeof options.trigger === 'string' ? options.trigger.split(' ').filter((trigger) => {
            return ['click', 'hover', 'focus'].indexOf(trigger) !== -1;
        }) : [];

        // set initial state
        this._isOpen = false;

        // set event listeners
        this._setEventListeners(target, events, options);
    }

    //
    // Public methods
    //

    show(target, options) {
        // get title
        const title = target.getAttribute('title') || options.title;

        // create tooltip node
        const tooltipNode = this._create(target, options.template, title, options.html);

        // append tooltip to container: container = false we pick the parent node of the target
        var container = options.container === false ? target.parentNode : options.container;

        this._append(tooltipNode, container);

        const popperOptions = {
            placement: options.placement,
            removeOnDestroy: true,
            arrowElement: this.arrowSelector,
        };

        if (options.boundariesElement) {
            popperOptions.boundariesElement = options.boundariesElement;
        }

        this.popperInstance = new Popper(target, tooltipNode, popperOptions);

        this._isOpen = true;
        this._tooltipNode = tooltipNode;

        return this;
    }

    hide(/*target, options*/) {
        this.popperInstance.destroy();
        this._isOpen = false;
        this._tooltipNode = null;
        return this;
    }

    //
    // Defaults
    //
    arrowSelector = '.tooltip-arrow, .tooltip__arrow';
    innerSelector = '.tooltip-inner, .tooltip__inner';

    //
    // Private methods
    //

    /**
     * Creates a new tooltip node
     * @param {HTMLElement} target
     * @param {String} template
     * @param {String|HTMLElement|TitleFunction} title
     * @param {Boolean} allowHtml
     * @return {HTMLelement} tooltipNode
     */
    _create(target, template, title, allowHtml) {
        // create tooltip element
        const tooltipGenerator = window.document.createElement('div');
        tooltipGenerator.innerHTML = template;
        const tooltipNode = tooltipGenerator.childNodes[0];

        // add title to tooltip
        const titleNode = tooltipGenerator.querySelector(this.innerSelector);
        if (title.nodeType === 1) {
            // if title is a node, append it only if allowHtml is true
            allowHtml && titleNode.appendChild(title);
        }
        else if (isFunction(title)) {
            // if title is a function, call it and set innerText or innerHtml depending by `allowHtml` value
            const titleText = title.call(target);
            allowHtml ? (titleNode.innerHTML = titleText) : (titleNode.innerText = titleText);
        }
        else {
            // if it's just a simple text, set innerText or innerHtml depending by `allowHtml` value
            allowHtml ? (titleNode.innerHTML = title) : (titleNode.innerText = title);
        }

        // return the generated tooltip node
        return tooltipNode;
    }

    _findContainer(container) {
        // if container is a query, get the relative element
        if (typeof container === 'string') {
            container = window.document.querySelector(container);
        }
        // if container is `false`, set it to body
        else if (container === false) {
            container = window.document.body;
        }
        return container;
    }

    /**
     * Append tooltip to container
     * @param {HTMLElement} tooltip
     * @param {HTMLElement|String|false} container
     */
    _append(tooltipNode, container) {
        container.appendChild(tooltipNode);
    }

    _setEventListeners(target, events, options) {
        const directEvents = events.map((event) => {
            switch(event) {
                case 'hover':
                    return 'mouseenter';
                case 'focus':
                    return 'focus';
                case 'click':
                    return 'click';
                default:
                    return;
            }
        });

        const oppositeEvents = events.map((event) => {
            switch(event) {
                case 'hover':
                    return 'mouseleave';
                case 'focus':
                    return 'blur';
                case 'click':
                    return 'click';
                default:
                    return;
            }
        }).filter(event => !!event);

        // schedule show tooltip
        directEvents.forEach((event) => {
            target.addEventListener(event, (evt)  => {
                if (this._isOpen === true) { return; }
                evt.usedByTooltip = true;
                this._scheduleShow(target, options.delay, options, evt);
            });
        });

        // schedule hide tooltip
        oppositeEvents.forEach((event) => {
            target.addEventListener(event, (evt) => {
                if (evt.usedByTooltip === true) { return; }
                this._scheduleHide(target, options.delay, options, evt);
            });
        });
    }

    _scheduleShow(target, delay, options/*, evt */) {
        // defaults to 0
        const computedDelay = (delay && delay.show) || delay || 0;
        window.setTimeout(() => this.show(target, options), computedDelay);
    }

    _scheduleHide(target, delay, options, evt) {
        // defaults to 0
        const computedDelay = (delay && delay.hide) || delay || 0;
        window.setTimeout(() => {

            if (this._isOpen === false) { return; }
            if (!document.body.contains(this._tooltipNode)) { return; }

            // if we are hiding because of a mouseleave, we must check that the new
            // target isn't the tooltip, because in this case we don't want to hide it
            if (evt.type === 'mouseleave') {
                const isSet = this._setTooltipNodeEvent(evt, target, delay, options);

                // if we set the new event, don't hide the tooltip yet
                // the new event will take care to hide it if necessary
                if (isSet) { return; }
            }

            this.hide(target, options);
        }, computedDelay);
    }

    _setTooltipNodeEvent(evt,  target, delay, options) {
        const relatedTarget = evt.relatedTarget || evt.toElement;

        const callback = (evt2) => {
            const relatedTarget2 = evt2.relatedTarget || evt2.toElement;

            // Remove event listener after call
            evt2.target.removeEventListener(evt2.type, callback);

            // If the new target is not the reference element, we schedule to hide tooltip
            if (!this._isElOrChildOfEl(relatedTarget2, target)) {
                this._scheduleHide(target, options.delay, options, evt2);
            }
        };

        if (this._isElOrChildOfEl(relatedTarget, this._tooltipNode)) {
            // listen to mouseleave on the tooltip element to be able to hide the tooltip
            this._tooltipNode.addEventListener(evt.type, callback);
            return true;
        }

        return false;
    }

    _isElOrChildOfEl(a, b) {
        return a === b || b.contains(a);
    }
}


/**
 * Placement function, its context is the Tooltip instance.
 * @callback PlacementFunction
 * @param {HTMLElement} tooltip - tooltip DOM node.
 * @param {HTMLElement} target - target DOM node.
 * @return {String} placement - One of the allowed placement options.
 */

/**
 * Title function, its context is the Tooltip instance.
 * @callback TitleFunction
 * @return {String} placement - The desired title.
 */
