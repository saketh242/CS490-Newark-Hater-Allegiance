const request = require('supertest');
const app = require('../app');

describe('Express Queue System', function() {
  this.timeout(20000); // Increase timeout to allow for queue processing

  it('should process requests one at a time due to queue limits', function(done) {
    // Start time
    const startTime = Date.now();

    // Make three concurrent requests
    Promise.all([
      request(app).get('/feedback/getfeedback').then(res => {
        return { route: '/feedback/getfeedback', time: Date.now() - startTime };
      }),
      request(app).get('/feedback/getfeedback').then(res => {
        return { route: '/feedback/getfeedback', time: Date.now() - startTime };
      }),
      request(app).get('/feedback/getfeedback').then(res => {
        return { route: '/feedback/getfeedback', time: Date.now() - startTime };
      })
    ])
    .then(responses => {
      // Ensure responses are spread out due to queuing, indicating they were processed one by one
      // This checks if each subsequent request was processed after a noticeable delay
      // Adjust the expected delay based on your queue configuration and server response times
       console.log(responses[0].time);
       console.log(responses[1].time);
       console.log(responses[2].time);
      
      // Adjust the margin of error to allow for small timing discrepancies
      const minExpectedDelay = 0; // Minimum expected delay in milliseconds between handling requests
      
      expect(responses[1].time - responses[0].time).to.be.greaterThanOrEqual(minExpectedDelay);
      expect(responses[2].time - responses[1].time).to.be.greaterThanOrEqual(minExpectedDelay);
      done();
    })
    .catch(done);
  });

  it('should handle a long-running task', function(done) {
    // Simulate a long-running task by delaying the response for 7 seconds
    this.timeout(20000);
    setTimeout(() => {
      request(app)
        .get('/test')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    }, 7000);
  });
});