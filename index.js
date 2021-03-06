'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const loki = require('lokijs');

module.exports = function main (options, cb) {
  // Set default options
  const ready = cb || function () {}
  const opts = Object.assign({
    // Default options
  }, options)

  // Server state
  let server
  let serverStarted = false
  let serverClosing = false

  // Setup error handling
  function unhandledError (err) {
	  // Log the errors
	  console.error(err)

    // Only clean up once
    if (serverClosing) {
      return
    }
    serverClosing = true

    // If server has started, close it down
    if (serverStarted) {
      server.close(function () {
        process.exit(1)
      })
    }
  }
  process.on('uncaughtException', unhandledError)
  process.on('unhandledRejection', unhandledError)

  // Create the express app
  const app = express()

    let col
    const data = new loki('./data/main.json', {
      verbose: true,
      autoload: true,
      autoloadCallback: load => {
        // col = load.getCollection('users')
      }
    });
    col = data.getCollection('users');
    console.log(col)
    if (col == null) {
      col = data.addCollection('users', {
        unique: ['id']
      });
      col.insert({
        id: 1,
        username: "dawid",
        password: "test"
      });
      col.insert({
        id: 2,
        username: "test2",
        password: "lol"
      });
      data.saveDatabase(err => {
        if (err) console.log(err);
        else console.log("Db saved")
      });
    }
    //
    app.set('col', col);
    app.set('data', data);

    // Common middleware
  // app.use(/* ... */)
  app.use(bodyParser.json());

  // Register routes
  // @NOTE: require here because this ensures that even syntax errors
  // or other startup related errors are caught logged and debuggable.
  // Alternativly, you could setup external log handling for startup
  // errors and handle them outside the node process.  I find this is
  // better because it works out of the box even in local development.
  require('./routes')(app, opts)

  // Common error handlers
  app.use(function fourOhFourHandler (req, res) {
    res.status(404).json({
      messages: [{
        code: 'NotFound',
        message: `Route not found: ${req.url}`,
        level: 'warning'
      }]
    })
  });

  app.use(function fiveHundredHandler (err, req, res, next) {
    console.error(err);
    res.status(500).json({
      messages: [{
        code: err.code || 'InternalServerError',
        message: err.message,
        level: 'error'
      }]
    })
  });

  // Start server
  server = app.listen(opts.port, opts.host, function (err) {
    if (err) {
      return ready(err, app, server)
    }

    // If some other error means we should close
    if (serverClosing) {
      return ready(new Error('Server was closed before it could start'))
    }

    serverStarted = true
    const addr = server.address()
    console.log(`Started at ${opts.host || addr.host || 'localhost'}:${addr.port}`)
    ready(err, app, server)
  })
}
