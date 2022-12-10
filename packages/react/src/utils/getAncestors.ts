import type {FloatingNodeType, ReferenceType} from '../types';

export function getAncestors<RT extends ReferenceType = ReferenceType>(
  nodes: Array<FloatingNodeType<RT>>,
  id: string | undefined
) {
  let allAncestors: Array<FloatingNodeType<RT>> = [];
  let currentParentId = nodes.find((node) => node.id === id)?.parentId;

  while (currentParentId) {
    const currentNode = nodes.find((node) => node.id === currentParentId);
    currentParentId = currentNode?.parentId;

    if (currentNode) {
      allAncestors = allAncestors.concat(currentNode);
    }
  }

  return allAncestors;
}
