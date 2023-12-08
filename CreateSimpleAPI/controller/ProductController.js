var express = require('express');
var router = express.Router();
var conn = require('../connection/connec')();



var routes = function () {
    router.route('/')
        .get(function (req, res) {
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                }
                var sqlQuery = "select * from product";
                conn.query(sqlQuery, function (err, result, fields) {
                    console.log(result);
                    res.json(result);
                });
            });

        })


        .post(function (req, res) {
            console.log(req.body);
            console.log(JSON.stringify(req.body));
            var obj = JSON.parse(JSON.stringify(req.body));
            conn.query("insert into product(name,price) values(?,?) ", [obj.name, obj.price], function (err, result, fields) {
                if (err) {
                    console.log(err);
                }
            });

        });


    return router;
};

module.exports = routes;