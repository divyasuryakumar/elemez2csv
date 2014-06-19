var expect = require('chai').expect,
  request = require('request'),
  sinon = require('sinon'),
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

  describe('with one page of data', function() {
    beforeEach(function() {
      sinon.stub(request, 'get');
      var response0 = {
        lastKey: 'X',
        events: []
      };
      var response1 = {
        lastKey: null,
        events: []
      };
      request.get.onCall(0).yields(null, null, response0);
      request.get.onCall(1).yields(null, null, response1);
    });

    afterEach(function() {
      request.get.restore();
    });

    it('should call request correctly', function(done) {
      return elemez2csv(argv, function() {
        expect(request.get.calledTwice).to.be.true;
        var options0 = {
          url: 'https://elemez.com/raw/1',
          json: true,
          headers: {
            token: 'TOKEN'
          }
        };
        expect(request.get.args[0][0]).to.deep.equal(options0);
        var options1 = {
          url: 'https://elemez.com/raw/1',
          json: true,
          headers: {
            token: 'TOKEN'
          },
          qs: {
            lastkey: 'X'
          }
        };
        expect(request.get.args[1][0]).to.deep.equal(options1);
        return done();
      });
    });
  });
});
