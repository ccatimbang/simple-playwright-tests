const request = require('supertest');
const app = require('../src/server');

describe('Authentication Endpoints', () => {
  describe('POST /login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          username: 'admin',
          password: 'password'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.username).toBe('admin');
      expect(response.body.user.email).toBe('admin@test.com');
    });

    it('should reject login with invalid username', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          username: 'invalid',
          password: 'password'
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid credentials');
    });

    it('should reject login with invalid password', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          username: 'admin',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid credentials');
    });

    it('should reject login with missing username', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          password: 'password'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Username and password required');
    });

    it('should reject login with missing password', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          username: 'admin'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Username and password required');
    });

    it('should reject login with empty body', async () => {
      const response = await request(app)
        .post('/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Username and password required');
    });
  });
});
