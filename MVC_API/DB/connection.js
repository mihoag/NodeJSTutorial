const mysql = require('mysql')
function connection() {
    var con = mysql.createConnection({
        host: 'Localhost',
        user: 'root',
        password: 'leminhhoang',
        database: 'employee'
    });
    return con;
}

module.exports = connection();