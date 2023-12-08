const express = require('express');
const route = express.Router();
const confirmController = require('../controller/ConfirmationController')

route.use('/', confirmController)

module.exports = route
