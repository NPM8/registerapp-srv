'use strict'
const simple = require('./handlers/simple')
const configured = require('./handlers/configured')
const addUser = require('./handlers/addUser')

module.exports = function (app, opts) {
  // Setup routes, middleware, and handlers
  app.get('/', simple)
  app.post('/add', addUser)
  app.post('/configured', configured(opts))
}
