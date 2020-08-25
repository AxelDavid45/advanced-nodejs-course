'use strict'
const express = require('express')
const app = express()
const { pipe } = require('./utils')
const http = require('http')
const server = http.createServer(app)
const debug = require('debug')('platziverse:web')
const socketIo = require('socket.io')
const PlatziverseAgent = require('platziverse-agent')
const PORT = process.env.PORT || 8080
const io = socketIo(server)
const agent = new PlatziverseAgent()
const api = require('./proxy')

app.use(express.static(`${__dirname}/public`))
app.use('/', api)
// Socket io
io.on('connection', socket => {
  debug(`Client ${socket.id} connected`)
  pipe(agent, socket)
})

server.listen(PORT, () => {
  console.log(`platziverse-web running on port ${PORT}`)
  agent.connect()
})

function handleFatalError (err) {
  debug(`[fatal error] ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)
