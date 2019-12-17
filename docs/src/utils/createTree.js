// Add an item node in the tree, at the right position
export function addToTree(node, treeNodes) {
  // Check if the item node should inserted in a subnode
  for (var i = 0; i < treeNodes.length; i++) {
    var treeNode = treeNodes[i];

    // "/store/travel".indexOf( '/store/' )
    if (node.slug.indexOf(treeNode.slug + '/') === 0) {
      addToTree(node, treeNode.children);

      // Item node was added, we can quit
      return;
    }
  }

  // Item node was not added to a subnode, so it's a sibling of these treeNodes
  treeNodes.push({
    title: node.title,
    slug: node.slug,
    children: [],
  });
}

//Create the item tree starting from menuItems
export function createTree(nodes) {
  var tree = [];

  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    addToTree(node, tree);
  }

  return tree;
}
