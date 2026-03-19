require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Connects vue to server
app.use(express.json()); // Allows server to read JSON

// Database routers
app.use('/api/profiles', require('./routers/ProfileRouter.js'))

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected."))
    .catch(err => console.log("Connection error:", err));

app.get('/', (req, res) => {
    res.send('i want to cry');    
});

app.get('/api', (req, res) => {
    res.send('i want to die');
})

app.listen(PORT, () => console.log(`[Server started on port ${PORT}]`));