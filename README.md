# int24

[![Build Status](https://travis-ci.org/matanamir/int24.png)](https://travis-ci.org/matanamir/int24)

int24 is a simple utility library for serializing 24-bit integers.

## Why is this useful?

A really good question.  Probably not very useful to most people.  I needed this for work I'm doing in Node.js with the
Hadoop Writable serialization (e.g. VLong), so I figured I'd share what I used.

## Example

```js
var int24 = require('int24');

var buf = new Buffer(3); //  3 byte Buffer
int24.writeUInt24BE(buf, 0, 16777215); // writes out 0xFFFFFF to the buffer at offset 0

var val;
var buf = new Buffer([0x01, 0x02, 0x03]);
val = int24.readInt24LE(buf, 0); // 197121
val = int24.readInt24BE(buf, 0); // 66051
```

## Install

```
npm install int24
```

## Tests

```
npm test
```

## License

MIT License
