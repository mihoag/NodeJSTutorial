const express = require('express')
const router = express.Router();
const homeController = require('../controller/home.c')

router.get('/', homeController.index);
module.exports = router