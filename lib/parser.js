// Define the lexer and set the generated parser's lexer attribute

var parser = require('./generatedParser').parser;
parser.lexer = new Lexer();
module.exports = parser;

function Lexer() {
  var text, pos, state;
  this.yytext = '';
  this.yylineno = 0;

  var normalLex = _normalLex.bind(this),
      rangeLex = _rangeLex.bind(this);

  function isRepChar(ch) {
    return ch === '*' || ch === '+' || ch === '?' || ch === '{';
  }

  function isNum(ch) {
    return ch >= '0' && ch <= '9';
  }

  // state: NORMAL
  function _normalLex() {
    var c = text[pos++], res;
    this.yytext = c;

    switch (c) {
      case '{':
        state = 'RANGE';
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
  }

  // state: RANGE
  function _rangeLex() {
    var c = text[pos], len = 0;

    if (c === ',') {
      ++pos;
      return c;
    } else if (c === '}') {
      ++pos;
      state = 'NORMAL';
      return c;
    } else if (!(isNum(c) && c !== '0')) {
      // parse error
      return 'tCHAR';
    }

    // should be an int
    var num = lexInt();
    this.yytext = num;
    return 'tNUM';
  }

  function lexInt() {
    var len = 1, start = pos++;
    while (isNum(text[pos])) {
      ++pos; ++len;
    }
    return text.slice(start, start + len);
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
    
    switch (state) {
      case 'NORMAL':
        return normalLex();
      case 'RANGE':
        return rangeLex();
      default:
        throw 'weird parser state';
    }
  };
}