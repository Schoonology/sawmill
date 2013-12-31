var names = []
  , skips = []

// Generating the names and skips RegExp Arrays just like granddaddy debug
// used to do (and still does, hopefully).
(process.env.DEBUG || '')
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
