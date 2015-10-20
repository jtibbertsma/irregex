describe("parser", function () {
  var parser = require('../../lib/parser');

  it('returns an empty array if an empty string is given', function () {
    expect(parser.parse('')).toEqual([]);
  });

  it('returns an array with a single character', function () {
    expect(parser.parse('a')).toEqual(['a']);
  });

  it('errors out on bad input', function () {
    expect(function () {
      parser.parse('ert');
    }).toThrow();
  });
});