var mill = require('../..').createMill('fixtures:human')

mill.add('std', require('../..').human, 'debug')

mill.debug('This is a debug message')
mill.info('This is an info message')
mill.warn('This is a warn message')
mill.error('This is an error message')
