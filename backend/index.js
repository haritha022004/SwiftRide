const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const rentUserRegisterRoute = require('./routes/rentUserRegisterRoute');
const rentUserSignin = require("./routes/rentUserSignin");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Routes
app.use('/api/rent-user/register', rentUserRegisterRoute);
app.use("/api/rent-user/signin", rentUserSignin);

// Serve React build if it exists
const buildPath = path.join(__dirname, '../build');
if (fs.existsSync(buildPath)) {
    app.use(express.static(buildPath));

    // Catch-all route for React
    app.get(/.*/, (req, res) => {
        res.sendFile(path.join(buildPath, 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('React frontend not found. Please build it first.');
    });
}

// MongoDB connection (skip if testing)
if (process.env.NODE_ENV !== "test") {
    mongoose.connect('mongodb://127.0.0.1:27017/swiftride')
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error('MongoDB connection error:', err));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app; // <-- export the app for testing