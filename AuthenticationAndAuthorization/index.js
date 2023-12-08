require('dotenv').config();
const express = require('express')
const app = express()
const expressHandleBar = require('express-handlebars')
const path = require('path')
const session = require('express-session')
const auth = require('./MiddlewareFunction/authorization')
const db = require('./db/db')

app.engine('handlebars', expressHandleBar.engine({}))
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'resources/views'));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'thisissecret',
    cookie: { maxAge: 600000000 }
}));

app.get('/', auth.authorization, (req, res) => {
    res.render('home')
})

app.get('/login', auth.authorization, (req, res) => {
    res.render('login')
})
app.get('/user', auth.authorization, (req, res) => {
    res.render('userSide');
})
app.get('/admin', auth.authorization, (req, res) => {
    res.render('adminSide');
})

app.post('/login', auth.authorization, async (req, res) => {
    const { username, password } = req.body;
    let data = await db.selectAccountByUsername(username);
    // console.log(data);
    if (data.length == 0) {
        res.redirect('/login');
    }
    else {
        if (password != data[0].password) {
            res.redirect('/login');
        }
        else {
            req.session.isLogined = true;
            req.session.role = data[0].role;
            res.redirect(`/${data[0].role}`);
        }
    }
})
app.get('/error', (req, res) => res.render('error'))
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
})
app.listen(process.env.PORT_SERVER)