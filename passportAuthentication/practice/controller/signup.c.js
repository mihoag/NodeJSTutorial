const db = require('../db/db')
const user = require('../model/user');
const Bcrypt = require('bcryptjs')
class registerController {
    showRegisterPage(req, res) {
        res.render('signup');
    }

    async validateRegister(req, res, next) {
        let errors = [];
        console.log(req.body);
        const { name, email, password, password2 } = req.body;
        if (password != password2) {
            errors.push({ msg: 'Passwords do not match' });
        }

        if (errors.length > 0) {
            res.render('signup', {
                errors,
                name,
                email,
                password,
                password2
            });
        }
        else {
            let checkEmail = await db.checkExistEmail(email);
            if (checkEmail) {
                errors.push({ msg: 'Email already' });
                res.render('signup', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }
            else {
                //let success = 
                let u = new user(email, name, password);
                Bcrypt.genSalt(10, async (err, salt) => {
                    Bcrypt.hash(u.password, salt, async (err, hash) => {
                        if (err) throw err;
                        u.password = hash;
                        //  console.log(u.password);
                        let check = await db.insertAcount(u);
                        if (check > 0) {
                            let success = [];
                            success.push({ msg: 'Register success! Please login to enter dashboard' });
                            res.render('login', { success });
                        }
                    });
                });
            }
        }

    }
}
module.exports = new registerController;