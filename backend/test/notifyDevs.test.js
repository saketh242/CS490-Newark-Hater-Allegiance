const sinon = require('sinon');
const sendErrorLogEmail = require('../logs/notifyDevs');

before(async () => {
    // Import chai
    const chaiModule = await import('chai');
    chai = chaiModule.default;
    expect = chaiModule.expect;
  });

describe('notifyDevs', () => {
  it('should send an email without errors', async () => {
    // Create a spy on console.error to check if there are any errors logged
    const consoleErrorSpy = sinon.spy(console, 'error');

    // Call the function and await the promise
    await sendErrorLogEmail();

    // Check if console.error was not called (indicating no errors)
    expect(consoleErrorSpy.called).to.be.false;

    // Restore the spy
    consoleErrorSpy.restore();
  });
});
