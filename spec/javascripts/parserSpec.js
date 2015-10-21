describe("parser", function () {
  var parser = require('../../lib/parser');

  it('returns an array containing an empty array if an empty string is given', function () {
    expect(parser.parse('')).toEqual([[]]);
  });
});