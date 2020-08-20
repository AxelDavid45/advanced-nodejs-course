'use strict'
module.exports = function setupAgent (AgentModel) {
  async function createOrUpdate (agent) {
    const filter = {
      where: {
        uuid: agent.uuid
      }
    }

    const existsAgent = AgentModel.findOne(filter)

    if (existsAgent) {
      const updated = AgentModel.update(agent, filter)
      return updated ? AgentModel.findOne(filter) : existsAgent
    }

    const result = AgentModel.create(agent)
    return result.toJSON()
  }

  function filterById (id) {
    return AgentModel.findById(id)
  }

  return {
    filterById,
    createOrUpdate
  }
}
