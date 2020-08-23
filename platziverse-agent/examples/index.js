'use strict'
const PlatziverseAgent = require('../')

const agent = new PlatziverseAgent({
  name: 'platzi',
  username: 'admin',
  interval: 2000,
  mqtt: {
    host: 'mqtt://localhost'
  }
})

// Metrics
agent.addMetric('rss', function getRss () {
  return process.memoryUsage().rss
})

agent.addMetric('promiseMetric', function getRandomPromise () {
  return Promise.resolve(Math.random())
})
agent.addMetric('callbackMetric', function getRandomCallback (callback) {
  setTimeout(() => {
    callback(null, Math.random())
  }, 1000)
})

agent.connect()

// This events are agent only
agent.on('connected', handler)
agent.on('disconnected', handler)
agent.on('message', handler)

agent.on('agent/connected', handler)
agent.on('agent/disconnected', handler)
agent.on('agent/message', payload => {
  console.log(payload)
})

function handler (payload) {
  console.log(payload)
}

setTimeout(() => agent.disconnect(), 10000)
