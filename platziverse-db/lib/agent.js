'use strict'
module.exports = function setupAgent (AgentModel) {
  function filterById (id) {
    return AgentModel.findById(id)
  }

  return {
    filterById
  }
}
