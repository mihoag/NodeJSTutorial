const express = require('express');
const app = express();
const expressHandleBar = require('express-handlebars')
const path = require('path')
const upload = require('./multer');
const cloudinary = require('./Utils/cloudinary')

const con = require('./database');
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
    con.query('select * from images', (err, result) => {
        if (err) throw err;
        // console.log(result.length);
        let images = [];
        for (let i = 0; i < result.length; i++) {
            // console.log(result[i]);
            images.push({ id: result[i].id, name: result[i].name, url: result[i].url, type: result[i].type, public_id: result[i].public_id })
        }
        console.log(images)
        res.render('home', {
            images: images
        });
    })


})

app.post('/upload', uploadImage)
app.get('/delete/:id', async (req, res) => {
    let id = req.params.id;
    if (id) {
        await cloudinary.uploader.destroy(id);
        con.query('delete from images where public_id =?', id, (err, result) => {
            if (err) throw err;
            // console.log(result);
            res.redirect('/');
        })
    }
})


app.post('/uploadFile', (req, res) => {
    upload.single('myImage')(req, res, err => {
        if (err) throw err;
        const imageFile = req.file;
        console.log(imageFile);
        const { originalname, mimetype, buffer } = imageFile;

        // console.log(originalname);
        //console.log(mimetype);
        //console.log(buffer);

        cloudinary.uploader.upload(req.file.path, function (err, result) {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    msg: "Error"
                })
            }

            console.log(result);

        })
    })

})


//console.log(con);

function uploadImage(req, res, next) {

    upload.single('myImage')(req, res, err => {
        if (err) throw err;
        const imageFile = req.file;
        console.log(imageFile);
        const { originalname, mimetype, buffer } = imageFile;

        console.log(originalname);
        //console.log(mimetype);
        //console.log(buffer);

        cloudinary.uploader.upload(req.file.path, function (err, result) {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    msg: "Error"
                })
            }

            //console.log(result);
            const { public_id, secure_url } = result;

            const data = {
                name: originalname,
                url: secure_url,
                type: mimetype,
                public_id: public_id
            }

            con.query('INSERT INTO images set ? ', data, (err, result) => {
                if (err) throw err;
                //console.log(result);
                res.redirect('/');
            })


        })
    })
}



app.listen(5001);


