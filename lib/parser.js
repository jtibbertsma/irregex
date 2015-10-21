// Define the lexer and set the generated parser's lexer attribute

var parser = require('./generatedParser').parser;
parser.lexer = new Lexer();
module.exports = parser;

function Lexer() {
  var text, pos, state, groupDepth = 0;
  this.yytext = '';
  this.yylineno = 0;

  var normalLex     = _normalLex.bind(this),
      rangeLex      = _rangeLex.bind(this),
      groupBeginLex = _groupBeginLex.bind(this),
      groupLex      = _groupLex.bind(this)
      subroutineLex = _subroutineLex.bind(this);

  this.setInput = function (input) {
    text = input;
    pos = 0;
    state = 'NORMAL';
  };

  this.lex = function () {
    if (pos >= text.length) {
      return 'tEND';
    }
    
    switch (state) {
      case 'NORMAL':
        return normalLex();
      case 'RANGE':
        return rangeLex();
      case 'GROUP_BEGIN':
        return groupBeginLex();
      case 'GROUP':
        return groupLex();
      case 'SUBROUTINE':
        return subroutineLex();
      default:
        throw 'Error: weird lexer state -- ' + state;
    }
  };

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

      case '(':
        res = c;
        state = 'GROUP_BEGIN';
        ++groupDepth;
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
  // We're lexing inside if a { } range. We should only find commas and
  // tNUMs until we hit the '}'.
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
      // let the parser hit a syntax error
      return 'tCHAR';
    }

    // should be an int
    this.yytext = lexInt();
    return 'tNUM';
  }

  // state: GROUP_BEGIN
  // We just entered a group, so try to find special ? syntax.
  function _groupBeginLex() {
    if (text[pos] === '?') {
      var c = text[++pos], res;
      switch (c) {
        case ':':
          res = 'tNOCAPTURE';
          break;

        case '>':
          res = 'tATOMIC';
          break;

        default:
          // Only found a question mark; this should be a subroutine call
          state = 'SUBROUTINE';
          return '?'; 
      }
      ++pos;
      state = 'GROUP';
      return res;
    } else {
      // It's a normal capture group
      state = 'GROUP';
      return groupLex();
    }
  }

  // state: GROUP
  // Same as NORMAL, but look for closing parens. Outside of a group, we
  // return tCHAR or TCHARLIT for a closing paren.
  function _groupLex() {
    if (text[pos] === ')') {
      ++pos;
      state = --groupDepth === 0 ? 'NORMAL' : 'GROUP';
      return ')';
    }

    return normalLex();
  }

  // state: SUBROUTINE
  // We just lexed a '?' token at the beginning of a group. Theres either
  // a tNUM or 'R' here, or it's a syntax error
  function _subroutineLex() {
    var res;
    if (text[pos] === 'R') {
      ++pos;
      res = 'R';
    } else if (text[pos] === '0') {
      // Don't lex a number starting with 0
      // (?0) is allowed but not something like (?02)
      ++pos;
      this.yytext = '0';
      res = 'tNUM';
    } else if (isNum(text[pos])) {
      this.yytext = lexInt();
      res = 'tNUM';
    }
    state = 'GROUP';
    return res || 'tCHAR';
  }

  // pos should be the index of the int, and we should know that the
  // first character is a number and is not 0.
  function lexInt() {
    var len = 1, start = pos++;
    while (isNum(text[pos])) {
      ++pos; ++len;
    }
    return text.slice(start, start + len);
  }
}