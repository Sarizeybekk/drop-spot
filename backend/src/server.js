import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db/database.js';
import './db/migrate.js';
import authRoutes from './routes/auth.js';
import dropsRoutes from './routes/drops.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'DropSpot API is running' });
});

app.get('/api/seed', (req, res) => {
  import('./config/seed.js').then(({ SEED, COEFFICIENTS }) => {
    res.json({ seed: SEED, coefficients: COEFFICIENTS });
  });
});

app.use('/auth', authRoutes);
app.use('/drops', dropsRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});

