var source = 'src/';
var output = 'dist/';

module.exports = {
  root: source,
  app: source + 'app.js',
  source: source + '**/!(*.spec).js',
  specs: source + '**/*spec.js',
  output: output,
  documentation: output + 'docs/'
};
