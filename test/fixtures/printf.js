var mill = require('../..').createMill('fixtures:printf')

mill.add('stdout', process.stdout)

mill.info('Some parameters: %j', { foo: 'bar' })
mill.warn('Error-ish:', { details: 'oops' })
