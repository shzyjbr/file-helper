import { BrowserWindow, WebContents, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import { Worker } from 'worker_threads'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const events = require('events')
const path = require('path')

function updateIPList(webcontent,ips) {
  webcontent.send('update-register', ips)
  setTimeout(updateIPList, 3000, webcontent, ips)
}
console.log(__dirname)
const winConfig = {
  show: false,
  frame: false,
  focusable: true,
  alwaysOnTop: false,
  resizable: false, 
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
    // todo 这里调用失败
    preload: path.join(__dirname, '/src/preload/mainPreload.js'),
    nodeIntegrationInWorker: true
  }
}
let registerThread = null
class Launch extends events {
  constructor(confInfo) {
    super()
    this.confInfo = confInfo
    this.state = Object.assign({}, winConfig, confInfo)
    this.windowInstance = new BrowserWindow(this.state)

    if (process.env.WEBPACK_DEV_SERVER_URL) {
      this.windowInstance.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}/#/`)
      // this.windowInstance.webContents.openDevTools()
    } else {
      createProtocol('app')
      this.windowInstance.loadURL('app://./index.html/#/')
    }
    this.windowInstance.webContents.openDevTools();
    this.init()
  }

  init() {
    this.windowInstance.once('ready-to-show', () => {
      console.log('launch.js: ready-to-show')
      this.windowInstance.show()
    })

    this.windowInstance.on('show', () => {
      console.log('launch.js: show')
      this.emit('show')
    })

    this.listenIpc()
  }


  listenIpc() {

    let ipList = new Set()
    const { width, height } = this.confInfo
    ipcMain.on('move-main', (event, pos) => {
      this.windowInstance && this.windowInstance.setBounds({ width, height })
      this.windowInstance && this.windowInstance.setPosition(pos.baseX, pos.baseY)
    })
    // 上下线通知
    ipcMain.on('register', (event, state) => {
      console.log('in register callback')
      new Worker('./src/worker/registerWorker.js', { workerData: { registerPort: 6666, state: state } })
      registerThread = new Worker('./src/worker/stateServer.js', { workerData: { registerPort: 6666 } })
      registerThread.on("message", result => {
        // result 可以保持传递过来的类型
        ipList = result
        console.log(`stateServer in main.js, Result: ${Array.from(ipList)}`);
      });
    })
    updateIPList(this.windowInstance.webContents,ipList)
    // 全屏
    ipcMain.on('mainWin:max', () => {
      this.windowInstance.setFullScreen(true)
    })
    // 还原
    ipcMain.on('mainWin:min', () => {
      this.windowInstance.setFullScreen(false)
    })
    // 隐藏主窗口
    ipcMain.on('mainWin:hide', () => {
      this.windowInstance.hide()
    })
    // 关闭主窗口
    ipcMain.on('mainWin:close', () => {
      app.quit()
      // this.windowInstance.close()
    })
    // 最大化
    ipcMain.on('mainWin:maximize', () => {
      this.windowInstance.maximize()
    })
    // 最大化恢复
    ipcMain.on('mainWin:restore', () => {
      this.windowInstance.restore()
    })
    // 最小化
    ipcMain.on('mainWin:minimize', () => {
      this.windowInstance.minimize()
    })
  }

  getWebContents() {
    return this.windowInstance.webContents
  }

  getWindowInstance() {
    return this.windowInstance
  }

  show() {
    this.windowInstance && this.windowInstance.show()
  }

  min() {
    this.windowInstance && this.windowInstance.minimize()
  }

  close() {
    this.windowInstance && this.windowInstance.close()
  }
}

export default Launch
