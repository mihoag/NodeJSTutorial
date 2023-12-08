var express = require('express'); // Load libraries and module
var app = express(); // create instance of express
var port = process.env.port || 1337;
var productController = require('./controller/ProductController')();

var bodyParser = require('body-parser');
/*app.get("/product", function (request, response) {
    response.json({ "Message": "Welcome to Node js" });
});



/*app.get('/', function (req, res) {
    console.log("ok");
    con.connect(function (err) {
        if (err) {
            console.log(err);
        }
        var sqlQuery = "select * from product";
        con.query(sqlQuery, function (err, result, fields) {
            console.log(result);
            res.send(result);
        });
    })
})
*/// create application/x-www-form-urlencoded parser
var bodyParser = require('body-parser');
// create application/x-www-form-urlencoded parser  
app.use(bodyParser.urlencoded({ extended: true }));
// create application/json parser  
app.use(bodyParser.json());

app.use("/api/products", productController);
app.listen(port, function () { // callback function
    var datetime = new Date();
    var message = "server running on port : " + port + " Start : " + datetime;
    console.log(message);
});

/*
 Note: - What is Callback?
A callback is a function called at the completion of a given task; this prevents any blocking and allows other code to be run in the meantime.
*/

