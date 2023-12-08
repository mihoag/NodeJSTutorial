var mysql = require('mysql');

var connect = function () {

    var con = mysql.createConnection({
        host: 'Localhost',
        user: 'root',
        password: 'leminhhoang',
        database: 'account'
    });
    return con;
}
module.exports = connect();