'use strict'

import { app, protocol, screen, ipcMain, shell, desktopCapturer } from 'electron'
import Launch from '@/wins/launch'
import TrayBox from '@/wins/tray'
import { BASE_WIN_WIDTH, BASE_WIN_HEIGHT, DESIGN_WIDTH_SMALL, DESIGN_HEIGHT_SMALL, VIDEO_PATH } from '@/utils/constant'
const path = require('path')
const {Worker, isMainThread} = require("worker_threads");

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

const getSize = () => {
  const { size, scaleFactor } = screen.getPrimaryDisplay()
  return {
    width: size.width * scaleFactor,
    height: size.height * scaleFactor
  }
}

let MainPage
app.on('ready', async () => {
  const bounds = screen.getPrimaryDisplay().bounds
  const winWSm = Math.floor((bounds.width / BASE_WIN_WIDTH) * DESIGN_WIDTH_SMALL)
  const winHSm = Math.ceil((bounds.height / BASE_WIN_HEIGHT) * DESIGN_HEIGHT_SMALL)


  const LaunchPage = new Launch({
    width: winWSm,
    height: winHSm
  })
  LaunchPage.on('show', function () {
    console.log('启动页开启')


    // eslint-disable-next-line no-new
    new TrayBox(MainPage)
  })
})

ipcMain.on('open-suspend', () => {
  MainPage.min()
  MainPage.getWebContents().send('record-start')
})

ipcMain.on('close-suspend', () => {
  MainPage.getWebContents().send('record-stop')
})

ipcMain.on('main-show', () => {
  MainPage.show()
})

ipcMain.on('directory-open', (event, arg) => {
  const file = path.join(VIDEO_PATH, arg)
  shell.showItemInFolder(file)
})

ipcMain.on('recive-desktop', async (event) => {
  const sizeInfo = getSize()
  const source = await desktopCapturer.getSources({
    types: ['window', 'screen'],
    thumbnailSize: sizeInfo
  })

  event.reply('transport-source', source[0])
})
