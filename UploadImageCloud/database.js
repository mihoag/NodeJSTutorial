var mysql = require('mysql');

var connect = function () {

    var con = mysql.createConnection({
        host: 'Localhost',
        user: 'root',
        password: 'leminhhoang',
        database: 'images'
    });
    return con;
}
module.exports = connect();