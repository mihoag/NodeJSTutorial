const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const student = new Schema({
    id: String,
    name: String,
})

module.exports = mongoose.model('std', student);
