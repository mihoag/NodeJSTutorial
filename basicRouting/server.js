const express = require('express');
const app = express();
const morgan = require('morgan')
app.use(morgan('combined'));
app.get('/', (req, res) => {
    res.send('Hello world');
});
app.listen('8080');