module.exports = {
    authorization: async function (req, res, next) {
        //console.log(req.originalUrl);
        let originalUrl = req.originalUrl;
        if (originalUrl == "/" || originalUrl == "/login" || originalUrl == "/logout") {
            //console.log("pk");
            //next();
            return next();
        }
        if (!req.session.isLogined) {
            res.redirect('/login');
            return;
        }

        let role = req.session.role;
        if (originalUrl.startsWith(`/${role}`)) {
            next();
        }
        else {
            res.redirect('/error');
        }
    }
}