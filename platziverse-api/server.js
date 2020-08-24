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

function handleFatalError (err) {
  debug(`[fatal error] ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

// Verify if the module is required
if (!module.parent) {
  process.on('uncaughtException', handleFatalError)
  process.on('unhandledRejection', handleFatalError)

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

module.exports = app
