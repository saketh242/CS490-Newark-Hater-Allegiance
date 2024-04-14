const axios = require('axios');
const request = require('supertest');
const app = require('../app');

const apiKey = process.env.FIREBASE_API_KEY;
const signInEndpoint = process.env.FIREBASE_SIGNIN_ENDPOINT;
const testEmail = process.env.TESTING_EXISTING_USER_EMAIL;
const testPassword = process.env.TESTING_EXISTING_USER_PASSWORD;

const signInWithEmailAndPassword = async (email, password) => {
    const requestBody = {
        email: email,
        password: password,
        returnSecureToken: true,
    };

    try {
        const response = await axios.post(`${signInEndpoint}?key=${apiKey}`, requestBody);
        return response.data.idToken;
    } catch (error) {
        console.error('Error signing in:', error.response ? error.response.data : error.message);
        throw error;
    }
};

let testToken;

before(async () => {
    const signInResponse = await signInWithEmailAndPassword(testEmail, testPassword);
    testToken = signInResponse;
});

const makeTranslationRequest = (inputCode, sourceLanguage, desiredLanguage, token) => {
    return request(app)
        .post('/openAI/postTranslation')
        .send({ inputCode, sourceLanguage, desiredLanguage })
        .set('Authorization', `Bearer ${token}`);
};

describe('Testing OpenAI and rate limits', function () {

    it('POST: should return 401 for unauthorized access to /openAI/postTranslation', async () => {
        const response = await request(app)
            .post('/openAI/postTranslation')
            .send({})
            .expect(401);

        expect(response.body).to.have.property('message').equal('Unauthorized: Missing Authorization Header');
    }).timeout(70000);

    it('POST: should return 200 for successful translation from Go to JavaScript for /openAI/postTranslation', async () => {
        const inputCode = "package main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello, world\")\n}";
        const response = await makeTranslationRequest(inputCode, "go", "javascript", testToken);
        
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('success').equal(true);
        expect(response.body).to.have.property('message').that.is.a('string');
    }).timeout(70000);

    it('POST: should return 400 for language mismatch, gibberish, or other language errors for /openAI/postTranslation', async () => {
        const inputCode = "printf(\"Hello World!\")";
        const response = await makeTranslationRequest(inputCode, "java", "c", testToken);
        
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('success').equal(false);
        expect(response.body).to.have.property('message').equal("Input code does not match specified source language");
    }).timeout(70000);

    it('POST: should return 200 for successful translation from Java to Python for /openAI/postTranslation', async () => {
        const inputCode = "public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World\");\n    }\n}";
        const response = await makeTranslationRequest(inputCode, "java", "python", testToken);
        
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('success').equal(true);
        expect(response.body).to.have.property('message').that.is.a('string');
    }).timeout(70000);

    it('POST: should return 200 for successful translation from C to Ruby for /openAI/postTranslation', async () => {
        const inputCode = "#include <stdio.h>\n\nint main() {\n    printf(\"Hello, world!\\n\");\n    return 0;\n}";
        const response = await makeTranslationRequest(inputCode, "c", "ruby", testToken);
        
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('success').equal(true);
        expect(response.body).to.have.property('message').that.is.a('string');
    }).timeout(70000);

    it('POST: should return 200 for successful translation from Ruby to PHP for /openAI/postTranslation', async () => {
        const inputCode = "puts 'Hello, world!'";
        const response = await makeTranslationRequest(inputCode, "ruby", "php", testToken);
        
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('success').equal(true);
        expect(response.body).to.have.property('message').that.is.a('string');
    }).timeout(70000);

});
