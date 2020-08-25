'use strict'
// This suite of tests are part of the integration test
const request = require('supertest')
const agentFixtures = require('./fixtures/agent')
const sinon = require('sinon')
const proxyquire = require('proxyquire').noPreserveCache()
const expect = require('chai').expect
// Globals
let sandbox = null
let apiStub = null
let server = null
let dbStub = null
const AgentStub = {}
const MetricStub = {}

beforeEach(function () {
  sandbox = sinon.createSandbox()
  dbStub = sandbox.stub()
  dbStub.resolves({
    Agent: AgentStub,
    Metric: MetricStub
  })

  AgentStub.findConnected = sandbox.stub()
  AgentStub.findConnected.resolves(agentFixtures.connected)

  apiStub = proxyquire('../api', {
    'platziverse-db': dbStub
  })

  server = proxyquire('../server', {
    './api': apiStub
  })
})

afterEach(function () {
  sandbox.restore()
})

describe('Testing API', function () {
  it('API should response with 200 and JSON content', async function () {
    const response = await request(server).get('/api/agents')
    expect(response.statusCode)
      .equal(200, 'Should response with 200')
    expect(response.headers['content-type'])
      .match(/json/, 'The response should be json')
  })

  it('should response with the connected agents', async function () {
    const response = await request(server).get('/api/agents')
    const expected = JSON.stringify(agentFixtures.connected)
    expect(response.statusCode).equal(200)
    expect(JSON.stringify(response.body)).equal(expected)
  })
})
