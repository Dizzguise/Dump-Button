const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

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

module.exports = { getSettings };