const config = require('../config/default')

const knex = require('knex')({
  client: 'mysql',
  connection: config.database
})

const db = require('bookshelf')(knex)

db.plugin(['pagination', 'visibility', 'bookshelf-camelcase'])

module.exports = db