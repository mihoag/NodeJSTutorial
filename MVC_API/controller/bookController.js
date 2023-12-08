const con = require('../DB/connection');

class bookController {
    getAll(req, res) {



        var query = "select * from employee";
        con.query(query, function (err, result, fields) {
            console.log(result);
            res.status(200).json({
                books: result
            })
        });


        //con.close();
    }

    addBook(req, res) {

        // const { id_emp, age, name, id_part } = req.body
        var query = "insert into employee set ?"
        //console.log(req.body);
        con.query(
            query,
            req.body,
            async (error, result) => {
                if (error) return res.status(400).json({ message: "Server Error" });

                return res.status(200).json({
                    message: "Thêm khách hàng thành công",
                });
            })

    }


    updateBook(req, res) {
        let id = req.params.id;
        var query = "update employee set ? where id_emp = ?";
        con.query(query, [req.body, id], async (error, result) => {
            if (error) return res.status(400).json({ message: "Server Error" });

            return res.status(200).json({ "message": "update thanh cong" });
        })
    }

    deleteBook(req, res) {
        let id = req.params.id;
        var query = "delete from employee where id_emp = ?";
        con.query(query, id, async (error, result) => {
            if (error) return res.status(400).json({ message: "Server Error" });

            return res.status(200).json({ "message": "xoa thanh cong" });
        })
    }

    getByID(req, res) {
        let id = req.params.id;
        var query = "select *  from employee where id_emp = ?";
        con.query(query, id, async (error, result) => {
            if (error) return res.status(400).json({ message: "Server Error" });

            return res.status(200).json(result[0]);
        })
    }
}



module.exports = new bookController();