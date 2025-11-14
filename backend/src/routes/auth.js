import express from 'express';
import jwt from 'jsonwebtoken';
import db from '../db/database.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signupSchema, loginSchema, validateRequest } from '../utils/validation.js';

const router = express.Router();

router.post('/signup', validateRequest(signupSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await hashPassword(password);
    const now = Math.floor(Date.now() / 1000);

    const result = db.prepare(`
      INSERT INTO users (email, password_hash, account_created_at, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(email, passwordHash, now, now, now);

    const token = jwt.sign(
      { id: result.lastInsertRowid, email, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: result.lastInsertRowid,
        email,
        role: 'user'
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', validateRequest(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

