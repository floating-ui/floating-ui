/**
 * This class can be provided to Popper.js as `reference` argument instead of
 * an actual DOM node.
 * This is useful if you need to position a popper knowing only the coordinates
 * of the target area, such as elements drawn on a canvas element.
 * @class
 * @argument {getBoundingClientRect} getBoundingClientRect
 */
export default class Reference {
    constructor(getBoundingClientRect) {
        this.getBoundingClientRect = getBoundingClientRect;
    }
    getBoundingClientRect = () => this.getBoundingClientRect()

    get clientWidth() {
        return this.getBoundingClientRect().right - this.getBoundingClientRect().left;
    }

    get clientHeight() {
        return this.getBoundingClientRect().bottom - this.getBoundingClientRect().top;
    }
}

/**
 * This function must return the same data of a real [Element.getBoundingClientRect()](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)
 * @callback getBoundingClientRect
 * @return {DOMRect} It doesn't have to be a real DOMRect, it must have the same properties
 */
