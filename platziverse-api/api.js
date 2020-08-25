'use strict'
const debug = require('debug')('platziverse:routes:api')
const errorResponse = require('./utils/error-response')
const config = require('../config/index')(false, debug)
const express = require('express')
const db = require('platziverse-db')
const api = express.Router()

let services = null
let Agent = null
let Metric = null

// intersection middleware
api.use(async (req, res, next) => {
  if (!services) {
    debug('Connecting to database')
    try {
      services = await db(config)
      Agent = services.Agent
      Metric = services.Metric
    } catch (e) {
      return next(e)
    }
  }
  next()
})

api.get('/agents', async (req, res, next) => {
  debug('Request to /agents')
  let agents = []
  try {
    agents = await Agent.findConnected()
  } catch (e) {
    next(e)
  }
  res.send(agents)
})

api.get('/agent/:uuid', async (req, res, next) => {
  debug('Request to /agent/:uuid')
  let agent = null
  try {
    const { uuid } = req.params
    agent = await Agent.findByUuid(uuid)
    if (!agent) {
      const error = errorResponse.notFoundError(`Agent not found with uuid ${uuid}`)
      return next(error)
    }
    res.send(agent)
  } catch (e) {
    next(e)
  }
})

api.get('/metrics/:uuid', async (req, res, next) => {
  const { uuid, type } = req.params
  debug(`request to /metrics/${uuid}`)
  let metrics = []
  try {
    metrics = await Metric.findByAgentUuid(uuid)
  } catch (e) {
    next(e)
  }

  if (metrics.length === 0) {
    return next(errorResponse.notFoundError(`Metrics not found for agent with uuid ${uuid}`))
  }

  res.send(metrics)
})

api.get('/metrics/:uuid/:type', async (req, res, next) =>{
  const { uuid, type } = req.params
  debug(`request to /metrics/${uuid}/${type}`)
  let metrics = []
  try {
    metrics = await Metric.findByTypeAgentUuid(type, uuid)
  } catch (e) {
    next(e)
  }
  if (metrics.length === 0) {
    return next(errorResponse.notFoundError(`Metrics not found for agent with uuid ${uuid}`))
  }
  res.send(metrics)
})
module.exports = api
