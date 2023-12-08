const express = require('express')
const app = express();
const expressHandleBar = require('express-handlebars')
const path = require('path')
const { stringify } = require('querystring');

app.engine('handlebars', expressHandleBar.engine({}))
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.get('/', (req, res) => {
    res.render('home');
})

app.post('/subscribe', async (req, res) => {
    console.log("ok");
    if (!req.body.captcha)
        return res.json({ success: false, msg: 'Please select captcha' });

    // Secret key
    const secretKey = '6Lf7nxQpAAAAAC-Xis2ngj5G1KzZEwp-ij29Yn-K';

    // Verify URL
    const query = stringify({
        secret: secretKey,
        response: req.body.captcha,
        remoteip: req.connection.remoteAddress
    });
    const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;

    // Make a request to verifyURL
    const body = await fetch(verifyURL).then(res => res.json());

    console.log(body);

    // If not successful
    if (body.success !== undefined && !body.success)
        return res.json({ success: false, msg: 'Failed captcha verification' });

    // If successful
    return res.json({ success: true, msg: 'Captcha passed' });
});

app.listen(3002)