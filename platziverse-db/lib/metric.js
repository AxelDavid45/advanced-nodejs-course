'use strict'
module.exports = function setupMetric (MetricModel, AgentModel) {
  // TODO create test for this module
  async function create (uuid, metric) {
    // Search the agent to obtain the id
    const agent = await AgentModel.findOne({
      where: { uuid }
    })

    if (agent) {
      //  Assign the id to the metric to create a  relation in the tables
      Object.assign(metric, { agentId: agent.id })
      // Create the metric and return the result
      const created = await MetricModel.create(metric)
      return created.toJSON()
    }
  }

  async function findByAgentUuid (uuid) {
    return MetricModel.findAll({
      attributes: ['type'],
      group: ['type'],
      include: [
        {
          attributes: [],
          model: AgentModel,
          where: {
            uuid
          }
        }
      ],
      raw: true
    })
  }

  async function findByTypeAgentUuid (type, uuid) {
    return MetricModel.findOne({
      attributes: ['id', 'type', 'value', 'createdAt'],
      where: {
        type
      },
      limit: 20,
      order: [['createdAt', 'DESC']],
      include: [{
        attributes: [],
        model: AgentModel,
        where: {
          uuid
        }
      }],
      raw: true
    })
  }

  return {
    create,
    findByAgentUuid,
    findByTypeAgentUuid
  }
}
