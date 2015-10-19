# Irregex

This is a regular expression engine written in javascript. My goal here is to play around with parser generators. I'll try writing a yacc syntax for regular expressions that parses a regular expression into an abstract syntax tree.

## Usage

This will used the same way as the javasript regex constructor:

```javascript
var matcher = new Irregex(regularExpression, flags);

var match = matcher.exec(string);
```