const con = require('./database');
const express = require('express');
const app = express();
const expressHandleBar = require('express-handlebars')
const path = require('path')
const upload = require('./multer');

app.engine('handlebars', expressHandleBar.engine({
    helpers:
    {

    }
}))
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'resources/views'));

app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/', (req, res) => {
    con.query('select * from documents', (err, result) => {
        if (err) throw err;
        // console.log(result)
        let documents = [];
        for (let i = 0; i < result.length; i++) {
            // console.log(result[i]);
            // images.push({ id: result[i].id, name: result[i].name, url: result[i].url, type: result[i].type, public_id: result[i].public_id })
            documents.push({ id: result[i].id, name: result[i].name, size: result[i].size, upload_time: result[0].upload_time });
        }
        //console.log(documents)
        res.render('home', { documents: documents });
    })
})

app.get('/download/:id', (req, res) => {

    con.query('select * from documents where id =?', [req.params.id], (err, result) => {
        if (err) throw err;

        let filename = result[0].name;
        let content = result[0].content;

        res.setHeader('Content-disposition', `attachment; filename=${filename}`); // Set the filename
        res.setHeader('Content-type', 'application/octet-stream'); // Set the appropriate content type
        res.send(content);
    })
}
)

app.post('/uploadFile', upload.single('myFile'), uploadFile)

function uploadFile(req, res, next) {
    //onsole.log(req.file);
    let { originalname, mimetype, size, buffer } = req.file;
    const data = {
        name: originalname,
        upload_time: new Date(),
        size: size,
        content: buffer
    }

    con.query('insert into documents set ? ', data, (err, result) => {
        if (err) throw err;
        // console.log(result)
        res.redirect('/');
    })
}

app.listen(5000);


