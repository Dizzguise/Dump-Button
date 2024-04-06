const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

const { logger } = require('./logger');
const { getSettings } = require('./settings');

const { PromiseRPCProtocol } = require('promise.rpc');
const { terminateFfmpegProcess, startFfmpegProcess } = require('./stream_utils');
const { nms } = require('./rtmp_relay');

nms.run();

const streamActions = {
  async startLive() {
    const liveArgs = ['-i', 'rtmp://localhost/live', '-acodec', 'copy', '-vcodec', 'copy', '-f', 'flv'];
    logger.info({'action': 'startLive', args:[...liveArgs, 'STREAMURI']});
    liveArgs.push(getSettings().STREAMURI);
    await terminateFfmpegProcess();
    await startFfmpegProcess(liveArgs);
  },
  async stopStream() {
    logger.info({'action': 'stopStream'});
    await terminateFfmpegProcess();
  },
  async triggerDump() {
    const dumpArgs = ['-re', '-i', getSettings().DUMPVIDEO, '-acodec', 'copy', '-vcodec', 'copy', '-f', 'flv', getSettings().STREAMURI];
    logger.info({'action': 'triggerDump', args:[...dumpArgs, 'STREAMURI']});
    dumpArgs.push(getSettings().STREAMURI);
    await terminateFfmpegProcess();
    await startFfmpegProcess(dumpArgs);
  }    
};


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
