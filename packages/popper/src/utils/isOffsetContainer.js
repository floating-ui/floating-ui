import getOffsetParent from './getOffsetParent';

export default function isOffsetContainer(element) {
  const { nodeName } = element;
  if (nodeName.toUpperCase() === 'BODY') {
    return false;
  }
  return (
    nodeName.toUpperCase() === 'HTML' || getOffsetParent(element.firstElementChild) === element
  );
}
