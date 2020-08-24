'use strict'
const debug = require('debug')('platziverse:api')
const express = require('express')
const PORT = process.env.PORT || 3000
const app = express()
const api = require('./api')
// Routes
app.use('/api', api)

// Express error handler
app.use((err, req, res, next) => {
  debug(`Error: ${err.message}`)
  res.status(err.statusCode).send(err.body)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
