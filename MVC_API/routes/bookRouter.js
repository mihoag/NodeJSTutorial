const express = require('express')
const router = express.Router();
const bookControl = require('../controller/bookController')


router.post('/', bookControl.addBook);
router.put('/:id', bookControl.updateBook);
router.get('/:id', bookControl.getByID)
router.get('/', bookControl.getAll);
router.delete('/:id', bookControl.deleteBook);

module.exports = router