// Define the lexer and set the generated parser's lexer attribute

var parser = require('./_parser').parser;
parser.lexer = new Lexer();
module.exports = parser;

function Lexer() {
  var text, pos, state;
  this.yytext = '';

  this.setInput = function (input) {
    text = input;
    pos = 0;
    state = 'NORMAL';
  };

  this.lex = function () {
    this.yylval = null;
    if (pos === text.length) {
      return 'tEND';
    }
    this.yytext = text[pos++];
    return 'tCHAR';
  };
}