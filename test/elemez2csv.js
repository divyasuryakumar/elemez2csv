var _ = require('lodash'),
  expect = require('chai').expect,
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
      sinon.stub(console, 'log');
      sinon.stub(request, 'get');
      var events = _.map(_.range(0, 5), function(i) {
        return {
          key: 'k' + i,
          scheme: 'sch' + i,
          schemeid: 'sid' + i,
          received: i,
          raised: i,
          sender: 'sdr' + i,
          source: 'src' + i,
          type: 't' + i,
          data: {
            a: i
          }
        };
      });

      var response0 = {
        lastKey: 'X',
        events: events
      };
      var response1 = {
        lastKey: null,
        events: [

        ]
      };
      request.get.onCall(0).yields(null, null, response0);
      request.get.onCall(1).yields(null, null, response1);
    });

    afterEach(function() {
      console.log.restore();
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
    it('should console.log the data as CSV', function(done) {
      return elemez2csv(argv, function() {
        expect(console.log.callCount).to.equal(5);
        expect(console.log.args[0][0]).to.equal('k0,sch0,sid0,0,0,sdr0,src0,t0');
        expect(console.log.args[1][0]).to.equal('k1,sch1,sid1,1,1,sdr1,src1,t1');
        expect(console.log.args[2][0]).to.equal('k2,sch2,sid2,2,2,sdr2,src2,t2');
        expect(console.log.args[3][0]).to.equal('k3,sch3,sid3,3,3,sdr3,src3,t3');
        expect(console.log.args[4][0]).to.equal('k4,sch4,sid4,4,4,sdr4,src4,t4');
        return done();
      });
    });
  });
});
