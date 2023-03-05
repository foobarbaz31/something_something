const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
// create application/json parser
const jsonParser = bodyParser.json()
 


const {initTree, deserializeTree, addNode} = require('./formatter')


let tree = initTree()


app.get('/api/tree/', (req, res) => {
  res.json([deserializeTree(tree)])
})

app.post('/api/tree/', jsonParser, (req, res) => {
  const { parent, label } = req.body
  const isTreeUpdated = addNode(parent, label, tree)
  if(!isTreeUpdated) {
    res.send(400) // implies parent was not found
  } 
  res.send(200)
})

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})