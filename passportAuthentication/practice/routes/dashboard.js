const express = require('express');
const router = express.Router();
const dashboardController = require('../controller/dashboard')
const auth = require('../MiddleWareFunction/auth')



router.get('/', auth.forwardAuthenticated, dashboardController.index);
module.exports = router;