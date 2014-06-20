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

function get(token, done) {
  var lastKey;

  function getFirehose(cb) {

    return request.get(getOptions(lastKey, token), function(e, res, body) {
      lastKey = body.lastKey;
      
      _.each(body.events, function(event) {
        delete event.data;
        event.received = new Date(event.received).toISOString();
        event.raised = new Date(event.raised).toISOString();
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
    return done('you must pass a token using --token');
  }

  get(parsedArgs.token, done);
};
