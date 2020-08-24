'use strict'
// This suite of tests are part of the integration test
const request = require('supertest')
const expect = require('chai').expect
const server = require('../server')
describe('Testing API', function () {
  it('API should response with 200 and JSON content', async function () {
    const response = await request(server).get('/api/agents')
    expect(response.statusCode)
      .equal(200, 'Should response with 200')
    expect(response.headers['content-type'])
      .match(/json/, 'The response should be json')
    expect(response.body)
      .deep.equals({}, 'Should response with empty body')
  })
})
