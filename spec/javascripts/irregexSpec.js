describe('Irregex', function () {
  var Irregex = require('../../lib/irregex');

  describe('literal match', function () {
    var pattern = new Irregex('literal');

    it('accepts an exact match', function () {
      expect(pattern.test('literal')).toBeTruthy();
    });

    it('accepts a match in the middle of a string', function () {
      expect(pattern.test('this is some literal bullshit')).toBeTruthy();
    });

    it('rejects a non match', function () {
      expect(pattern.test('this shouldn\'t match')).toBeFalsy();
    });
  });
});