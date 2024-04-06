const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    sendMessage: (channel, message) => ipcRenderer.send(channel, message),
    receiveMessage: (channel, callback) => ipcRenderer.on(channel, callback)
});