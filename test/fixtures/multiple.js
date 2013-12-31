var mill = require('../..').createMill('fixtures:multiple')

mill.add('stdout', process.stdout, 'debug')
mill.add('stdout', process.stdout, 'info')
mill.add('stdout', process.stdout, 'warn')
mill.add('stdout', process.stdout, 'error')

mill.debug('This is a debug message')
mill.info('This is an info message')
mill.warn('This is a warn message')
mill.error('This is an error message')
