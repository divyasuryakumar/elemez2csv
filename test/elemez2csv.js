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
      expect(e).to.equal('Usage: elemez2csv --token <TOKEN> [--types <TYPES>] [--data <ADDITIONALDATAFIELDS>]');
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
          received: Date.UTC(2014, i, 1),
          raised: Date.UTC(2014, i, 2),
          sender: 'sdr' + i,
          source: 'src' + i,
          type: 't' + i,
          data: {
            a: i,
            b: {
              c: i
            }
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
            lastkey: 'X',
            limit: 1000
          }
        };
        expect(request.get.args[1][0]).to.deep.equal(options1);
        return done();
      });
    });
    it('should console.log the data as CSV', function(done) {
      return elemez2csv(argv, function() {
        expect(console.log.callCount).to.equal(5);
        expect(console.log.args[0][0]).to.equal('k0,sch0,sid0,2014-01-01T00:00:00.000Z,2014-01-02T00:00:00.000Z,sdr0,src0,t0');
        expect(console.log.args[1][0]).to.equal('k1,sch1,sid1,2014-02-01T00:00:00.000Z,2014-02-02T00:00:00.000Z,sdr1,src1,t1');
        expect(console.log.args[2][0]).to.equal('k2,sch2,sid2,2014-03-01T00:00:00.000Z,2014-03-02T00:00:00.000Z,sdr2,src2,t2');
        expect(console.log.args[3][0]).to.equal('k3,sch3,sid3,2014-04-01T00:00:00.000Z,2014-04-02T00:00:00.000Z,sdr3,src3,t3');
        expect(console.log.args[4][0]).to.equal('k4,sch4,sid4,2014-05-01T00:00:00.000Z,2014-05-02T00:00:00.000Z,sdr4,src4,t4');
        return done();
      });
    });
    it('should filter types if passed', function(done) {
      argv = ['node', 'elemez2csv', '--token', 'TOKEN', '--types', 't2,t3'];

      return elemez2csv(argv, function() {
        expect(console.log.callCount).to.equal(2);
        expect(console.log.args[0][0]).to.equal('k2,sch2,sid2,2014-03-01T00:00:00.000Z,2014-03-02T00:00:00.000Z,sdr2,src2,t2');
        expect(console.log.args[1][0]).to.equal('k3,sch3,sid3,2014-04-01T00:00:00.000Z,2014-04-02T00:00:00.000Z,sdr3,src3,t3');
        return done();
      });
    });
    it('should return data if passed', function(done) {
      argv = ['node', 'elemez2csv', '--token', 'TOKEN', '--data', 'a,c'];
      return elemez2csv(argv, function() {
        expect(console.log.callCount).to.equal(5);
        expect(console.log.args[0][0]).to.equal('k0,sch0,sid0,2014-01-01T00:00:00.000Z,2014-01-02T00:00:00.000Z,sdr0,src0,t0,0,0');
        expect(console.log.args[1][0]).to.equal('k1,sch1,sid1,2014-02-01T00:00:00.000Z,2014-02-02T00:00:00.000Z,sdr1,src1,t1,1,1');
        expect(console.log.args[2][0]).to.equal('k2,sch2,sid2,2014-03-01T00:00:00.000Z,2014-03-02T00:00:00.000Z,sdr2,src2,t2,2,2');
        expect(console.log.args[3][0]).to.equal('k3,sch3,sid3,2014-04-01T00:00:00.000Z,2014-04-02T00:00:00.000Z,sdr3,src3,t3,3,3');
        expect(console.log.args[4][0]).to.equal('k4,sch4,sid4,2014-05-01T00:00:00.000Z,2014-05-02T00:00:00.000Z,sdr4,src4,t4,4,4');
        return done();
      });
    });
  });
});
