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
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  hide_sensitive: true,
  private_cdn: false,
  secure: true
});

// Setting up sessions
import session from 'express-session';
import MongoStore from 'connect-mongo';

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { 
    maxAge: 1000 * 60 * 60, //* 24, // Cookie lasts for 1 day
    httpOnly: true, // Security: prevents frontend JS from stealing the cookie
    secure: process.env.NODE_ENV === 'production', // Must be false for localhost
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  },
  proxy: process.env.NODE_ENV === 'production',
}));

if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1); 
}

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
  res.send('Japan is turning footsteps into electricty');
});

app.listen(PORT, () => console.log(`[Server started on port ${PORT}]`));