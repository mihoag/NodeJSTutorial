class ConfirmationController {
    index(req, res) {
        res.render('confirmation');
    }
}

module.exports = new ConfirmationController;