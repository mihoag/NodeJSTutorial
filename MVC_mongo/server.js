const express = require('express');
const app = express();
const db = require('./db/connection')
const routes = require('./routes')
db.connect();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

routes(app);
app.listen(8080);
