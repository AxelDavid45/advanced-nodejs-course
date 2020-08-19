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
let AgentStub = null
let sandBox = null

// Create a copy of the single fixture
const single = Object.assign({}, agentFixtures.single)

describe('Agent service', function () {
  beforeEach(async function () {
    sandBox = sinon.createSandbox()
    AgentStub = {
      hasMany: sandBox.spy()
    }
    // Replace the original models with the stubs
    const setupDatabase = proxyquire('../', {
      './models/agent': () => AgentStub,
      './models/metric': () => MetricStub
    })
    db = await setupDatabase(config)
  })

  afterEach(function () {
    // Restores the status of the stubs
    sandBox.restore()
  })

  it('should exist agent in the api', function () {
    expect(db).to.have.a.property('Agent')
  })
  it('should call the stub methods', function () {
    expect(AgentStub.hasMany.called).to.be.equal(true)
    expect(MetricStub.belongsTo.called).to.be.equal(true)

  })

  it('should call the stub method with the stub objects', function () {
    expect(MetricStub.belongsTo.calledWith(AgentStub)).to.be.equal(true)
    expect(AgentStub.hasMany.calledWith(MetricStub)).to.be.equal(true)
  })

  it('Agent#FilterById should return the same data', async function () {
    const agent = db.Agent.filterById(id)
    expect(agent).to.be.deep.equal(agentFixtures.byId(id))
  })
})
