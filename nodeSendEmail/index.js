const express = require('express');
const app = express();
const expressHandleBar = require('express-handlebars')
const path = require('path')
const nodemailer = require('nodemailer')
app.engine('handlebars', expressHandleBar.engine({
    helpers:
    {
    }

}))
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
///
//console.log(path.join(__dirname, 'resources/public'))

app.use(express.static(path.join(__dirname, 'public')))
app.get('/', (req, res) => {
    res.render('home');
})

app.post('/send', function (req, res) {
    const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        // host: 'mail.YOURDOMAIN.com',
        service: 'gmail',
        auth: {
            user: 'leminhhoang123456le@gmail.com',
            pass: 'ookjlchwjyswrjgq' // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: 'leminhhoang123456le@gmail.com', // sender address
        to: req.body.email, // list of receivers
        subject: 'Node Contact Request', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('home', { msg: 'Email has been sent' });
    });

})


app.listen(3001);
