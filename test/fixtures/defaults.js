var mill = require('../..').createMill('fixtures:defaults')

mill.add('stdout', process.stdout)

mill.debug('This is a debug message')
mill.info('This is an info message')
mill.warn('This is a warn message')
mill.error('This is an error message')
