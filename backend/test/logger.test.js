const fs = require('fs');
const sinon = require('sinon');

const logger = require('../logs/logger');

before(async () => {
    // Import chai
    const chaiModule = await import('chai');
    chai = chaiModule.default;
    expect = chaiModule.expect;
  });
describe('Error Logging System', () => {
  it('should update the error log file when an error occurs', async () => {
    // Simulate an error
    const error = new Error('Input code does not match specified source language');
    error.status = 400;
    const inputCode = 'language mismatch';
    const sourceLanguage = 'cplusplus';
    const detectedSourceLanguage = 'python';
    const desiredLanguage = 'java';

    // Log the error
    logger.error(`Error: ${error.message}, Input: ${inputCode}, SourceLanguage: ${sourceLanguage}, DetectedLanguage: ${detectedSourceLanguage}, DesiredLanguage: ${desiredLanguage}`);

    // Check if error log file has been updated
    const errorLogContent = fs.readFileSync('logs/error.log', 'utf8');
    const errorLogLines = errorLogContent.trim().split('\n');
    const lastErrorLogEntry = JSON.parse(errorLogLines[errorLogLines.length - 1]);
    // Check if the error log entry matches the expected format
    expect(lastErrorLogEntry).to.have.property('level', 'error');
    expect(lastErrorLogEntry).to.have.property('message').that.includes('Error: Input code does not match specified source language');
    expect(lastErrorLogEntry).to.have.property('timestamp');
  });
});
