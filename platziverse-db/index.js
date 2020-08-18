'use strict'
const setupDatabase = require('./lib/db')
const setupAgentModel = require('./models/agent')
const setupMetricModel = require('./models/metric')

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

  const Agent = {}
  const Metric = {}

  return {
    Agent,
    Metric
  }
}
