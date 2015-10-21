describe("parser", function () {
  var parser = require('../../lib/parser');

  it('returns an array containing an empty array if an empty string is given', function () {
    expect(parser.parse('')).toEqual([[]]);
  });

  describe('literals', function () {

    it('should only generate one node for a literal string', function () {
      var tree = parser.parse('literal');
      expect(tree.length).toEqual(1);
      expect(tree[0].length).toEqual(1);
      expect(tree[0][0].value).toEqual("literal");
    });
  });

  describe('alternation', function () {

    it('generates multiple paths for alternation', function () {
      var tree = parser.parse('one|two|three');
      expect(tree.length).toEqual(3);
    });
  });

  describe('repetition', function () {
    var simpleTree;

    beforeEach(function () {
      simpleTree = parser.parse('abcd*')[0];
    });

    it('detects repetition', function () {
      var range = simpleTree[simpleTree.length-1].repetition.range;
      expect(range[0]).toEqual(0);
      expect(range[1]).toBeGreaterThan(100000);
    });

    it('detects modifiers', function () {
      expect(parser.parse('a??')[0][0].repetition.type).toEqual('lazy');
    });

    it('parses range notation', function () {
      var range = parser.parse('a{12,467}')[0][0].repetition.range;
      expect(range[0]).toEqual(12);
      expect(range[1]).toEqual(467);
    });

    describe('the lexer', function () {

      it('doesn\'t report a tCHARLIT just before a repetition symbol', function () {
        expect(simpleTree[0].value).toEqual('abc');
      });
    });
  });
});