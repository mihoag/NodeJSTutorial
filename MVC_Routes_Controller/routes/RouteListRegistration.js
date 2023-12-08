const listRegistrationController = require('../controller/ListRegistrationController')
const express = require('express')
const route = express.Router();
route.use('/', listRegistrationController.index)

module.exports = route