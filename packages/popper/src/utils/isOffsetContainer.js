import getOffsetParent from './getOffsetParent';

export default function isOffsetContainer(element) {
  const { nodeName } = element;
  if (nodeName.toLowerCase() === 'body') {
    return false;
  }
  return (
    nodeName.toLowerCase() === 'html' || getOffsetParent(element.firstElementChild) === element
  );
}
