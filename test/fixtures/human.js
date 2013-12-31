var mill = require('../..').createMill('fixtures:human')

mill.add('std', require('../..').human, 'debug')

mill.debug('This is a debug message')
mill.info('This is an info message')
mill.warn('This is a warn message')
mill.error('This is an error message', { foo: 'bar' })
mill.info({ bar: 'baz', answer: 42, nest: { eggs: 2 } })
mill.info({ key: 'value' }, 'This time, with feeling!')
