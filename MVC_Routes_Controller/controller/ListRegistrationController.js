class ListRegistrationController {
    index(req, res) {
        res.render('listRegistration');
    }
}
module.exports = new ListRegistrationController();