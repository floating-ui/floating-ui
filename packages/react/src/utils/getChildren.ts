import type {FloatingNodeType, ReferenceType} from '../types';

export function getChildren<RT extends ReferenceType = ReferenceType>(
  nodes: Array<FloatingNodeType<RT>>,
  id: string | undefined
) {
  let allChildren =
    nodes.filter((node) => node.parentId === id && node.context?.open) ?? [];
  let currentChildren = allChildren;

  while (currentChildren.length) {
    currentChildren =
      nodes.filter((node) =>
        currentChildren?.some(
          (n) => node.parentId === n.id && node.context?.open
        )
      ) ?? [];

    allChildren = allChildren.concat(currentChildren);
  }

  return allChildren;
}
