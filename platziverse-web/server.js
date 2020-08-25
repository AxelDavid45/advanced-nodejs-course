'use strict'
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const debug = require('debug')('platziverse:web')
const socketIo = require('socket.io')
const PORT = process.env.PORT || 8080
const io = socketIo(server)
app.use(express.static(`${__dirname}/public`))

// Socket io
io.on('connect', socket => {
  debug(`Client ${socket.id} connected`)

  socket.on('agent/message', payload => {
    console.log(payload)
  })

  setInterval(() => io.emit('agent/message', { agent: 'xxx-yyy' }), 5000)
})

server.listen(PORT, () => {
  console.log(`platziverse-web running on port ${PORT}`)
})

function handleFatalError (err) {
  debug(`[fatal error] ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)
