var Matcher = require('./matcher');
var op = require('./opcodes');

module.exports = compile;

function compile(syntaxTree) {
  var opcodes = [];

  compileTree(syntaxTree, 0);
  return new Matcher(opcodes);

  function compileTree(tree, depth) {
    for (var i = 0; i < tree.length; ++i) {
      if (i + 1 !== tree.length) {
        // alternation
      }
      compileBranch(tree[i], depth);
    }
  }

  function compileBranch(branch, depth) {
    for (var i = 0; i < branch.length; ++i) {
      var node = branch[i];

      switch (node.type) {
        case 'LITERAL':
          opcodes.push([op.literal, node.value]);
          break;
      }
    }
  } 
}