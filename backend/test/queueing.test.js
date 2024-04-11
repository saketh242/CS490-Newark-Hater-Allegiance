const request = require('supertest');
const app = require('../app');

describe('Express Queue System', function() {
  this.timeout(20000); // Increase timeout to allow for queue processing

  let server;
  
  before(async () => {
    // Start the server 
    server = app.listen(3001);
  });

  after((done) => {
    console.log("closing server")
    server.close(() => {
      console.log("server closed successfully")
      done();
    });
  });

  it('should process requests one at a time with increasing delay', function(done) {
    const start = Date.now();
    const delays = [3000, 2000, 1000]; // Delay times in milliseconds

    // Make requests with increasing delay
    Promise.all(delays.map((delay, index) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          request(app)
            .get('/feedback/getFeedback')
            .expect(200)
            .end((err, res) => {
              if (err) return reject(err);
              resolve(res);
            });
        }, delay);
      });
    }))
    .then((responses) => {
      const end = Date.now();
      const durations = responses.map((res, index) => end - start - delays[index]);
      console.log("Response Durations:", durations);
      for (let i = 1; i < durations.length; i++) {
        if (durations[i] < durations[i - 1]) {
          done(new Error('Requests are not processed in order'));
          return;
        }
      }
      done();
    })
    .catch((err) => {
      done(err);
    });
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