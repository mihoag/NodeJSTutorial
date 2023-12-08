class dashboardController {
    index(req, res) {
        let email = req.session.email;
        res.render('dashboard', { email });
    }
}
module.exports = new dashboardController();