const request = require('supertest');
const app = require('../app'); 

describe('Rate Limiting', function() {
  it('should enforce rate limiting after 100 requests', async function() {
    this.timeout(20000); 

    // our app is setup in a way such that only 100 requests are allowed in 15 minutes
    // 33 requests are already made in all the previous test so checking for 67 (200)
    // and 68th request will be a 429
    for (let i = 0; i < 64; i++) {
      await request(app)
        .get('/test') 
        .expect(200); 
    }
    // this is 68th request
    const response = await request(app).get('/test');
    expect(response.status).to.equal(429); 
  });
});
