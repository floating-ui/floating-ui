import getParentNode from './getParentNode';

export default function getParentNodeAndParentNodeIs(element, condition) {
  const parentNode = getParentNode(element)
  return parentNode && condition(parentNode)
}
