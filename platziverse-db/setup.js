'use strict'
const db = require('./')
const inquirer = require('inquirer')
const configSetup = require('../config')
const debug = require('debug')('platziverse:db:setup')

async function setup () {
  const answer = await inquirer.prompt([{
    type: 'confirm',
    name: 'setup',
    message: 'This will overwrite the database and destroy your data, are you sure?'
  }])
  if (!answer.setup) {
    return console.log('Ok, everything is all right')
  }
  /**
   * Creates the config object to start the configuration process.
   */
  const config = configSetup(true, debug)
  /**
   * Waits until the configuration process ends, if there's an error, it will be captured
   */
  await db(config).catch(fatalError)
  console.log('Setup completed')
  process.exit(0)
}

/**
 * Handles the error if exists
 * @param err
 */
function fatalError (err) {
  console.error(err.message)
  console.error(err.stack)
  process.exit(1)
}

setup()
