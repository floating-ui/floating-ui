export default function appendNewRef(id, text, container) {
    const jasmineWrapper = document.getElementById('jasmineWrapper');

    const popper = document.createElement('div');
    popper.id = id;
    popper.className = 'ref';
    popper.textContent = text || 'reference';
    (container || jasmineWrapper).appendChild(popper);
    return popper;
}
