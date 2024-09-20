// logger.js
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, errors } = format;

// Custom format for logging
const myFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const logger = createLogger({
  level: 'info', // Logging level
  format: combine(
    timestamp(),
    errors({ stack: true }), // Captures stack traces for errors
    myFormat
  ),
  transports: [
    new transports.Console(),  // Log to console
    new transports.File({ filename: 'logs/app.log' }) // Log to file
  ],
});

module.exports = logger;
