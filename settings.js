const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');
const { logger } = require('./logger');

dotenv.config();

function getSettings() {
  const defaultSettings = {
    NMSPORT: 8200,  // Port for Node-Media-Server
  }

  const settingsPath = path.join(__dirname, 'settings.json');
  const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));

  const mergedSettings = { ...defaultSettings, ...process.env, ...settings };    

  return mergedSettings;
}


if (fs.existsSync('./settings.json')) {
  logger.info({action:'init', msg:'settings found'});
} else {
  logger.info({action:'init', msg:'settings not found, creating defaults'}); 
  fs.writeFileSync('./settings.json', fs.readFileSync("./settings.example.json"));
}


module.exports = { getSettings };
