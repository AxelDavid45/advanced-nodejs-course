'use strict'
module.exports = function setupAgent (AgentModel) {
  async function createOrUpdate (agent) {
    const filter = {
      where: {
        uuid: agent.uuid
      }
    }

    const existsAgent = await AgentModel.findOne(filter)

    if (existsAgent) {
      const updated = await AgentModel.update(agent, filter)
      return updated ? await AgentModel.findOne(filter) : existsAgent
    }

    const result = await AgentModel.create(agent)
    return result.toJSON()
  }

  function filterById (id) {
    return AgentModel.findById(id)
  }

  function findAll () {
    return AgentModel.findAll()
  }

  function findByUuid (uuid) {
    return AgentModel.findOne({
      where: {
        uuid
      }
    })
  }

  function findConnected () {
    return AgentModel.findAll({
      where: {
        connected: true
      }
    })
  }

  function findByUsername (username) {
    return AgentModel.findOne({
      where: {
        username,
        connected: true
      }
    })
  }

  return {
    filterById,
    createOrUpdate,
    findAll,
    findByUsername,
    findByUuid,
    findConnected
  }
}
