const express = require('express')
const route = express.Router();
const studentController = require('../controller/StudentController');
const student = require('../model/student');


route.get('/', studentController.getAll)
route.post('/', studentController.insertStudent)
route.get('/:id', studentController.getStudentByID)
//route.dele

module.exports = route