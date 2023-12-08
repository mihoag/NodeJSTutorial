const student = require('../model/student')
const mongoose = require('mongoose')
class StudentController {
    getAll(req, res) {
        student.find({})
            .then(data => {
                res.json(data)
            })
            .catch(err => {
                console.log(err);
            })
    }

    insertStudent(req, res) {
        console.log(req.body)
        const std = new student({
            id: req.body.id,
            name: req.body.name
        });

        return std.save().then(
            (newStudent) => {
                return res.status(201).json({
                    success: true,
                    message: 'New student created successfully',
                    student: newStudent,
                });
            }
        )
            .catch((error) => {
                console.log(error);
                res.status(500).json({
                    success: false,
                    message: 'Server error. Please try again.',
                    error: error.message,
                });
            })
    }

    getStudentByID(req, res) {

        let data = student.findOne({ id: req.params.id })

        //console.log(data);
        /*student.find({})
            .then(data => {

                // student.deleteOne({id : req.params.id})
                for (let i = 0; i < data.length; i++) {
                    if (data[i].id == req.params.id) {
                        res.status(200).json({
                            success: true,
                            student: data[i]
                        });
                        //flag = false;
                        return
                    }
                }

                res.status(500).json({
                    success: false,
                    message: 'This student does not exist',
                });

            })
            .catch(err => {
                console.log(err);
            })*/
    }

}

module.exports = new StudentController;