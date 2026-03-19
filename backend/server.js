// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const app = express();
// const PORT = process.env.PORT || 3000;

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// import 'dotenv/config.js';
// i want to kill whoever designed it this way
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Connects vue to server
app.use(express.json()); // Allows server to read JSON

// Database routers
import AuthRouter from './routers/AuthRouter.js';
import ProfileRouter from './routers/ProfileRouter.js';
app.use('/api/auth/', AuthRouter);
app.use('/api/p/', ProfileRouter);

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