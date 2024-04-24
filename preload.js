const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    sendMessage: (channel, message) => {
        console.log(`Sending message on ${channel}`, message);
        ipcRenderer.send(channel, message);
    },
    receiveMessage: (channel, callback) => {
        console.log(`Listening on ${channel}`);
        ipcRenderer.on(channel, callback);
    }    
});