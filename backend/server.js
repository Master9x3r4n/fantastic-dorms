const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Connects vue to server
app.use(express.json()); // Allows server to read JSON

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected!"))
    .catch(err => console.log("Connection error:", err));

app.get('/', (req, res) => {
    res.send('i\'ve been trapped in vscode for 2 weeks... there is no food or water... let me out...');    
});

app.listen(PORT, () => console.log(`[Server started on port ${PORT}]`));