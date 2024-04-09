const axios = require('axios');
const request = require('supertest');
const app = require('../app');


let chai, expect;
let testToken;
let postUserToken;
let user_id = process.env.TESTING_USER_ID;
let post_id = process.env.TESTING_POST_ID;
const apiKey = process.env.FIREBASE_API_KEY;
const signInEndpoint = process.env.FIREBASE_SIGNIN_ENDPOINT;

const signInWithEmailAndPassword = async (email, password) => {
  const requestBody = {
    email: email,
    password: password,
    returnSecureToken: true,
  };

  try {
    const response = await axios.post(`${signInEndpoint}?key=${apiKey}`, requestBody);
    const responseData = response.data;

    const idToken = responseData.idToken;

    return idToken;
  } catch (error) {
    console.error('Error signing in:', error.response ? error.response.data : error.message);
    throw error;
  }
};

const email = process.env.TESTING_EXISTING_USER_EMAIL;
const password = process.env.TESTING_EXISTING_USER_PASSWORD;

const emailN = process.env.TESTING_NEW_USER_EMAIL;
const passwordN = process.env.TESTING_NEW_USER_PASSWORD;

before(async () => {
  // Import chai
  const chaiModule = await import('chai');
  chai = chaiModule.default;
  expect = chaiModule.expect;

  // Use Promise.all to wait for both sign-ins to complete
  await Promise.all([
    signInWithEmailAndPassword(email, password).then((token) => {
      testToken = token;
    }),
    signInWithEmailAndPassword(emailN, passwordN).then((token) => {
      postUserToken = token;
    }),
  ]);
});


