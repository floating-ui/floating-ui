export default function appendNewPopper(id, text, container) {
    const jasmineWrapper = document.getElementById('jasmineWrapper');

    var popper = document.createElement('div');
    popper.id = id;
    popper.className = 'popper';
    popper.textContent = text || 'popper';
    var arrow = document.createElement('div');
    arrow.className = 'popper__arrow';
    arrow.setAttribute('x-arrow', '');
    popper.appendChild(arrow);
    (container || jasmineWrapper).appendChild(popper);
    return popper;
}
