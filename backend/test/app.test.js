let chai, expect;

before(async () => {
  // Import chai dynamically inside an async function
  const chaiModule = await import('chai');
  chai = chaiModule.default;
  expect = chaiModule.expect;
});
const request = require('supertest');
const app = require('../app');


let testToken = process.env.TESTING_TOKEN_KEY;
let postTestToken = process.env.TESTING_POST_TOKEN_KEY;
let invalidTestToken = process.env.TESTING_POST_INVALID_KEY;
let user_id = process.env.TESTING_USER_ID;

describe('API RESPONSES ', () => {
  let server;

  before(async () => {
    // Start the server after generating the test token
    server = app.listen(3001);
  });

  after((done) => {
    console.log("closing server")
    server.close(() => {
      console.log("server closed successfully")
      done();
    });
  });

  it('GET: should return 200 OK for /', (done) => {
    request(app)
      .get('/')
      .expect(200, done);
  });

  it('GET: should return 401 for unauthorized access for /users', (done) => {
    request(app)
      .get('/users')
      .expect(401, done);
  });

  it('GET: should return the user for authorized access to /users', (done) => {
    request(app)
      .get('/users')
      .set('Authorization', `Bearer ${testToken}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('_id');
        expect(res.body).to.have.property('email');
        expect(res.body).to.have.property('firstName');
        expect(res.body).to.have.property('lastName');
        expect(res.body).to.have.property('uid'); 
  
        done();
      });
  });
  /*
  it('should POST a new user and return 200 with success message /users/postUser', (done) => {
    const newUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };
  
    request(app)
      .post('/users/postUser')
      .send(newUser)
      .set('Authorization', `Bearer ${postTestToken}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
  
        // Assertions for the response body
        expect(res.body).to.have.property('message').equal('User information received successfully');
  
        done();
      });
  });
  */
  it('POST: should return 409 if user already exists /users/postUser', (done) => {
    const existingUser = {
      firstName: 'Existing',
      lastName: 'User',
      email: 'test@test.com',
    };
  
    request(app)
      .post('/users/postUser')
      .send(existingUser)
      .set('Authorization', `Bearer ${invalidTestToken}`)
      .expect(409)
      .end((err, res) => {
        if (err) return done(err);
  
        // Assertions for the response body
        expect(res.body).to.have.property('error').equal('User already exists');
  
        done();
      });
  });

  it('POST: should return 400 for validation error /users/postUser', (done) => {
    const invalidUser = {
      firstName: '',
      lastName: '1391',
      email: '@test.com',
    };
  
    request(app)
      .post('/users/postUser')
      .send(invalidUser)
      .set('Authorization', `Bearer ${invalidTestToken}`)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
  
        // Assertions for the response body
        expect(res.body).to.have.property('error').that.includes('Invalid input data');
  
        done();
      });
  });

  it('GET: should return 401 for unauthorized access for /history', (done) => {
    request(app)
      .get('/history')
      .expect(401, done);
  });

  it('GET: should return 200 OK for /history/getAllHistory', (done) => {
    request(app)
      .get(`/history/getAllHistory?user_id=${user_id}`)
      .set('Authorization', `Bearer ${testToken}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
  
        // Assuming res.body is an array of history objects
        const histories = res.body;
  
        // Example assertions
        expect(histories).to.be.an('array');
        expect(histories).to.have.lengthOf.at.least(1);
  
        // Check properties of each history object
        histories.forEach(history => {
          expect(history).to.have.property('original_code').that.is.a('string');
          expect(history).to.have.property('Source_language').that.is.a('string');
          expect(history).to.have.property('Desired_language').that.is.a('string');
          expect(history).to.have.property('converted_code').that.is.a('string');
          expect(history).to.have.property('createdAt').that.is.a('string');
        });
  
        done();
      });
  });

  it('POST: should create a new history entry and return 200 with the inserted ID /history', (done) => {
    const newHistoryEntry = {
      user_id: user_id,
      inputCode: 'print("Hello, World!")',
      translateCode: 'print("Hola, Mundo!")',
      sourceLanguage: 'python',
      desiredLanguage: 'python',
    };
  
    request(app)
      .post('/history')
      .send(newHistoryEntry)
      .set('Authorization', `Bearer ${testToken}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
  
        // Assertions for the response body
        expect(res.body).to.be.a('string'); // Assuming the inserted ID is a string
        expect(res.body).to.have.lengthOf.at.least(1); // Assuming the ID has a non-zero length
  
        done();
      });
  });
  
  

  it('GET: should return 200 OK for /feedback/getFeedback', (done) => {
  request(app)
    .get('/feedback/getFeedback')
    .expect(200)
    .end((err, res) => {
      if (err) return done(err);

      // Assuming res.body is an array of feedback objects
      const feedbacks = res.body;

      // Example assertions
      expect(feedbacks).to.be.an('array');
      expect(feedbacks).to.have.lengthOf.at.least(1);

      // Check properties of each feedback object
      feedbacks.forEach(feedback => {
        expect(feedback).to.have.property('textMessage').that.is.a('string');
        expect(feedback).to.have.property('user').that.is.an('object');

        const user = feedback.user;
        expect(user).to.have.property('firstName').that.is.a('string');
        expect(user).to.have.property('lastName').that.is.a('string');
      });

      done();
    });
});

  it('GET: should return 404 for an invalid route', (done) => {
    request(app)
      .get('/invalid-route')
      .expect(404, done);
  });

  it('GET: should return a specific response for /test', (done) => {
    request(app)
      .get('/test')
      .expect(200)
      .expect({ message: 'This is a test for auth' }, done);
  });
});
