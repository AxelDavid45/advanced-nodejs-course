'use strict'
const debug = require('debug')('platziverse:mqtt')
const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)
const redis = require('redis')

const backend = {
  type: 'redis',
  redis,
  return_buffers: true
}

const settings = {
  port: 1883,
  backend
}

// Listen when a client connected
aedes.on('clientReady', (client) => {
  debug(`Client with id: ${client.id} connected`)
})

aedes.on('clientDisconnect', client => {
  debug(`Client with id ${client.id} disconnected`)
})

// Listen when the client publish something in the server
aedes.on('publish', (packet, client) => {
  debug(`Received: ${packet.topic}`)
  debug(`Payload: ${packet.payload}`)
})

server.on('error', handleFatalError)

server.listen(settings.port, () => {
  debug(`Server running on port ${settings.port}`)
})

function handleFatalError (err) {
  console.error(err.message)
  console.error(err.stack)
  process.exit(1)
}

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)
