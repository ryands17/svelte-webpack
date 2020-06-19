const express = require('express')
const path = require('path')

const PORT = 3000

exports.PORT = PORT

const app = express()

const buildDir = path.join(__dirname, '..', 'build')
app.use(express.static(buildDir))

const httpServer = require('http').createServer(app)
httpServer.listen(PORT, '0.0.0.0', () => console.log('server running'))

app.get('*', (_req, res) => {
  res.sendFile(path.join(buildDir, 'index.html'))
})
