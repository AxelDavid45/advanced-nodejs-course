'use strict'
const { expect } = require('chai')

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

beforeEach(async () => {
  const setupDatabase = require('../')
  db = await setupDatabase(config)
})

describe('Agent service', function () {
  it('should exist agent in the api', function () {
    expect(db).to.have.a.property('Agent')
  })
})
