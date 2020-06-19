const { app, BrowserWindow } = require('electron')
const path = require('path')
const { spawn } = require('child_process')
const waitOn = require('wait-on')
const isDev = require('electron-is-dev')

const PROD_SERVER = 'http://127.0.0.1:3000'
let mainWindow
let server

async function createWindow() {
  // let screenElectron = electron.screen;
  // let mainScreen = screenElectron.getPrimaryDisplay();
  // let dimensions = mainScreen.size;
  mainWindow = new BrowserWindow({
    width: 1364,
    height: 768,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
    },
  })

  mainWindow.setMinimumSize(1364, 768)
  if (isDev) {
    mainWindow.loadURL('http://localhost:8080')
  } else {
    try {
      server = startServer()
      await waitForServer()
      mainWindow.loadURL(PROD_SERVER)
    } catch (e) {
      console.log('e', e)
    }
  }

  isDev && mainWindow.webContents.openDevTools()
  mainWindow.on('closed', () => {
    return (mainWindow = null)
  })
}

app.on('ready', async () => {
  await createWindow()
})

app.on('activate', async () => {
  if (mainWindow === null) {
    await createWindow()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  server && server.kill()
})

function startServer() {
  let dir = path.join(__dirname, 'server.js')
  const server = spawn('node', [dir])
  server.stdout.on('data', data => {
    console.log('stdout', data.toString('ascii'))
  })

  server.stderr.on('data', data => {
    console.log('stderr', data.toString('ascii'))
  })

  server.stdin.on('data', data => {
    console.log('stdin', data.toString('ascii'))
  })
  return server
}

function waitForServer() {
  return waitOn({
    resources: [PROD_SERVER],
  })
}
