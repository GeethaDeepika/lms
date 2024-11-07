exports.signup = async (req, res) => {
    const { role, username, email, password } = req.body;

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        return res.status(400).json({ msg: "Password must be at least 8 characters long and include an uppercase letter and a number" });
    }

    try {
        const existingEmail = await User.findOne({ email });
        const existingUsername = await User.findOne({ username });

        if (existingEmail) return res.status(400).json({ msg: "Email already exists" });
        if (existingUsername) return res.status(400).json({ msg: "Username already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ role, username, email, password: hashedPassword });
        await newUser.save();

        res.json({ msg: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error });
    }
};
