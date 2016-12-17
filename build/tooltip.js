/**!
 * @fileOverview Kickass library to create tooltips in your applications.
 * @version 1.0.0-alpha.1
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
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('../popper/index.js')) :
  typeof define === 'function' && define.amd ? define(['../popper/index.js'], factory) :
  (global.Tooltip = factory(global.Popper));
}(this, (function (Popper) { 'use strict';

Popper = 'default' in Popper ? Popper['default'] : Popper;

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var DEFAULT_OPTIONS = {
    container: false,
    delay: 0,
    html: false,
    placement: 'top',
    title: '',
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    offset: 0
};

var Tooltip = function () {
    /**
     * Create a new Tooltip.js instance
     * @class Tooltip
     * @param {HTMLElement} reference - The reference element used to position the tooltip
     * @param {Object} options
     * @param {String} options.placement=bottom
     *      Placement of the popper accepted values: `top(-start, -end), right(-start, -end), bottom(-start, -right),
     *      left(-start, -end)`
     *
     * @param {HTMLElement} reference - The DOM node used as reference of the tooltip (it can be a jQuery element).
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
     *      [boundariesElement docs](https://popper.js.org/popper-documentation.html)
     * @param {Number|String} options.offset=0 - Offset of the tooltip relative to its reference. For more information refer to Popper.js'
     *      [offset docs](https://popper.js.org/popper-documentation.html)
     * @return {Object} instance - The generated tooltip instance
     */
    function Tooltip(reference, options) {
        classCallCheck(this, Tooltip);

        _initialiseProps.call(this);

        // apply user options over default ones
        options = Object.assign({}, DEFAULT_OPTIONS, options);

        reference.jquery && (reference = reference[0]);

        // cache reference and options
        this.reference = reference;
        this.options = options;

        // get events list
        var events = typeof options.trigger === 'string' ? options.trigger.split(' ').filter(function (trigger) {
            return ['click', 'hover', 'focus'].indexOf(trigger) !== -1;
        }) : [];

        // set initial state
        this._isOpen = false;

        // set event listeners
        this._setEventListeners(reference, events, options);
    }

    //
    // Public methods
    //

    /**
     * Reveals an element's tooltip. This is considered a "manual" triggering of the tooltip.
     * Tooltips with zero-length titles are never displayed.
     * @memberof Tooltip
     */


    /**
     * Hides an element’s tooltip. This is considered a “manual” triggering of the tooltip.
     * @memberof Tooltip
     */


    /**
     * Hides and destroys an element’s tooltip.
     * @memberof Tooltip
     */


    /**
     * Toggles an element’s tooltip. This is considered a “manual” triggering of the tooltip.
     * @memberof Tooltip
     */


    //
    // Defaults
    //


    //
    // Private methods
    //

    createClass(Tooltip, [{
        key: '_create',


        /**
         * Creates a new tooltip node
         * @memberof Tooltip
         * @private
         * @param {HTMLElement} reference
         * @param {String} template
         * @param {String|HTMLElement|TitleFunction} title
         * @param {Boolean} allowHtml
         * @return {HTMLelement} tooltipNode
         */
        value: function _create(reference, template, title, allowHtml) {
            // create tooltip element
            var tooltipGenerator = window.document.createElement('div');
            tooltipGenerator.innerHTML = template;
            var tooltipNode = tooltipGenerator.childNodes[0];

            // add title to tooltip
            var titleNode = tooltipGenerator.querySelector(this.innerSelector);
            if (title.nodeType === 1) {
                // if title is a node, append it only if allowHtml is true
                allowHtml && titleNode.appendChild(title);
            } else if (Popper.Utils.isFunction(title)) {
                // if title is a function, call it and set innerText or innerHtml depending by `allowHtml` value
                var titleText = title.call(reference);
                allowHtml ? titleNode.innerHTML = titleText : titleNode.innerText = titleText;
            } else {
                // if it's just a simple text, set innerText or innerHtml depending by `allowHtml` value
                allowHtml ? titleNode.innerHTML = title : titleNode.innerText = title;
            }

            // return the generated tooltip node
            return tooltipNode;
        }
    }, {
        key: '_show',
        value: function _show(reference, options) {
            // don't show if it's already visible
            if (this._isOpen) {
                return this;
            }
            this._isOpen = true;

            // if the tooltipNode already exists, just show it
            if (this._tooltipNode) {
                this._tooltipNode.style.display = '';
                this.popperInstance.update();
                return this;
            }

            // get title
            var title = reference.getAttribute('title') || options.title;

            // don't show tooltip if no title is defined
            if (!title) {
                return this;
            }

            // create tooltip node
            var tooltipNode = this._create(reference, options.template, title, options.html);

            // append tooltip to container: container = false we pick the parent node of the reference
            var container = options.container === false ? reference.parentNode : options.container;

            this._append(tooltipNode, container);

            var popperOptions = {
                placement: options.placement,
                arrowElement: this.arrowSelector
            };

            if (options.boundariesElement) {
                popperOptions.boundariesElement = options.boundariesElement;
            }

            this.popperInstance = new Popper(reference, tooltipNode, popperOptions);

            this._tooltipNode = tooltipNode;

            return this;
        }
    }, {
        key: '_hide',
        value: function _hide() /*reference, options*/{
            // don't hide if it's already hidden
            if (!this._isOpen) {
                return this;
            }

            this._isOpen = false;

            // hide tooltipNode
            this._tooltipNode.style.display = 'none';

            return this;
        }
    }, {
        key: '_dispose',
        value: function _dispose() {
            var _this = this;

            if (this._tooltipNode) {
                this._hide();

                // destroy instance
                this.popperInstance.destroy();

                // remove event listeners
                this._events.forEach(function (_ref) {
                    var func = _ref.func,
                        event = _ref.event;

                    _this._tooltipNode.removeEventListener(event, func);
                });
                this._events = [];

                // destroy tooltipNode
                this._tooltipNode.parentNode.removeChild(this._tooltipNode);
                this._tooltipNode = null;
            }
            return this;
        }
    }, {
        key: '_findContainer',
        value: function _findContainer(container) {
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
         * @memberof Tooltip
         * @private
         * @param {HTMLElement} tooltip
         * @param {HTMLElement|String|false} container
         */

    }, {
        key: '_append',
        value: function _append(tooltipNode, container) {
            container.appendChild(tooltipNode);
        }
    }, {
        key: '_setEventListeners',
        value: function _setEventListeners(reference, events, options) {
            var _this2 = this;

            var directEvents = events.map(function (event) {
                switch (event) {
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

            var oppositeEvents = events.map(function (event) {
                switch (event) {
                    case 'hover':
                        return 'mouseleave';
                    case 'focus':
                        return 'blur';
                    case 'click':
                        return 'click';
                    default:
                        return;
                }
            }).filter(function (event) {
                return !!event;
            });

            // schedule show tooltip
            directEvents.forEach(function (event) {
                var func = function func(evt) {
                    if (_this2._isOpen === true) {
                        return;
                    }
                    evt.usedByTooltip = true;
                    _this2._scheduleShow(reference, options.delay, options, evt);
                };
                _this2._events.push({ event: event, func: func });
                reference.addEventListener(event, func);
            });

            // schedule hide tooltip
            oppositeEvents.forEach(function (event) {
                var func = function func(evt) {
                    if (evt.usedByTooltip === true) {
                        return;
                    }
                    _this2._scheduleHide(reference, options.delay, options, evt);
                };
                _this2._events.push({ event: event, func: func });
                reference.addEventListener(event, func);
            });
        }
    }, {
        key: '_scheduleShow',
        value: function _scheduleShow(reference, delay, options /*, evt */) {
            var _this3 = this;

            // defaults to 0
            var computedDelay = delay && delay.show || delay || 0;
            window.setTimeout(function () {
                return _this3._show(reference, options);
            }, computedDelay);
        }
    }, {
        key: '_scheduleHide',
        value: function _scheduleHide(reference, delay, options, evt) {
            var _this4 = this;

            // defaults to 0
            var computedDelay = delay && delay.hide || delay || 0;
            window.setTimeout(function () {
                if (_this4._isOpen === false) {
                    return;
                }
                if (!document.body.contains(_this4._tooltipNode)) {
                    return;
                }

                // if we are hiding because of a mouseleave, we must check that the new
                // reference isn't the tooltip, because in this case we don't want to hide it
                if (evt.type === 'mouseleave') {
                    var isSet = _this4._setTooltipNodeEvent(evt, reference, delay, options);

                    // if we set the new event, don't hide the tooltip yet
                    // the new event will take care to hide it if necessary
                    if (isSet) {
                        return;
                    }
                }

                _this4._hide(reference, options);
            }, computedDelay);
        }
    }, {
        key: '_isElOrChildOfEl',
        value: function _isElOrChildOfEl(a, b) {
            return a === b || b.contains(a);
        }
    }]);
    return Tooltip;
}();

/**
 * Placement function, its context is the Tooltip instance.
 * @memberof Tooltip
 * @callback PlacementFunction
 * @param {HTMLElement} tooltip - tooltip DOM node.
 * @param {HTMLElement} reference - reference DOM node.
 * @return {String} placement - One of the allowed placement options.
 */

/**
 * Title function, its context is the Tooltip instance.
 * @memberof Tooltip
 * @callback TitleFunction
 * @return {String} placement - The desired title.
 */


var _initialiseProps = function _initialiseProps() {
    var _this5 = this;

    this.show = function () {
        return _this5._show(_this5.reference, _this5.options);
    };

    this.hide = function () {
        return _this5._hide();
    };

    this.dispose = function () {
        return _this5._dispose();
    };

    this.toggle = function () {
        if (_this5._isOpen) {
            return _this5.hide();
        } else {
            return _this5.show();
        }
    };

    this.arrowSelector = '.tooltip-arrow, .tooltip__arrow';
    this.innerSelector = '.tooltip-inner, .tooltip__inner';
    this._events = [];

    this._setTooltipNodeEvent = function (evt, reference, delay, options) {
        var relatedreference = evt.relatedreference || evt.toElement;

        var callback = function callback(evt2) {
            var relatedreference2 = evt2.relatedreference || evt2.toElement;

            // Remove event listener after call
            _this5._tooltipNode.removeEventListener(evt.type, callback);

            // If the new reference is not the reference element
            if (!_this5._isElOrChildOfEl(relatedreference2, reference)) {

                // Schedule to hide tooltip
                _this5._scheduleHide(reference, options.delay, options, evt2);
            }
        };

        if (_this5._isElOrChildOfEl(relatedreference, _this5._tooltipNode)) {
            // listen to mouseleave on the tooltip element to be able to hide the tooltip
            _this5._tooltipNode.addEventListener(evt.type, callback);
            return true;
        }

        return false;
    };
};

return Tooltip;

})));
//# sourceMappingURL=tooltip.js.map
