const request = require('supertest');
const { app } = require('../app');
const User = require('../models/User');
const mongoose = require('mongoose');

describe('Authentication Tests', () => {
  beforeAll(async () => {
    // Connect to a test database
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/test_db';
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    // Clean up and close database connection
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear users collection before each test
    await User.deleteMany({});
  });

  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123',
        userType: 'consumer'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData);

      console.log('Register Response:', response.body);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('message', 'User created successfully');
      expect(response.body.user).toHaveProperty('username', userData.username);
      expect(response.body.user).toHaveProperty('email', userData.email);
      expect(response.body.user).not.toHaveProperty('password'); // Password should not be returned
    });

    it('should not register a user with duplicate email', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123',
        userType: 'consumer'
      };

      // Create first user
      await request(app)
        .post('/api/auth/signup')
        .send(userData);

      // Try to create second user with same email
      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('message', 'Username or email already exists');
    });

    it('should not register a user with missing required fields', async () => {
      const userData = {
        username: 'testuser',
        // email missing
        password: 'Password123'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData);

      expect(response.statusCode).toBe(500);
    });
  });

  describe('User Login', () => {
    beforeEach(async () => {
      // Create a test user before each login test
      await request(app)
        .post('/api/auth/signup')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'Password123',
          userType: 'consumer'
        });
    });

    it('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123'
        });

      console.log('Login Response:', response.body);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'Logged in successfully');
      expect(response.body).toHaveProperty('user');
    });

    it('should not login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.statusCode).toBe(400);
    });

    it('should not login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123'
        });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('User Logout', () => {
    it('should logout successfully', async () => {
      // First login to get a session
      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123'
        });

      const response = await request(app)
        .post('/api/auth/logout');

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'Logged out successfully');
    });
  });
});