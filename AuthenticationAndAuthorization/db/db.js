require('dotenv').config();
const pgp = require('pg-promise')({
    capSQL: true
});
const cn = {
    host: process.env.host || 'localhost',
    port: process.env.port,
    database: process.env.database,
    user: process.env.user,
    password: process.env.password,
    max: 30 // use up to 30 connections
};
const db = pgp(cn)

module.exports = {
    checkExistUser: async (username) => {
        let dbcn = null;
        try {
            dbcn = await db.connect();
            let data = [];
            data = await dbcn.any('SELECT * FROM account where username = $1', username);
            console.log(data);
            //return data;
            if (data.length != 0) {
                return true;
            }
            else {
                return false;
            }
        } catch (error) {
            throw error;
        }
        finally {
            dbcn.done();
        }
    },
    selectAccountByUsername: async (username) => {
        let dbcn = null;
        try {
            dbcn = await db.connect();
            //let data = [];
            data = await dbcn.any('SELECT * FROM account where username = $1', username);
            return data;
        } catch (error) {
            throw error;
        }
        finally {
            dbcn.done();
        }
    }
}