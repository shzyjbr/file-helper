const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('myAPI', {
  handleUpdateRegister: (callback) => ipcRenderer.on('update-register', callback)
})