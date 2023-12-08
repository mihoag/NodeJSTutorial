const express = require('express');
const route = express.Router();
const homeController = require('../controller/HomeController')

route.use('/', homeController.index)

module.exports = route

