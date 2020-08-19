'use strict'
const { expect } = require('chai')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

let db = null
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
let MetricStub = {
  belongsTo: function () {}
}

// Create the stubs for the AgentModel, every time we run a new test we need a new stub
let AgentStub = null

beforeEach(async function () {
  AgentStub = {
    hasMany: function () {}
  }

  const setupDatabase = proxyquire('../', {
    './models/agent': () => AgentStub,
    './models/metric': () => MetricStub
  })

  db = await setupDatabase(config)
})

describe('Agent service', function () {
  it('should exist agent in the api', function () {
    expect(db).to.have.a.property('Agent')
  })
})
