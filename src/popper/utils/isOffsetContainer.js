export default function isOffsetContainer(element) {
    return element.firstElementChild.offsetParent === element
}
