# Database Structure

One common way to persist a tree type datastructure is to use a materialized path pattern. This pattern can be implemented both in a relational database as well as non-relational database.

## Approach 1: Relational Database

If this information were to be persisted in an RDBMS, then we would have the following tables

1. Nodes: To maintain the metadata about each node such as id and label

``` table: NODES
+-------+--------------+------+-----+---------+----------------+
| Field | Type         | Null | Key | Default | Extra          |
+-------+--------------+------+-----+---------+----------------+
| ID    | int          | NO   | PRI | NULL    | auto_increment |
| LABEL | varchar(100) | NO   |     | NULL    |                |
+-------+--------------+------+-----+---------+----------------+
```

2. Relationships: To maintain the materialized paths for each node. 
The node_id column in this table maps to the id of the node in the NODES table

```table: RELATIONSHIPS
+---------+--------------+------+-----+---------+----------------+
| Field   | Type         | Null | Key | Default | Extra          |
+---------+--------------+------+-----+---------+----------------+
| ID      | int          | NO   | PRI | NULL    | auto_increment |
| NODE_ID | int          | NO   | MUL | NULL    |                |
| PATH    | varchar(255) | NO   |     | NULL    |                |
| IS_ROOT | tinyint(1)   | YES  |     | NULL    |                |
+---------+--------------+------+-----+---------+----------------+
```

For the example provided in the problem statement, the populated tables will look as below

1. NODES
```
+----+----------+
| ID | LABEL    |
+----+----------+
|  1 | root     |
|  2 | ant      |
|  3 | bear     |
|  4 | cat      |
|  5 | dog      |
|  6 | elephant |
|  7 | frog     |
+----+----------+
```

2. RELATIONSHIPS
```
+----+---------+---------+---------+
| ID | NODE_ID | PATH    | IS_ROOT |
+----+---------+---------+---------+
|  1 |       1 | 1       |       1 |
|  2 |       2 | 2.1     |       0 |
|  3 |       3 | 3.1     |       0 |
|  4 |       4 | 4.3.1   |       0 |
|  5 |       5 | 5.3.1   |       0 |
|  6 |       6 | 6.5.3.1 |       0 |
|  7 |       7 | 7.1     |       0 |
+----+---------+---------+---------+
```

Thus we save the path from the current node all the way to the root node

### Query Patterns

1. Adding a new node to a parent (i.e POST /api/tree endpoint)

When the add endpoint is called, following steps will be run

1.1 Fetch the path of the req.body.parent node using
```
SELECT path from RELATIONSHIPS where NODE_ID = ${parent_id}
```
If this returns no data, we can throw an error as this implies an invalid parent id was provided

1.2 Create a new node using the following 
```
INSERT INTO NODES(LABEL) VALUES($req.body.label)
```

1.3 Add this new node to the relationships table using the following snippet
```
$path_of_new_node = $new_node_id_from_1.2" + "." + $parent_path_from_1.1
```

```
INSERT INTO RELATIONSHIPS(NODE_ID, PATH) VALUES($new_node_id_from_1.2, $path_of_new_node)
```

2. Fetching the entire tree (i.e GET /api/tree endpoint)

In order to fetch the entire tree, we first determine the root node id using the following query
```
$root_node_id = SELECT NODE_ID FROM RELATIONSHIPS WHERE IS_ROOT = 1
```

Now fetch the entire tree data using the following query
```
$entire_tree_data = SELECT * FROM RELATIONSHIPS WHERE PATH LIKE '%$root_node_id%';
```

Finally we need to do some in-memory processing to serialize the data model into TreeNode class and establish appropriate children attributes on the node. That can be achieved using the following function:
```
function serializeTreeFromDb(entire_tree_data) {
  let root = entire_tree_data
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
  return root; // returns the root node of the tree created in-memory
}
```

## Approach 2 : Non-relational database

Assuming that the node metadata is going to be light, and we don't want to create complex aggregation queries, a single MongoDB table might suffice for this purpose. 

Adding a node and retrieving the tree can follow similar methods as approach 1.
