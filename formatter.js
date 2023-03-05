class TreeNode {
  constructor(id, label, children, parent) {
    this.id = id
    this.label = label
    this.children = children
    this.parent = parent
  }
}

let rootNode;
let last_added_child_id;

function initTree() {
  rootNode = new TreeNode("1", "root", [], null)

  let antNode = new TreeNode("2", "ant", [], rootNode)
  let bearNode = new TreeNode("3", "bear", [], rootNode)
  let frogNode = new TreeNode("7", "frog", [], rootNode)

  let catNode = new TreeNode("4", "cat", [], bearNode)
  let dogNode = new TreeNode("5", "dog", [], bearNode)

  let elephantNode = new TreeNode("6", "elephant", [], dogNode)

  rootNode.children = [antNode, bearNode, frogNode]
  bearNode.children = [catNode, dogNode]
  dogNode.children = [elephantNode]

  last_added_child_id = "7"
  return rootNode
}

function deserializeTree(root) {
  return {
    [root.id]: {
      "label": root.label,
      "children": root.children.length > 0 ? root.children.map((item) => deserializeTree(item)) : []
    }
  }
}




function addNode(parentId, childLabel, root) {
  if(root == null) {
    return false
  }
  if(root.id == parentId) {
    let childId = parseInt(last_added_child_id) + 1
    last_added_child_id = `${childId}`
    root.children.push(new TreeNode(last_added_child_id, childLabel, [], root))
    return true
  }
  else {
    for(let c of root.children) {
      let res = addNode(parentId, childLabel, c)
      if (res == true) {
        return true
      }
    }
  }
  return false
}

module.exports = {
  initTree,
  deserializeTree,
  addNode
}