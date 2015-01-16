exports.config = {
  allScriptsTimeout: 10000,

  specs: [
    'e2e/**/*.js'
  ],

  multiCapabilities: [{
    'browserName': 'firefox'
  }, {
    'browserName': 'chrome'
  }],

  baseUrl: 'http://localhost:9000/',

  framework: 'mocha',

  mochaOpts: {
    reporter: 'dot',
    timeout: 4000
  }
};
