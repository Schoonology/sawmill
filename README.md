# Sawmill

On top of being a [delicious variety of gravy][gravy], a sawmill is the
destination for manly men and giant logs to float to, cutting the logs down to
size and sending them elsewhere on arrival. Whether you're a manly man or a
giant log, it is your destiny.

[gravy]: http://en.wikipedia.org/wiki/Gravy#Types

## Goals

 1. Predictability - The way this works should be tested and documented to the
 point that all side effects are predictable to users.
 1. Simplicity - Both the code and its use should be self-explanatory for the
 times I fail at #1 (of course I will).
 1. Streams - Where would we be without [log driving][driving]? Streams are
 definitely the best method of moving logs around.
 1. Fun - Let's face it: we spend a lot of time working on these applications.
 Shouldn't we have a little fun with it?

[driving]: http://en.wikipedia.org/wiki/Log_driving

## Installation

```
npm install --save sawmill
```

## Usage

_In general, usage follows that of `console`._ The major differences are around
our differing need: where `console` is always to `stdout` and `stderr`, we want
to support any stream, and need to provide resources for that.

Inspiration is also paid to [debug][] for its simplicity.

[debug]: https://github.com/visionmedia/debug

### Creating a Mill

First things first: create a "Mill" to collect logs. I recommend (much like
[debug][]) creating and naming the Mill on `require`:

```
var mill = require('sawmill').createMill('app:Server')
// Shortcut
var mill = require('sawmill')('app:Server')
```

### Logging

Once you have a Mill, it's time to send it logs. There are only two kinds of
logs Sawmill understands: Objects and Messages. You may only send one at a time,
and the delimiter is thus: _anything that is not of type "object" is a Message._

```
mill.log('Some message') // Send a Message to log level "info".
mill.info({ key: 'value' }) // Send an Object to log level "info".

mill.debug('This goes to log level "debug"')
mill.warn('Same for "warn"')
mill.error('Same for "error"')

mill.trace('This describes stuff') // Send a Message with a stack trace.
```

### Output Format

Both Objects and Messages are sent out as JSON. Messages are added as a
"message" key, while Objects are used wholesale. Additional values are _always_
added:

 * `mill`: The original name you gave the Mill. (Feel free to use `name` for
 your own dastardly purposes!)
 * `time`: The Date this log was received.
 * `level`: The level at which this log was received.

### Output Locations

Any Mill can have as many or few destinations as you like, configured with the
`add` and `remove` methods:

```
mill.add('stdout', process.stdout) // Name required!

mill.remove('stdout') // Peace and quiet.
```

Removing is always by name, and adding is by name and a [WritableStream][]. If
a third argument is provided to `add`, it is used to determine the _minimum_
log level for sending, inclusive:

```
mill.add('stderr', process.stderr, "error")
```

The current streams are accessible at `mill.streams` as an Array of Objects.
Each Object has three keys, `name`, `level`, and `stream`. Should be pretty
self-explanatory. Change at will.

[WritableStream]: http://nodejs.org/api/stream.html#stream_class_stream_writable

### Helpful Streams

These streams are provided to make working with Mills' output easier. They are
available on the root module (e.g. `require('sawmill').human`).

 * `human` - A batteries-included `console` logger. By default, "info" through
 "warn" are sent to `process.stdout`, while "error" is sent to `process.stderr`.
 If DEBUG is set, it is used as a filter and "debug" is sent as well. If
 NODE_ENV is set to "development", "debug" is sent, whereas setting NODE_ENV to
 "production" silences all log messages.

## Alternatives

There are _plenty_ of alternatives when it comes to logging, but the two best
alternatives are:

 * [Winston][] - Lots of available destinations. I've spent more time
 _fighting_ with Winston than I have _using_ it (although I've used it for
 major projects), but that's probably because of an integration problem with
 either me or some other library I chose. YMMV.
 * [Bunyan][] - A commonly-offered alternative, but too complicated for my
 taste. Comes with Dtrace support and an drool-worthy CLI tool for reading the
 JSON output.

[Winston]: https://github.com/flatiron/winston
[Bunyan]: https://github.com/trentm/node-bunyan
