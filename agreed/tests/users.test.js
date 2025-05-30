// Import supertest to make HTTP requests for testing
const request = require('supertest');

// Import the Express app
const app = require('../server');

// Group all tests related to user API
describe('User API Tests', () => {
  // Create a unique username for testing to avoid conflicts with existing users
  const uniqueUser = `user${Date.now()}`;

  // Test: signup a new user successfully
  it('should sign up a new user successfully', async () => {
    const res = await request(app)
      .post('/user/signup') // send POST request to signup endpoint
      .send({
        username: uniqueUser,
        password: 'testpass',
        email: `${uniqueUser}@example.com`,
        firstName: 'Test',
        lastName: 'User'
        // Optional fields like phone and address are omitted here
      });

    // Check that response status is 200 OK and signup was successful
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('user.username', uniqueUser);
  });

  // Test: login with wrong credentials should fail
  it('should handle login with wrong credentials', async () => {
    const res = await request(app)
      .post('/user/login') // send POST request to login endpoint
      .send({
        username: 'nonexistentuser',
        password: 'wrongpass'
      });

    // Expect success to be false and message to say invalid credentials
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });
});
