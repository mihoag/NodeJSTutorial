require('dotenv').config();
const express = require('express')
const app = express()
const expressHandleBar = require('express-handlebars')
const path = require('path')
const session = require('express-session')
app.engine('handlebars', expressHandleBar.engine({
    helpers:
    {
        showError: (errors) => {
            let data = '';
            if (typeof errors !== 'undefined') {
                for (let i = 0; i < errors.length; i++) {
                    data += `<div class="alert alert-danger" role="alert">
                ${errors[i].msg}
                </div>`
                }
            }
            return data;
        },
        formatValue: (value) => {
            if (typeof value === undefined) {
                return '';
            }
            return value;
        },
        showSuccess: (success) => {
            let data = '';
            if (typeof success !== 'undefined') {
                for (let i = 0; i < success.length; i++) {
                    data += `<div class="alert alert-success" role="alert">
                      ${success[i].msg}
                </div>`
                }
            }
            //console.log(data);
            return data;
        }
    },

}))
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'resources/views'));

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
///
//console.log(path.join(__dirname, 'resources/public'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'thisissecret',
    cookie: { maxAge: 600000000 }
}));


const idx = require('./routes/index.r')
const user = require('./routes/user.r');
const dashboard = require('./routes/dashboard');


app.use('/', idx)
app.use('/user', user)
app.use('/dashboard', dashboard)

app.listen(process.env.PORT_SERVER);


