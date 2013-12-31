var path = require('path')
  , nexpect = require('nexpect')
  , once = require('once-later')

function nspawn(script) {
  return nexpect.spawn('node ' + path.resolve(__dirname, 'fixtures', script + '.js'))
}

module.exports = {
  'Sawmill Scripts:': {
    'defaults': function (done) {
      done = once(done)
      nspawn('defaults')
        .expect('This is an info message')
        .expect('This is a warn message')
        .expect('This is an error message')
        .run(done)
    },
    'multiple': function (done) {
      done = once(done)
      nspawn('multiple')
        .expect('This is a debug message')
        .expect('This is an info message')
        .expect('This is an info message')
        .expect('This is a warn message')
        .expect('This is a warn message')
        .expect('This is a warn message')
        .expect('This is an error message')
        .expect('This is an error message')
        .expect('This is an error message')
        .expect('This is an error message')
        .run(done)
    },
    'human': {
      'no environment': null,
      'NODE_ENV=development': null,
      'NODE_ENV=production': null,
      'DEBUG=*': null,
      'DEBUG=fixtures:*': null,
      'DEBUG=nothing': null
    }
  }
}
