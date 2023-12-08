const express = require('express');
const app = express();
const expressHandleBar = require('express-handlebars')
const path = require('path')
const upload = require('./multer');
const con = require('./database');
const excelJS = require('exceljs');
app.engine('handlebars', expressHandleBar.engine({
}))
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'resources/views'));

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
///
//console.log(path.join(__dirname, 'resources/public'))
app.get('/', (req, res) => {
    res.render('home');
})

app.post('/uploadFile', (req, res) => {
    upload.single('myFile')(req, res, err => {
        if (err) throw err;
        // const file = req.file;
        //console.log(imageFile);
        //const { originalname, mimetype, buffer } = imageFile;
        const workbook = new excelJS.Workbook();
        workbook.xlsx.readFile(req.file.path).then(function (workbook) {
            const worksheet = workbook.getWorksheet(1);
            worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
                // Create a new document based on your Mongoose model
                // data duoc lay tu hang thu hai, hang dau tien la header

                // console.log(row.getCell(1).value + " " + row.getCell(2).value);
                const data = {
                    name: row.getCell(1).value,
                    addr: row.getCell(2).value
                }

                con.query("insert into account set  ? ", data, (err, result) => {
                    if (err) throw err;
                    // console.log(result);
                    // res.redirect('/');
                })
                console.log(data);

            })
        })
    });
})

app.use(express.static(path.join(__dirname, 'public')))
app.listen(3001);