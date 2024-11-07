const User = require('../models/User');  // Make sure to check this path
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup function
exports.signup = async (req, res) => {
    const { role, username, email, password } = req.body;

    // Validate password
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        return res.status(400).json({ msg: "Password must be at least 8 characters long and include an uppercase letter and a number" });
    }

    try {
        // Check if email or username already exists
        const existingEmail = await User.findOne({ email });
        const existingUsername = await User.findOne({ username });

        if (existingEmail) return res.status(400).json({ msg: "Email already exists" });
        if (existingUsername) return res.status(400).json({ msg: "Username already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({ role, username, email, password: hashedPassword });
        await newUser.save();

        res.json({ msg: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error });
    }
};

// Login function
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid credentials" });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        // Generate JWT
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ msg: "Login successful", token });
    } catch (error) {
        res.status(500).json({ error });
    }
};
