import type {ReferenceType, FloatingNodeType} from '../types';

export function getNodeChildren<RT extends ReferenceType = ReferenceType>(
  nodes: Array<FloatingNodeType<RT>>,
  id: string | undefined,
  onlyOpenChildren = true,
) {
  let allChildren = nodes.filter(
    (node) => node.parentId === id && node.context?.open,
  );
  let currentChildren = allChildren;

  while (currentChildren.length) {
    currentChildren = onlyOpenChildren
      ? nodes.filter(
          (node) =>
            currentChildren?.some(
              (n) => node.parentId === n.id && node.context?.open,
            ),
        )
      : nodes;

    allChildren = allChildren.concat(currentChildren);
  }

  return allChildren;
}

export function getDeepestNode<RT extends ReferenceType = ReferenceType>(
  nodes: Array<FloatingNodeType<RT>>,
  id: string | undefined,
) {
  let deepestNodeId: string | undefined;
  let maxDepth = -1;

  function findDeepest(nodeId: string | undefined, depth: number) {
    if (depth > maxDepth) {
      deepestNodeId = nodeId;
      maxDepth = depth;
    }

    const children = getNodeChildren(nodes, nodeId);

    children.forEach((child) => {
      findDeepest(child.id, depth + 1);
    });
  }

  findDeepest(id, 0);

  return nodes.find((node) => node.id === deepestNodeId);
}

export function getNodeAncestors<RT extends ReferenceType = ReferenceType>(
  nodes: Array<FloatingNodeType<RT>>,
  id: string | undefined,
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
