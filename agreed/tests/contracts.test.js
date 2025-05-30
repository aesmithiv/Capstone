// Import supertest to simulate HTTP requests
const request = require('supertest');

// Import the Express app
const app = require('../server');

// Grouping tests for the Contract API
describe('Contract API Tests', () => {
  // Sample username to associate with test contracts
  const username = 'userForContract';

  // Sample contract data to be used in the tests
  const contractPayload = {
    displayName: 'Loan to Alice',
    content: 'This is a sample loan agreement.',
    date: '2025-05-28',
    lenderSignature: 'lender-signature-data',
    borrowerSignature: 'borrower-signature-data',
    lenderQR: '',
    borrowerQR: '',
    startDate: '2025-06-01',
    paymentCount: 4,
    repaymentSchedule: 'Monthly',
    loanAmount: 500,
    interestRate: 0,
    interestType: 'None',
    payments: [
      { dueDate: '2025-06-01', amount: 125, paid: false },
      { dueDate: '2025-07-01', amount: 125, paid: false },
      { dueDate: '2025-08-01', amount: 125, paid: false },
      { dueDate: '2025-09-01', amount: 125, paid: false }
    ]
  };

  // Test: create a new contract for a user
  it('should create a new contract', async () => {
    const res = await request(app)
      .post(`/contracts/${username}`)
      .send(contractPayload); // send sample contract data

    // Expect the server to respond with 200 OK and success: true
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });

  // Test: get contracts for the given user
  it('should return contracts for a given user', async () => {
    const res = await request(app)
      .get(`/contracts/${username}`); // fetch contracts for this user

    // Expect the server to respond with 200 OK and return an array
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
