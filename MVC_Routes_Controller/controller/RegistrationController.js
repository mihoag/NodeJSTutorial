/*const express = require('express')
const route = express.Router()

route.use('/',)
*/

class RegistrationController {
    index(req, res) {
        res.render('registration')
    }
}
module.exports = new RegistrationController();