function appendNewPopper(id, text, container) {
    var popper = document.createElement('div');
    popper.id = id;
    popper.classList.add('popper');
    popper.textContent = text || 'popper';
    var arrow = document.createElement('div');
    arrow.classList.add('popper__arrow');
    arrow.setAttribute('x-arrow', '');
    popper.appendChild(arrow);
    (container || jasmineWrapper).appendChild(popper);
    return popper;
}
function appendNewRef(id, text, container) {
    var popper = document.createElement('div');
    popper.id = id;
    popper.classList.add('ref');
    popper.textContent = text || 'reference';
    (container || jasmineWrapper).appendChild(popper);
    return popper;
}


/**
 * Get the prefixed supported property name
 * @function
 * @ignore
 * @argument {String} property (camelCase)
 * @returns {String} prefixed property (camelCase)
 */
function getSupportedPropertyName(property) {
    var prefixes = ['', 'ms', 'webkit', 'moz', 'o'];

    for (var i = 0; i < prefixes.length; i++) {
        var toCheck = prefixes[i] ? prefixes[i] + property.charAt(0).toUpperCase() + property.slice(1) : property;
        if (typeof document.body.style[toCheck] !== 'undefined') {
            return toCheck;
        }
    }
    return null;
}
