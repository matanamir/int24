/**
 * Deal with 24-bit integer serialization
 */
module.exports = function(assert) {

    function int24() {}

    int24.readInt24BE = function(buf, offset) {
        return readInt24(buf, offset, true);
    };

    int24.readInt24LE = function(buf, offset) {
        return readInt24(buf, offset, false);
    };

    int24.readUInt24BE = function(buf, offset) {
        var val;
        val = buf[offset] << 16;
        val |= buf[offset + 1] << 8;
        val |= buf[offset + 2];
        return val;
    };

    int24.readUInt24LE = function(buf, offset) {
        var val;
        val = buf[offset + 2] << 16;
        val |= buf[offset + 1] << 8;
        val |= buf[offset];
        return val;
    };

    int24.writeUInt24BE = function(buf, offset, value) {
        verifuint(value, 0xffffff);
        buf[offset] = (value & 0xff0000) >>> 16;
        buf[offset + 1] = (value & 0x00ff00) >>> 8;
        buf[offset + 2] = value & 0x0000ff;
    };

    int24.writeUInt24LE = function(buf, offset, value) {
        verifuint(value, 0xffffff);
        buf[offset + 2] = (value & 0xff0000) >>> 16;
        buf[offset + 1] = (value & 0x00ff00) >>> 8;
        buf[offset] = value & 0x0000ff;
    };

    int24.writeInt24BE = function(buf, offset, value) {
        writeInt24(buf, offset, value, true);
    };

    int24.writeInt24LE = function(buf, offset, value) {
        writeInt24(buf, offset, value, false);
    };

    function writeInt24(buf, offset, value, isBE) {
        var func = (isBE) ? int24.writeUInt24BE : int24.writeUInt24LE;
        verifsint(value, 0x7fffff, -0x800000);
        if (value >= 0) {
            func(buf, offset, value);
        } else {
            func(buf, offset, 0xffffff + value + 1);
        }
    }

    function readInt24(buf, offset, isBE) {
        var func = (isBE) ? int24.readUInt24BE : int24.readUInt24LE,
            neg,
            val;
        val = func(buf, offset);
        neg = val & 0x800000;
        if (!neg) {
            return val;
        }
        return (0xffffff - val + 1) * -1;
    }

    /*
     * Useful for verifying number ranges
     * Credit: https://github.com/joyent/node/blob/v0.8.22-release/lib/buffer.js
     */
    function verifsint(value, max, min) {
        assert.ok(typeof (value) == 'number', 'cannot write a non-number as a number');
        assert.ok(value <= max, 'value larger than maximum allowed value');
        assert.ok(value >= min, 'value smaller than minimum allowed value');
        assert.ok(Math.floor(value) === value, 'value has a fractional component');
    }

    function verifuint(value, max) {
        assert.ok(typeof (value) == 'number', 'cannot write a non-number as a number');
        assert.ok(value >= 0, 'specified a negative value for writing an unsigned value');
        assert.ok(value <= max, 'value is larger than maximum value for type');
        assert.ok(Math.floor(value) === value, 'value has a fractional component');
    }

    return int24;

};