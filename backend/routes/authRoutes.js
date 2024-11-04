const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register); // Ensure this is POST
router.post('/login', login);       // Ensure this is POST

module.exports = router;
