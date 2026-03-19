const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // connect vue to server
app.use(express.json()); // allow server to read json

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected!"))
  .catch(err => console.log("Connection Error:", err));

// A simple test route
app.get('/', (req, res) => {
  res.send('Fantastic Dorms Server is Online');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));