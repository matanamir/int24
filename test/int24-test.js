var test = require('tap').test,
    assert = require('assert'),
    int24 = require('../int24.js')(assert);

process.on('uncaughtException', function(err) {
    console.log('Uncaught exception: ' + err);
    process.exit(-1);
});

test('writeUInt24BE', function(t) {
    write_uint_compare(t, true, 0, '000000', 'writeUInt24BE: Min value (0) should be written in BE format.');
    write_uint_compare(t, true, 12345678, 'bc614e', 'writeUInt24BE: Writes 3 bytes in proper BE format.');
    write_uint_compare(t, true, 16777215, 'ffffff', 'writeUInt24BE: Max value (ffffff) should be written in BE format.');
    t.end();
});

test('writeUInt24LE', function(t) {
    write_uint_compare(t, false, 0, '000000', 'writeUInt24LE: Min value (0) should be written in LE format.');
    write_uint_compare(t, false, 12345678, '4e61bc', 'writeUInt24LE: Writes 3 bytes in proper LE format.');
    write_uint_compare(t, false, 16777215, 'ffffff', 'writeUInt24LE: Max value (16777215) should be written in LE format.');
    t.end();
});

test('writeInt24BE', function(t) {
    write_int_compare(t, true, -8388607, '800001', 'writeInt24BE: Min value (-8388607) should be written in BE format.');
    write_int_compare(t, true, 1234567, '12d687', 'writeInt24BE: Writes 3 bytes in the proper BE format.');
    write_int_compare(t, true, 8388607, '7fffff', 'writeInt24BE: Max value (8388607) should be written in BE format.');
    t.end();
});

test('writeInt24LE', function(t) {
    write_int_compare(t, false, -8388607, '010080', 'writeInt24LE: Min value (-8388607) should be written in LE format.');
    write_int_compare(t, false, 1234567, '87d612', 'writeInt24LE: Writes 3 bytes in the proper LE format.');
    write_int_compare(t, false, 8388607, 'ffff7f', 'writeInt24LE: Max value (8388607) should be written in LE format.');
    t.end();
});

test('readUInt24BE', function(t) {
    read_uint_compare(t, true, 0, '000000', 'readUInt24BE: Min value (0) should be read in BE format.');
    read_uint_compare(t, true, 12345678, 'bc614e', 'readUInt24BE: Reads 3 bytes in proper BE format.');
    read_uint_compare(t, true, 16777215, 'ffffff', 'readUInt24BE: Max value (ffffff) should be read in BE format.');
    t.end();
});

test('readUInt24LE', function(t) {
    read_uint_compare(t, false, 0, '000000', 'readUInt24LE: Min value (0) should be read in LE format.');
    read_uint_compare(t, false, 12345678, '4e61bc', 'readUInt24LE: Reads 3 bytes in proper LE format.');
    read_uint_compare(t, false, 16777215, 'ffffff', 'readUInt24LE: Max value (ffffff) should be read in LE format.');
    t.end();
});

test('readInt24BE', function(t) {
    read_int_compare(t, true, -8388607, '800001', 'readInt24BE: Min value (-8388607) should be read in BE format.');
    read_int_compare(t, true, 1234567, '12d687', 'readInt24BE: Reads 3 bytes in the proper BE format.');
    read_int_compare(t, true, 8388607, '7fffff', 'readInt24BE: Max value (8388607) should be read in BE format.');
    t.end();
});

test('readInt24LE', function(t) {
    read_int_compare(t, false, -8388607, '010080', 'readInt24LE: Min value (-8388607) should be read in LE format.');
    read_int_compare(t, false, 1234567, '87d612', 'readInt24LE: Reads 3 bytes in the proper LE format.');
    read_int_compare(t, false, 8388607, 'ffff7f', 'readInt24LE: Max value (8388607) should be read in LE format.');
    t.end();
});

function write_uint_compare(t, isBE, val, hex, message) {
    var buf = new Buffer(3);
    (isBE) ? int24.writeUInt24BE(buf, 0, val) : int24.writeUInt24LE(buf, 0, val);
    t.equal(buf.toString('hex'), hex, message);
}

function write_int_compare(t, isBE, val, hex, message) {
    var buf = new Buffer(3);
    (isBE) ? int24.writeInt24BE(buf, 0, val) : int24.writeInt24LE(buf, 0, val);
    t.equal(buf.toString('hex'), hex, message);
}

function read_uint_compare(t, isBE, val, hex, message) {
    var buf = new Buffer(hex, 'hex'),
        read_val = (isBE) ? int24.readUInt24BE(buf, 0) : int24.readUInt24LE(buf, 0);
    t.equal(read_val, val, message);
}

function read_int_compare(t, isBE, val, hex, message) {
    var buf = new Buffer(hex, 'hex'),
        read_val = (isBE) ? int24.readInt24BE(buf, 0) : int24.readInt24LE(buf, 0);
    t.equal(read_val, val, message);
}