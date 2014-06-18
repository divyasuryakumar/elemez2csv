var expect = require('chai').expect,
elemez2csv = require('../lib/elemez2csv');

describe('elemez2csv', function() {
  var argv;
  beforeEach(function() {
    argv = ['node', 'elemez2csv', '--token', 'TOKEN'];
  });

  it('should return error if you do not provide token', function(done) {
    argv.splice(2, 2);
    elemez2csv(argv, function(e) {
      expect(e).to.equal('you must pass a token using --token');
      return done();
    });
  });
});
