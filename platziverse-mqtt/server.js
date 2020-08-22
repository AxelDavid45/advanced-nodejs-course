'use strict'
const debug = require('debug')('platziverse:mqtt')
const mqemitter = require('mqemitter-redis')
const aedes = require('aedes')({
  mq: mqemitter({
    host: 'redis-19672.c93.us-east-1-3.ec2.cloud.redislabs.com',
    port: 19672,
    password: 'IrJz7hfX3MWgLe1o8bR8UpEBMXlTPPke'
  })
})
const server = require('net').createServer(aedes.handle)
const redis = require('redis')
const configSetup = require('../config')
const config = configSetup(false, debug)
const { parsePayload } = require('./utils')
const db = require('platziverse-db')

const backend = {
  type: 'redis',
  redis,
  return_buffers: true
}

const settings = {
  port: 1883,
  backend
}

// Map to save all the agents connected
const clients = new Map()

// Listen when a client connected
aedes.on('clientReady', (client) => {
  debug(`Client with id: ${client.id} connected`)
  // Save the client that has connected
  clients.set(client.id, null)
})

aedes.on('clientDisconnect', async (client) => {
  debug(`Client with id ${client.id} disconnected`)
  const agent = clients.get(client.id)
  if (agent) {
    agent.connected = false
    try {
      await AgentService.createOrUpdate(agent)
    } catch (e) {
      return handleError(e)
    }
    // Delete agent from client list
    clients.delete(client.id)

    aedes.publish({
      topic: 'agent/disconnected',
      payload: JSON.stringify({
        agent: {
          uuid: agent.uuid
        }
      })
    })
    debug(`Client (${client.id}) associated to Agent (${agent.uuid}) marked as disconnected`)
  }
})

// Listen when the client publish something in the server
aedes.on('publish', async (packet, client) => {
  debug(`Received: ${packet.topic}`)
  // TODO handle the payload depending on the topic
  switch (packet.topic) {
    case 'agent/connected':
    case 'agent/disconnected':
      debug(`Payload: ${packet.payload}`)
      break
    case 'agent/message':
      // parse the payload
      debug(`Payload: ${packet.payload}`)
      const payload = parsePayload(packet.payload)

      if (payload) {
        payload.agent.connected = true
        let agent = null
        try {
          agent = await AgentService.createOrUpdate(payload.agent)
        } catch (e) {
          return handleError(e)
        }
        debug(`Agent ${agent.uuid} save`)
        // Notify Agent is connected
        if (!clients.get(client.id)) {
          clients.set(client.id, agent)
          aedes.publish({
            topic: 'agent/connected',
            payload: JSON.stringify({
              agent: {
                uuid: agent.uuid,
                name: agent.name,
                hostname: agent.hostname,
                pid: agent.pid,
                connected: agent.connected
              }
            })
          })
        }

        // Store metrics
        for (let metric of payload.metrics) {
          let m = null
          try {
            m = await MetricService.create(agent.uuid, metric)
          } catch (e) {
            return handleError(e)
          }
          debug(`Metric ${m.id} saved on agent ${agent.uuid}`)
        }
      }
      break
  }
})

server.on('error', handleFatalError)

// Create global varibles to use in different parts of the server
let AgentService = null
let MetricService = null

server.on('listening', async () => {
  const services = await db(config).catch(handleFatalError)

  AgentService = services.Agent
  MetricService = services.Metric

  debug('Server is ready and running')
})

server.listen(settings.port, () => {
  debug(`Server listening on port ${settings.port}`)
})

function handleFatalError (err) {
  console.error('[fatal error]: ', err.message)
  console.error(err.stack)
  process.exit(1)
}

function handleError (err) {
  console.error(`[error]:${err.message}`)
  console.error(err.stack)
}

// handle the global errors
process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)
