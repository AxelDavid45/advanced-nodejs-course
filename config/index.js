'use strict'
module.exports = function configs (setup = true, debug) {
  const config = {
    dialect: 'mysql',
    database: process.env.DB_NAME || 'Fd4GTkakrw',
    username: process.env.DB_USER || 'Fd4GTkakrw',
    password: process.env.DB_PASS || '4QxYx7HOZU',
    host: process.env.DB_HOST || 'remotemysql.com',
    logging: query => debug(query),
    auth: {
      secret: process.env.SECRET || 'platzi',
      algorithms: ['HS256']
    }
  }

  if (setup) {
    config.setup = true
  }
  return config
}
