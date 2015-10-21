// Define the lexer and set the generated parser's lexer attribute

var parser = require('./generatedParser').parser;
parser.lexer = new Lexer();
module.exports = parser;

function Lexer() {
  var text, pos, state;
  this.yytext = '';
  this.yylineno = 0;

  function isRepChar(ch) {
    return ch === '*' || ch === '+' || ch === '?' || ch === '{';
  }

  this.setInput = function (input) {
    text = input;
    pos = 0;
    state = 'NORMAL';
  };

  this.lex = function () {
    if (pos === text.length) {
      return 'tEND';
    }
    var c = text[pos++], res;
    this.yytext = c;

    switch (c) {
      case '|': case '*': case '+': case '?':
        res = c;
        break;

      default:
        if (isRepChar(text[pos]))
          res = 'tCHAR';
        else
          res = 'tCHARLIT';
    }
    return res;
  };
}