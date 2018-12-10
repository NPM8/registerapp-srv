'use strict'
const simple = require('./handlers/simple')
const configured = require('./handlers/configured')
const addUser = require('./handlers/addUser')
const getUsers = require('./handlers/getUsers')
const getUser = require('./handlers/getUser')
const delUser = require('./handlers/delUser')

module.exports = function (app, opts) {
  // Setup routes, middleware, and handlers
  app.get('/', simple)
  app.post('/add', addUser)
  app.get('/get/users', getUsers)
  app.get('/get/:id', getUser)
  app.get('/del/:id', delUser)
  // app.get('/upadte/:id', )
  app.get('/configured', configured(opts))
}
