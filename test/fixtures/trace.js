var mill = require('../..').createMill('fixtures:trace')

mill.add('stdout', process.stdout, 'debug')

mill.trace('Trace message')
