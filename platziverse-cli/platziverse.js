'use strict'
const blessed = require('blessed')
const moment = require('moment')
const contrib = require('blessed-contrib')
const PlatziverseAgent = require('platziverse-agent')

const screen = blessed.screen({
  smartCSR: true
})
const agent = new PlatziverseAgent()
const agents = new Map()
const agentMetrics = new Map()
let extended = []
let selected = {
  uuid: null,
  type: null
}

// eslint-disable-next-line new-cap
const grid = new contrib.grid({
  rows: 1,
  cols: 4,
  screen
})

const tree = grid.set(0, 0, 1, 1, contrib.tree, {
  label: 'Connected Agents'
})

const line = grid.set(0, 1, 1, 3, contrib.line, {
  label: 'Metric',
  showLegend: true,
  minY: 0,
  xPadding: 5
})

screen.key(['escape', 'q', 'C-c'], (ch, key) => {
  process.exit(0)
})

function renderData () {
  const treeData = {}
  for (const [uuid, val] of agents) {
    const title = `${val.name} - (${val.pid})`
    treeData[title] = {
      uuid,
      agent: true,
      extended: extended.includes(uuid),
      children: {}
    }
    const metrics = agentMetrics.get(uuid)
    Object.keys(metrics).forEach(type => {
      const metric = {
        uuid,
        type,
        metric: true
      }
      const metricName = ` ${type}`
      treeData[title].children[metricName] = metric
    })
  }

  tree.setData({
    extended: true,
    children: treeData
  })
  screen.render()
}

function renderMetric () {
  if (!selected.uuid && !selected.type) {
    line.setData([{ x: [], y: [], title: '' }])
    screen.render()
    return
  }
  const metrics = agentMetrics.get(selected.uuid)
  const values = metrics[selected.type]
  const series = [{
    title: selected.type,
    x: values.map(v => v.timestamp).slice(-10),
    y: values.map(v => v.value).slice(-10)
  }]
  line.setData(series)
  screen.render()
  renderData()
}

agent.on('agent/connected', payload => {
  const { uuid } = payload.agent
  if (!agents.has(uuid)) {
    agents.set(uuid, payload.agent)
    agentMetrics.set(uuid, {})
  }
  renderData()
})

agent.on('agent/disconnected', payload => {
  const { uuid } = payload.agent
  if (agents.has(uuid)) {
    agents.delete(uuid)
    agentMetrics.delete(uuid)
  }
  renderData()
})

agent.on('agent/message', payload => {
  const { uuid } = payload.agent
  const { timestamp } = payload

  if (!agents.has(uuid)) {
    agents.set(uuid, payload.agent)
    agentMetrics.set(uuid, {})
  }
  const metrics = agentMetrics.get(uuid)
  payload.metrics.forEach((m) => {
    const { type, value } = m
    if (!Array.isArray(metrics[type])) {
      metrics[type] = []
    }
    const length = metrics[type].length
    if (length >= 20) {
      metrics[type].shift()
    }
    metrics[type].push({
      value,
      timestamp: moment(timestamp).format('HH:mm:ss')
    })
  })
  renderMetric()
})

tree.on('select', node => {
  const { uuid, type } = node
  if (node.agent) {
    node.extended ? extended.push(uuid) : extended = extended.filter(e => e !== uuid)
    selected.uuid = null
    selected.type = null
    return
  }
  selected.uuid = uuid
  selected.type = type
  renderMetric()
})
agent.connect()
tree.focus()
screen.render()
