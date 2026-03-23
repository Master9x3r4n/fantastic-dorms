import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  hide_sensitive: true,
  private_cdn: false,
  secure: true
});

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

app.get('/', (req, res) => {
  res.send('I need a Chicago deep dish in my system');
});

app.listen(PORT, () => console.log(`[Server started on port ${PORT}]`));