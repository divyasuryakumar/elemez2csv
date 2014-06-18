var minimist = require('minimist'),
    json2csv = require('json2csv-stream');

module.exports = function(argv, done) {
  var parsedArgs = minimist(argv.slice(2));

  if (!parsedArgs.token) {
    return done('you must pass a token using --token');
  }

 var reader = require('fs').createReadStream('package.json');

 var parser = new json2csv();
  reader
    .pipe(parser)
    .pipe(process.stdout)
    .on('end', done);
};
