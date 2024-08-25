const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Define your routes here
router.get('/', userController.getAllUsers);
router.post('/', userController.addUser);
router.put('/:id', userController.editUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;