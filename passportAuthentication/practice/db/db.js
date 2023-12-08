require('dotenv').config();
const pgp = require('pg-promise')({
    capSQL: true
});
const cn = {
    host: 'localhost',
    port: '5432',
    database: 'account',
    user: 'postgres',
    password: 'leminhhoang',
    max: 30 // use up to 30 connections
};
const db = pgp(cn)
console.log(process.env.localhost)

module.exports =
{
    checkExistEmail: async (email) => {
        let dbcn = null;
        try {
            dbcn = await db.connect();
            let data = [];
            data = await dbcn.any('SELECT * FROM useraccount where email = $1', email);
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
    insertAcount: async (entity) => {

        try {
            await db.none('INSERT INTO useraccount (fullname, email, password) values ($1,$2,$3)', [entity.fullname, entity.email, entity.password])
            return 1;
        } catch (error) {
            throw error;
        }
        finally {

        }
    },
    selectAccountByEmail: async (email) => {
        let dbcn = null;
        try {
            dbcn = await db.connect();
            //let data = [];
            data = await dbcn.any('SELECT * FROM useraccount where email = $1', email);
            return data;
        } catch (error) {
            throw error;
        }
        finally {
            dbcn.done();
        }
    }
}
