const pino = require('pino');
const path = require('path');

const formatUtcDateTime = () => {
  return new Date().toISOString().replace(/[:.]/g, '-');
};

const logFileName = `${formatUtcDateTime()}.system.log.json`;
  
const logStream = pino.destination(path.join(__dirname, logFileName));
  
const logger = pino(logStream);

module.exports = { logger };
