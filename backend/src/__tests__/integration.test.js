import request from 'supertest';
import express from 'express';
import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from '../routes/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const testDbPath = join(__dirname, '../../test.db');
const testDb = new Database(testDbPath);
const schemaPath = join(__dirname, '../db/schema.sql');
const schema = readFileSync(schemaPath, 'utf-8');
testDb.exec(schema);

process.env.JWT_SECRET = 'test-secret-key-for-jwt';
process.env.DATABASE_URL = testDbPath;

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

beforeAll(() => {
  testDb.exec('DELETE FROM claims');
  testDb.exec('DELETE FROM waitlists');
  testDb.exec('DELETE FROM drops');
  testDb.exec('DELETE FROM users');
});

afterAll(() => {
  testDb.close();
});

describe('Auth API Integration Tests', () => {
  test('POST /auth/signup - Create user', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send({
        email: 'user@test.com',
        password: 'password123'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe('user@test.com');
  });

  test('POST /auth/signup - Reject duplicate email', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send({
        email: 'user@test.com',
        password: 'password123'
      });

    expect(response.status).toBe(409);
    expect(response.body.error).toBe('Email already registered');
  });

  test('POST /auth/login - Login with valid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'user@test.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe('user@test.com');
  });

  test('POST /auth/login - Reject invalid password', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'user@test.com',
        password: 'wrongpassword'
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Invalid credentials');
  });

  test('POST /auth/login - Reject non-existent user', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'nonexistent@test.com',
        password: 'password123'
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Invalid credentials');
  });
});
