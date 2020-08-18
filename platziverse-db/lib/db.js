'use strict'
const Sequelize = require('sequelize')
let connection = null
/**
 * Module to create a connection with the database, uses singleton pattern to return an only
 * instance of the connection.
 * @param config
 * @returns {Sequelize}
 */
module.exports = function setupDatabase (config) {
  if (!connection) {
    connection = new Sequelize(config)
  }
  return connection
}
