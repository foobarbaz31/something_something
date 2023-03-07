const data = [
  {
    id: 1, path: '1',
  },
  {
    id: 2, path: '2.1',
  },
  { // child of 1
    id: 3, path: '3.1',
  },
  { // child of 1
    id: 4, path: '4.3.1', // child of 3
  },
  {
    id: 6, path: '6.3.1', // child of 3
  },
  {
    id: 5, path: '5.4.3.1', // child of 4
  }
]

class TreeNode {
  constructor(id, children) {
    this.id = id
    this.children = children
  }
}

function serializeTreeFromDb(entire_tree) {
  const data = entire_tree
  let root = undefined
  let nodesArray = []
  let level = 1
  for(let node of data) {
    let currentNode = new TreeNode(node.id, [])
    if (root == undefined || node.path.split('.').length < 2) {
      root = currentNode
      nodesArray[level] = currentNode
    } else {
      let currentNodesAncestorPath = node.path.split('.')
      let parentLevel = currentNodesAncestorPath[1]
      // update the parent's children arry
      nodesArray[parseInt(parentLevel)].children.push(currentNode)
      // add current node to the array
      nodesArray[++level] = currentNode
    }
  }  
  return root
}

serializeTreeFromDb(data)
