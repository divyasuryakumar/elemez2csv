var minimist = require('minimist'),
  request = require('request'),
  async = require('async');

function get(token, done) {
  var lastKey;

  function getFirehose(cb) {
    var options = {
      url: 'https://elemez.com/raw/1',
      json: true,
      headers: {
        token: token
      }
    };

    if (lastKey) {
      options.qs = {
        lastkey: lastKey
      };
    }

    return request.get(options, function(e, res, body) {
      console.log(body);
      lastKey = body.lastKey;
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
