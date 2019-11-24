import getOffsetParent from './getOffsetParent';

export default function isOffsetContainer(element) {
  const { nodeName } = element;
  if (nodeName === 'BODY' || nodeName === 'body') {
    return false;
  }
  return (
    nodeName === 'HTML' || nodeName === 'html' || getOffsetParent(element.firstElementChild) === element
  );
}
