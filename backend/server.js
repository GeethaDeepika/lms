// // // server.js
// // const express = require('express');
// // const connectDB = require('./config/db');
// // const authRoutes = require('./routes/authRoutes');
// // require('dotenv').config();

// // const app = express();

// // // Connect to database
// // connectDB();

// // // Middleware
// // app.use(express.json());

// // // Routes
// // app.use('/api/auth', authRoutes);

// // // Start server
// // const PORT = process.env.PORT || 5001;
// // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const connectDB = require('./config/db');
// const authRoutes = require('./routes/authRoutes');

// const app = express();
// const PORT = process.env.PORT || 5001;

// // Connect to MongoDB
// connectDB();

// // Middleware
// app.use(bodyParser.json());

// // Routes
// app.use('/api/auth', authRoutes);

// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

