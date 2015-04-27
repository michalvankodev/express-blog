var source = 'src/';
var output = 'dist/'; // not used yet

module.exports = {
  root: source,
  app: source + 'app.js',
  source: source + '**/!(*.spec).js',
  specs: source + '**/*spec.js'
};
