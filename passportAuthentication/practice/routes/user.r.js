const express = require('express');
const router = express.Router();
const loginController = require('../controller/login.c')
const registerController = require('../controller/signup.c');
const auth = require('../MiddleWareFunction/auth')


router.get('/login', auth.forwardAuthenticated, loginController.showLoginPage)
router.get('/register', auth.forwardAuthenticated, registerController.showRegisterPage)
router.post('/register', registerController.validateRegister);
router.post('/login', loginController.validateLogin);
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/user/login');
})
module.exports = router;