// reference:
// https://www.bezkoder.com/node-express-mongodb-crud-rest-api/
// https://dev.to/kjdowns/building-a-basic-api-using-express-node-and-mongodb-160f

import express from 'express';
import ProfileController from '../controllers/ProfileController.js';
const router = express.Router();

router.post('/login', ProfileController.login);

router.get('/me', (req, res) => {
  if (req.session.user) res.status(200).json({ user: req.session.user });
  else res.status(401).json({ message: 'Not logged in.' });
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Logout failed.' });
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logged out.' });
  });
});

export default router;