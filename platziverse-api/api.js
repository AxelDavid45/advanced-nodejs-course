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
      next()
    } catch (e) {
      return next(e)
    }
  }
  next()
})

api.get('/agents', (req, res, next) => {
  try {
    debug('Request to /agents')
    res.send({})
  } catch (e) {
    next(e)
  }
})

api.get('/agent/:uuid', (req, res, next) => {
  const { uuid } = req.params
  if (uuid !== 'yyy') {
    const error = errorResponse.notFoundError('Agent not found')
    return next(error)
  }
  res.send({ uuid })
})

api.get('/metrics/:uuid', (req, res) => {
  const { uuid, type } = req.params
  res.send({ uuid, type })
})

module.exports = api
