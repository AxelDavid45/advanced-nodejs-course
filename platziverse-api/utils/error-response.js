'use strict'

function notFoundError (message) {
  const error = new Error(message)
  error.statusCode = 404
  error.body = {
    code: error.statusCode,
    message: error.message
  }
  return error
}

function internalError (message) {
  const error = new Error(message)
  error.statusCode = 500
  error.body = {
    code: error.statusCode,
    message: error.message
  }
  return error
}

function unauthorizedError (message) {
  const error = new Error(message)
  error.statusCode = 401
  error.body = {
    code: error.statusCode,
    message: error.message
  }
  return error
}

module.exports = {
  notFoundError,
  internalError,
  unauthorizedError
}
