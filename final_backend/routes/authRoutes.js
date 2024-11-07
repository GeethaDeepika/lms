// // routes/authRoutes.js
// const express = require('express');
// const { register, login } = require('../controllers/authController');

// const router = express.Router();

// // Register route with role selection
// router.post('/register', register);

// // Login route with role selection
// router.post('/login', login);

// module.exports = router;

const express = require('express');
const { signup, login } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

module.exports = router;
