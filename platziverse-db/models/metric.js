'use strict'
'use strict'
const Sequelize = require('sequelize')
const setupDatabase = require('../lib/db')

module.exports = function setupAgentModel (config) {
  const sequelize = setupDatabase(config)

  return sequelize.define('agent', {
    agentId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    type: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  })
}
