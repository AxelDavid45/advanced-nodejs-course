'use strict'
const jwt = require('jsonwebtoken')

async function sign (payload, secret, callback) {
  return jwt.sign(payload, secret, callback)
}

async function verify (token, secret, callback) {
  return jwt.verify(token, secret, callback)
}
module.exports = {
  sign,
  verify
}
