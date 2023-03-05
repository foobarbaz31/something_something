# Install dependencies
Assumes that nodejs is already installed. 
To install deps required for this app, run
```
yarn install
```

# Start the server
```
PORT=3000 node app.js
```

# Test GET endpoint
```
curl --location --request GET 'localhost:3000/api/tree'
```

# Test POST endpoint
```
curl --location --request POST 'localhost:3000/api/tree' \
--header 'Content-Type: application/json' \
--data-raw '{
    "parent": "7",
    "label": "horse"
}'
```
As long as the app is running any changes made via POST will always persist in the in-memory tree object
You can verify that by running a GET after POST