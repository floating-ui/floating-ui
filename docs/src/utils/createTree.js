// Add an item node in the tree, at the right position
export function addToTree(node, treeNodes) {
  // Check if the item node should inserted in a subnode
  for (var i = 0; i < treeNodes.length; i++) {
    var treeNode = treeNodes[i];

    // "/store/travel".indexOf( '/store/' )
    if (node.slug.startsWith(treeNode.slug)) {
      addToTree(node, treeNode.children);

      // Item node was added, we can quit
      return;
    }
  }

  // Item node was not added to a subnode, so it's a sibling of these treeNodes
  treeNodes.push({
    navigationLabel: node.navigationLabel,
    slug: node.slug,
    order: node.order,
    children: [],
  });
  treeNodes = treeNodes.sort((a, b) => a.order - b.order);
}

//Create the item tree starting from menuItems
export function createTree(nodes) {
  nodes = nodes
    .sort((a, b) => a.slug.split('/').length - b.slug.split('/').length)
    .filter(route => route.navigationLabel != null);

  var tree = [];

  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    addToTree(node, tree);
  }

  tree.sort((a, b) => b.order - a.order);

  return tree;
}
