const ircServer = require('./server')
const irc = ircServer.createServer()

irc.listen(6667)

const express = require('express')
const app = express()
const http = require('http')
const WebSocket = require('websocket-stream')

// Serve static files from the 'public' directory
app.use(express.static('public'))

// Create an HTTP server
const httpServer = http.createServer(app)

// Create a WebSocket server
const wss = new WebSocket.Server({ server: httpServer })

// Handle WebSocket connections
wss.on('connection', irc.handleConnection)

httpServer.listen(3000, () => {
  console.log('Server listening on port 3000')
})
