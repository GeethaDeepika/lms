// // // controllers/authController.js
// // const User = require('../models/User');
// // const bcrypt = require('bcryptjs');
// // const jwt = require('jsonwebtoken');

// // exports.register = async (req, res) => {
// //     try {
// //         const { username, email, password } = req.body;

// //         // Check if the email already exists
// //         const existingUser = await User.findOne({ email });
// //         if (existingUser) {
// //             return res.status(400).json({ error: 'Email already in use' });
// //         }

// //         const user = new User({ username, email, password });
// //         await user.save();
// //         res.status(201).json({ message: 'User registered successfully' });
// //     } catch (error) {
// //         res.status(500).json({ error: 'Registration failed' });
// //     }
// // };

// // exports.login = async (req, res) => {
// //     try {
// //         const { email, password } = req.body;

// //         // Find user by email
// //         const user = await User.findOne({ email });
// //         if (!user || !(await bcrypt.compare(password, user.password))) {
// //             return res.status(401).json({ error: 'Invalid credentials' });
// //         }

// //         // Create and send JWT token
// //         const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
// //         res.json({ token });
// //     } catch (error) {
// //         res.status(500).json({ error: 'Login failed' });
// //     }
// // };


// // controllers/authController.js
// const Student = require('../models/Student');
// const Teacher = require('../models/Teacher');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// exports.register = async (req, res) => {
//     try {
//         const { username, email, password, role } = req.body;

//         // Check if the email already exists in either Student or Teacher collection
//         const existingUser = await (role === "student" ? Student : Teacher).findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ error: 'Email already in use' });
//         }

//         // Create new user and hash password
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const userData = { username, email, password: hashedPassword };

//         // Save to the correct collection based on role
//         if (role === "student") {
//             const student = new Student(userData);
//             await student.save();
//             res.status(201).json({ message: 'Student registered successfully' });
//         } else if (role === "teacher") {
//             const teacher = new Teacher(userData);
//             await teacher.save();
//             res.status(201).json({ message: 'Teacher registered successfully' });
//         } else {
//             res.status(400).json({ error: 'Invalid role' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'Registration failed' });
//     }
// };

// exports.login = async (req, res) => {
//     try {
//         const { email, password, role } = req.body;

//         // Find user by email in the appropriate collection
//         const user = await (role === "student" ? Student : Teacher).findOne({ email });
//         if (!user || !(await bcrypt.compare(password, user.password))) {
//             return res.status(401).json({ error: 'Invalid credentials' });
//         }

//         // Create and send JWT token
//         const token = jwt.sign({ userId: user._id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         res.json({ token, redirectUrl: role === "student" ? "/student" : "/teacher" });
//     } catch (error) {
//         res.status(500).json({ error: 'Login failed' });
//     }
// };

// controllers/authController.js
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// // Define separate schemas for Student and Instructor
// const Student = mongoose.model('Student', require('../models/User'));
// const Instructor = mongoose.model('Instructor', require('../models/User'));

// // Register user with role-based collections
// exports.register = async (req, res) => {
//     try {
//         const { username, email, password, role } = req.body;

//         // Check if the email already exists
//         const existingUser =
//             role === 'student'
//                 ? await Student.findOne({ email })
//                 : await Instructor.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ error: 'Email already in use' });
//         }

//         // Hash password and create user
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user =
//             role === 'student'
//                 ? new Student({ username, email, password: hashedPassword })
//                 : new Instructor({ username, email, password: hashedPassword });
//         await user.save();
//         res.status(201).json({ message: 'User registered successfully' });
//     } catch (error) {
//         res.status(500).json({ error: 'Registration failed' });
//     }
// };

// // Login user based on role and issue token
// exports.login = async (req, res) => {
//     try {
//         const { email, password, role } = req.body;

//         // Search in the appropriate collection based on role
//         const user =
//             role === 'student'
//                 ? await Student.findOne({ email })
//                 : await Instructor.findOne({ email });
//         if (!user || !(await bcrypt.compare(password, user.password))) {
//             return res.status(401).json({ error: 'Invalid credentials' });
//         }

//         // Create and send JWT token
//         const token = jwt.sign({ userId: user._id, role: role }, process.env.JWT_SECRET, {
//             expiresIn: '1h'
//         });
//         res.json({ token });
//     } catch (error) {
//         res.status(500).json({ error: 'Login failed' });
//     }
// };

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    const { role, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ msg: "User already exists" });
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = new User({ role, email, password: hashedPassword });
        await newUser.save();
        
        res.json({ msg: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "User does not exist" });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
        
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error });
    }
};
