const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require("body-parser");

const mailRoutes = require("./routes/mail");

const app = express();
app.use(bodyParser.json());

// ✅ Use Mail Routes
app.use("/api", mailRoutes);

// Path to React build
const buildPath = path.join(__dirname, '../build');

// Serve React build if it exists
if (fs.existsSync(buildPath)) {
    // Serve static files
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});