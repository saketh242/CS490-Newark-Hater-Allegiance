const request = require('supertest');
const app = require('../app');

before(async () => {
    // Import chai
    const chaiModule = await import('chai');
    chai = chaiModule.default;
    expect = chaiModule.expect;
  });
  
describe('Queueing System', () => {
  it('should limit the number of active requests to 1', (done) => {
    // Make three concurrent requests to the same endpoint
    Promise.all([
      request(app).get('/'),
      request(app).get('/'),
      request(app).get('/')
    ])
      .then(([res1, res2, res3]) => {
        // Ensure that only one request is served immediately, while others are queued
        expect(res1.status).to.equal(200);
        expect(res2.status).to.equal(429); // 429: Too Many Requests
        expect(res3.status).to.equal(429); // 429: Too Many Requests
        done();
      })
      .catch((err) => done(err));
  });
});