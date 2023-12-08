const express = require('express')
const route = express.Router()
const registrationController = require('../controller/RegistrationController')

route.use('/', registrationController.index);

module.exports = route