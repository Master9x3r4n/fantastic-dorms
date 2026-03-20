// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const app = express();
// const PORT = process.env.PORT || 3000;

import express from 'express';
// import session from 'express-session';
// import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';

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
// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true
// }));
app.use(cors());
app.use(express.json()); // Allows server to read JSON
cloudinary.config()

// Database routers
import AuthRouter from './routers/AuthRouter.js';
import ProfileRouter from './routers/ProfileRouter.js';
import ReviewRouter from './routers/ReviewRouter.js';
import ListingRouter from './routers/ListingRouter.js';
app.use('/api/auth/', AuthRouter);
app.use('/api/p/', ProfileRouter);
app.use('/api/r/', ReviewRouter);
app.use('/api/l/', ListingRouter);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected."))
    .catch(err => console.log("Connection error:", err));

// Session object
// app.use(
//     session({
//         secret: process.env.SECRET_KEY,
//         resave: false,
//         saveUninitialized: false
//     })
// );
// app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('i want to cry');
});

app.get('/api', (req, res) => {
    res.send('i want to die');
})

app.listen(PORT, () => console.log(`[Server started on port ${PORT}]`));