var human = {}
  , names = []
  , skips = []

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
 * Returns the level of the provided `chunk`.
 */
function getLevel(chunk) {
  var matches = /"level":"([^\"]*)"/.exec(chunk)
  return matches ? matches[1] : null
}

/**
 * Returns the name of the provided `chunk`'s Mill.
 */
function getMill(chunk) {
  var matches = /"mill":"([^\"]*)"/.exec(chunk)
  return matches ? matches[1] : null
}

/**
 * Write the provided `chunk`.
 */
human.write = write
function write(chunk) {
  var level = getLevel(chunk)
    , mill = getMill(chunk)

  if (!level || !mill) {
    return
  }

  switch (level) {
  case 'debug':
    if (shouldDebug(mill)) {
      process.stdout.write(chunk)
    }
    break
  case 'info':
  case 'warn':
    process.stdout.write(chunk)
    break
  case 'error':
    process.stderr.write(chunk)
    break
  }
}

module.exports = human
