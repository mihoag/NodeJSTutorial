const express = require('express');
const app = express();



const route = require('./routes');
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
//console.log(route)
route(app);
app.listen(8081)