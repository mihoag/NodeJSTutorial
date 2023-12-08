module.exports = {
    forwardAuthenticated: function (req, res, next) {
        if (!req.session.isAuthenticated) {
            return next();
        }
        res.redirect('/dashboard');
    }
}