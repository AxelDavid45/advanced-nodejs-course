'use strict'
const express = require('express')
const api = express.Router()
const axios = require('axios')
const { endpoint, apiToken } = require('./config')

api.get('/agents', async (req, res, next) => {
  let agents = []
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiToken}`
    },
    responseType: 'json'
  }
  try {
    agents = await axios.get(`${endpoint}/api/agents`, options)
  } catch (e) {
    return next(e)
  }
  res.send(agents)
})

api.get('/agents/:uuid', (req, res) => {

})

api.get('/metrics/:uuid', (req, res) => {

})

api.get('/metrics/:uuid/:type', (req, res) => {

})

module.exports = api