describe('API RESPONSES ', () => {
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

  it('DELETE: should return 401 for unauthorized access for /users/deleteUser', (done) => {
    request(app)
      .delete('/users/deleteUser')
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body).to.have.property('message').equal('Unauthorized: Missing Authorization Header');
  
        done();
      });
  });

  it('DELETE: should return 200 for sucessful delete of user and their data for /users/deleteUser', (done) => {
    request(app)
      .delete('/users/deleteUser')
      .set('Authorization', `Bearer ${postUserToken}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('message').equal('User and associated data deleted successfully');
        done();
      });
  });

  it('DELETE: should return 404 for user not found for /users/deleteUser', (done) => {
    request(app)
      .delete('/users/deleteUser')
      .set('Authorization', `Bearer ${postUserToken}`)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('error').equal('User not found');
        done();
      });
  });

  it('PUT: should return 400 for validation error /users/updateUser', (done) => {
    const invalidUser = {
      firstName: '',
      lastName: '1391',
      email: '@test.com',
    };
    request(app)
      .put('/users/updateUser')
      .send(invalidUser)
      .set('Authorization', `Bearer ${testToken}`)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        // Make sure that if the data is not validated then error
        expect(res.body).to.have.property('error').that.includes('Invalid user input data');

        done();
      });
  });

  it('PUT: should return 404 for user not found /users/updateUser', (done) => {
    const invalidUser = {
      firstName: 'Karam',
      lastName: 'Assaf',
      email: 'karamassaf3@gmail.com',
    };
    request(app)
      .put('/users/updateUser')
      .send(invalidUser)
      .set('Authorization', `Bearer ${postUserToken}`)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);

        // Make sure that the user is not found in the database
        expect(res.body).to.have.property('error').that.includes('User not found');

        done();
      });
  });

  it('PUT: should return 200 for sucessfull update for /users/updateUser', (done) => {
    const updateUser = {
      email: 'ka534@njit.edu',
      firstName: 'Karam',
      lastName: 'Assaf',
      newEmailFlag: false,
      newFirstNameFlag: true,
      newLastNameFlag: true
    };
    request(app)
      .put('/users/updateUser')
      .send(updateUser)
      .set('Authorization', `Bearer ${testToken}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        // Make sure that the user is not found in the database
        expect(res.body).to.have.property('message').that.includes('User details updated successfully!');

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

  it('GET: should return 200 OK for /', (done) => {
    request(app)
      .get('/')
      .expect(200, done);
  });

  it('GET: should return 401 for unauthorized access for /history', (done) => {
    request(app)
      .get('/history')
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body).to.have.property('message').equal('Unauthorized: Missing Authorization Header');
  
        done();
      });
  });

  it('GET: should return 200 OK for /history/getAllHistory', (done) => {
    request(app)
      .get(`/history/getAllHistory?user_id=${user_id}&sortField=Date`)
      .set('Authorization', `Bearer ${testToken}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);


        const histories = res.body;


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

  it('GET: should return 400 for missing user id field /history/getAllHistory', (done) => {
    request(app)
      .get(`/history/getAllHistory`)
      .set('Authorization', `Bearer ${testToken}`)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body).to.have.property('error').that.includes('Missing required field to get history');

        done();
      });
  });

  it('GET: should return 200 OK for /feedback/getFeedback', (done) => {
    request(app)
      .get('/feedback/getFeedback')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const feedbacks = res.body;

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

  it('GET: should return 401 for unauthorized access for /users', (done) => {
    request(app)
      .get('/users')
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body).to.have.property('message').equal('Unauthorized: Missing Authorization Header');
  
        done();
      });
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

  it('GET: should return 404 for user not found for /users', (done) => {
    request(app)
      .get('/users')
      .set('Authorization', `Bearer ${postUserToken}`)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('error').equal('User not found');
        done();
      });
  });

  it('POST: a new user and return 200 with success message /users/postUser', (done) => {
    const newUser = {
      firstName: 'Karam',
      lastName: 'Assaf',
      email: 'karamassaf3@gmail.com',
    };

    request(app)
      .post('/users/postUser')
      .send(newUser)
      .set('Authorization', `Bearer ${postUserToken}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        // Assertions for the response body
        expect(res.body).to.have.property('message').equal('User information received successfully');

        done();
      });
  });

  it('POST: should return 409 if user already exists /users/postUser', (done) => {
    const existingUser = {
      firstName: 'Cram',
      lastName: 'Fassa',
      email: 'ka534@njit.edu',
    };

    request(app)
      .post('/users/postUser')
      .send(existingUser)
      .set('Authorization', `Bearer ${testToken}`)
      .expect(409)
      .end((err, res) => {
        if (err) return done(err);

        // Making sure to show that the user already exists
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
      .set('Authorization', `Bearer ${testToken}`)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        // Make sure that if the data is not validated then error
        expect(res.body).to.have.property('error').that.includes('Invalid user input data');

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


        expect(res.body).to.be.a('string');
        expect(res.body).to.have.lengthOf.at.least(1);

        done();
      });
  });

  it('POST: should return 400 for an invalid history entry /history', (done) => {
    const invalidHistoryEntry = {
      user_id: user_id,
      inputCode: 'print("Hello, World!")',
      translateCode: 'print("Hola, Mundo!")',
      sourceLanguage: 'xml',
      desiredLanguage: 'python',
    };

    request(app)
      .post('/history')
      .send(invalidHistoryEntry)
      .set('Authorization', `Bearer ${testToken}`)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        // Making sure that the invalid fields throw error
        expect(res.body).to.have.property('error').that.includes('Missing required fields to post or invalid input');

        done();
      });
  });

  it('POST: should successfully post feedback and return 200 with success message /feedback', (done) => {
    const feedbackData = {
      user_id: user_id,
      postId: post_id,
      Trating: 4,
      Urating: 5,
      ratingText: 'Great translation and user experience!',
    };

    request(app)
      .post('/feedback')
      .send(feedbackData)
      .set('Authorization', `Bearer ${testToken}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        // Show that the feedback is inserted
        expect(res.text).to.equal('Feedback inserted!');

        done();
      });
  });

  it('POST: should return 404 if user is not found when posting feedback /feedback', (done) => {
    const invalidFeedbackData = {
      user_id: 'nonExistentUserId',
      postId: 'postId456',
      Trating: 3,
      Urating: 4,
      ratingText: 'Average translation and user experience.',
    };

    request(app)
      .post('/feedback')
      .send(invalidFeedbackData)
      .set('Authorization', `Bearer ${testToken}`)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);

        // Test if user is not found
        expect(res.body).to.have.property('error').equal('User not found');

        done();
      });
  });

  it('POST: should return 400 if input is not validated with invalid Trating or Urating posting feedback /feedback', (done) => {
    const invalidFeedbackData = {
      user_id: user_id,
      postId: post_id,
      Trating: 'GRUH',
      Urating: 4,
      ratingText: 'Average translation and user experience.',
    };

    request(app)
      .post('/feedback')
      .send(invalidFeedbackData)
      .set('Authorization', `Bearer ${testToken}`)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        // Type errors here
        expect(res.body).to.have.property('error').equal('Trating and Urating must be integer values');

        done();
      });
  });

  it('POST: should return 400 if input is not validated with missing field posting feedback /feedback', (done) => {
    const invalidFeedbackData = {
      user_id: user_id,
      postId: post_id,
      Trating: 4,
      Urating: 4,
    };

    request(app)
      .post('/feedback')
      .send(invalidFeedbackData)
      .set('Authorization', `Bearer ${testToken}`)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        // If the data dosen't contain the correct data
        expect(res.body).to.have.property('error').equal('Missing required fields for feedback');

        done();
      });
  });

  it('POST: should return 400 if input is not validated with invalid Trating or Urating posting being under min or over max feedback /feedback', (done) => {
    const invalidFeedbackData = {
      user_id: user_id,
      postId: post_id,
      Trating: 3,
      Urating: -1,
      ratingText: 'Average translation and user experience.',
    };

    request(app)
      .post('/feedback')
      .send(invalidFeedbackData)
      .set('Authorization', `Bearer ${testToken}`)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        // Out of the bounds error
        expect(res.body).to.have.property('error').equal('Invalid rating values. Ratings should be between 1 and 5');

        done();
      });
  });

  it('POST: should return 401 for unauthorized access to /openAI/postTranslation', (done) => {
    const inputCode = {
      inputCode: "print(\"Hello World!\")",
      sourceLanguage: "python",
      desiredLanguage: "c",
    };
  
    request(app)
      .post('/openAI/postTranslation')
      .send(inputCode)
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body).to.have.property('message').equal('Unauthorized: Missing Authorization Header');
  
        done();
      });
  });
  

  it('POST: should return 200 for sucessful translation for /openAI/postTranslation', (done) => {
    const inputCode = {
      inputCode: "print(\"Hello World!\")",
      sourceLanguage: "python",
      desiredLanguage: "c",
    };

    request(app)
      .post('/openAI/postTranslation')
      .send(inputCode)
      .set('Authorization', `Bearer ${testToken}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        // sucessful translation
        expect(res.body).to.have.property('success').equal(true);

        done();
      });
  }).timeout(10000);

  it('POST: should return 400 for language mismatch, gibberish, or other language errors for /openAI/postTranslation', (done) => {
    const inputCode = {
      inputCode: "printf(\"Hello World!\")",
      sourceLanguage: "java",
      desiredLanguage: "c",
    };

    request(app)
      .post('/openAI/postTranslation')
      .send(inputCode)
      .set('Authorization', `Bearer ${testToken}`)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        // sucessful translation
        expect(res.body).to.have.property('success').equal(false);
        expect(res.body).to.have.property('message').equal("Input code does not match specified source language");

        done();
      }).timeout(10000);
  });

});