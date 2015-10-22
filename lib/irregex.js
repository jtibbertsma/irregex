var parser = require('./parser');
var compile = require('./compile');

module.exports = Irregex;

function Irregex(expr, flags) {
  // TODO: do something with the flags
  var syntaxTree = parser.parse(expr);
  this.matcher = compile(syntaxTree);
}

Irregex.prototype = {
  exec: function (string) {
    for (var i = 0; i < string.length; ++i) {
      var match = this.matcher.doMatch(string, i);
      if (match) {
        return match;
      }
    }
    return null;
  }
};