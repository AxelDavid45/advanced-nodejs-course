'use strict'
const agent = {
  id: 1,
  uuid: 'yyy-yyy-yyy',
  name: 'fixture',
  username: 'platzi',
  hostname: 'test-host',
  pid: 0,
  connected: true,
  createdAt: new Date(),
  updatedAt: new Date()
}

const agents = [
  agent,
  extend(agent, { id: 2, uuid: 'yyy-yyy-yyw', connected: false, username: 'test' }),
  extend(agent, { id: 3, uuid: 'yyy-yyy-yya', connected: true, username: 'platzi' }),
  extend(agent, { id: 4, uuid: 'aay-yyy-yyw', connected: false, username: 'test' })
]

function extend (obj, properties) {
  const clone = Object.assign({}, obj)
  return Object.assign(clone, properties)
}

module.exports = {
  single: agent,
  all: agents,
  connected: agents.filter(i => i.connected),
  platzi: agents.filter(i => i.username === 'platzi'),
  byUuid: uuid => agents.filter(i => i.uuid === uuid).shift(),
  byId: id => agents.filter(i => i.id === id)
}
