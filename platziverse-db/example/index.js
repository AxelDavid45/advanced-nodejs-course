'use strict'
const db = require('../')

async function run () {
  /**
   * Creates the config object to start the configuration process.
   */
  const config = {
    dialect: 'mysql',
    database: process.env.DB_NAME || 'Fd4GTkakrw',
    username: process.env.DB_USER || 'Fd4GTkakrw',
    password: process.env.DB_PASS || '4QxYx7HOZU',
    host: process.env.DB_HOST || 'remotemysql.com',
    raw: true
  }
  const { Agent, Metric } = await db(config).catch(handleFatalError)
  const agent = await Agent.createOrUpdate({
    uuid: 'yyy',
    name: 'test',
    username: 'test',
    hostname: 'test',
    pid: 1,
    connected: true
  }).catch(handleFatalError)

  console.log('--Agent created--')
  console.log(agent)
  const agents = await Agent.findAll().catch(handleFatalError)
  console.log('--All Agents--')
  console.log(agents)

  const metrics = await Metric.findByAgentUuid(agent.uuid)
  console.log('--metrics---')
  console.log(metrics)

  const createMetric = await Metric.create(agent.uuid, {
    type: 'memory',
    value: '300'
  }).catch(handleFatalError)

  const metricsByType = await Metric.findByTypeAgentUuid('memory', agent.uuid)
  console.log('--metrics by type--')
  console.log(metricsByType)

}

function handleFatalError (err) {
  console.error(err.message)
  console.error(err.stack)
  process.exit(1)
}

run().then(() => console.log('Finish'))
