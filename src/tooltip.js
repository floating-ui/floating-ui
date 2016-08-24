/* global Popper */

import isFunction from './utils/isFunction';

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
        target.jquery && (target = target[0]);

        // get events list
        const events = options.trigger.split(' ').filter((trigger) => {
            return ['click', 'hover', 'focus'].indexOf(trigger) !== -1;
        });

        // set event listeners
        this._setEventListeners(target, events, options);
    }

    //
    // Public methods
    //

    show(target, options) {
        // create tooltip node
        const tooltipNode = this._create(target, options.template, options.title, options.html);

        // append tooltip to container: container = false we pick the parent node of the target
        var container = options.container === false ? target.parentNode : options.container;

        this._append(tooltipNode, container);

        this.popperInstance = new Popper(target, tooltipNode, {
            placement: options.placement,
            boundariesElement: options.boundariesElement,
            removeOnDestroy: true,
            arrowElement: this.arrowSelector
        })
        return this;
    }

    hide(/*target, options*/) {
        this.popperInstance.destroy();
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
        const oppositeEvents = events.map((event) => {
            switch(event) {
                case 'hover':
                    return 'mouseleave';
                case 'focus':
                    return 'blur';
                default:
                    return;
            }
        }).filter(event => !!event);

        // schedule show tooltip
        var me = this;

        events.forEach(function(event) {
            target.addEventListener(event, function() {
                me._scheduleShow(target, options.delay, options);
            });
        });

        // schedule hide tooltip
        oppositeEvents.forEach(function(event) {
            target.addEventListener(event, function() {
                me._scheduleHide(target, options.delay, options);
            });
        });
    }

    _scheduleShow(target, delay, options) {
        // defaults to 0
        const computedDelay = (delay && delay.show) || delay || 0
        window.setTimeout(() => this.show(target, options), computedDelay);
    }

    _scheduleHide(target, delay, options) {
        // defaults to 0
        const computedDelay = (delay && delay.hide) || delay || 0
        window.setTimeout(() => this.hide(target, options), computedDelay);
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
