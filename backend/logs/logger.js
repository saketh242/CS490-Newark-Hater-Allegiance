const winston = require('winston');

const { createLogger, transports } = winston;
const logger = createLogger({
  transports: [
    new transports.File({
      filename: `${__dirname}/error.log`, // Use __dirname to refer to the directory of the current module
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ]
});

module.exports = logger;
