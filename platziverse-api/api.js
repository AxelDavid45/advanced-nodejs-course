'use strict'
const debug = require('debug')('platziverse:routes:api')
const errorResponse = require('./utils/error-response')
const express = require('express')
const api = express.Router()

api.get('/agents', (req, res) => {
  debug('Request to /agents')
  res.send({})
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
