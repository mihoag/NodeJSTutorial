// npm i express-handlebars
// npm i node-sass
require('dotenv').config();

const exhdbs = require('express-handlebars')
const express = require('express')
const app = express();
const path = require('path')
const db = require('./db/db');
const session = require('express-session');
const methodOverride = require('method-override');
const SortMiddleWare = require('../MiddlewareFunction/SortMiddleWare')

// Dung methodOverride để thực hiện overide lại phương thức trong form
// phần action trong form cần cung cấp action dạng ".../.../...?_method='PUT/DELETE/POST/GET,....'"
// trong route, ta có thể gọi app.get, app.post, app.put, app.delete

app.use(methodOverride('_method'))
// Custom middleware
app.use(SortMiddleWare);


// Template engine
app.engine('handlebars', exhdbs.engine(
    {
        helpers: {
            sum: (a, b) => a + b,
            sortable: (field, sort) => {
                let sortType = field === sort.column ? sort.type : 'default';
                const icons = {
                    default: '<i class="fa-solid fa-sort">',
                    asc: '<i class="fa-solid fa-sort-up"></i>',
                    desc: '<i class="fa-solid fa-sort-down"></i>'
                }
                const types = {
                    default: 'desc',
                    asc: 'desc',
                    desc: 'asc'
                }

                const icon = icons[sortType];
                const type = types[sort.type];
                // console.log(sort.type);
                return `<a href="?_sort&type=${type}&column=${field}">${icon}</a>`;
            },
            compare: (id1, id2) => {
                if (id2 === undefined) {
                    return "selected";
                }
                else {
                    return id1 === id2 ? "selected" : "";
                }
            }
        },


    }
))
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'resources/views'));

app.use(express.urlencoded({ extended: true }))
app.use(express.json())


///
//console.log(path.join(__dirname, 'resources/public'))
app.use(express.static(path.join(__dirname, 'public')))
// Khi đã set thư mục public rồi, khi muốn gọi css hay img chỉ cần nhậpd dường dẫn : /css/style.css hoặc /img/anh.jpg
// khi muoons su dung handlebar
/* 
- set thu muc co dang cau truc
- layouts : phan cau truc chinh cua web, moi component se duoc thay vao cau truc nay
- partials la phan khoi tao. Thuong la nhung component static nhu header, footer
- nhung component co de de ben ngoai, hoac set trong thu muc chi dinh

*/


// use session
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'thisissecret',
    cookie: { maxAge: 600000000 }
}));

// session co the dung de luu 1 so thuoc tinh, de truy xuat mot so thong tin de xem co the dung hay khong


app.get('/', async (req, res) => {

    let sess = req.session;
    if (!sess.isLogin) {
        res.redirect('/login')
    }
    else {
        // console.log
        if (req.query.hasOwnProperty('_sort')) {
            let data = await db.getAllSort("detailPerson", req.query.column, req.query.type);
            let city = { id: 1000, name: 'Khanh Hoa' };
            res.render('home', { persons: data, city: city });
        }
        else {
            let data = await db.getAll("detailPerson");
            // console.log(data);
            // console.log(data);
            let city = { id: 1000, name: 'Khanh Hoa' };
            res.render('home', { persons: data, city: city });
        }
    }
})



app.get('/login', async (req, res) => {
    res.render('login');
})


app.get('/logout', async (req, res) => {
    req.session.destroy();    // Huy mot sesstion
    res.redirect('/login');
})
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(username)
    console.log(password);

    if (username == "admin" && password == "123456") {
        // tao session
        let sess = req.session;
        sess.isLogin = true;
        sess.username = username;

        if (sess.back) {
            res.redirect(sess.back)
        }
        else {
            res.redirect('/')
        }
    }
    else {
        // quay ve lai trang login
        // 
        res.redirect('/login');
    }

})

app.delete('/delete/:id', async (req, res) => {
    let id = req.params.id;
    //  console.log(id);

    let data = await db.deleteById("detailperson", id);
    //console.log("ok");
    console.log(data);
    if (parseInt(data) > 0) {
        res.redirect('back');
    }
    res.redirect('back');
})

app.get('/restore/:id', async (req, res) => {
    let id = req.params.id;
    let data = db.restoreByID("detailperson", id);
    res.redirect('/recycle');
})




app.get('/recycle', async (req, res) => {
    let data = await db.getDelete("detailperson");
    res.render('deletePage', { persons: data });

})



app.post('/ActionManyItems',
    async (req, res) => {
        console.log(req.body);

        let formSelect = req.body.formSelect;
        let action = req.body.action;
        switch (formSelect) {
            case "delete":
                {
                    for (let i = 0; i < action.length; i++) {
                        await db.deleteById("detailperson", action[i]);
                    }
                    break;
                }
        }
        res.redirect('back');
    })

app.get('/middleware', function (req, res, next) { }

)

// Ứng dụng của middleware
/*
- Chức năng xác thực (authentication)
- chức năng phân quyền (authorization)
- Để chia sẻ các giá trị biến dùng chung giữa các view
*/
console.log(process.env.PORT_SERVER)
app.listen(3000);
