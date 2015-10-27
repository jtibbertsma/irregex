var op = require('./opcodes');

module.exports = Matcher;

function Matcher(opcodes) {
  this.opcodes = opcodes;
}

Matcher.prototype = {
  doMatch: function (string, start) {
    var pos = start,
        res = [],
        opInd = 0,
        opcodes = this.opcodes;

    doNextOp();
    return res;

    function doNextOp() {
      
    }
  }
};