require('dotenv').config();
const pgp = require('pg-promise')({
    capSQL: true
});
const cn = {
    host: 'localhost',
    port: '5432',
    database: 'person',
    user: 'postgres',
    password: 'leminhhoang',
    max: 30 // use up to 30 connections
};
const db = pgp(cn)
module.exports =
{
    getAll: async (tbName) => {
        let dbcn = null;
        try {
            dbcn = await db.connect();
            const data = await dbcn.any('SELECT * FROM ' + tbName + ' where deleteat is null  order by id ');
            // console.log(data);
            return data;
        } catch (error) {
            throw error;
        }
        finally {
            dbcn.done();
        }
    },
    getAllSort: async (tbName, column, type) => {
        let dbcn = null;
        try {
            dbcn = await db.connect();
            const data = await dbcn.any(`SELECT * FROM  ${tbName}  where deleteat is null order by ${column} ${type}`);
            // console.log(data);
            return data;
        } catch (error) {
            throw error;
        }
        finally {
            dbcn.done();
        }
    }
    ,
    getDelete: async (tbName) => {
        let dbcn = null;
        try {
            dbcn = await db.connect();
            const data = await dbcn.any('SELECT * FROM ' + tbName + ' where deleteat is not null  order by id ');
            // console.log(data);
            return data;
        } catch (error) {
            throw error;
        }
        finally {
            dbcn.done();
        }
    },
    restoreByID: async (tbName, id) => {

        let dbcn = null;
        try {
            dbcn = await db.connect();
            //  console.log(ok);
            // console.log(new Date());
            dbcn.result('update ' + tbName + ' set deleteat = null WHERE id = $1', [id], r => r.rowCount)
                .then(data => {
                    // data = number of rows that were deleted
                    // console.log(data);
                    dbcn.done();
                    return data;
                });
            //console.log(data);
        } catch (error) {
            dbcn.done;
            throw error;
        }
    }
    ,
    // soft delete
    deleteById: async (tbName, id) => {
        //  console.log(tbName)
        // console.log(id)

        let dbcn = null;
        try {
            dbcn = await db.connect();
            //  console.log(ok);
            console.log(new Date());
            dbcn.result('update ' + tbName + ' set deleteat = $1 WHERE id = $2', [new Date(), id], r => r.rowCount)
                .then(data => {
                    // data = number of rows that were deleted
                    // console.log(data);
                    dbcn.done();
                    return data;
                });
            //console.log(data);
        } catch (error) {
            dbcn.done;
            throw error;
        }
    },
}