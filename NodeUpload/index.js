const express = require('express');
const app = express();
const expressHandleBar = require('express-handlebars')
const path = require('path')
const multer = require('multer');
app.engine('handlebars', expressHandleBar.engine({
    helpers:
    {
        showImage: (file) => {
            console.log("ok");
            console.log(file);
            if (typeof file === 'undefined') {
                return '';
            }
            return file;
        }
    }

}))
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'resources/views'));

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
///
//console.log(path.join(__dirname, 'resources/public'))

app.use(express.static(path.join(__dirname, 'public')))
app.get('/', (req, res) => {
    res.render('home');
})

// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/upload/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myImage');

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif|txt/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('home', {
                msg: err
            });
        } else {
            if (req.file == undefined) {
                res.render('home', {
                    msg: 'Error: No File Selected!'
                });
            } else {
                console.log(req.file.buffer);
                res.render('home', {
                    msg: 'File Uploaded!',
                    file: `upload/${req.file.filename}`
                });
            }
        }
    });
});



app.listen(3001);


