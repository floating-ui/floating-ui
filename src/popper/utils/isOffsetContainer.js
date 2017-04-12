export default function isOffsetContainer(element) {
    return element.nodeName === 'HTML' || element.firstElementChild.offsetParent === element;
}
