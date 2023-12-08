const bcrypt = require('bcryptjs');
const db = require('../db/db')
class loginController {
    showLoginPage(req, res) {
        res.render('login');
    }

    async validateLogin(req, res) {
        const { email, password } = req.body;
        let data = []
        data = await db.selectAccountByEmail(email);
        let errors = [];
        //console.log(data);
        // Neu khong co email hop le, thi data la mot mang rong
        if (data.length == 0) {

            errors.push({ msg: 'Email not found' });
            res.render('login', { errors, email, password });
        }
        else {

            // let sess = req.session;
            //sess.email = email;
            bcrypt.compare(password, data[0].password, (err, isMatch) => {
                if (err) throw err;
                if (!isMatch) {
                    errors.push({ msg: 'Password is incorrect' });
                    res.render('login', { errors, email, password });
                } else {
                    //return done(null, false, { message: 'Password incorrect' });
                    // 
                    let sess = req.session;
                    sess.isAuthenticated = true;
                    sess.email = email;
                    res.render('dashboard', { email });
                }
            });
        }
    }
}

module.exports = new loginController;