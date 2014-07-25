var minimist = require('minimist'),
  request = require('request'),
  async = require('async'),
  _ = require('lodash');

function getOptions(lastKey, token) {
  var options = {
    url: 'https://elemez.com/raw/1',
    json: true,
    headers: {
      token: token
    }
  };

  if (lastKey) {
    options.qs = {
      lastkey: lastKey,
      limit: 1000
    };
  }

  return options;
}

function findNested(obj, key, memo) {
  if (!_.isArray(memo)) {
    memo = [];
  }
  _.forOwn(obj, function(val, i) {
    if (i === key) {
      memo.push(val);
    } else if (_.isPlainObject(val)) {
      findNested(val, key, memo);
    }
  });
  return memo;
}

function get(token, types, data, done) {
  var lastKey;
  var filterTypes = types ? types.split(',') : null;
  var dataFields = data ? data.split(',') : [];

  function getFirehose(cb) {

    return request.get(getOptions(lastKey, token), function(e, res, body) {
      if(e) {        
        // ignore errors, sleep a bit and try again...
        return setTimeout(cb, 10000);
      }

      lastKey = body.lastKey;

      _.each(body.events, function(event) {
        if (filterTypes && !_.contains(filterTypes, event.type)) {
          return;
        }

        event.received = new Date(event.received).toISOString();
        event.raised = new Date(event.raised).toISOString();
        _.each(dataFields, function(dataField) {
          var matches = findNested(event.data, dataField);
          event[dataField] = matches.length === 1 ? matches[0] : '';
        });
        delete event.data;
        console.log(_.values(event).join(','));
      });

      return cb();
    });
  }

  function finished(e) {
    return lastKey;
  }

  return async.doWhilst(getFirehose, finished, done);
};

module.exports = function(argv, done) {
  var parsedArgs = minimist(argv.slice(2));

  if (!parsedArgs.token) {
    return done('Usage: elemez2csv --token <TOKEN> [--types <TYPES>] [--data <ADDITIONALDATAFIELDS>]');
  }

  get(parsedArgs.token, parsedArgs.types, parsedArgs.data, done);
};
