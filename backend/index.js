const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const cors = require('cors');

const rentUserRegisterRoute = require('./routes/rentUserRegisterRoute');
const rentUserSignin = require("./routes/rentUserSignin");
const rentUserAddBikeRoute = require("./routes/rentUserAddBikeRoute");
const rentUserGetBikesRoute = require('./routes/rentUserGetBikesRoute');
const rentUserRentAvailableRoute = require('./routes/rentUserRentAvailableRoute');
const bookUserGetBikesRoute = require('./routes/bookUserGetBikesRoute');

const app = express();

// Middleware
app.use(cors());

// Increased limits for large Base64 payloads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API Routes
app.use('/api/rent-user/register', rentUserRegisterRoute);
app.use("/api/rent-user/signin", rentUserSignin);
app.use("/api/rent-user/add-bike", rentUserAddBikeRoute);
app.use('/api/rent-user/get-bikes', rentUserGetBikesRoute);
app.use('/api/rent-user/rent-available', rentUserRentAvailableRoute);
app.use('/api/book-user/get-bikes', bookUserGetBikesRoute);
// Serve React build
const buildPath = path.join(__dirname, '../build');
if (fs.existsSync(buildPath)) {
    app.use(express.static(buildPath));
    app.get(/.*/, (req, res) => {
        res.sendFile(path.join(buildPath, 'index.html'));
    });
} else {
    app.get('/', (req, res) => res.send('React frontend not found.'));
}

// MongoDB connection
if (process.env.NODE_ENV !== "test") {
    const MONGO_URI = 'mongodb+srv://sainikhilchitra:z0nKhuwK79g2Fktk@swiftride.ppyeu39.mongodb.net/swiftride?retryWrites=true&w=majority&appName=swiftride';

    mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log('MongoDB connected');

            const PORT = process.env.PORT || 5000;
            app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        })
        .catch(err => console.error('MongoDB connection error:', err));
}

module.exports = app;