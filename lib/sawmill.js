/*!
 * Sawmill is responsible for cutting up logs and sending them to downstream
 * destinations.
 */
var util = require('util')
  , LEVELS = ['error', 'warn', 'info', 'debug']

// Double the LEVELS array as a handy, dandy Object!
LEVELS.forEach(function (name, index) {
  LEVELS[name] = index
})

/**
 * Creates a new instance of Mill with the provided `name`.
 */
function Mill(name) {
  if (!(this instanceof Mill)) {
    return new Mill(name)
  }

  this.name = name || 'Unknown'
  this.streams = []
}
Mill.createMill = Mill

// Expose helpful, batteries-included streams
Mill.human = require('./human')

/**
 * Builds a complete body from the original arguments provided. If `args`
 * contains an Object, all enumerable keys are assigned to the new body.
 * Otherwise, it is used to build a Message using `util.format`, stored in the
 * body as "message".
 *
 * `mill`, `level`, and `time` are added to the new body before it is returned.
 */
Mill.prototype.createBody = createBody
function createBody(level, args) {
  var body = {}

  if (typeof args[0] === 'object') {
    util._extend(body, args[0])

    if (args[0] instanceof Error) {
      // The stack is not included automatically to avoid generating a stack
      // where possible. If desired, please create a vanilla Object with the
      // properties you want.
      ['name', 'message'].forEach(function (key) {
        body[key] = args[0][key]
      })
    }

    // If there's additional context available, add it as a message.
    if (args.length > 1) {
      args = Array.prototype.slice.call(args, 1)
    } else {
      args = []
    }
  }

  body.message = util.format.apply(util, args)

  // There's no need to flood the log with empty messages.
  if (!body.message) {
    delete body.message
  }

  body.mill = this.name
  body.time = new Date().toString()
  body.level = level

  return body
}

/**
 * Sends the provided `body` to all connected streams.
 */
Mill.prototype.send = send
function send(level, body) {
  this.streams.forEach(function (obj) {
    if (LEVELS[level] > LEVELS[obj.level]) {
      return
    }

    obj.stream.write(JSON.stringify(body) + '\n')
  })

  return this
}

/**
 * Sends the provided Message or Object to the appropriate log level.
 */
;['debug', 'info', 'warn', 'error']
  .forEach(function (level) {
    Mill.prototype[level] = function log() {
      return this.send(level, this.createBody(level, arguments))
    }
  })

// Alias for `log`.
Mill.prototype.log = Mill.prototype.info

/**
 * Sends the provided Message or Object along with an Array stack trace to the
 * "debug" log level.
 */
Mill.prototype.trace = trace
function trace() {
  var err = new Error()
    , stack
    , body

  Error.captureStackTrace(err, arguments.callee)

  stack = err.stack.replace(/    at /g, '').split('\n')
  stack.shift()

  body = this.createBody('debug', arguments)
  body.stack = stack

  return this.send('debug', body)
}

/**
 * Adds `stream` as `name` to the output streams at the provided `level`.
 */
Mill.prototype.add = add
function add(name, stream, level) {
  this.streams.push({
    name: name,
    stream: stream,
    level: level || 'info'
  })

  return this
}

/**
 * Removes the stream (or streams) with `name`.
 */
Mill.prototype.remove = remove
function remove(name) {
  var streams = this.streams

  streams.forEach(function (obj, index) {
    if (obj.name === name) {
      streams.splice(index, 1)
    }
  })
}

/*!
 * Export `Mill`.
 */
module.exports = Mill
