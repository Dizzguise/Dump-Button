const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

const { logger } = require('./logger');
const { getSettings } = require('./settings');

const { PromiseRPCProtocol } = require('promise.rpc');
const { ffmpegProcessFactory } = require('./stream_utils');
const { nms } = require('./rtmp_relay');

nms.run();

const ffmpegYoutube = ffmpegProcessFactory();
const ffmpegRumble = ffmpegProcessFactory();

const streamActions = {
  async startYoutube() {
    const liveArgs = ['-i', 'rtmp://localhost/live', '-acodec', 'copy', '-vcodec', 'copy', '-f', 'flv'];
    liveArgs.push(getSettings().YOUTUBEURI);
    await ffmpegYoutube.startFfmpegProcess(liveArgs);
  },
  async stopYoutube() {
    await ffmpegYoutube.terminateFfmpegProcess();
  },
  async dumpYoutube() {
    const dumpArgs = ['-stream_loop', '-1', '-re', '-i', getSettings().DUMPVIDEO, '-acodec', 'copy', '-vcodec', 'copy', '-f', 'flv'];
    dumpArgs.push(getSettings().YOUTUBEURI);
    await ffmpegYoutube.terminateFfmpegProcess();
    await ffmpegYoutube.startFfmpegProcess(dumpArgs);
  },

  async startRumble() {
    const liveArgs = ['-i', 'rtmp://localhost/live', '-acodec', 'copy', '-vcodec', 'copy', '-f', 'flv'];
    liveArgs.push(getSettings().RUMBLEURI);
    await ffmpegRumble.startFfmpegProcess(liveArgs);
  },
  async stopRumble() {
    await ffmpegRumble.terminateFfmpegProcess();
  },
  async dumpRumble() {
    const dumpArgs = ['-stream_loop', '-1', '-re', '-i', getSettings().DUMPVIDEO, '-acodec', 'copy', '-vcodec', 'copy', '-f', 'flv'];
    dumpArgs.push(getSettings().RUMBLEURI);
    await ffmpegRumble.terminateFfmpegProcess();
    await ffmpegRumble.startFfmpegProcess(dumpArgs);
  },
};

module.exports = streamActions;


let mainWindow;
/* NOTE: this is only designed to one renderer, and will break with multiple  */
const apiServer = new PromiseRPCProtocol(streamActions);

apiServer.onDispatch = (message) => {
  mainWindow.webContents.send('rpc', message);
};
ipcMain.on('rpc', function(event, arg) {
  console.log({args: arguments})
  apiServer.dispatch(arg);
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}


app.on('ready', createWindow);


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
