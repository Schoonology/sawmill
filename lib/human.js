var util = require('util')
  , colors = require('colors')
  , human = {}
  , names = []
  , skips = []
  , SILENT = false
  , LevelColors

// We want to silence all output on production (where presumably daemonized with
// a log file) and in testing (where we'd be interfering with more useful
// output).
if (
  String(process.env.NODE_ENV).slice(0, 4) === 'prod' ||
  String(process.env.NODE_ENV).slice(0, 4) === 'test'
) {
  SILENT = true
}

// Theme.
LevelColors = {
  debug: 'blue',
  info: 'green',
  warn: 'yellow',
  error: 'red'
}

// Generating the names and skips RegExp Arrays just like granddaddy debug
// used to do (and still does, hopefully).
;(process.env.DEBUG || '')
  .split(/[\s,]+/)
  .forEach(function(name){
    name = name.replace('*', '.*?');
    if (name[0] === '-') {
      skips.push(new RegExp('^' + name.substr(1) + '$'));
    } else {
      names.push(new RegExp('^' + name + '$'));
    }
  });

/**
 * Returns true if `name` has been enabled with the DEBUG or NODE_ENV
 * environment variables, false otherwise.
 */
function shouldDebug(name) {
  var match

  if (String(process.env.NODE_ENV).slice(0, 3) === 'dev') {
    return true
  }

  match = skips.some(function (regex) {
    return regex.test(name)
  })

  if (match) {
    return false
  }

  match = names.some(function (regex) {
    return regex.test(name)
  })

  if (!match) {
    return false
  }

  return true
}

/**
 * Returns an appropriately-colored level name.
 */
function colorLevel(level) {
  level = String(level)
  return level[LevelColors[level]]
}

/**
 * Returns a formatted String from `body`.
 */
function format(body) {
  var level = colorLevel(body.level)
    , time = new Date(body.time).toLocaleTimeString()
    , message = body.message

  if (!body.message) {
    message = Object.keys(body)
      .filter(function (key) {
        return !(key === 'level' || key === 'time' || key === 'mill')
      })
      .reduce(function (obj, key) {
        obj[key] = body[key]
        return obj
      }, {})
    message = 'Object ' + util.inspect(message, { depth: null, colors: true })
  }

  return util.format('%s %s| %s: %s\n', String(body.mill).grey, time.grey, level, message)
}

/**
 * Write the provided `chunk`.
 */
human.write = write
function write(chunk) {
  var body = null
    , stream = null

  if (SILENT) {
    return
  }

  try {
    body = JSON.parse(chunk)
  } catch (e) {
    return
  }

  if (body.level === 'info' || body.level === 'warn') {
    stream = process.stdout
  } else if (body.level === 'error') {
    stream = process.stderr
  } else if (body.level === 'debug' && shouldDebug(body.mill)) {
    stream = process.stderr
  }

  stream && stream.write(format(body))
}

module.exports = human
