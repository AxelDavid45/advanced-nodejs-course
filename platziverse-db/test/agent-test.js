'use strict'
const { expect } = require('chai')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const agentFixtures = require('./fixtures/agent')

let db = null
const id = 1
// Test db configurations
const config = {
  dialect: 'sqlite',
  pool: {
    max: 10,
    min: 0,
    idle: 10000
  },
  query: {
    raw: true
  }
}

// Creating stubs to use instead the original objects
const MetricStub = {
  belongsTo: sinon.spy()
}

// Create the stubs for the AgentModel, every time we run a new test we need a new stub
let AgentModelStub = null
let sandBox = null

// Create a copy of the single fixture
const single = Object.assign({}, agentFixtures.single)
// Create the uuidArguments to filter
const uuid = 'yyy-yyy-yyy'
const uuidFilter = {
  where: {
    uuid
  }
}
const connectedFilter = {
  where: {
    connected: true
  }
}
const username = 'platzi'
const usernameFilter = {
  where: {
    username
  }
}

// Create the mock for the new agent with different uuid
const newAgent = Object.assign({}, single)
newAgent.uuid = 'xpx-xpx-xpx'

describe('Agent service', function () {
  beforeEach(async function () {
    sandBox = sinon.createSandbox()

    // Create the stub of the model
    AgentModelStub = {
      hasMany: sandBox.spy()
    }

    // Set up the function in the model filterById
    AgentModelStub.findById = sandBox.stub()
    AgentModelStub.findById.withArgs(id).returns(Promise.resolve(agentFixtures.byId(id)))

    // Create the stub in the model for the function findOne
    AgentModelStub.findOne = sandBox.stub()
    AgentModelStub.findOne.withArgs(uuidFilter).returns(Promise.resolve(agentFixtures.byUuid(uuid)))
    AgentModelStub.findOne.withArgs(uuid).returns(Promise.resolve(agentFixtures.byUuid(uuid)))
    AgentModelStub.findOne.withArgs(usernameFilter).returns(Promise.resolve(agentFixtures.platzi))

    // Create the update stub function in the model
    AgentModelStub.update = sandBox.stub()
    AgentModelStub.update.withArgs(single, uuidFilter).returns(Promise.resolve(single))

    // Create the create stub function in the model
    AgentModelStub.create = sandBox.stub()
    AgentModelStub.create.withArgs(newAgent).returns(Promise.resolve({
      toJSON: () => newAgent
    }))

    // Creating the findAll stub function in the model
    AgentModelStub.findAll = sandBox.stub()
    AgentModelStub.findAll.withArgs().returns(Promise.resolve(agentFixtures.all))
    AgentModelStub.findAll.withArgs(connectedFilter).returns(Promise.resolve(agentFixtures.connected))

    // Creating the findByUuid stub function in the model
    AgentModelStub.findByUuid = sandBox.stub()
    AgentModelStub.findByUuid.withArgs(uuid).returns(Promise.resolve(agentFixtures.byUuid(uuid)))

    // Replace the original models with the stubs
    const setupDatabase = proxyquire('../', {
      './models/agent': () => AgentModelStub,
      './models/metric': () => MetricStub
    })
    db = await setupDatabase(config)
  })

  afterEach(function () {
    // Restores the status of the stubs
    sandBox.restore()
  })

  it('Should return the AgentService', function () {
    expect(db).to.have.a.property('Agent')
  })

  it('should call the stub methods', function () {
    expect(AgentModelStub.hasMany.called).to.be.equal(true, 'Agent has many was executed')
    expect(MetricStub.belongsTo.called).to.be.equal(true, 'Metric belongs to was executed')
    expect(MetricStub.belongsTo.calledWith(AgentModelStub)).to.be
      .equal(true, 'Argument should be AgentModel')
    expect(AgentModelStub.hasMany.calledWith(MetricStub)).to.be
      .equal(true, 'Argument should be MetricModel')
  })

  it('Agent#FilterById should return the same data', async function () {
    const agent = await db.Agent.filterById(id)
    expect(AgentModelStub.findById.called).equal(true, 'Should  call the method in the model')
    expect(AgentModelStub.findById.calledOnce).equal(true, 'Should only call once the method')
    expect(AgentModelStub.findById.calledWith(id))
      .equal(true, 'It should call the method with the custom id')
    expect(agent).to.be.deep.equal(agentFixtures.byId(id))
  })

  it('Agent#CreateOrUpdate method - exists', async function () {
    const create = await db.Agent.createOrUpdate(single)
    expect(AgentModelStub.findOne.calledTwice).equal(true, 'Should call the function twice')
    expect(AgentModelStub.findOne.calledWith(uuidFilter))
      .equal(true, 'Should call the function with the uuid args')
    expect(AgentModelStub.update.calledOnce).equal(true, 'Should call the function once')
    expect(AgentModelStub.update.calledWith(single))
      .equal(true, 'Should call the function with the single agent fixture')

    expect(create).deep.equal(single, 'Should be the same data')
  })

  it('Agent#createOrUpdate - create one', async function () {
    const create = await db.Agent.createOrUpdate(newAgent)
    expect(AgentModelStub.findOne.calledOnce).equal(true, 'Should only call once the function')
    expect(AgentModelStub.findOne.calledWith({ where: { uuid: newAgent.uuid } }))
      .equal(true, 'Should call the function with the uuid of the new Agent')
    expect(create).deep.equal(newAgent, 'Should be the same data')
  })

  it('Agent#findAll should return all Agents', async function () {
    const result = await db.Agent.findAll()
    expect(AgentModelStub.findAll.calledOnce).equal(true, 'Should call once the function')
    expect(AgentModelStub.findAll.calledWith()).equal(true)
    expect(result).deep.equals(agentFixtures.all, 'Should return all the agents')
  })

  it('Agent#findByuui should return only an Agent', async function () {
    const result = await db.Agent.findByUuid(uuid)
    expect(AgentModelStub.findOne.calledOnce).equal(true, 'Should only call once the function')
    expect(AgentModelStub.findOne.calledWith(uuidFilter))
      .equal(true, 'Should call the function with the predefine uuid')
    expect(result).deep.equals(agentFixtures.byUuid(uuid))
  })

  it('Agent#findConnected should response with the agents connected', async function () {
    const result = await db.Agent.findConnected()
    expect(AgentModelStub.findAll.calledOnce)
      .equal(true, 'Should call the function once')
    expect(AgentModelStub.findAll.calledWith(connectedFilter))
      .equal(true, 'Should call the function with the connected filter')
    expect(result).deep.equals(agentFixtures.connected)
  })

  it('Agent#findByUsername should return an agent', async function () {
    const result = await db.Agent.findByUsername(username)
    expect(AgentModelStub.findOne.calledOnce)
      .equal(true, 'Should only call once the filter')
    expect(AgentModelStub.findOne.calledWith(usernameFilter))
      .equal(true, 'Should call the function with the predefine filter')
    expect(result).deep.equals(agentFixtures.platzi)
  })
})
