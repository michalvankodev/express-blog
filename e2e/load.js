'use strict';

// Use the external Chai As Promised to deal with resolving promises in
// expectations.
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

/**
 * Load main routes of the website
 *
 * Try to load main index and admin index and see if it is redirected the right way
 */
before(function() {
  browser.get('/');
});

describe('routing from the client to the admin', function(){
  it('should load the client side', function() {
    browser.sleep(10);
    expect($('.articles').isPresent()).to.be.true;


  });
});
