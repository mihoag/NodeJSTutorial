const con = require('./database');
const express = require('express');
const app = express();
const expressHandleBar = require('express-handlebars')
const path = require('path')
const upload = require('./multer');
const excelJS = require('exceljs');

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

app.get('/exportExcel', (req, res) => {
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
        //res.render('home', { documents: documents });

        /// Export to EXCEL
        const workbook = new excelJS.Workbook();  // create a new workbook
        const worksheet = workbook.addWorksheet('document'); // create a new worksheet
        worksheet.columns = [
            { header: "ID", key: "id", width: 10 },
            { header: "Name", key: "name", width: 10 },
            { header: "Size", key: "size", width: 10 },
            { header: "UploadTime", key: "upload_time", width: 10 }
        ];
        worksheet.addRows(documents);
        // Making first line in excel bold
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
        });


        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=exported_data.xlsx');

        // Pipe the Excel workbook to the response
        workbook.xlsx.write(res)
            .then(() => {
                res.end();
            })
            .catch((error) => {
                console.error('Error exporting Excel:', error);
                res.status(500).send('Internal Server Error');
            });
    })
})

app.listen(5001);


