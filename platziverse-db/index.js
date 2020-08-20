'use strict'
const setupDatabase = require('./lib/db')
const setupAgentModel = require('./models/agent')
const setupMetricModel = require('./models/metric')
const setupAgentService = require('./lib/agent')
const setupAgentService = require('./lib/metric')
/**
 * Configures the models, relationships and more
 * @type {Object}
 * @returns {Promise<{Agent: {}, Metric: {}}>}
 */
module.exports = async function (config) {
  /**
   * In this part, we're configuring the models and creating the connection to the db,
   * that's why we're calling setupDatabase before the Models. The models will use the current
   * connection because of the Singleton pattern
   */
  const sequelize = setupDatabase(config)
  const AgentModel = setupAgentModel(config)
  const MetricModel = setupMetricModel(config)

  /**
   * This part of the code configures the relationship between the models.
   * We do not need to set up the fields that relates the tables when we write the models.
   * Sequelize does that.
   */
  AgentModel.hasMany(MetricModel)
  MetricModel.belongsTo(AgentModel)

  /**
   * This part makes a sql query to verify the connection of the database, if the database is
   * not connected, the code will throw an error, and the implementation will have to handle it.
   */
  await sequelize.authenticate()

  /**
   * If exists in the config object the property setup set to true, start the process of
   * migration the tables.
   */
  if (config.setup) {
    await sequelize.sync({ force: true })
  }

  const Agent = setupAgentService(AgentModel)
  const Metric = setupMetricService(MetricModel, AgentModel)

  return {
    Agent,
    Metric
  }
}
